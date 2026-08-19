---
name: instagram-extract
description: >-
  Extract photos, feed posts, story highlights, and professionals from a public
  Instagram profile for premium landing pages. Use when building clinic/brand
  sites that need real Instagram visuals, captions, coauthors, or team data from
  @handle — without inventing copy.
paths:
  - "apps/**/public/**"
  - "apps/**/src/data/**"
---

# Instagram Extract

Pull **real** visuals and copy from a public Instagram profile before wiring a
landing (`premium-site-brief` → `anti-ai-landing`). Never invent captions,
titles, CRM numbers, or specialties.

Invoke with `/instagram-extract` or load when the user asks for fotos do Insta,
feed, destaques, profissionais, or equipe from `@handle`.

## What you can extract (no login)

| Asset | Source | Notes |
| --- | --- | --- |
| Feed posts (visible in embed) | `/{username}/embed/` | Captions, shortcodes, coauthors, 640px images via `display_resources` |
| Profile photo | same embed | `profile_pic_url` / `_hd` |
| Follower count | same embed | `edge_followed_by.count` |
| Coauthors / team handles | per-post blocks in embed | `coauthor_producers` usernames |
| Full names (sometimes) | `/{coauthor}/embed/` | `full_name`, `biography` when exposed |
| Story highlights | **instaloader** (optional) | Rate-limited; may fail without session |

**Not reliably available without login:** full feed history, reels MP4, DMs,
private accounts, expired CDN URLs.

## Workflow

### 1. Confirm handle and output paths

- Handle: `@clinicamussiestetica` → username `clinicamussiestetica`
- Output root: `apps/<project>/public/`
- Script: [references/extract.py](references/extract.py)

```bash
python3 .cursor/skills/frontend/instagram-extract/references/extract.py \
  clinicamussiestetica \
  --out apps/clinica-mussi-estetica/public
```

Optional highlights (instaloader — retry later if 429):

```bash
python3 .cursor/skills/frontend/instagram-extract/references/extract.py \
  clinicamussiestetica \
  --out apps/clinica-mussi-estetica/public \
  --instaloader
```

Read [output schema](references/output-schema.md) for `meta.json` layout.

### 2. Verify downloads

- `public/instagram/post-*.jpg` — feed images
- `public/instagram/profile.jpg` — avatar
- `public/instagram/meta.json` — captions + professionals JSON
- `public/team/*.jpg` — coauthor avatars (may be small if CDN blocks upscaling)
- `public/instagram/highlights/` — only when instaloader succeeds

If CDN returns **403** on upscaled URLs, the script retries the original
thumbnail (`s100x100`). Do not substitute stock photos.

### 3. Extract professionals honestly

**Sources of truth (priority order):**

1. **Caption names** — e.g. “A Márcia faz parte de quem torna…” → Márcia + description from caption
2. **Coauthor handles** on official clinic posts → team member with link to Instagram
3. **`full_name` from profile embed** when available (Enidelcy Mussi, Gislene Vilas Boas, etc.)
4. **Handle hints** — `dra.` → equipe clínica; `psi.` → psicologia; `*lash*` → lash designer

**When bio/full_name is missing**, use neutral copy:

> Profissional associada em publicação oficial @{clinic_handle}.

Never fabricate CRM, university, or procedure specialties.

### 4. Map captions to people

Scan `meta.json` → `feed[].caption` for proper names tied to roles:

| Caption signal | Action |
| --- | --- |
| Named person + role context | `description` verbatim or lightly trimmed |
| Team post (“cada profissional contribui…”) | Section intro, not individual bio |
| Founder post | Featured professional with full portrait if photo exists |

Match post images to people when the post **is about** them (e.g. post-3 → Márcia).

### 5. Wire into the site

In `src/data/site.ts`:

```ts
export const media = {
  profile: '/instagram/profile.jpg',
  gallery: ['/instagram/post-1.jpg', /* … */],
  team: { eny: '/team/eny-mussi.jpg', /* … */ },
}

export const site = {
  professionals: [
    { id: 'eny', name: 'Eny Mussi', role: 'Fundadora', description: '…', photo: media.team.eny, featured: true, source: 'Instagram @handle' },
  ],
}
```

Add a `Team` section (`#equipe`) — editorial layout, not a generic card grid.
Load `anti-ai-landing` for composition rules.

## Fallback ladder (when blocked)

1. **`/{username}/embed/`** — primary; works for most public business profiles
2. **`/{username}/embed/` saved HTML** — parse offline if live fetch rate-limits
3. **`/p/{shortcode}/embed/`** — single post when profile embed is incomplete
4. **instaloader** — highlights + extra metadata; expect 429 → wait/retry
5. **User-provided assets** — ask for photos/export if all automated paths fail

Do **not** scrape logged-in pages, bypass auth, or use unofficial APIs that require tokens.

## Parsing notes (embed HTML)

Instagram embed JSON is escaped (`\\"text\\":\\"…\\"`, `\\\\\\/`, `\\u00e9`).

```python
def decode_text(raw):
    text = raw.replace('\\/', '/').replace('\\n', '\n')
    text = text.encode('utf-8').decode('unicode_escape')
    return text.encode('utf-8', 'surrogatepass').decode('utf-8', 'replace')
```

Extract images from `display_resources` — pick highest `config_width`.
Coauthors: regex `username` inside each shortcode block.

## Content discipline

- Copy on site must trace to a caption or public bio in `meta.json`
- Tag `source: 'Instagram @handle'` on professional entries
- Commit `public/instagram/` and `public/team/` with the feature
- Do not commit temp `ig-*.html` scrape files at repo root

## Checklist before shipping

- [ ] `meta.json` written and readable (UTF-8, no surrogate errors)
- [ ] Feed images downloaded or documented as expired
- [ ] Featured professionals have real photos (not placeholders)
- [ ] Descriptions verified — no invented credentials
- [ ] Team section linked from hero (`#equipe`)
- [ ] Highlights folder present OR user informed instaloader failed
