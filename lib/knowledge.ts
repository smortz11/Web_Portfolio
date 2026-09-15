import "server-only"

import { promises as fs } from "node:fs"
import path from "node:path"

export interface RecommendedResource {
  name: string
  url: string
  description?: string
}

export interface KnowledgeCollection {
  title: string
  slug: string
  description: string
  summary?: string
  purpose?: string
  audience?: string
  prerequisites?: string[]
  recommendedResources?: RecommendedResource[]
  notes?: string
  disclaimer?: string
  tags?: string[]
  lastUpdated?: string
  resourceCount: number
}

export type PreviewKind = "markdown" | "text" | "image" | "pdf" | "download"

export interface KnowledgeResource {
  title: string
  slug: string
  description: string
  date?: string
  tags: string[]
  filename: string
  extension: string
  typeLabel: string
  previewKind: PreviewKind
  size: number
  downloadPath: string
  content?: string
}

type CollectionFile = Omit<KnowledgeCollection, "resourceCount">
type ResourceMetadata = {
  title?: string
  slug?: string
  description?: string
  date?: string
  tags?: string[]
  file?: string
}

const KNOWLEDGE_ROOT = path.join(process.cwd(), "public", "knowledge")
const SAFE_SLUG = /^[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*$/
const SAFE_FILENAME = /^[^/\\\0]+$/
const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"])
const TEXT_EXTENSIONS = new Set([".txt", ".json", ".yaml", ".yml"])
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"])

export function titleToSlug(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

export function isValidKnowledgeSlug(value: string): boolean {
  return value.length > 0 && value.length <= 100 && SAFE_SLUG.test(value)
}

function assertSlug(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || !isValidKnowledgeSlug(value)) {
    throw new Error(`Invalid ${label} in Knowledge Base metadata`)
  }
}

function isPlainFilename(value: unknown): value is string {
  return typeof value === "string" && SAFE_FILENAME.test(value) && value !== "." && value !== ".."
}

function isSafeExternalUrl(value: unknown): value is string {
  if (typeof value !== "string") return false
  try {
    const protocol = new URL(value).protocol
    return protocol === "https:" || protocol === "http:"
  } catch {
    return false
  }
}

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as T
}

function parseScalar(value: string): string {
  return value.trim().replace(/^(["'])(.*)\1$/, "$2")
}

function parseFrontmatter(source: string): { data: ResourceMetadata; body: string } {
  if (!source.startsWith("---\n") && !source.startsWith("---\r\n")) return { data: {}, body: source }
  const normalized = source.replace(/\r\n/g, "\n")
  const end = normalized.indexOf("\n---\n", 4)
  if (end < 0) return { data: {}, body: source }

  const data: ResourceMetadata = {}
  const lines = normalized.slice(4, end).split("\n")
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    if (key === "tags") {
      const tags: string[] = []
      if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
        tags.push(...rawValue.slice(1, -1).split(",").map(parseScalar).filter(Boolean))
      } else {
        while (lines[index + 1]?.match(/^\s+-\s+/)) {
          index += 1
          tags.push(parseScalar(lines[index].replace(/^\s+-\s+/, "")))
        }
      }
      data.tags = tags
    } else if (["title", "slug", "description", "date"].includes(key)) {
      data[key as "title" | "slug" | "description" | "date"] = parseScalar(rawValue)
    }
  }
  return { data, body: normalized.slice(end + 5).trimStart() }
}

function extensionDetails(filename: string): Pick<KnowledgeResource, "extension" | "typeLabel" | "previewKind"> {
  const extension = path.extname(filename).toLowerCase()
  if (MARKDOWN_EXTENSIONS.has(extension)) return { extension, typeLabel: extension.slice(1).toUpperCase(), previewKind: "markdown" }
  if (TEXT_EXTENSIONS.has(extension)) return { extension, typeLabel: extension.slice(1).toUpperCase(), previewKind: "text" }
  if (IMAGE_EXTENSIONS.has(extension)) return { extension, typeLabel: "IMG", previewKind: "image" }
  if (extension === ".pdf") return { extension, typeLabel: "PDF", previewKind: "pdf" }
  const labels: Record<string, string> = { ".pkt": "PKT", ".apkg": "ANKI", ".zip": "ZIP", ".pcap": "PCAP", ".pcapng": "PCAP" }
  return { extension, typeLabel: labels[extension] ?? (extension.slice(1).toUpperCase() || "FILE"), previewKind: "download" }
}

async function loadResource(collectionSlug: string, directoryName: string): Promise<KnowledgeResource | null> {
  if (!isValidKnowledgeSlug(directoryName)) return null
  const directory = path.join(KNOWLEDGE_ROOT, collectionSlug, directoryName)
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const metadataEntry = entries.find((entry) => entry.isFile() && entry.name === "metadata.json")
  const metadata = metadataEntry ? await readJson<ResourceMetadata>(path.join(directory, metadataEntry.name)) : {}
  const configuredFilename = metadata.file
  const contentEntry = configuredFilename
    ? entries.find((entry) => entry.isFile() && entry.name === configuredFilename)
    : entries.find((entry) => entry.isFile() && entry.name !== "metadata.json" && MARKDOWN_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))

  if (!contentEntry || !isPlainFilename(contentEntry.name)) return null
  const filename = contentEntry.name
  const details = extensionDetails(filename)
  const absolutePath = path.join(directory, filename)
  const stat = await fs.stat(absolutePath)
  let content: string | undefined
  let frontmatter: ResourceMetadata = {}
  if (details.previewKind === "markdown" || details.previewKind === "text") {
    content = await fs.readFile(absolutePath, "utf8")
    if (details.previewKind === "markdown") {
      const parsed = parseFrontmatter(content)
      frontmatter = parsed.data
      content = parsed.body
    }
  }
  const combined = { ...metadata, ...frontmatter }
  const slug = combined.slug ?? directoryName
  assertSlug(slug, "resource slug")
  if (slug !== directoryName) throw new Error(`Resource directory must match its slug: ${directoryName}`)

  return {
    title: combined.title ?? filename.replace(path.extname(filename), "").replace(/_/g, " "),
    slug,
    description: combined.description ?? "Downloadable technical resource.",
    date: combined.date,
    tags: Array.isArray(combined.tags) ? combined.tags.filter((tag): tag is string => typeof tag === "string") : [],
    filename,
    ...details,
    size: stat.size,
    downloadPath: `/knowledge/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(slug)}/${encodeURIComponent(filename)}`,
    content,
  }
}

