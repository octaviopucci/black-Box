#!/usr/bin/env python3
"""Generate round favicon/PWA icons with centered logo and comfortable padding."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "public" / "brand"
# Square mark — loading-frame is 110×142 and crops off-center when forced to a circle.
SOURCE = BRAND / "logo-icon.png"
FALLBACK = BRAND / "loading-frame.png"

SIZES = {
    "icon-round-16.png": 16,
    "icon-round-32.png": 32,
    "icon-round-64.png": 64,
    "icon-round-180.png": 180,
    "icon-round-192.png": 192,
    "icon-round-512.png": 512,
    "apple-icon.png": 180,
}

# Logo occupies this fraction of the circle diameter (padding around the mark).
CONTENT_SCALE = 0.72


def trim_alpha(im: Image.Image, pad: int = 2) -> Image.Image:
    im = im.convert("RGBA")
    bbox = im.getbbox()
    if not bbox:
        return im
    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(im.width, right + pad)
    bottom = min(im.height, bottom + pad)
    return im.crop((left, top, right, bottom))


def make_circular(source: Image.Image, size: int) -> Image.Image:
    mark = trim_alpha(source)
    side = max(mark.width, mark.height)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2), mark)

    target = max(1, int(size * CONTENT_SCALE))
    fitted = square.resize((target, target), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset = (size - target) // 2
    canvas.paste(fitted, (offset, offset), fitted)

    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)

    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(canvas, (0, 0), mask)
    return out


def main() -> None:
    source_path = SOURCE if SOURCE.exists() else FALLBACK
    if not source_path.exists():
        raise SystemExit(f"Source not found: {SOURCE} or {FALLBACK}")
    source = Image.open(source_path)
    print(f"→ source: {source_path.name} ({source.size[0]}×{source.size[1]})")

    for name, size in SIZES.items():
        out = make_circular(source, size)
        path = BRAND / name
        out.save(path, optimize=True)
        print(f"✓ {path.name} ({size}px)")

    ico = make_circular(source, 32)
    ico.save(BRAND / "favicon.ico", sizes=[(16, 16), (32, 32)])
    print("✓ favicon.ico")

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
