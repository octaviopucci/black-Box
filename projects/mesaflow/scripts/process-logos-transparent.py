#!/usr/bin/env python3
"""Remove fundos sólidos das logos NA MESA para encaixe transparente na UI."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "public" / "brand"
ASSETS = Path("/home/ubuntu/.cursor/projects/workspace/assets")

SOURCES = {
    "logo-horizontal.png": ASSETS / "98756ab5-526e-4b81-8757-b8b5ebd91ccf.png",
    "logo-vertical.png": ASSETS / "08395ee2-d612-4603-813b-af6df68c5f35.png",
    "logo-icon.png": ASSETS / "91d474d4-a5a3-458c-b7d3-e1f5a6ea2541.png",
}


def avg_corner_color(im: Image.Image) -> tuple[int, int, int]:
    w, h = im.size
    points = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    rs = gs = bs = 0
    for x, y in points:
        r, g, b, *_ = im.getpixel((x, y))
        rs += r
        gs += g
        bs += b
    n = len(points)
    return (rs // n, gs // n, bs // n)


def color_dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def remove_dark_bg(im: Image.Image, threshold: float = 42) -> Image.Image:
    im = im.convert("RGBA")
    key = avg_corner_color(im)
    out = Image.new("RGBA", im.size)
    px_in = im.load()
    px_out = out.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px_in[x, y]
            if color_dist((r, g, b), key) <= threshold:
                px_out[x, y] = (r, g, b, 0)
            else:
                px_out[x, y] = (r, g, b, a)
    return out


def remove_light_bg(im: Image.Image, threshold: float = 28) -> Image.Image:
    im = im.convert("RGBA")
    out = Image.new("RGBA", im.size)
    px_in = im.load()
    px_out = out.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px_in[x, y]
            if r > 235 and g > 235 and b > 235:
                px_out[x, y] = (r, g, b, 0)
            elif color_dist((r, g, b), (255, 255, 255)) <= threshold and r > 200:
                px_out[x, y] = (r, g, b, 0)
            else:
                px_out[x, y] = (r, g, b, a)
    return out


def trim_transparent(im: Image.Image, pad: int = 8) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(im.width, right + pad)
    bottom = min(im.height, bottom + pad)
    return im.crop((left, top, right, bottom))


def save_sizes(im: Image.Image, base_name: str, sizes: list[tuple[str, int | tuple[int, int]]]) -> None:
    for name, size in sizes:
        target = im if isinstance(size, int) and im.size == (size, size) else im.resize(
            (size, size) if isinstance(size, int) else size,
            Image.Resampling.LANCZOS,
        )
        target.save(BRAND / name, optimize=True)


def main() -> None:
    BRAND.mkdir(parents=True, exist_ok=True)

    horizontal = remove_dark_bg(Image.open(SOURCES["logo-horizontal.png"]))
    horizontal = trim_transparent(horizontal, pad=12)
    horizontal.save(BRAND / "logo-horizontal.png", optimize=True)
    horizontal.resize((440, int(440 * horizontal.height / horizontal.width)), Image.Resampling.LANCZOS).save(
        BRAND / "logo-horizontal-compact.png",
        optimize=True,
    )

    vertical = remove_dark_bg(Image.open(SOURCES["logo-vertical.png"]))
    vertical = trim_transparent(vertical, pad=12)
    vertical.resize((330, int(330 * vertical.height / vertical.width)), Image.Resampling.LANCZOS).save(
        BRAND / "logo-vertical.png",
        optimize=True,
    )

    icon = remove_light_bg(Image.open(SOURCES["logo-icon.png"]))
    icon = trim_transparent(icon, pad=4)
    save_sizes(
        icon,
        "logo-icon.png",
        [
            ("logo-icon.png", 512),
            ("logo-icon-navy.png", 512),
            ("icon-192.png", 192),
            ("icon-512.png", 512),
            ("icon-180.png", 180),
            ("apple-icon.png", 180),
            ("icon-1024.png", 1024),
            ("icon-64.png", 64),
            ("icon-32.png", 32),
            ("icon-16.png", 16),
        ],
    )

    icon_32 = Image.open(BRAND / "icon-32.png")
    icon_32.save(BRAND / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32)])

    print("✓ logos transparentes geradas em", BRAND)


if __name__ == "__main__":
    main()
