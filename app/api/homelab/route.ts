import { NextResponse } from "next/server"

// Node names in your cluster
const NODES = ["prox1", "prox2", "prox4"]

interface NodeStatus {
  cpu?: number
  memory?: { used: number; total: number }
  rootfs?: { used: number; total: number }
  uptime?: number
  cpuinfo?: { cpus: number }
  loadavg?: number[]
}

interface NodeData {
  name: string
  status: "online" | "offline" | "loading"
  cpu: number
  memory: { used: number; total: number }
  disk: { used: number; total: number }
  uptime: number
  cores: number
  loadavg: number[]
  error?: string
}

interface GuestData {
  vmid: number
  name: string
  node: string
  type: "qemu" | "lxc"
  status: "running" | "stopped"
  cpu: number
  mem: number
  maxmem: number
  uptime: number
}

async function pveRequest(path: string): Promise<unknown> {
  const host = process.env.PROXMOX_HOST
  const token = process.env.PROXMOX_TOKEN

  if (!host || !token) {
    throw new Error("Proxmox credentials not configured")
  }

  const url = `${host}/api2/json${path}`
  
  const res = await fetch(url, {
    headers: {
      Authorization: `PVEAPIToken=${token}`,
    },
    // Skip SSL verification for self-signed certs (common in homelabs)
    // @ts-expect-error - Node.js fetch option
    rejectUnauthorized: false,
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  return json.data
}

export async function GET() {
  const host = process.env.PROXMOX_HOST
  const token = process.env.PROXMOX_TOKEN

  if (!host || !token) {
    return NextResponse.json({
      error: "Proxmox API not configured",
      nodes: [],
      guests: [],
    })
  }

  try {
    // Fetch node statuses
    const nodeResults = await Promise.all(
      NODES.map(async (name): Promise<NodeData> => {
        try {
          const data = (await pveRequest(`/nodes/${name}/status`)) as NodeStatus
          return {
            name,
            status: "online",
            cpu: data.cpu || 0,
            memory: {
              used: data.memory?.used || 0,
              total: data.memory?.total || 1,
            },
            disk: {
              used: data.rootfs?.used || 0,
              total: data.rootfs?.total || 1,
            },
            uptime: data.uptime || 0,
            cores: data.cpuinfo?.cpus || 0,
            loadavg: (data.loadavg || [0, 0, 0]).map(Number),
          }
        } catch (e) {
          return {
            name,
            status: "offline",
            cpu: 0,
            memory: { used: 0, total: 1 },
            disk: { used: 0, total: 1 },
            uptime: 0,
            cores: 0,
            loadavg: [0, 0, 0],
            error: e instanceof Error ? e.message : "Unknown error",
          }
        }
      })
    )

    // Fetch VMs and containers from all nodes
    const allGuests: GuestData[] = []
    
    await Promise.all(
      NODES.map(async (node) => {
        try {
          const [vms, cts] = await Promise.all([
            pveRequest(`/nodes/${node}/qemu`).catch(() => []),
            pveRequest(`/nodes/${node}/lxc`).catch(() => []),
          ])

          if (Array.isArray(vms)) {
            vms.forEach((vm: Record<string, unknown>) => {
              allGuests.push({
                vmid: Number(vm.vmid) || 0,
                name: String(vm.name || ""),
                node,
                type: "qemu",
                status: vm.status === "running" ? "running" : "stopped",
                cpu: Number(vm.cpu) || 0,
                mem: Number(vm.mem) || 0,
                maxmem: Number(vm.maxmem) || 1,
                uptime: Number(vm.uptime) || 0,
              })
            })
          }

          if (Array.isArray(cts)) {
            cts.forEach((ct: Record<string, unknown>) => {
              allGuests.push({
                vmid: Number(ct.vmid) || 0,
                name: String(ct.name || ""),
                node,
                type: "lxc",
                status: ct.status === "running" ? "running" : "stopped",
                cpu: Number(ct.cpu) || 0,
                mem: Number(ct.mem) || 0,
                maxmem: Number(ct.maxmem) || 1,
                uptime: Number(ct.uptime) || 0,
              })
            })
          }
        } catch {
          // Ignore errors for individual nodes
        }
      })
    )

    // Sort: running first, then by name
    allGuests.sort((a, b) => {
      if (a.status === b.status) return a.name.localeCompare(b.name)
      return a.status === "running" ? -1 : 1
    })

    return NextResponse.json({
      nodes: nodeResults,
      guests: allGuests,
    })
  } catch {
    return NextResponse.json({
      error: "Failed to connect to Proxmox API",
      nodes: [],
      guests: [],
    })
  }
}
