# Output schema

All paths are relative to the app `public/` directory unless noted.

## Directory layout

```
public/
  instagram/
    profile.jpg          # avatar from embed
    post-1.jpg …         # feed images (640px from display_resources)
    meta.json            # machine-readable extraction
    highlights/          # optional (--instaloader)
      highlight-01-Spa-Day.jpg
  team/
    dra-samiebaptista.jpg
    psi-gislenevilas.jpg
    …                    # coauthor profile pics from feed posts
```

## `meta.json`

```json
{
  "username": "clinicamussiestetica",
  "followers": 2521,
  "profile_pic_url": "https://…",
  "post_count": 6,
  "source": "instagram embed",
  "feed": [
    {
      "id": 1,
      "shortcode": "DbOUZvbCvlu",
      "file": "/instagram/post-1.jpg",
      "caption": "…",
      "is_video": true,
      "coauthors": [],
      "permalink": "https://www.instagram.com/p/DbOUZvbCvlu/"
    }
  ],
  "professionals": [
    {
      "username": "dra.samiebaptista",
      "full_name": "Dra. Samie Baptista",
      "role_hint": "Equipe clínica",
      "bio": null,
      "photo": "/team/dra-samiebaptista.jpg",
      "instagram": "https://www.instagram.com/dra.samiebaptista/",
      "source_post": "DbbwraEpEW2"
    }
  ],
  "highlights": {
    "highlights": [{ "title": "Spa Day", "file": "instagram/highlights/highlight-01-Spa-Day.jpg" }],
    "highlight_count": 1
  }
}
```

## Wiring into `site.ts`

Map verified fields only:

| meta.json | site.ts |
| --- | --- |
| `feed[].file` | `media.gallery`, procedure images |
| `feed[].caption` | procedure lead/note, hero copy (verbatim) |
| `professionals[].full_name` | `name` (fallback: formatted username) |
| `professionals[].role_hint` | `role` (only when inferable from handle) |
| Caption mentioning a person by name | `description` for that professional |
| `professionals[].photo` | `photo` |

Do **not** invent CRM, specialties, or bios when `bio` is null.
