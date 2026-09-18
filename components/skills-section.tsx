interface SkillGroup {
  category: string
  items: string[]
}

const skills: SkillGroup[] = [
  {
    category: "Network Engineering",
    items: ["Network Troubleshooting", "VLANs", "VPNs", "Cisco IOS / IOS XE", "Cisco Catalyst", "Cisco Nexus"],
  },
  {
    category: "Firewalls, Monitoring & Analysis",
    items: ["FortiGate", "FortiManager", "FortiAnalyzer", "Elastic", "Wireshark"],
  },
  {
    category: "Scripting & Automation",
    items: ["Python", "Bash", "PowerShell"],
  },
  {
    category: "Lab & Study Tools",
    items: ["Cisco Packet Tracer", "Cisco ASA", "pfSense", "Pi-hole", "Proxmox"],
  },
  {
    category: "Platforms & Systems",
    items: ["Linux (Ubuntu, Debian)", "Windows (10/11)", "Active Directory", "VMware", "VirtualBox"],
  },
]

export function SkillsSection() {
  return (
    <section aria-labelledby="skills-heading">
      <div className="flex items-center gap-4 mb-6">
        <h2
          id="skills-heading"
          className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          Technical Skills
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-5">
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-2 font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/80">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
