import { ArrowRight } from "lucide-react"

interface Plan {
  title: string
  description: string
  timeline: string
}

const plans: Plan[] = [
  {
    title: "Complete CCNA Certification",
    description:
      "Networking fundamentals is a prioritiy in both, blue and red team operations. The knowledge is extremely valuable!",
    timeline: "2026",
  },
  {
    title: "Graduate from IU Southeast",
    description:
      "Earning dual B.S. degrees in Computer Science and Mathematics with a 4.0 GPA.",
    timeline: "May 2026",
  },
  {
    title: "Pursue Entry Security Role",
    description:
      "Targeting a full-time cybersecurity position focused on network defense, incident response, or SOC operations.",
    timeline: "Summer 2026",
  },
  {
    title: "Expand Homelab Infrastructure",
    description:
      "Adding more enterprise-grade tooling like ELK Stack, pfSense, with an ability to red team myself and practice blue team skills.",
    timeline: "Ongoing",
  },
]

export function FuturePlans() {
  return (
    <section aria-labelledby="plans-heading">
      <div className="flex items-center gap-4 mb-6">
        <h2
          id="plans-heading"
          className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          What{"'"}s Next
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.title}
            className="group relative border border-border p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground">
                  {plan.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>
              </div>
              <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <span className="mt-3 inline-block font-mono text-[10px] uppercase tracking-widest text-primary/70">
              {plan.timeline}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
