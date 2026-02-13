import { ExternalLink } from "lucide-react"

interface Project {
  title: string
  tech: string
  description: string[]
  date: string
}

const projects: Project[] = [
  {
    title: "Cybersecurity Homelab",
    tech: "Proxmox, Splunk, Pi-hole, Cisco ASA, Cisco Catalyst",
    description: [
      "Built and manage a virtualized environment using Proxmox for security testing and network monitoring.",
      "Configured Cisco ASA firewall and Cisco Catalyst switch to secure and segment network traffic.",
      "Deployed Splunk instances for SIEM demonstration and log correlation.",
      "Hosted secure website and configured Pi-hole for network-wide ad and malware blocking.",
    ],
    date: "Ongoing",
  },
  {
    title: "O.MG Mitigation",
    tech: "Hardware Security",
    description: [
      "Developed a system to encrypt keystrokes in real time with rotating ciphers.",
      "Bypassed hardware-level MitM keylogging and payload injection.",
      "Authored an IEEE paper analyzing potential threat actors and possible intrusions mitigated.",
    ],
    date: "Feb 2026",
  },
  {
    title: "Facial Recognition & 2FA on Raspberry Pi",
    tech: "Logical Security",
    description: [
      "Integrated multi-factor authentication with facial recognition for secure access.",
      "Designed a low-resource secure system on Raspberry Pi.",
      "Authored an IEEE-published paper on system design and implementation.",
    ],
    date: "Mar 2025",
  },
]

export function ProjectsSection() {
  return (
    <section aria-labelledby="projects-heading">
      <div className="flex items-center gap-4 mb-6">
        <h2
          id="projects-heading"
          className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          Projects
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.title}
            className="group border border-border p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
                  {project.title}
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-primary/70">
                  {project.tech}
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {project.date}
              </span>
            </div>
            <ul className="mt-3 grid gap-1">
              {project.description.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                >
                  <span className="mt-1.5 h-px w-2 shrink-0 bg-muted-foreground/50" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
