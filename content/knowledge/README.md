# Knowledge Base publishing guide

The Knowledge Base is generated from `public/knowledge`. Each collection is a directory containing a `collection.json`. Each resource is a subdirectory containing one downloadable file. Markdown can carry its own frontmatter; all other file types use `metadata.json`.

Files live under `public` deliberately: Next.js copies them unchanged into the production build, so previews and original downloads work without a database or server-side download endpoint.

## Slugs and direct URLs

Public slugs use letters, numbers, and single underscores. They are case-sensitive, limited to 100 characters, and must match their directory name. The helper converts a title by replacing groups of punctuation/whitespace with underscores: `System and Network Settings` becomes `System_and_Network_Settings`.

- Collection: `/Knowledge_Base/<Collection_Slug>`
- Resource: `/Knowledge_Base/<Collection_Slug>/<Resource_Slug>`

Invalid or unknown slugs return Next.js's normal 404 page.

## Add a category

1. Create `public/knowledge/My_New_Category/`.
2. Add `collection.json`:

```json
{
  "title": "My New Category",
  "slug": "My_New_Category",
  "description": "A short category description.",
  "summary": "Optional longer summary.",
  "tags": ["Optional", "Tags"],
  "lastUpdated": "2026-09-15"
}
```

Optional collection fields are `purpose`, `audience`, `prerequisites` (array), `notes`, `disclaimer`, and `recommendedResources`. Recommended links use `{ "name": "Resource", "url": "https://example.com", "description": "Optional" }`.

## Add a Markdown document

1. Create `public/knowledge/My_Category/My_Document/`.
2. Add `My_Document.md` (or `.mdx`; MDX is rendered as safe Markdown, not executable JSX).
3. Put this frontmatter at the top:

```markdown
---
title: "My Document"
slug: "My_Document"
description: "What the document contains."
date: "2026-09-15"
tags:
  - Networking
  - Security
---

# My Document
```

The resource directory and frontmatter slug must match. The original Markdown is downloadable from its resource page.

## Add Packet Tracer, Anki, PDF, PCAP, ZIP, or another file

1. Create a resource directory, for example `public/knowledge/CCNA_Study_Materials/OSPF_Troubleshooting_Lab/`.
2. Put the original file in it, such as `OSPF_Troubleshooting_Lab.pkt`.
3. Add `metadata.json` beside it:

```json
{
  "title": "OSPF Troubleshooting Lab",
  "slug": "OSPF_Troubleshooting_Lab",
  "description": "Packet Tracer lab for diagnosing OSPF adjacency issues.",
  "date": "2026-09-15",
  "tags": ["Cisco", "OSPF", "Lab"],
  "file": "OSPF_Troubleshooting_Lab.pkt"
}
```

Use the same steps for `.apkg`, `.pdf`, `.pcap`, `.pcapng`, `.zip`, images, text, or unknown extensions. Change `file` to the exact filename. PDFs, images, and supported text receive previews; Packet Tracer, Anki, captures, archives, and unknown formats show metadata plus a download action.

## Remove a resource

Delete its resource directory. Also update the collection's `lastUpdated` value if desired. No component changes are needed.

## Test and publish

From the `Web_Portfolio` directory:

```shell
npm install
npm run dev
npm run lint
npx tsc --noEmit
npm run build
```

Visit the landing page, collection URL, and direct resource URL. Also test one invalid URL and the layout at a narrow viewport. After committing and pushing through your normal workflow, rebuild production; no database migration or CMS publishing step is required.

## Update NSE4 notes from Obsidian

Provide an NSE4 notes ZIP and an Images ZIP, keeping original filenames. Run:

```shell
python3 scripts/import-nse4.py /path/to/NSE4.zip /path/to/Images.zip
```

The importer validates image and note references before writing, publishes only
referenced images, converts Obsidian embeds and links to standard Markdown, and
marks empty chapters as pending in the table of contents. Notes have separate
resource directories so existing labs are preserved. Reimporting updates the same
resources. Old resources/assets are retained: review explicitly requested deletions
separately. Use `--date YYYY-MM-DD` to specify the publication date.

Review the diff, run TypeScript and production build checks, then commit and push.
