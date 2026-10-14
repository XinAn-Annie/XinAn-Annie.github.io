"""Create responsive web assets without changing the original media files."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "media"
OUTPUT = ROOT / "public" / "optimized"
MANIFEST = ROOT / "src" / "optimizedMedia.json"
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg"}
WIDTHS = (480, 1600)
GRAPHIC_WORKS = {
    "slide-07-picture-001.png", "slide-08-picture-001.png",
    "slide-09-picture-014.png", "slide-09-picture-189.png",
    "slide-09-picture-211.png", "slide-09-picture-292.png",
    "slide-10-picture-001.png",
}
Image.MAX_IMAGE_PIXELS = None  # These large, locally supplied works are trusted.


def ffmpeg_binary() -> str:
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError as exc:
        raise SystemExit("Install imageio-ffmpeg before building video assets") from exc


def make_image(source: Path, manifest: dict) -> None:
    relative = source.relative_to(SOURCE)
    key = "/media/" + relative.as_posix()
    target_base = OUTPUT / relative.parent / relative.stem
    variants = []
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        original_width, original_height = image.size
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
        for width in WIDTHS:
            actual_width = min(width, original_width)
            target = target_base.with_name(f"{target_base.name}-{width}.webp")
            target.parent.mkdir(parents=True, exist_ok=True)
            if not target.exists() or target.stat().st_mtime < source.stat().st_mtime:
                scaled = image.copy()
                scaled.thumbnail((actual_width, max(1, round(original_height * actual_width / original_width))), Image.Resampling.LANCZOS)
                scaled.save(target, "WEBP", quality=84, method=5)
                scaled.close()
            with Image.open(target) as generated:
                variant_width = generated.width
            variants.append({
                "src": "/optimized/" + target.relative_to(OUTPUT).as_posix(),
                "width": variant_width,
            })
    manifest[key] = {"width": original_width, "height": original_height, "variants": variants}
    print(f"image {key}", flush=True)


def make_video(source: Path, ffmpeg: str, manifest: dict) -> None:
    relative = source.relative_to(SOURCE)
    key = "/media/" + relative.as_posix()
    target = OUTPUT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.exists() or target.stat().st_mtime < source.stat().st_mtime:
        temporary = target.with_name(target.stem + ".tmp.mp4")
        command = [
            ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
            "-vf", "scale='min(1280,iw)':-2", "-c:v", "libx264", "-preset", "fast",
            "-crf", "29", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            "-c:a", "aac", "-b:a", "96k", str(temporary),
        ]
        subprocess.run(command, check=True)
        temporary.replace(target)
    manifest[key] = "/optimized/" + relative.as_posix()
    print(f"video {key}", flush=True)


def main() -> None:
    OUTPUT.mkdir(exist_ok=True)
    images = {}
    videos = {}
    ffmpeg = ffmpeg_binary()
    for source in sorted(SOURCE.rglob("*")):
        if source.parent.name == "graphic-design" and source.name not in GRAPHIC_WORKS:
            continue
        if source.suffix.lower() in IMAGE_EXTENSIONS:
            make_image(source, images)
        elif source.suffix.lower() == ".mp4":
            make_video(source, ffmpeg, videos)
    MANIFEST.write_text(json.dumps({"images": images, "videos": videos}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Finished: {len(images)} images, {len(videos)} videos", flush=True)


if __name__ == "__main__":
    sys.exit(main())
