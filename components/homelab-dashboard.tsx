"use client"

import { useState, useEffect, useCallback } from "react"
import { RefreshCw, Server, Container, Cpu, HardDrive, MemoryStick, Clock, AlertCircle } from "lucide-react"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const NODES = ["prox1", "prox2", "prox4"]

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
}

function formatUptime(seconds: number): string {
  if (!seconds) return "—"
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function getBarColor(pct: number): string {
  if (pct > 85) return "bg-red-500"
  if (pct > 65) return "bg-amber-500"
  return "bg-primary"
}

// ─────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────

function StatusDot({ status }: { status: "online" | "offline" | "loading" }) {
  const colors = {
    online: "bg-emerald-500 shadow-emerald-500/50",
    offline: "bg-red-500 shadow-red-500/50",
    loading: "bg-amber-500 shadow-amber-500/50 animate-pulse",
  }
  return (
    <span className={`h-2 w-2 rounded-full shadow-[0_0_6px] ${colors[status]}`} />
  )
}

function MetricBar({ label, value, max, icon: Icon }: { label: string; value: number; max: number; icon: React.ElementType }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
          <Icon className="h-3 w-3" />
          {label}
        </span>
        <span className="text-foreground font-medium">
          {formatBytes(value)} / {formatBytes(max)} ({pct}%)
        </span>
      </div>
      <div className="h-1 bg-border overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${getBarColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function CpuBar({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
          <Cpu className="h-3 w-3" />
          CPU
        </span>
        <span className="text-foreground font-medium">{pct}%</span>
      </div>
      <div className="h-1 bg-border overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${getBarColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function NodeCard({ node }: { node: NodeData }) {
  return (
    <div className="group border border-border bg-card/50 p-5 transition-colors hover:border-primary/40">
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-primary/30 pointer-events-none" />
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">{node.name}</h3>
        </div>
        <StatusDot status={node.status} />
      </div>

      {node.error ? (
        <div className="flex items-center gap-2 text-red-500 text-xs">
          <AlertCircle className="h-3 w-3" />
          {node.error}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <CpuBar value={node.cpu} />
            <MetricBar label="Memory" value={node.memory.used} max={node.memory.total} icon={MemoryStick} />
            <MetricBar label="Disk" value={node.disk.used} max={node.disk.total} icon={HardDrive} />
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatUptime(node.uptime)}
            </span>
            <span>{node.cores} cores</span>
            <span>load {node.loadavg.map(n => n.toFixed(2)).join(" ")}</span>
          </div>
        </>
      )}
    </div>
  )
}

function GuestRow({ guest }: { guest: GuestData }) {
  const isRunning = guest.status === "running"
  const cpuPct = isRunning ? Math.round(guest.cpu * 100) : 0
  const memPct = isRunning ? Math.round((guest.mem / guest.maxmem) * 100) : 0

  return (
    <tr className="border-b border-border transition-colors hover:bg-card/50">
      <td className="py-3 px-4">
        <div className="text-sm font-medium text-foreground">{guest.name || "—"}</div>
        <div className="text-[10px] text-muted-foreground">{guest.node} / {guest.vmid}</div>
      </td>
      <td className="py-3 px-4">
        <span className="inline-flex items-center gap-1 border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {guest.type === "qemu" ? <Server className="h-2.5 w-2.5" /> : <Container className="h-2.5 w-2.5" />}
          {guest.type}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`flex items-center gap-1.5 text-[11px] uppercase tracking-wider ${isRunning ? "text-emerald-500" : "text-red-500"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isRunning ? "bg-emerald-500" : "bg-red-500"}`} />
          {guest.status}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="w-20">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-muted-foreground">CPU</span>
            <span>{cpuPct}%</span>
          </div>
          <div className="h-0.5 bg-border overflow-hidden">
            <div className={`h-full ${getBarColor(cpuPct)}`} style={{ width: `${cpuPct}%` }} />
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="w-28">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-muted-foreground">RAM</span>
            <span>{formatBytes(guest.mem)} / {formatBytes(guest.maxmem)}</span>
          </div>
          <div className="h-0.5 bg-border overflow-hidden">
            <div className={`h-full ${getBarColor(memPct)}`} style={{ width: `${memPct}%` }} />
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-[11px] text-muted-foreground">
        {formatUptime(guest.uptime)}
      </td>
    </tr>
  )
}

// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────

export function HomelabDashboard() {
  const [nodes, setNodes] = useState<NodeData[]>([])
  const [guests, setGuests] = useState<GuestData[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>("—")
  const [isLoading, setIsLoading] = useState(true)
  const [configError, setConfigError] = useState(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/homelab")
      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }
      
      const data = await response.json()
      
      if (data.error) {
        setConfigError(true)
        setNodes(NODES.map(name => ({
          name,
          status: "offline" as const,
          cpu: 0,
          memory: { used: 0, total: 1 },
          disk: { used: 0, total: 1 },
          uptime: 0,
          cores: 0,
          loadavg: [0, 0, 0],
          error: "API not configured"
        })))
        setGuests([])
      } else {
        setConfigError(false)
        setNodes(data.nodes || [])
        setGuests(data.guests || [])
      }
      
      setLastUpdated(new Date().toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit" 
      }))
    } catch {
      setConfigError(true)
      setNodes(NODES.map(name => ({
        name,
        status: "offline" as const,
        cpu: 0,
        memory: { used: 0, total: 1 },
        disk: { used: 0, total: 1 },
        uptime: 0,
        cores: 0,
        loadavg: [0, 0, 0],
        error: "Connection failed"
      })))
      setGuests([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <div className="space-y-8">
      {/* Config Notice */}
      {configError && (
        <div className="border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
          <strong>Setup Required:</strong> Configure your Proxmox API credentials in the environment variables.
          Set <code className="bg-amber-500/20 px-1.5 py-0.5 text-amber-100">PROXMOX_HOST</code> and{" "}
          <code className="bg-amber-500/20 px-1.5 py-0.5 text-amber-100">PROXMOX_TOKEN</code> to connect to your cluster.
        </div>
      )}

      {/* Refresh controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Last updated: {lastUpdated}</span>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-2 border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Nodes */}
      <section>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Nodes
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nodes.length > 0 ? (
            nodes.map((node) => <NodeCard key={node.name} node={node} />)
          ) : (
            <div className="col-span-full border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {isLoading ? "Loading nodes..." : "No nodes found"}
            </div>
          )}
        </div>
      </section>

      {/* Guests Table */}
      <section>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Virtual Machines &amp; Containers
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        
        {guests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary/30">
                  <th className="py-2 px-4 font-mono text-[9px] uppercase tracking-[0.2em] text-primary/70">Name</th>
                  <th className="py-2 px-4 font-mono text-[9px] uppercase tracking-[0.2em] text-primary/70">Type</th>
                  <th className="py-2 px-4 font-mono text-[9px] uppercase tracking-[0.2em] text-primary/70">Status</th>
                  <th className="py-2 px-4 font-mono text-[9px] uppercase tracking-[0.2em] text-primary/70">CPU</th>
                  <th className="py-2 px-4 font-mono text-[9px] uppercase tracking-[0.2em] text-primary/70">Memory</th>
                  <th className="py-2 px-4 font-mono text-[9px] uppercase tracking-[0.2em] text-primary/70">Uptime</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <GuestRow key={`${guest.node}-${guest.vmid}`} guest={guest} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {isLoading ? "Loading guests..." : "No virtual machines or containers found"}
          </div>
        )}
      </section>
    </div>
  )
}
