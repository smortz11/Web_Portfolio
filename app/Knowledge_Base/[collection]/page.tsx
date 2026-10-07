import { Folder } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { KnowledgeBreadcrumbs, KnowledgeHeader, ResourceCard, TagList } from "@/components/knowledge/knowledge-ui"
import { formatKnowledgeDate, getCollection, getCollections, getResources } from "@/lib/knowledge"

type Props = { params: Promise<{ collection: string }> }

export async function generateStaticParams() {
  return (await getCollections()).map((collection) => ({ collection: collection.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection: slug } = await params
  const collection = await getCollection(slug)
  if (!collection) return {}
  return { title: `${collection.title} | Andrew Swartz Knowledge Base`, description: collection.description }
}

export default async function CollectionPage({ params }: Props) {
  const { collection: slug } = await params
  const collection = await getCollection(slug)
  if (!collection) notFound()
  const resources = await getResources(collection.slug)
  const folders = collection.folders ?? []
  const unfiled = resources.filter((resource) => !folders.some((folder) => folder.slug === resource.folder))

  return <>
    <KnowledgeBreadcrumbs collection={collection} />
    <KnowledgeHeader eyebrow="Knowledge Base // Collection" title={collection.title} description={collection.description} />
    <section className="mb-10 border border-border bg-card/45 p-5 sm:p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>{collection.summary && <p className="text-sm leading-relaxed text-muted-foreground">{collection.summary}</p>}
          {collection.purpose && <Info label="Purpose" value={collection.purpose} />}
          {collection.audience && <Info label="Audience" value={collection.audience} />}
          {collection.prerequisites?.length ? <Info label="Prerequisites" value={collection.prerequisites.join(" · ")} /> : null}
        </div>
        <div>
          {collection.recommendedResources?.length ? <div><h2 className="kb-label">Recommended resources</h2><ul className="mt-3 space-y-2">{collection.recommendedResources.map((resource) => <li key={resource.url}><a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{resource.name} ↗</a>{resource.description && <p className="mt-0.5 text-xs text-muted-foreground">{resource.description}</p>}</li>)}</ul></div> : null}
          {collection.notes && <Info label="Notes" value={collection.notes} />}
          {collection.disclaimer && <Info label="Disclaimer" value={collection.disclaimer} />}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-4"><TagList tags={collection.tags} />{collection.lastUpdated && <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Updated {formatKnowledgeDate(collection.lastUpdated)}</p>}</div>
    </section>
    <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"><span>Resources</span><span>{resources.length} file{resources.length === 1 ? "" : "s"}</span></div>
    <section className="grid gap-3" aria-label="Collection resources">
      {folders.map((folder) => {
        const entries = resources.filter((resource) => resource.folder === folder.slug)
          .sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }))
        return <details key={folder.slug} id={folder.slug} className="group border border-border bg-card/45">
          <summary className="cursor-pointer p-5 marker:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <span className="inline-flex items-center gap-3 align-middle"><Folder aria-hidden="true" className="h-5 w-5 text-primary" /><span className="font-semibold">{folder.title}</span><span className="font-mono text-xs text-muted-foreground">{entries.length} file{entries.length === 1 ? "" : "s"}</span></span>
            <span className="mt-2 block text-xs text-muted-foreground">{folder.description}</span>
          </summary>
          <div className="grid gap-3 border-t border-border p-3 sm:p-5">
            {entries.length ? entries.map((resource) => <ResourceCard key={resource.slug} collectionSlug={collection.slug} resource={resource} />) : <p className="py-6 text-center text-sm text-muted-foreground">No {folder.title.toLowerCase()} added yet.</p>}
          </div>
        </details>
      })}
      {unfiled.map((resource) => <ResourceCard key={resource.slug} collectionSlug={collection.slug} resource={resource} />)}
      {!resources.length && !folders.length && <div className="border border-dashed border-border px-5 py-12 text-center"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">[ EMPTY DIRECTORY ]</p><p className="mt-2 text-xs text-muted-foreground">Resources will be added here as they become available.</p></div>}
    </section>
  </>
}

function Info({ label, value }: { label: string; value: string }) { return <div className="mt-5"><h2 className="kb-label">{label}</h2><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{value}</p></div> }
