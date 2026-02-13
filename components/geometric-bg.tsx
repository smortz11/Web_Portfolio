"use client"

import { useEffect, useRef, useCallback } from "react"

interface Orb {
  x: number
  y: number
  dirX: number
  dirY: number
  speed: number
  color: "red" | "blue"
  alpha: number
  targetAlpha: number
  stepsRemaining: number
  trail: { x: number; y: number; alpha: number }[]
}

const SPACING = 80
const ORB_COUNT = 24
const ORB_RADIUS = 3
const TRAIL_LENGTH = 24

export function GeometricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbsRef = useRef<Orb[]>([])
  const animFrameRef = useRef<number>(0)

  const snapToGrid = (val: number, max: number) => {
    const count = Math.floor(max / SPACING)
    const idx = Math.floor(Math.random() * (count + 1))
    return idx * SPACING
  }

  const pickDirection = (): { dirX: number; dirY: number } => {
    const dirs = [
      { dirX: 1, dirY: 0 },
      { dirX: -1, dirY: 0 },
      { dirX: 0, dirY: 1 },
      { dirX: 0, dirY: -1 },
      { dirX: 1, dirY: 1 },
      { dirX: -1, dirY: -1 },
    ]
    return dirs[Math.floor(Math.random() * dirs.length)]
  }

  const createOrb = useCallback((w: number, h: number): Orb => {
    const dir = pickDirection()
    const isHorizontal = dir.dirY === 0
    const isVertical = dir.dirX === 0

    let x: number
    let y: number

    if (isHorizontal) {
      x = snapToGrid(0, w)
      y = snapToGrid(0, h)
    } else if (isVertical) {
      x = snapToGrid(0, w)
      y = snapToGrid(0, h)
    } else {
      x = snapToGrid(0, w)
      y = snapToGrid(0, h)
    }

    const stepsInLine = Math.floor(Math.random() * 6 + 3)

    return {
      x,
      y,
      dirX: dir.dirX,
      dirY: dir.dirY,
      speed: 0.4 + Math.random() * 0.4,
      color: Math.random() > 0.5 ? "red" : "blue",
      alpha: 0,
      targetAlpha: 0.25 + Math.random() * 0.2,
      stepsRemaining: stepsInLine * SPACING,
      trail: [],
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initOrbs = () => {
      orbsRef.current = Array.from({ length: ORB_COUNT }, () =>
        createOrb(canvas.width, canvas.height)
      )
    }

    const drawGrid = () => {
      if (!ctx || !canvas) return

      ctx.strokeStyle = "rgba(45, 212, 191, 0.04)"
      ctx.lineWidth = 1

      for (let x = 0; x < canvas.width; x += SPACING) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += SPACING) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Diagonal accent lines
      ctx.strokeStyle = "rgba(45, 212, 191, 0.03)"
      for (let i = -canvas.height; i < canvas.width + canvas.height; i += SPACING * 3) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i + canvas.height, canvas.height)
        ctx.stroke()
      }
    }

    const drawOrbs = () => {
      if (!ctx || !canvas) return

      for (const orb of orbsRef.current) {
        // Draw trail
        for (let i = 0; i < orb.trail.length; i++) {
          const t = orb.trail[i]
          const trailAlpha = t.alpha * (i / orb.trail.length) * 0.5
          if (orb.color === "red") {
            ctx.fillStyle = `rgba(239, 68, 68, ${trailAlpha})`
          } else {
            ctx.fillStyle = `rgba(59, 130, 246, ${trailAlpha})`
          }
          const trailSize = ORB_RADIUS * (i / orb.trail.length) * 0.8
          ctx.fillRect(t.x - trailSize / 2, t.y - trailSize / 2, trailSize, trailSize)
        }

        // Draw orb glow
        const glowAlpha = orb.alpha * 0.3
        if (orb.color === "red") {
          const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, ORB_RADIUS * 6)
          gradient.addColorStop(0, `rgba(239, 68, 68, ${glowAlpha})`)
          gradient.addColorStop(1, "rgba(239, 68, 68, 0)")
          ctx.fillStyle = gradient
        } else {
          const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, ORB_RADIUS * 6)
          gradient.addColorStop(0, `rgba(59, 130, 246, ${glowAlpha})`)
          gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
          ctx.fillStyle = gradient
        }
        ctx.fillRect(orb.x - ORB_RADIUS * 6, orb.y - ORB_RADIUS * 6, ORB_RADIUS * 12, ORB_RADIUS * 12)

        // Draw orb core (square for geometric feel)
        if (orb.color === "red") {
          ctx.fillStyle = `rgba(239, 68, 68, ${orb.alpha})`
        } else {
          ctx.fillStyle = `rgba(59, 130, 246, ${orb.alpha})`
        }
        ctx.fillRect(orb.x - ORB_RADIUS, orb.y - ORB_RADIUS, ORB_RADIUS * 2, ORB_RADIUS * 2)
      }
    }

    const updateOrbs = () => {
      if (!canvas) return

      for (let i = 0; i < orbsRef.current.length; i++) {
        const orb = orbsRef.current[i]

        // Fade in
        if (orb.alpha < orb.targetAlpha) {
          orb.alpha = Math.min(orb.alpha + 0.003, orb.targetAlpha)
        }

        // Add to trail
        orb.trail.push({ x: orb.x, y: orb.y, alpha: orb.alpha })
        if (orb.trail.length > TRAIL_LENGTH) {
          orb.trail.shift()
        }

        // Move along grid
        orb.x += orb.dirX * orb.speed
        orb.y += orb.dirY * orb.speed
        orb.stepsRemaining -= orb.speed

        // At an intersection, possibly change direction
        if (orb.stepsRemaining <= 0) {
          // Snap to nearest grid point
          orb.x = Math.round(orb.x / SPACING) * SPACING
          orb.y = Math.round(orb.y / SPACING) * SPACING

          const newDir = pickDirection()
          orb.dirX = newDir.dirX
          orb.dirY = newDir.dirY
          orb.stepsRemaining = (Math.floor(Math.random() * 6 + 2)) * SPACING
        }

        // If off-screen, respawn
        const margin = SPACING * 2
        if (
          orb.x < -margin ||
          orb.x > canvas.width + margin ||
          orb.y < -margin ||
          orb.y > canvas.height + margin
        ) {
          orbsRef.current[i] = createOrb(canvas.width, canvas.height)
        }
      }
    }

    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawGrid()
      updateOrbs()
      drawOrbs()
      animFrameRef.current = requestAnimationFrame(animate)
    }

    resize()
    initOrbs()
    animate()

    window.addEventListener("resize", resize)
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [createOrb])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  )
}
