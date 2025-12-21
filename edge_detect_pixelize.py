#!/usr/bin/env python
from __future__ import annotations

import argparse
from pathlib import Path
import numpy as np
from PIL import Image
import cv2


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert AI 'pixel-style' image into true pixel art by detecting pixel grid edges.",
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
        help="Output image path. Defaults to out/<name>_edge_pixel.png.",
    )
    parser.add_argument(
        "--edge-threshold",
        type=float,
        default=0.1,
        help="Edge detection threshold (0.0-1.0). Lower = more edges.",
    )
    parser.add_argument(
        "--min-grid-size",
        type=int,
        default=2,
        help="Minimum pixel grid size in pixels.",
    )
    parser.add_argument(
        "--max-grid-size",
        type=int,
        default=20,
        help="Maximum pixel grid size in pixels.",
    )
    parser.add_argument(
        "--upscale",
        type=int,
        default=4,
        help="Upscale factor after pixelizing (integer).",
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
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Save debug images showing detected edges.",
    )
    return parser.parse_args()


def _resolve_output_path(input_path: Path, output_path: str | None, suffix: str = "_edge_pixel") -> Path:
    if output_path:
        return Path(output_path)
    return Path("out") / f"{input_path.stem}{suffix}.png"


def detect_edges(image: np.ndarray, threshold: float) -> tuple[np.ndarray, np.ndarray]:
    """检测水平和垂直边缘"""
    # 转换为灰度图
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

    # 计算梯度
    sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
    sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)

    # 归一化到 0-1
    sobel_x = np.abs(sobel_x) / np.max(sobel_x)
    sobel_y = np.abs(sobel_y) / np.max(sobel_y)

    # 应用阈值
    edges_x = (sobel_x > threshold).astype(np.uint8)
    edges_y = (sobel_y > threshold).astype(np.uint8)

    return edges_x, edges_y


def find_grid_lines(edges: np.ndarray, min_size: int, max_size: int) -> list[int]:
    """在边缘投影中找到规律的网格线"""
    # 投影到一维
    projection = np.sum(edges, axis=0)

    # 平滑处理
    kernel_size = max_size
    kernel = np.ones(kernel_size) / kernel_size
    smoothed = np.convolve(projection, kernel, mode='same')

    # 找到局部最大值作为网格线
    lines = []
    for i in range(1, len(smoothed) - 1):
        if smoothed[i] > smoothed[i-1] and smoothed[i] > smoothed[i+1]:
            if smoothed[i] > np.mean(smoothed) * 0.5:  # 过滤弱边缘
                lines.append(i)

    # 过滤太近的线
    filtered_lines = []
    for line in lines:
        if not filtered_lines or line - filtered_lines[-1] >= min_size:
            filtered_lines.append(line)

    return filtered_lines


def create_pixel_grid(image: np.ndarray, h_lines: list[int], v_lines: list[int],
                     min_size: int, max_size: int) -> np.ndarray:
    """创建基于检测到的网格的像素化图像"""
    height, width = image.shape[:2]

    # 如果检测不到足够的网格线，使用默认大小
    if len(h_lines) < 2 or len(v_lines) < 2:
        default_size = 8
        grid_h = range(0, height, default_size)
        grid_w = range(0, width, default_size)
    else:
        grid_h = h_lines
        grid_w = v_lines

    # 创建像素化图像
    pixelated = np.zeros((len(grid_h) - 1, len(grid_w) - 1, 3), dtype=np.uint8)

    for i in range(len(grid_h) - 1):
        for j in range(len(grid_w) - 1):
            # 获取网格区域
            y1, y2 = grid_h[i], min(grid_h[i + 1], height)
            x1, x2 = grid_w[j], min(grid_w[j + 1], width)

            # 计算该区域的平均颜色
            if y2 > y1 and x2 > x1:
                region = image[y1:y2, x1:x2]
                avg_color = np.mean(region.reshape(-1, 3), axis=0)
                pixelated[i, j] = avg_color.astype(np.uint8)

    return pixelated


def detect_pixel_grid(image: Image.Image, edge_threshold: float,
                     min_grid_size: int, max_grid_size: int) -> tuple[np.ndarray, list[int], list[int]]:
    """检测像素网格"""
    # 转换为numpy数组
    img_array = np.array(image)

    # 检测边缘
    edges_x, edges_y = detect_edges(img_array, edge_threshold)

    # 找到水平和垂直网格线
    h_lines = find_grid_lines(edges_y, min_grid_size, max_grid_size)  # 水平线
    v_lines = find_grid_lines(edges_x.T, min_grid_size, max_grid_size)  # 垂直线

    # 确保包含边界
    h_lines = [0] + h_lines + [img_array.shape[0]]
    v_lines = [0] + v_lines + [img_array.shape[1]]

    # 创建像素网格
    pixelated = create_pixel_grid(img_array, h_lines, v_lines, min_grid_size, max_grid_size)

    return pixelated, h_lines, v_lines


def main() -> None:
    args = _parse_args()
    input_path = Path(args.input_path)
    if not input_path.exists():
        raise SystemExit(f"Input not found: {input_path}")

    output_path = _resolve_output_path(input_path, args.output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # 打开图像
    image = Image.open(input_path).convert("RGB")

    # 检测像素网格
    pixelated, h_lines, v_lines = detect_pixel_grid(
        image, args.edge_threshold, args.min_grid_size, args.max_grid_size
    )

    # 转换回PIL图像
    pixelated_img = Image.fromarray(pixelated)

    # 放大
    if args.upscale > 1:
        new_size = (pixelated_img.width * args.upscale, pixelated_img.height * args.upscale)
        pixelated_img = pixelated_img.resize(new_size, Image.Resampling.NEAREST)

    # 颜色量化
    if not args.no_quant:
        pixelated_img = pixelated_img.quantize(colors=args.colors, method=Image.FASTOCTREE)
        pixelated_img = pixelated_img.convert("RGB")

    # 保存结果
    pixelated_img.save(output_path)
    print(f"Saved: {output_path}")
    print(f"Detected grid: {len(v_lines)-1} x {len(h_lines)-1} pixels")

    # 保存调试图像
    if args.debug:
        debug_path = output_path.parent / f"{input_path.stem}_debug.png"
        img_array = np.array(image)

        # 在原图上绘制检测到的网格线
        debug_img = img_array.copy()
        for line in h_lines:
            cv2.line(debug_img, (0, line), (debug_img.shape[1], line), (255, 0, 0), 2)
        for line in v_lines:
            cv2.line(debug_img, (line, 0), (line, debug_img.shape[0]), (255, 0, 0), 2)

        Image.fromarray(debug_img).save(debug_path)
        print(f"Debug image saved: {debug_path}")


if __name__ == "__main__":
    main()