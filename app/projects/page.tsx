import type { Metadata } from "next"
import { Nav } from "@/components/nav"
import { GeometricBackground } from "@/components/geometric-bg"
import { ProjectsList } from "@/components/projects-list"

export const metadata: Metadata = {
  title: "Projects | Andrew Swartz",
  description:
    "Cybersecurity and computer science projects by Andrew Swartz, including published IEEE research.",
}

export default function ProjectsPage() {
  return (
    <>
      <GeometricBackground />
      <Nav />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-24">
        {/* Page header */}
        <div className="mb-12">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl text-balance">
            Projects
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            A deeper look at the systems, tools, and research I have built. Click any
            project to expand it for details, technologies, and external links.
          </p>
          <div className="mt-6 h-px w-full bg-border" />
        </div>

        <ProjectsList />

        {/* Footer */}
        <footer className="mt-16 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Andrew Swartz &middot; 2026
            </p>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rotate-45 border border-primary/50" />
              <div className="h-1.5 w-1.5 rotate-45 bg-primary/30" />
              <div className="h-1.5 w-1.5 rotate-45 border border-primary/50" />
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
