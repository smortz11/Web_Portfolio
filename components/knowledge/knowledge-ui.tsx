import Link from "next/link"
import { ArrowLeft, ArrowRight, Download, ExternalLink, Folder, FileText } from "lucide-react"
import type { KnowledgeCollection, KnowledgeResource } from "@/lib/knowledge"
import { formatFileSize, formatKnowledgeDate } from "@/lib/knowledge"

export function KnowledgeHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="mb-10 border-b border-border pb-8">
    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-primary/70">{eyebrow}</p>
    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
  </header>
}

export function TagList({ tags = [] }: { tags?: string[] }) {
  if (!tags.length) return null
  return <div className="flex flex-wrap gap-1.5">{tags.map((tag) => <span key={tag} className="border border-primary/20 bg-primary/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary/80">{tag}</span>)}</div>
}

export function CollectionCard({ collection }: { collection: KnowledgeCollection }) {
  return <Link href={`/Knowledge_Base/${collection.slug}`} className="group relative flex min-h-52 flex-col border border-border bg-card/60 p-5 transition-all hover:border-primary/45 hover:bg-primary/[0.035]">
    <div className="absolute -left-px -top-px h-3 w-3 border-l border-t border-primary/70" />
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary"><Folder className="h-3.5 w-3.5" />[ DIR ]</div>
    <h2 className="mt-4 text-base font-semibold text-foreground transition-colors group-hover:text-primary">{collection.title}</h2>
    <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{collection.description}</p>
    <div className="mt-5"><TagList tags={collection.tags?.slice(0, 3)} /></div>
    <div className="mt-4 flex items-end justify-between gap-4 border-t border-border/70 pt-3 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
      <div><span>{collection.resourceCount} resource{collection.resourceCount === 1 ? "" : "s"}</span>{collection.lastUpdated && <span className="mt-1 block">Updated {formatKnowledgeDate(collection.lastUpdated)}</span>}</div>
      <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
    </div>
  </Link>
}

export function ResourceCard({ collectionSlug, resource }: { collectionSlug: string; resource: KnowledgeResource }) {
  return <article className="group border border-border bg-card/50 p-5 transition-colors hover:border-primary/35">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary"><FileText className="h-3.5 w-3.5" />[ {resource.typeLabel} ]</div>
        <h2 className="mt-3 text-base font-semibold text-foreground">{resource.title}</h2>
        <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground">{resource.filename}</p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{resource.description}</p>
        <div className="mt-4"><TagList tags={resource.tags} /></div>
        <p className="mt-3 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{formatFileSize(resource.size)}{resource.date ? ` · ${formatKnowledgeDate(resource.date)}` : ""}</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Link href={`/Knowledge_Base/${collectionSlug}/${resource.slug}`} className="kb-button"><ExternalLink className="h-3 w-3" />{resource.previewKind === "download" ? "Open" : "Preview"}</Link>
        <a href={resource.downloadPath} download className="kb-button"><Download className="h-3 w-3" />Download</a>
      </div>
    </div>
  </article>
}

export function KnowledgeBreadcrumbs({ collection, resource }: { collection?: KnowledgeCollection; resource?: KnowledgeResource }) {
  return <nav aria-label="Breadcrumb" className="mb-7 overflow-x-auto whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
    <Link href="/Knowledge_Base" className="hover:text-primary">Knowledge Base</Link>
    {collection && <><span className="px-2 text-primary/50">/</span><Link href={`/Knowledge_Base/${collection.slug}`} className="hover:text-primary">{collection.title}</Link></>}
    {resource && <><span className="px-2 text-primary/50">/</span><span className="text-foreground">{resource.title}</span></>}
  </nav>
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary"><ArrowLeft className="h-3 w-3" />{children}</Link>
}
