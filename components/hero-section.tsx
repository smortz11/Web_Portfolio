import React from "react"
import Image from "next/image"
import { Mail, Linkedin, Github, MapPin } from "lucide-react"

export function HeroSection() {
  return (
    <section className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
      {/* Profile Image */}
      <div className="relative shrink-0">
        <div className="relative h-40 w-40 overflow-hidden border border-border md:h-48 md:w-48">
          <Image
            src="headshot.jpg"
            alt="Andrew Swartz"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Geometric corner accents */}
        <div className="absolute -left-1.5 -top-1.5 h-4 w-4 border-l border-t border-primary" />
        <div className="absolute -bottom-1.5 -right-1.5 h-4 w-4 border-b border-r border-primary" />
      </div>

      {/* Info */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
          Andrew Swartz
        </h1>
        <p className="mt-2 font-mono text-sm text-primary tracking-wide">
          Computer Science & Mathematics
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          CS and Mathematics double major at Indiana University Southeast with a
          4.0 GPA. Focused on cybersecurity, network defense, and building
          secure systems. Published IEEE author (x2) and Top 4% NCL competitor.
        </p>

        {/* Contact links */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <ContactLink
            href="mailto:a.swartz.cs@protonmail.com"
            icon={<Mail className="h-4 w-4" />}
            label="Email"
          />
          <ContactLink
            href="https://linkedin.com/in/andrew-swartz-cs"
            icon={<Linkedin className="h-4 w-4" />}
            label="LinkedIn"
          />
          <ContactLink
            href="https://github.com/smortz11"
            icon={<Github className="h-4 w-4" />}
            label="GitHub"
          />
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            Ramsey, IN
          </span>
        </div>
      </div>
    </section>
  )
}

function ContactLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
      aria-label={label}
    >
      {icon}
      <span className="border-b border-transparent group-hover:border-primary">
        {label}
      </span>
    </a>
  )
}
