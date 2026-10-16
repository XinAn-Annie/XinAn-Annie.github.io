"""Build responsive WebP and AVIF assets for the Xiangmai AR archive."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "01_古画交互" / "02_乡脉智绘" / "04_AR" / "AR"
OUTPUT = ROOT / "public" / "optimized" / "xiangmai" / "ar"
MANIFEST = ROOT / "src" / "optimizedMedia.json"

ASSETS = [
    ("地图.png", "ar-guide-map", (800, 1600)),
    ("1.png", "01-sisters-pavilion", (480, 960)),
    ("1_.png", "01-fermented-rice-bun-ip", (480, 960)),
    ("2.png", "02-wenbi-peak", (480, 960)),
    ("2_.png", "02-torreya-ip", (480, 960)),
    ("3.png", "03-jixian-hall", (480, 960)),
    ("3_.png", "03-sweet-potato-starch-ip", (480, 960)),
    ("4.png", "04-shen-ancestral-hall", (480, 960)),
    ("4_.png", "04-changpo-tofu-ip", (480, 960)),
    ("5.png", "05-shi-jianwu-hometown", (480, 960)),
    ("5_.png", "05-rice-ip", (480, 960)),
    ("6.png", "06-zhuomu-workshop", (480, 960)),
    ("6_.png", "06-kiwifruit-ip", (480, 960)),
]


def save_variant(image: Image.Image, stem: str, requested_width: int, image_format: str) -> tuple[str, int]:
    actual_width = min(requested_width, image.width)
    scaled = image.copy()
    scaled.thumbnail((actual_width, round(image.height * actual_width / image.width)), Image.Resampling.LANCZOS)
    suffix = image_format.lower()
    target = OUTPUT / f"{stem}-{requested_width}.{suffix}"
    if image_format == "WEBP":
        scaled.save(target, "WEBP", quality=84, method=6)
    else:
        scaled.save(target, "AVIF", quality=58, speed=6)
    scaled.close()
    return f"/optimized/xiangmai/ar/{target.name}", actual_width


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    images = manifest.setdefault("images", {})

    for filename, stem, widths in ASSETS:
        source = SOURCE / filename
        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened)
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
            webp_variants = []
            avif_variants = []
            for width in widths:
                webp_src, webp_width = save_variant(image, stem, width, "WEBP")
                avif_src, avif_width = save_variant(image, stem, width, "AVIF")
                webp_variants.append({"src": webp_src, "width": webp_width})
                avif_variants.append({"src": avif_src, "width": avif_width})

            virtual_source = f"/media/xiangmai/ar/{stem}.png"
            images[virtual_source] = {
                "width": image.width,
                "height": image.height,
                "variants": webp_variants,
                "avifVariants": avif_variants,
            }
            print(f"built {filename} -> {stem}")

    MANIFEST.write_text(
        json.dumps(manifest, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
