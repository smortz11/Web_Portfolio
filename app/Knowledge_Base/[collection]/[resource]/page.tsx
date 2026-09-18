import type { Metadata } from "next"
import Image from "next/image"
import { Download } from "lucide-react"
import { notFound } from "next/navigation"
import { CopyLinkButton } from "@/components/knowledge/copy-link-button"
import { MarkdownRenderer } from "@/components/knowledge/markdown-renderer"
import { BackLink, KnowledgeBreadcrumbs, TagList } from "@/components/knowledge/knowledge-ui"
import type { KnowledgeResource } from "@/lib/knowledge"
import { formatFileSize, formatKnowledgeDate, getCollection, getCollections, getResource, getResources } from "@/lib/knowledge"

type Props = { params: Promise<{ collection: string; resource: string }> }

export async function generateStaticParams() {
  const collections = await getCollections()
  return (await Promise.all(collections.map(async (collection) => (await getResources(collection.slug)).map((resource) => ({ collection: collection.slug, resource: resource.slug }))))).flat()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const values = await params
  const resource = await getResource(values.collection, values.resource)
  if (!resource) return {}
  return { title: `${resource.title} | Andrew Swartz Knowledge Base`, description: resource.description }
}

export default async function ResourcePage({ params }: Props) {
  const values = await params
  const collection = await getCollection(values.collection)
  const resource = collection ? await getResource(collection.slug, values.resource) : null
  if (!collection || !resource) notFound()

  return <>
    <KnowledgeBreadcrumbs collection={collection} resource={resource} />
    <header className="mb-8 border-b border-border pb-7">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">[ {resource.typeLabel} ] // {collection.title}</div>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{resource.title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
      <div className="mt-5"><TagList tags={resource.tags} /></div>
    </header>
    <section className="mb-7 flex flex-col justify-between gap-4 border border-border bg-card/50 p-4 sm:flex-row sm:items-center">
      <dl className="grid gap-x-8 gap-y-2 text-xs sm:grid-cols-3"><Meta label="Filename" value={resource.filename} /><Meta label="Size / type" value={`${formatFileSize(resource.size)} · ${resource.typeLabel}`} /><Meta label="Updated" value={formatKnowledgeDate(resource.date) ?? "Not specified"} /></dl>
      <div className="flex flex-wrap gap-2"><CopyLinkButton /><a href={resource.downloadPath} download className="kb-button kb-button-primary"><Download className="h-3 w-3" />Download original</a></div>
    </section>
    <section className="mb-8"><Preview resource={resource} /></section>
    <BackLink href={`/Knowledge_Base/${collection.slug}`}>Back to {collection.title}</BackLink>
  </>
}

function Meta({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><dt className="kb-label">{label}</dt><dd className="mt-1 break-all font-mono text-[10px] text-foreground/80">{value}</dd></div> }

function Preview({ resource }: { resource: KnowledgeResource }) {
  if (resource.previewKind === "markdown") return <MarkdownRenderer source={resource.content ?? ""} basePath={resource.downloadPath} />
  if (resource.previewKind === "text") return <pre className="kb-text-preview"><code>{resource.content}</code></pre>
  if (resource.previewKind === "image") return <div className="relative min-h-72 overflow-hidden border border-border bg-black/20"><Image src={resource.downloadPath} alt={resource.title} fill className="object-contain" unoptimized={resource.extension === ".gif"} /></div>
  if (resource.previewKind === "pdf") return <iframe src={resource.downloadPath} title={`${resource.title} PDF preview`} className="h-[70vh] min-h-96 w-full border border-border bg-white" />
  return <div className="border border-dashed border-border px-5 py-14 text-center"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">[ PREVIEW UNAVAILABLE ]</p><p className="mt-2 text-xs text-muted-foreground">This file type requires its native application. Download the original file to open it.</p></div>
}
