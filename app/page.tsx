import { Nav } from "@/components/nav"
import { HeroSection } from "@/components/hero-section"
import { ProgressSection } from "@/components/progress-bar"
import { FuturePlans } from "@/components/future-plans"
import { ProjectsSection } from "@/components/projects-section"
import { ExperienceSection } from "@/components/experience-section"
import { SkillsSection } from "@/components/skills-section"
import { ProfessionalDev } from "@/components/professional-dev"
import { GeometricBackground } from "@/components/geometric-bg"

/*
 * =============================================
 * CERTIFICATION PROGRESS CONFIG
 * =============================================
 * To update a progress bar, simply change the
 * `value` field (0-100) for each certification.
 *
 * Example: CCNA: 45 means the bar fills to 45%
 * =============================================
 */
const certifications = [
  { label: "CompTIA Security+", value: 100, subtitle: "Earned Jun 2025" },
  { label: "CompTIA CySA+", value: 100, subtitle: "Earned Sep 2025" },
  { label: "ISC2 CC", value: 100, subtitle: "Earned Jan 2026" },
  { label: "Cisco CCNA", value: 55, subtitle: "In Progress" },
]

function Divider() {
  return (
    <div className="my-10 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <div className="h-1 w-1 rotate-45 bg-primary" />
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

export default function Home() {
  return (
    <>
      <GeometricBackground />
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-24">
        {/* ===== FULL-WIDTH TOP SECTIONS ===== */}

        {/* Hero / About */}
        <div id="about" className="scroll-mt-20">
          <HeroSection />
        </div>

        <Divider />

        {/* Certification Progress Bars */}
        <div id="progress" className="scroll-mt-20">
          <ProgressSection certifications={certifications} />
        </div>

        <Divider />

        {/* Future Plans */}
        <div id="plans" className="scroll-mt-20">
          <FuturePlans />
        </div>

        <Divider />

        {/* ===== TWO-COLUMN GRID ===== */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
          {/* Left Column */}
          <div className="flex flex-col gap-10">
            <div id="projects" className="scroll-mt-20">
              <ProjectsSection />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <div className="h-1 w-1 rotate-45 bg-primary" />
              <div className="h-px flex-1 bg-border" />
            </div>

            <div id="experience" className="scroll-mt-20">
              <ExperienceSection />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-10">
            <div id="skills" className="scroll-mt-20">
              <SkillsSection />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <div className="h-1 w-1 rotate-45 bg-primary" />
              <div className="h-px flex-1 bg-border" />
            </div>

            <ProfessionalDev />
          </div>
        </div>

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