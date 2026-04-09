import { NextResponse } from "next/server"

const KUMA_HOST = "http://192.168.30.54:3001"
const KUMA_SLUG = "ennead"

interface HeartbeatEntry {
  status: number
  time: string
  msg: string
  ping: number
}

interface MonitorEntry {
  id: number
  name: string
  type: string
}

interface ServiceStatus {
  id: number
  name: string
  type: string
  status: "up" | "down" | "unknown"
  ping: number | null
  uptime24h: number
  recentBeats: { time: string; status: number; ping: number }[]
}

export async function GET() {
  try {
    const [configRes, heartbeatRes] = await Promise.all([
      fetch(`${KUMA_HOST}/api/status-page/${KUMA_SLUG}`, { cache: "no-store" }),
      fetch(`${KUMA_HOST}/api/status-page/heartbeat/${KUMA_SLUG}`, { cache: "no-store" }),
    ])

    if (!configRes.ok || !heartbeatRes.ok) {
      throw new Error("Failed to fetch from Uptime Kuma")
    }

    const configData = await configRes.json()
    const heartbeatData = await heartbeatRes.json()

    // Build a flat list of monitors from the status page groups
    const monitors: MonitorEntry[] = (configData.publicGroupList ?? []).flatMap(
      (group: { monitorList: MonitorEntry[] }) => group.monitorList
    )

    const heartbeats: Record<string, HeartbeatEntry[]> = heartbeatData.heartbeatList ?? {}
    const uptimes: Record<string, number> = heartbeatData.uptimeList ?? {}

    const services: ServiceStatus[] = monitors.map((monitor) => {
      const beats = heartbeats[String(monitor.id)] ?? []
      const latest = beats[beats.length - 1] ?? null
      const uptime24Key = `${monitor.id}_24`

      return {
        id: monitor.id,
        name: monitor.name,
        type: monitor.type,
        status: latest ? (latest.status === 1 ? "up" : "down") : "unknown",
        ping: latest?.ping ?? null,
        uptime24h: uptimes[uptime24Key] ?? 0,
        // Last 30 beats for the sparkline-style history bar
        recentBeats: beats.slice(-30).map((b) => ({
          time: b.time,
          status: b.status,
          ping: b.ping,
        })),
      }
    })

    return NextResponse.json({ services })
  } catch (e) {
    return NextResponse.json({
      error: e instanceof Error ? e.message : "Failed to connect to Uptime Kuma",
      services: [],
    })
  }
}
