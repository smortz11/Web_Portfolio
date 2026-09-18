"""Import NSE4 Obsidian ZIPs, validating references before writing public files."""
import argparse
import datetime
import json
from pathlib import Path
import re
import zipfile
from urllib.parse import quote

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('notes_zip', type=Path)
parser.add_argument('images_zip', type=Path)
parser.add_argument('--date', default=datetime.date.today().isoformat())
args = parser.parse_args()
datetime.date.fromisoformat(args.date)
root = Path(__file__).resolve().parents[1]
collection = root / 'public/knowledge/NSE4_Study_Materials'
assets = root / 'public/knowledge-assets/NSE4'

def slug(title):
    return re.sub(r'[^A-Za-z0-9]+', '_', title).strip('_') + '_Notes'

with zipfile.ZipFile(args.notes_zip) as archive:
    notes = {}
    for name in archive.namelist():
        if name.endswith('.md') and not name.startswith('__MACOSX/'):
            title = Path(name).stem
            if title in notes:
                raise ValueError(f'Duplicate note: {title}')
            notes[title] = archive.read(name).decode('utf-8-sig').strip()

with zipfile.ZipFile(args.images_zip) as archive:
    images = {}
    for name in archive.namelist():
        if name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
            key = Path(name).name
            if key in images:
                raise ValueError(f'Ambiguous image filename: {key}')
            images[key] = archive.read(name)

used = set()
outputs = {}
for title, body in notes.items():
    if not body:
        continue
    def image(match):
        name = match[1]
        if name not in images:
            raise ValueError(f'{title}: missing image {name}')
        used.add(name)
        return f'![Study diagram](/knowledge-assets/NSE4/{quote(name)})'
    def link(match):
        target = match[1]
        if target not in notes:
            raise ValueError(f'{title}: unknown note {target}')
        label = re.sub(r'^\d+\.\s*', '', target)
        return (f'[{label}](/Knowledge_Base/NSE4_Study_Materials/{slug(target)})'
                if notes[target] else f'{label} — notes pending')
    body = re.sub(r'!\[\[([^\]]+)\]\]', image, body)
    body = re.sub(r'\[\[([^\]]+)\]\]', link, body)
    if title.startswith('0.'):
        body = '\n'.join('- ' + line for line in body.splitlines() if line.strip())
    resource_slug = slug(title)
    metadata = {'title': title + (' — Notes' if not title.startswith('0.') else ''),
                'slug': resource_slug, 'description': 'NSE4 study notes: ' + re.sub(r'^\d+\.\s*', '', title),
                'date': args.date, 'tags': ['Fortinet', 'NSE4', 'Notes']}
    frontmatter = '\n'.join(f'{k}: {json.dumps(v)}' for k, v in metadata.items())
    outputs[resource_slug] = f'---\n{frontmatter}\n---\n\n{body}\n'

# All references have passed validation; publish only referenced assets.
for resource_slug, content in outputs.items():
    folder = collection / resource_slug
    folder.mkdir(parents=True, exist_ok=True)
    (folder / 'Notes.md').write_text(content)
assets.mkdir(parents=True, exist_ok=True)
for name in sorted(used):
    (assets / name).write_bytes(images[name])
print(f'Imported {len(outputs)} documents and {len(used)} images; skipped {len(notes)-len(outputs)} empty notes.')
print('Existing resources and assets are retained; review intentional deletions separately.')
