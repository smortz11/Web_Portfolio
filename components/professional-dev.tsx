interface DevItem {
  title: string
  period: string
  bullets: string[]
}

const items: DevItem[] = [
  {
    title: "Cyber Competitions: NCL",
    period: "Sep 2025 -- Present",
    bullets: [
      "Competed in National Cyber League challenges covering OSI, Cryptography, Password Cracking, Log Analysis, Network Traffic Analysis, etc.",
      "Ranked in Top 4% National Cyber League -- Fall 2025.",
      "Currently awaiting the Spring 2026 season!"
    ],
  },
  {
    title: "Cyber Competitions: CCDC",
    period: "Sep 2025 -- Present",
    bullets: [
      "Participated in Collegiate Cyber Defense Competition simulating enterprise defense under live attacks.",
      "Applied SIEM, log analysis, and incident response techniques in competitive environments.",
      "Hardened routers, firewalls, and Linux servers against red team attacks.",
      "Placed second in qualifier CCDC, advancing to wildcard round on 2/21/26!"
    ],
  },
  {
    title: "Information Systems Security Association",
    period: "Aug 2024 -- Present",
    bullets: [
      "Engage with cybersecurity professionals and chapter events to strengthen applied security knowledge.",
      "Attend monthly meetings, listen to cybersecurity lectures, and volunteer at conferences.",
    ],
  },
  {
    title: "Computer Science Group",
    period: "Aug 2022 -- Present",
    bullets: [
      "Collaborate with peers to explore cybersecurity and programming topics.",
      "Engage in campus IEEE events and technical lectures to deepen cybersecurity knowledge.",
    ],
  },
]

export function ProfessionalDev() {
  return (
    <section aria-labelledby="profdev-heading">
      <div className="flex items-center gap-4 mb-6">
        <h2
          id="profdev-heading"
          className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          Professional Development
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-5">
        {items.map((item) => (
          <div
            key={item.title}
            className="relative pl-5 border-l border-border"
          >
            <div className="absolute -left-px top-0 h-2 w-px bg-primary" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-medium text-foreground">
                {item.title}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {item.period}
              </span>
            </div>
            <ul className="mt-2 grid gap-1">
              {item.bullets.map((bullet) => (
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
