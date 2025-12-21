#!/usr/bin/env python
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert an AI 'pixel-style' image into true pixel art.",
    )
    parser.add_argument(
        "--in",
        dest="input_path",
        required=True,
        help="Input image path.",
    )
    parser.add_argument(
        "--out",
        dest="output_path",
        help="Output image path. Defaults to out/<name>_pixel.png.",
    )
    parser.add_argument(
        "--scale",
        type=int,
        default=4,
        help="Downscale factor before pixelizing (integer).",
    )
    parser.add_argument(
        "--upscale",
        type=int,
        default=4,
        help="Upscale factor after pixelizing (integer).",
    )
    parser.add_argument(
        "--target-width",
        type=int,
        default=0,
        help="Target width for the pixel grid (overrides --scale).",
    )
    parser.add_argument(
        "--target-height",
        type=int,
        default=0,
        help="Target height for the pixel grid (overrides --scale).",
    )
    parser.add_argument(
        "--colors",
        type=int,
        default=32,
        help="Palette size for quantization (lower = more retro).",
    )
    parser.add_argument(
        "--no-quant",
        action="store_true",
        help="Skip palette quantization.",
    )
    return parser.parse_args()


def _resolve_output_path(input_path: Path, output_path: str | None) -> Path:
    if output_path:
        return Path(output_path)
    return Path("out") / f"{input_path.stem}_pixel.png"


def _calc_grid_size(
    width: int,
    height: int,
    scale: int,
    target_width: int,
    target_height: int,
) -> tuple[int, int]:
    if target_width > 0 and target_height > 0:
        return target_width, target_height
    if target_width > 0:
        return target_width, max(1, round(height * (target_width / width)))
    if target_height > 0:
        return max(1, round(width * (target_height / height))), target_height
    return max(1, width // scale), max(1, height // scale)


def pixelize_image(
    image: Image.Image,
    scale: int,
    upscale: int,
    target_width: int,
    target_height: int,
    colors: int,
    do_quantize: bool,
) -> Image.Image:
    if scale < 1 or upscale < 1:
        raise ValueError("scale and upscale must be >= 1")

    image = image.convert("RGB")
    grid_w, grid_h = _calc_grid_size(
        image.width,
        image.height,
        scale,
        target_width,
        target_height,
    )

    # Reduce to a coarse grid using box filtering, then quantize the palette.
    downscaled = image.resize((grid_w, grid_h), resample=Image.Resampling.BOX)
    if do_quantize:
        downscaled = downscaled.quantize(colors=colors, method=Image.FASTOCTREE)
        downscaled = downscaled.convert("RGB")

    # Enlarge back with nearest-neighbor to keep hard pixel edges.
    out_w = grid_w * upscale
    out_h = grid_h * upscale
    return downscaled.resize((out_w, out_h), resample=Image.Resampling.NEAREST)


def main() -> None:
    args = _parse_args()
    input_path = Path(args.input_path)
    if not input_path.exists():
        raise SystemExit(f"Input not found: {input_path}")

    output_path = _resolve_output_path(input_path, args.output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    image = Image.open(input_path)
    result = pixelize_image(
        image=image,
        scale=args.scale,
        upscale=args.upscale,
        target_width=args.target_width,
        target_height=args.target_height,
        colors=args.colors,
        do_quantize=not args.no_quant,
    )
    result.save(output_path)
    print(f"Saved: {output_path}")


if __name__ == "__main__":
    main()
