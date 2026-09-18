import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function MarkdownRenderer({ source, basePath = "/" }: { source: string; basePath?: string }) {
  function resolveUrl(url: string) {
    if (!url || url.startsWith("/") || url.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(url)) return url
    const resolved = new URL(url, `https://knowledge.invalid${basePath}`)
    return resolved.pathname + resolved.search + resolved.hash
  }

  return <article className="kb-markdown">
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
      a: ({ href, children }) => {
        const external = /^https?:\/\//i.test(href ?? "")
        return <a href={resolveUrl(href ?? "")} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{children}</a>
      },
      img: ({ src, alt, title }) => <img src={resolveUrl(typeof src === "string" ? src : "")} alt={alt ?? ""} title={title} loading="lazy" style={{ maxWidth: "100%", height: "auto" }} />,
      table: ({ children }) => <div className="kb-table-wrap"><table>{children}</table></div>,
    }}>{source}</ReactMarkdown>
  </article>
}
