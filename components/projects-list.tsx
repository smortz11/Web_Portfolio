"use client"

import { ExternalLink, ChevronDown, Github } from "lucide-react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

interface ProjectLink {
  label: string
  href: string
  type: "paper" | "github" | "external"
}

interface Project {
  id: string
  title: string
  subtitle: string
  date: string
  status: "complete" | "ongoing"
  tech: string[]
  summary: string
  details: string[]
  links?: ProjectLink[]
}

const projects: Project[] = [
  {
    id: "homelab",
    title: "Cybersecurity Homelab",
    subtitle: "Virtualized security environment for testing and monitoring",
    date: "Ongoing",
    status: "ongoing",
    tech: [
      "Proxmox",
      "Splunk",
      "Pi-hole",
      "Cisco ASA",
      "Cisco Catalyst",
      "Ubuntu Server",
      "pfSense",
    ],
    summary:
      "A full-stack virtualized environment for hands-on security testing, SIEM demonstration, and network segmentation.",
    details: [
      "Built and manage a virtualized environment using Proxmox for security testing and network monitoring.",
      "Configured Cisco ASA firewall and Cisco Catalyst switch to secure and segment network traffic across multiple VLANs.",
      "Deployed Splunk instances for SIEM demonstration and log correlation, ingesting firewall, DNS, and system logs.",
      "Hosted a secure website behind a reverse proxy and configured Pi-hole for network-wide ad and malware blocking.",
      "Implemented pfSense as a secondary firewall layer for inter-VLAN routing and traffic inspection.",
      "Environment is actively used to simulate real-world attack scenarios and validate defense configurations.",
    ],
  },
  {
    id: "omg-mitigation",
    title: "O.MG Mitigation",
    subtitle: "Real-time keystroke encryption against hardware-level attacks",
    date: "Feb 2026",
    status: "complete",
    tech: [
      "Python",
      "Cryptography",
      "Hardware Security",
      "USB Protocol Analysis",
    ],
    summary:
      "Developed a system to encrypt keystrokes in real time with rotating ciphers, defeating hardware-level MitM keylogging.",
    details: [
      "Designed and implemented a real-time keystroke encryption system using rotating cipher keys to defeat hardware-level man-in-the-middle keylogging.",
      "Bypassed payload injection attacks from O.MG-style implant devices by validating and encrypting all HID input at the OS driver level.",
      "Conducted threat modeling to identify potential attack vectors from state-sponsored actors, insider threats, and supply chain compromises.",
      "Authored an IEEE paper analyzing the threat landscape of covert USB implants and the effectiveness of the proposed mitigation strategy.",
      "Demonstrated the system's efficacy against multiple attack scenarios in a controlled lab environment.",
    ],
  },
  {
    id: "facial-recognition",
    title: "Facial Recognition & 2FA on Raspberry Pi",
    subtitle: "Multi-factor authentication with biometric verification",
    date: "Mar 2025",
    status: "complete",
    tech: [
      "Python",
      "OpenCV",
      "Raspberry Pi",
      "TOTP",
      "Linux",
      "SQLite",
    ],
    summary:
      "A low-resource secure access system integrating facial recognition with time-based one-time passwords for multi-factor authentication.",
    details: [
      "Integrated multi-factor authentication combining facial recognition (OpenCV) with TOTP-based second-factor verification for secure physical access control.",
      "Designed and optimized the system to run on a Raspberry Pi with constrained compute and memory resources while maintaining sub-second recognition latency.",
      "Built a local SQLite database for storing enrolled user face encodings and authentication logs with encrypted-at-rest protections.",
      "Implemented a fallback authentication flow for edge cases where facial recognition confidence was below threshold.",
      "Authored an IEEE-published paper detailing the system architecture, threat model, and performance benchmarks.",
    ],
    links: [
      {
        label: "IEEE Publication",
        href: "https://ieeexplore.ieee.org/document/10971467",
        type: "paper",
      },
    ],
  },
  {
    id: "portfolio",
    title: "Personal Portfolio Website",
    subtitle: "This site -- built with Next.js and deployed on Vercel",
    date: "2026",
    status: "ongoing",
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Vercel",
      "shadcn/ui",
    ],
    summary:
      "A responsive, accessible portfolio website showcasing projects, certifications, and professional experience.",
    details: [
      "Designed and developed a minimalist, terminal-inspired portfolio using Next.js App Router and Tailwind CSS.",
      "Implemented an animated geometric background with grid-traversing orbs rendered on HTML Canvas.",
      "Built with accessibility in mind, including semantic HTML, proper ARIA attributes, and keyboard navigation support.",
      "Deployed on Vercel with automatic CI/CD from GitHub for rapid iteration.",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/smortz11/Web_Portfolio",
        type: "github",
      },
    ],
  },
]

export function ProjectsList() {
  return (
    <Accordion type="single" collapsible className="grid gap-3">
      {projects.map((project) => (
        <AccordionItem
          key={project.id}
          value={project.id}
          className="border border-border bg-card/30 px-5 py-0 transition-colors data-[state=open]:border-primary/40"
        >
          <AccordionTrigger className="py-5 hover:no-underline gap-4">
            <div className="flex flex-1 flex-col items-start gap-1 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-sm font-medium text-foreground">
                  {project.title}
                </h2>
                <span
                  className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border ${
                    project.status === "ongoing"
                      ? "border-primary/40 text-primary/80"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {project.status === "ongoing" ? "Ongoing" : project.date}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {project.subtitle}
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pb-5">
            {/* Summary */}
            <p className="text-sm leading-relaxed text-foreground/90">
              {project.summary}
            </p>

            {/* Tech stack */}
            <div className="mt-4">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Detailed bullets */}
            <div className="mt-4">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Details
              </h3>
              <ul className="grid gap-1.5">
                {project.details.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-1.5 h-px w-3 shrink-0 bg-primary/50" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* External links */}
            {project.links && project.links.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {link.type === "github" ? (
                      <Github className="h-3 w-3" />
                    ) : (
                      <ExternalLink className="h-3 w-3" />
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-widest">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
