"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, X, Server } from "lucide-react"

interface NavLink {
  label: string
  href: string
}

const homeLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Progress", href: "#progress" },
  { label: "Plans", href: "#plans" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
]

const globalLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  const links = isHome ? homeLinks : globalLinks

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="font-mono text-xs font-medium tracking-[0.15em] text-primary uppercase"
        >
          A.Swartz
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const isAnchor = link.href.startsWith("#")
            if (isAnchor) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              )
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-[10px] uppercase tracking-[0.15em] transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Homelab Button - subtle but stands out */}
          <Link
            href="/homelab"
            className={`group flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] transition-all ${
              pathname === "/homelab"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
            }`}
          >
            <Server className="h-3 w-3" />
            <span>Homelab</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-muted-foreground md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="grid gap-3">
            {links.map((link) => {
              const isAnchor = link.href.startsWith("#")
              if (isAnchor) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                )
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`font-mono text-xs uppercase tracking-[0.15em] transition-colors hover:text-primary ${
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            
            {/* Homelab in mobile menu */}
            <Link
              href="/homelab"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors hover:text-primary ${
                pathname === "/homelab" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Server className="h-3 w-3" />
              <span>Homelab</span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
