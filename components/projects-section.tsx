import Link from "next/link"
import { ExternalLink, ArrowRight } from "lucide-react"

interface Project {
  title: string
  tech: string
  description: string[]
  date: string
  link?: string
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
    link: "https://ieeexplore.ieee.org/document/11476152",
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
    link: "https://ieeexplore.ieee.org/document/10971467",
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
        {projects.map((project) => {
          const Wrapper = project.link ? "a" : "div"
          const wrapperProps = project.link
            ? { href: project.link, target: "_blank", rel: "noopener noreferrer" }
            : {}

          return (
            <Wrapper
              key={project.title}
              {...wrapperProps}
              className="group block border border-border p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {project.title}
                    {project.link && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
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
              {project.link && (
                <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-primary/70 opacity-0 transition-opacity group-hover:opacity-100">
                  View IEEE Publication
                </p>
              )}
            </Wrapper>
          )
        })}
      </div>

      {/* Link to full projects page */}
      <Link
        href="/projects"
        className="group mt-6 flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        <span className="border-b border-transparent group-hover:border-primary font-mono uppercase tracking-widest">
          View all projects
        </span>
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </section>
  )
}
