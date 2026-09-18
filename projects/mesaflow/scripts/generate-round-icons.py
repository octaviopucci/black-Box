#!/usr/bin/env python3
"""Generate round favicon/PWA icons from loading-frame.png (splash icon)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "public" / "brand"
SOURCE = BRAND / "loading-frame.png"

SIZES = {
    "icon-round-16.png": 16,
    "icon-round-32.png": 32,
    "icon-round-64.png": 64,
    "icon-round-180.png": 180,
    "icon-round-192.png": 192,
    "icon-round-512.png": 512,
    "apple-icon.png": 180,
}


def make_circular(img: Image.Image, size: int) -> Image.Image:
    img = img.convert("RGBA")
    side = min(img.size)
    left = (img.width - side) // 2
    top = (img.height - side) // 2
    cropped = img.crop((left, top, left + side, top + side))
    resized = cropped.resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(resized, (0, 0), mask)
    return out


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Source not found: {SOURCE}")
    source = Image.open(SOURCE)
    for name, size in SIZES.items():
        out = make_circular(source, size)
        path = BRAND / name
        out.save(path, optimize=True)
        print(f"✓ {path.name} ({size}px)")

    # favicon.ico from 32px round
    ico = make_circular(source, 32)
    ico.save(BRAND / "favicon.ico", sizes=[(32, 32)])
    print("✓ favicon.ico")

    # Aliases used by layout/manifest
    aliases = {
        "icon-16.png": "icon-round-16.png",
        "icon-32.png": "icon-round-32.png",
        "icon-180.png": "icon-round-180.png",
        "icon-192.png": "icon-round-192.png",
        "icon-512.png": "icon-round-512.png",
    }
    for target, source_name in aliases.items():
        src = BRAND / source_name
        dst = BRAND / target
        Image.open(src).save(dst, optimize=True)
        print(f"✓ {target} ← {source_name}")


if __name__ == "__main__":
    main()
