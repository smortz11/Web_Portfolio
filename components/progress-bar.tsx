"use client"

import { useEffect, useState } from "react"

interface ProgressBarProps {
  label: string
  value: number
  subtitle?: string
}

export function ProgressBar({ label, value, subtitle }: ProgressBarProps) {
  const [width, setWidth] = useState(0)
  const isIncomplete = value < 100

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 100)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="group">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm font-medium text-foreground tracking-wide">
            {label}
          </span>
          {subtitle && (
            <span className={`font-mono text-xs ${isIncomplete ? "text-primary/80" : "text-muted-foreground"}`}>
              {subtitle}
            </span>
          )}
        </div>
        <span className={`font-mono text-xs tabular-nums ${isIncomplete ? "text-primary animate-pulse" : "text-primary"}`}>
          {value}%
        </span>
      </div>
      <div className={`relative h-2.5 w-full overflow-hidden bg-secondary ${isIncomplete ? "shadow-[inset_0_0_8px_rgba(45,212,191,0.08)]" : ""}`}>
        {/* Filled portion */}
        <div
          className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out ${isIncomplete ? "bg-primary" : "bg-primary/70"}`}
          style={{ width: `${width}%` }}
        />
        {/* Shimmer sweep on incomplete bars - much brighter */}
        {isIncomplete && (
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${width}%` }}
          >
            <div className="h-full w-[200%] animate-shimmer bg-gradient-to-r from-transparent via-white/40 via-50% to-transparent" />
          </div>
        )}
        {/* Glowing right edge for incomplete bars */}
        {isIncomplete && (
          <div
            className="absolute inset-y-0 w-1 animate-pulse transition-all duration-1000 ease-out"
            style={{
              left: `calc(${width}% - 2px)`,
              background: "hsl(173, 58%, 55%)",
              boxShadow: "0 0 8px 2px hsl(173, 58%, 45%), 0 0 16px 4px hsl(173, 58%, 45%/0.4)",
            }}
          />
        )}
        {/* Subtle tick for completed bars */}
        {!isIncomplete && (
          <div
            className="absolute inset-y-0 w-0.5 bg-primary opacity-60 transition-all duration-1000 ease-out"
            style={{ left: `${width}%` }}
          />
        )}
      </div>
      {/* "In progress" indicator for incomplete */}
      {isIncomplete && (
        <div className="mt-1.5 flex items-center justify-end gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping bg-primary opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 bg-primary" />
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-primary/60">
            in progress
          </span>
        </div>
      )}
    </div>
  )
}

interface ProgressSectionProps {
  certifications: {
    label: string
    value: number
    subtitle?: string
  }[]
}

export function ProgressSection({ certifications }: ProgressSectionProps) {
  return (
    <section aria-labelledby="progress-heading">
      <div className="flex items-center gap-4 mb-6">
        <h2
          id="progress-heading"
          className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          Certification Progress
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-6">
        {certifications.map((cert) => (
          <ProgressBar key={cert.label} {...cert} />
        ))}
      </div>
    </section>
  )
}
