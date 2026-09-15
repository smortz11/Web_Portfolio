"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  return <button type="button" onClick={copy} className="kb-button" aria-live="polite">{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}{copied ? "Copied" : "Copy link"}</button>
}
