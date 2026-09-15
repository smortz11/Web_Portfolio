import type { ReactNode } from "react"

function inline(text: string): ReactNode[] {
  const tokens = text.split(/(`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\)|\*\*[^*]+\*\*)/g)
  return tokens.map((token, index) => {
    if (token.startsWith("`") && token.endsWith("`")) return <code key={index}>{token.slice(1, -1)}</code>
    const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/)
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]}</a>
    if (token.startsWith("**") && token.endsWith("**")) return <strong key={index}>{token.slice(2, -2)}</strong>
    return token
  })
}

function isDivider(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line)
}

function cells(line: string) {
  return line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim())
}

export function MarkdownRenderer({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n")
  const blocks: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) { index += 1; continue }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim()
      const code: string[] = []
      index += 1
      while (index < lines.length && !lines[index].startsWith("```")) code.push(lines[index++])
      index += 1
      blocks.push(<pre key={blocks.length} data-language={language || undefined}><code>{code.join("\n")}</code></pre>)
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      const Heading = `h${heading[1].length}` as keyof React.JSX.IntrinsicElements
      blocks.push(<Heading key={blocks.length}>{inline(heading[2])}</Heading>)
      index += 1
      continue
    }

    if (line.includes("|") && isDivider(lines[index + 1] ?? "")) {
      const headers = cells(line)
      index += 2
      const rows: string[][] = []
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) rows.push(cells(lines[index++]))
      blocks.push(
        <div className="kb-table-wrap" key={blocks.length}><table><thead><tr>{headers.map((cell, cellIndex) => <th key={cellIndex}>{inline(cell)}</th>)}</tr></thead>
          <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>
      )
      continue
    }

    if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line)
      const items: string[] = []
      const pattern = ordered ? /^\s*\d+\.\s+(.+)$/ : /^\s*[-*+]\s+(.+)$/
      while (index < lines.length) {
        const item = lines[index].match(pattern)
        if (!item) break
        items.push(item[1]); index += 1
      }
      const List = ordered ? "ol" : "ul"
      blocks.push(<List key={blocks.length}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</List>)
      continue
    }

    if (line.startsWith("> ")) {
      const quote: string[] = []
      while (index < lines.length && lines[index].startsWith("> ")) quote.push(lines[index++].slice(2))
      blocks.push(<blockquote key={blocks.length}>{inline(quote.join(" "))}</blockquote>)
      continue
    }

    if (/^---+$/.test(line.trim())) { blocks.push(<hr key={blocks.length} />); index += 1; continue }
    const paragraph = [line]
    index += 1
    while (index < lines.length && lines[index].trim() && !/^(#{1,6})\s|^```|^> |^\s*[-*+]\s+|^\s*\d+\.\s+/.test(lines[index])) paragraph.push(lines[index++])
    blocks.push(<p key={blocks.length}>{inline(paragraph.join(" "))}</p>)
  }

  return <article className="kb-markdown">{blocks}</article>
}
