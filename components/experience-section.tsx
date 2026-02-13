interface ExperienceItem {
  role: string
  company: string
  location: string
  period: string
  bullets: string[]
}

const experiences: ExperienceItem[] = [
  {
    role: "Computer Science Tutor",
    company: "Indiana University Southeast",
    location: "New Albany, IN",
    period: "Aug 2025 -- Present",
    bullets: [
      "Provide one-on-one and group tutoring for students in programming and cybersecurity courses.",
      "Assist with lab exercises, debugging, and problem-solving to reinforce technical concepts.",
      "Support student learning by explaining complex topics clearly and offering study strategies.",
    ],
  },
  {
    role: "Third Shift Merchandising Associate",
    company: "Kroger",
    location: "Jeffersonville, IN",
    period: "Jan 2023 -- Dec 2024",
    bullets: [
      "Emphasized attention to detail and independent problem-solving in overnight operations.",
      "Communicated effectively with supervisors and peers to coordinate workload and maintain store standards.",
    ],
  },
]

export function ExperienceSection() {
  return (
    <section aria-labelledby="experience-heading">
      <div className="flex items-center gap-4 mb-6">
        <h2
          id="experience-heading"
          className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          Experience
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-6">
        {experiences.map((exp) => (
          <div key={exp.role} className="relative pl-5 border-l border-border">
            <div className="absolute -left-px top-0 h-2 w-px bg-primary" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-medium text-foreground">
                {exp.role}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {exp.period}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-primary/80">
              {exp.company} &middot; {exp.location}
            </p>
            <ul className="mt-2 grid gap-1">
              {exp.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                >
                  <span className="mt-1.5 h-px w-2 shrink-0 bg-muted-foreground/50" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