export async function getResources(collectionSlug: string): Promise<KnowledgeResource[]> {
  if (!isValidKnowledgeSlug(collectionSlug)) return []
  try {
    const entries = await fs.readdir(path.join(KNOWLEDGE_ROOT, collectionSlug), { withFileTypes: true })
    const resources = await Promise.all(entries.filter((entry) => entry.isDirectory()).map((entry) => loadResource(collectionSlug, entry.name)))
    return resources.filter((resource): resource is KnowledgeResource => resource !== null).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "") || a.title.localeCompare(b.title))
  } catch {
    return []
  }
}

export async function getCollections(): Promise<KnowledgeCollection[]> {
  const entries = await fs.readdir(KNOWLEDGE_ROOT, { withFileTypes: true })
  const collections = await Promise.all(entries.filter((entry) => entry.isDirectory()).map(async (entry) => {
    try {
      const data = await readJson<CollectionFile>(path.join(KNOWLEDGE_ROOT, entry.name, "collection.json"))
      assertSlug(data.slug, "collection slug")
      if (data.slug !== entry.name) throw new Error(`Collection directory must match its slug: ${entry.name}`)
      const resources = await getResources(data.slug)
      const recommendedResources = Array.isArray(data.recommendedResources)
        ? data.recommendedResources.filter((resource) => resource && typeof resource.name === "string" && isSafeExternalUrl(resource.url))
        : undefined
      const collection: KnowledgeCollection = { ...data, recommendedResources, resourceCount: resources.length }
      return collection
    } catch (error) {
      console.error(`Could not load Knowledge Base collection ${entry.name}:`, error)
      return null
    }
  }))
  return collections.filter((collection): collection is KnowledgeCollection => collection !== null).sort((a, b) => a.title.localeCompare(b.title))
}

export async function getCollection(slug: string): Promise<KnowledgeCollection | null> {
  if (!isValidKnowledgeSlug(slug)) return null
  return (await getCollections()).find((collection) => collection.slug === slug) ?? null
}

export async function getResource(collectionSlug: string, resourceSlug: string): Promise<KnowledgeResource | null> {
  if (!isValidKnowledgeSlug(resourceSlug)) return null
  return (await getResources(collectionSlug)).find((resource) => resource.slug === resourceSlug) ?? null
}

export function getResourceDownloadPath(resource: KnowledgeResource): string {
  return resource.downloadPath
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

export function formatKnowledgeDate(date?: string): string | null {
  if (!date) return null
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(parsed)
}
