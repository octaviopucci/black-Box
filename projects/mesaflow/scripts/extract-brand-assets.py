#!/usr/bin/env python3
"""Extrai assets da brand sheet NA MESA com recorte e upscale de alta qualidade."""

from __future__ import annotations

import struct
import zlib
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SHEET = Path("/home/ubuntu/.cursor/projects/workspace/assets/9a9d67e3-22f8-4899-b2f9-00225132fc97.png")
OUT = ROOT / "public" / "brand"

# Coordenadas validadas na sheet 1536×1024 (x0, y0, x1, y1)
CROPS: dict[str, tuple[int, int, int, int]] = {
    "logo-icon-navy.png": (35, 215, 182, 346),
    "logo-icon-orange.png": (216, 215, 360, 346),
    "icon-32.png": (427, 244, 494, 309),
    "icon-16.png": (445, 252, 477, 284),
    "icon-192.png": (818, 220, 949, 347),
    "icon-512.png": (988, 218, 1126, 349),
    "icon-180.png": (1165, 215, 1295, 350),
    "apple-icon.png": (1350, 218, 1480, 348),
    "logo-horizontal.png": (30, 395, 358, 465),
    "logo-vertical.png": (110, 495, 275, 635),
    "logo-branco-fundo-escuro.png": (405, 345, 565, 535),
    "logo-navy-fundo-claro.png": (575, 345, 735, 535),
    "logo-branco-horizontal.png": (395, 548, 615, 645),
    "logo-navy-horizontal.png": (615, 548, 755, 645),
    "logo-navy-bg.png": (780, 448, 955, 528),
    "logo-white-bg.png": (653, 462, 835, 555),
    "logo-orange-bg.png": (965, 448, 1140, 528),
    "avatar-circular.png": (1168, 355, 1268, 455),
    "avatar-circular-orange.png": (1389, 472, 1479, 550),
    "avatar-square.png": (1168, 560, 1268, 660),
    "avatar-square-orange.png": (1389, 616, 1480, 695),
    "banner-capa.png": (8, 678, 632, 1016),
    "loading-frame.png": (668, 748, 778, 890),
    "icon-1024.png": (925, 799, 1051, 919),
    "icon-64.png": (1101, 829, 1180, 904),
    "powered-by.png": (1040, 900, 1285, 1010),
}

TARGET_SIZES: dict[str, tuple[int, int] | int] = {
    "logo-horizontal.png": (656, 140),
    "logo-vertical.png": (330, 280),
    "logo-icon-navy.png": 512,
    "logo-icon-orange.png": 512,
    "icon-16.png": 16,
    "icon-32.png": 32,
    "icon-64.png": 64,
    "icon-180.png": 180,
    "apple-icon.png": 180,
    "icon-192.png": 192,
    "icon-512.png": 512,
    "icon-1024.png": 1024,
    "avatar-circular.png": 512,
    "avatar-circular-orange.png": 512,
    "avatar-square.png": 512,
    "avatar-square-orange.png": 512,
}


def square_crop(im: Image.Image) -> Image.Image:
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    return im.crop((left, top, left + side, top + side))


def resize_high(im: Image.Image, size: int | tuple[int, int]) -> Image.Image:
    if isinstance(size, int):
        size = (size, size)
    if im.size == size:
        return im
    return im.resize(size, Image.Resampling.LANCZOS)


def write_ico(path: Path, sizes: list[int]) -> None:
    images = [resize_high(Image.open(OUT / "icon-32.png"), s) for s in sizes]
    images[0].save(path, format="ICO", sizes=[(s, s) for s in sizes], append_images=images[1:])


def write_loading_gif(path: Path, frame_path: Path) -> None:
    base = Image.open(frame_path).convert("RGBA")
    w, h = base.size
    frames: list[Image.Image] = []
    navy = (24, 36, 44, 255)
    for step in range(12):
        canvas = Image.new("RGBA", (w, h), navy)
        canvas.alpha_composite(base, (0, 0))
        draw = ImageDraw.Draw(canvas)
        active = step % 3
        dot_y = h - max(10, h // 8)
        start_x = w // 2 - 18
        for i in range(3):
            fill = (255, 106, 0, 255) if i == active else (255, 106, 0, 90)
            draw.ellipse((start_x + i * 14, dot_y, start_x + i * 14 + 8, dot_y + 8), fill=fill)
        frames.append(canvas.convert("P", palette=Image.Palette.ADAPTIVE))
    frames[0].save(path, save_all=True, append_images=frames[1:], duration=180, loop=0, disposal=2)


def main() -> None:
    if not SHEET.exists():
        raise SystemExit(f"Brand sheet não encontrada: {SHEET}")

    OUT.mkdir(parents=True, exist_ok=True)
    sheet = Image.open(SHEET).convert("RGBA")

    for filename, box in CROPS.items():
        crop = sheet.crop(box)
        if filename.startswith("icon-") or filename.startswith("logo-icon") or filename.startswith("avatar-") or filename == "apple-icon.png":
            crop = square_crop(crop)
        if filename in TARGET_SIZES:
            crop = resize_high(crop, TARGET_SIZES[filename])
        crop.save(OUT / filename, optimize=True)
        print(f"✓ {filename} ({crop.size[0]}×{crop.size[1]})")

    # Aliases usados pelo app
    Image.open(OUT / "logo-icon-navy.png").save(OUT / "logo-icon.png", optimize=True)

    write_ico(OUT / "favicon.ico", [16, 32, 48])
    import shutil

    shutil.copy2(OUT / "favicon.ico", ROOT / "src" / "app" / "favicon.ico")
    Image.open(OUT / "apple-icon.png").save(ROOT / "src" / "app" / "apple-icon.png", optimize=True)

    write_loading_gif(OUT / "loading.gif", OUT / "loading-frame.png")
    print("✓ favicon.ico, loading.gif, aliases")


if __name__ == "__main__":
    main()
