#!/usr/bin/env python3
"""Extract public Instagram media and team data from profile embed pages.

No login required for feed/captions/coauthors visible in /{username}/embed/.
Highlights and full feed may need --instaloader (rate limits apply).

Usage:
  python extract.py clinicamussiestetica --out ./public
  python extract.py clinicamussiestetica --out ./public --instaloader
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

USER_AGENTS = [
    'Mozilla/5.0',
    'facebookexternalhit/1.1',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
]


@dataclass
class Post:
    shortcode: str
    caption: str
    image_url: str
    is_video: bool
    coauthors: list[str] = field(default_factory=list)


@dataclass
class Professional:
    username: str
    full_name: str | None
    role_hint: str | None
    profile_pic_url: str | None
    source_post: str | None
    bio: str | None = None


def fetch(url: str) -> str:
    last_error: Exception | None = None
    for agent in USER_AGENTS:
        req = urllib.request.Request(url, headers={'User-Agent': agent})
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                html = response.read().decode('utf-8', errors='ignore')
            if '\\"shortcode\\":\\"' in html or '"shortcode":"' in html:
                return html
        except Exception as exc:
            last_error = exc
    if last_error:
        raise last_error
    raise RuntimeError(f'Failed to fetch embed HTML: {url}')


def unescape_url(raw: str) -> str:
    return raw.replace('\\\\\\/', '/').replace('\\/', '/').replace('\\u00253D', '%3D')


def decode_text(raw: str) -> str:
    text = raw.replace('\\/', '/').replace('\\n', '\n').replace('\\"', '"')
    try:
        text = text.encode('utf-8').decode('unicode_escape')
    except UnicodeDecodeError:
        pass
    return text.encode('utf-8', errors='surrogatepass').decode('utf-8', errors='replace')


def download(url: str, dest: Path) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': USER_AGENTS[0], 'Referer': 'https://www.instagram.com/'},
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            dest.write_bytes(response.read())
        return True
    except urllib.error.HTTPError as exc:
        print(f'  skip download ({exc.code}): {dest.name}', file=sys.stderr)
        return False


def role_from_username(username: str) -> str | None:
    lower = username.lower()
    if lower.startswith('dra.') or lower.startswith('dr.'):
        return 'Equipe clínica'
    if lower.startswith('psi.') or lower.startswith('psic'):
        return 'Psicologia'
    if 'lash' in lower:
        return 'Lash designer'
    return None


def parse_embed(html: str, username: str) -> tuple[list[Post], dict[str, Any]]:
    shortcodes = list(dict.fromkeys(re.findall(r'\\"shortcode\\":\\"([A-Za-z0-9_-]+)\\"', html)))
    captions = [
        decode_text(match)
        for match in re.findall(r'\\"text\\":\\"(.*?)\\"', html)
        if len(match) > 20
    ]

    posts: list[Post] = []
    for index, shortcode in enumerate(shortcodes):
        caption = captions[index] if index < len(captions) else ''
        block = _block_for_shortcode(html, shortcode)
        image_url = _best_image_from_block(block)
        is_video = '\\"is_video\\":true' in block
        coauthors = _coauthors_from_block(block, username)
        if image_url:
            posts.append(
                Post(
                    shortcode=shortcode,
                    caption=caption,
                    image_url=image_url,
                    is_video=is_video,
                    coauthors=coauthors,
                )
            )

    followers_match = re.search(r'\\"edge_followed_by\\":\{\\"count\\":(\d+)\}', html)
    profile_match = re.search(
        r'\\"profile_pic_url_hd\\":\\"((?:[^\\]|\\.)*?)\\"|\\"profile_pic_url\\":\\"((?:[^\\]|\\.)*?)\\"',
        html,
    )
    profile_url = None
    if profile_match:
        profile_url = unescape_url(profile_match.group(1) or profile_match.group(2))

    meta = {
        'username': username,
        'followers': int(followers_match.group(1)) if followers_match else None,
        'profile_pic_url': profile_url,
        'post_count': len(posts),
    }
    return posts, meta


def _block_for_shortcode(html: str, shortcode: str) -> str:
    marker = f'\\"shortcode\\":\\"{shortcode}\\"'
    start = html.find(marker)
    if start < 0:
        return ''
    return html[max(0, start - 2000) : start + 12000]


def _best_image_from_block(block: str) -> str | None:
    resources = re.findall(
        r'\\"config_width\\":(\d+),\\"config_height\\":(\d+),\\"src\\":\\"((?:[^\\]|\\.)*?)\\"',
        block,
    )
    if not resources:
        match = re.search(r'\\"display_url\\":\\"((?:[^\\]|\\.)*?)\\"', block)
        return unescape_url(match.group(1)) if match else None

    best = max(resources, key=lambda item: int(item[0]))
    return unescape_url(best[2])


def _coauthors_from_block(block: str, owner: str) -> list[str]:
    names = re.findall(r'\\"username\\":\\"([^\\"]+)\\"', block)
    return [name for name in dict.fromkeys(names) if name != owner]


def fetch_profile_name(username: str) -> tuple[str | None, str | None]:
    try:
        html = fetch(f'https://www.instagram.com/{username}/embed/')
    except Exception:
        return None, None
    full_name_match = re.search(r'\\"full_name\\":\\"([^\\"]*)\\"', html)
    bio_match = re.search(r'\\"biography\\":\\"([^\\"]*)\\"', html)
    full_name = decode_text(full_name_match.group(1)) if full_name_match and full_name_match.group(1) else None
    bio = decode_text(bio_match.group(1)) if bio_match and bio_match.group(1) else None
    return full_name or None, bio or None


def build_professionals(posts: list[Post], owner: str, html: str) -> list[Professional]:
    by_user: dict[str, Professional] = {}

    for post in posts:
        block = _block_for_shortcode(html, post.shortcode)
        for username in post.coauthors:
            pic_match = re.search(
                rf'\\"username\\":\\"{re.escape(username)}\\"[^}}]*?\\"profile_pic_url\\":\\"((?:[^\\]|\\.)*?)\\"',
                block,
            )
            pic = unescape_url(pic_match.group(1)) if pic_match else None
            if username not in by_user:
                by_user[username] = Professional(
                    username=username,
                    full_name=None,
                    role_hint=role_from_username(username),
                    profile_pic_url=pic,
                    source_post=post.shortcode,
                )

    for username, person in by_user.items():
        full_name, bio = fetch_profile_name(username)
        person.full_name = full_name
        person.bio = bio

    return list(by_user.values())


def instaloader_fetch(username: str, out_dir: Path) -> dict[str, Any]:
    try:
        import instaloader
    except ImportError as exc:
        raise SystemExit('instaloader not installed; pip install instaloader') from exc

    loader = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        quiet=True,
    )

    profile = instaloader.Profile.from_username(loader.context, username)
    highlights_dir = out_dir / 'instagram' / 'highlights'
    highlights_dir.mkdir(parents=True, exist_ok=True)
    saved: list[dict[str, str]] = []

    for index, highlight in enumerate(profile.get_highlights(), start=1):
        cover = highlight.cover_url
        if not cover:
            continue
        filename = highlights_dir / f'highlight-{index:02d}-{highlight.title.replace(" ", "-")[:40]}.jpg'
        if download(cover, filename):
            saved.append({'title': highlight.title, 'file': str(filename.relative_to(out_dir))})

    return {'highlights': saved, 'highlight_count': len(saved)}


def write_outputs(out_dir: Path, posts: list[Post], meta: dict[str, Any], professionals: list[Professional]) -> None:
    instagram_dir = out_dir / 'instagram'
    team_dir = out_dir / 'team'
    instagram_dir.mkdir(parents=True, exist_ok=True)
    team_dir.mkdir(parents=True, exist_ok=True)

    feed_meta: list[dict[str, Any]] = []
    for index, post in enumerate(posts, start=1):
        filename = f'post-{index}.jpg'
        dest = instagram_dir / filename
        ok = download(post.image_url, dest)
        feed_meta.append(
            {
                'id': index,
                'shortcode': post.shortcode,
                'file': f'/instagram/{filename}' if ok else None,
                'caption': post.caption,
                'is_video': post.is_video,
                'coauthors': post.coauthors,
                'permalink': f'https://www.instagram.com/p/{post.shortcode}/',
            }
        )

    if meta.get('profile_pic_url'):
        download(meta['profile_pic_url'], instagram_dir / 'profile.jpg')

    team_meta: list[dict[str, Any]] = []
    for person in professionals:
        safe = person.username.replace('.', '-')
        pic_file = team_dir / f'{safe}.jpg'
        if person.profile_pic_url:
            pic_url = person.profile_pic_url
            if not download(pic_url.replace('s100x100', 's640x640'), pic_file):
                download(pic_url, pic_file)
        team_meta.append(
            {
                'username': person.username,
                'full_name': person.full_name,
                'role_hint': person.role_hint,
                'bio': person.bio,
                'photo': f'/team/{pic_file.name}' if pic_file.exists() else None,
                'instagram': f'https://www.instagram.com/{person.username}/',
                'source_post': person.source_post,
            }
        )

    payload = {
        **meta,
        'source': 'instagram embed',
        'feed': feed_meta,
        'professionals': team_meta,
    }

    meta_path = instagram_dir / 'meta.json'
    meta_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Wrote {meta_path}')
    print(f'Feed posts: {len(feed_meta)} | Professionals: {len(team_meta)}')


def main() -> None:
    parser = argparse.ArgumentParser(description='Extract Instagram feed and team from public embed')
    parser.add_argument('username', help='Instagram handle without @')
    parser.add_argument('--out', type=Path, default=Path('public'), help='Output root (public/)')
    parser.add_argument('--instaloader', action='store_true', help='Also fetch story highlights via instaloader')
    args = parser.parse_args()

    username = args.username.lstrip('@')
    print(f'Fetching embed for @{username}...')
    html = fetch(f'https://www.instagram.com/{username}/embed/')
    posts, meta = parse_embed(html, username)
    professionals = build_professionals(posts, username, html)

    if args.instaloader:
        try:
            highlight_meta = instaloader_fetch(username, args.out)
            meta['highlights'] = highlight_meta
        except Exception as exc:
            print(f'instaloader highlights skipped: {exc}', file=sys.stderr)

    write_outputs(args.out, posts, meta, professionals)


if __name__ == '__main__':
    main()
