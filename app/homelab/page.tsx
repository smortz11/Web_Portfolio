import { Metadata } from "next"
import { Nav } from "@/components/nav"
import { GeometricBG } from "@/components/geometric-bg"
import { HomelabDashboard } from "@/components/homelab-dashboard"

export const metadata: Metadata = {
  title: "Ennead Lab | Andrew Swartz",
  description: "Proxmox homelab infrastructure dashboard - virtualization cluster monitoring",
}

export default function HomelabPage() {
  return (
    <>
      <GeometricBG />
      <Nav />
      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-16">
        {/* Header */}
        <header className="mb-12 border-b border-border pb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/70 mb-2">
            Infrastructure Dashboard
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Ennead Lab
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Proxmox Cluster — 192.168.30.0/24
          </p>
        </header>

        {/* Dashboard */}
        <HomelabDashboard />
      </main>
    </>
  )
}
