import type { Metadata } from "next"
import { CollectionCard, KnowledgeHeader } from "@/components/knowledge/knowledge-ui"
import { getCollections } from "@/lib/knowledge"

export const metadata: Metadata = {
  title: "Knowledge Base | Andrew Swartz",
  description: "Networking, certification, homelab, and cybersecurity resources from Andrew Swartz.",
}

export default async function KnowledgeBasePage() {
  const collections = await getCollections()
  return <>
    <KnowledgeHeader eyebrow="Technical Repository // Index" title="Knowledge Base" description="Study material, field notes, labs, writeups, and downloadable resources covering networking, homelab operations, and cybersecurity." />
    <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"><span>Collections</span><span>{collections.length} directories</span></div>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{collections.map((collection) => <CollectionCard key={collection.slug} collection={collection} />)}</section>
  </>
}
