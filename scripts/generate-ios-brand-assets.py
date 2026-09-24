from pathlib import Path
import math
import struct
import zlib


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "ios" / "App" / "App" / "Assets.xcassets"


def blend(dst, src):
    sa = src[3] / 255
    da = dst[3] / 255
    out_a = sa + da * (1 - sa)
    if out_a == 0:
        return (0, 0, 0, 0)
    return tuple(
        int((src[i] * sa + dst[i] * da * (1 - sa)) / out_a)
        for i in range(3)
    ) + (int(out_a * 255),)


def write_png(path, width, height, pixels):
    raw = bytearray()
    for y in range(height):
        raw.append(0)
        row_start = y * width
        for pixel in pixels[row_start:row_start + width]:
            raw.extend(pixel)

    def chunk(kind, data):
        body = kind + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    png += chunk(b"IEND", b"")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(png)


def canvas(width, height, top=(17, 19, 21), bottom=(32, 38, 44)):
    pixels = []
    for y in range(height):
        t = y / max(height - 1, 1)
        for x in range(width):
            vignette = 1 - min(0.28, math.hypot((x / width) - 0.5, (y / height) - 0.46) * 0.38)
            color = tuple(int((top[i] * (1 - t) + bottom[i] * t) * vignette) for i in range(3))
            pixels.append((*color, 255))
    return pixels


def rect(pixels, width, height, x0, y0, x1, y1, color, radius=0):
    x0, y0, x1, y1 = map(int, (x0, y0, x1, y1))
    radius = int(radius)
    for y in range(max(0, y0), min(height, y1)):
        for x in range(max(0, x0), min(width, x1)):
            if radius:
                cx = min(max(x, x0 + radius), x1 - radius - 1)
                cy = min(max(y, y0 + radius), y1 - radius - 1)
                if (x - cx) ** 2 + (y - cy) ** 2 > radius ** 2:
                    continue
            idx = y * width + x
            pixels[idx] = blend(pixels[idx], color)


def circle(pixels, width, height, cx, cy, radius, color):
    cx, cy, radius = int(cx), int(cy), int(radius)
    r2 = radius * radius
    for y in range(max(0, cy - radius), min(height, cy + radius + 1)):
        for x in range(max(0, cx - radius), min(width, cx + radius + 1)):
            if (x - cx) ** 2 + (y - cy) ** 2 <= r2:
                idx = y * width + x
                pixels[idx] = blend(pixels[idx], color)


def line(pixels, width, height, x0, y0, x1, y1, color, thickness):
    steps = int(max(abs(x1 - x0), abs(y1 - y0))) + 1
    for step in range(steps):
        t = step / max(steps - 1, 1)
        x = x0 * (1 - t) + x1 * t
        y = y0 * (1 - t) + y1 * t
        circle(pixels, width, height, x, y, thickness / 2, color)


def draw_mark(pixels, width, height, scale=1.0, offset_y=0):
    cx = width / 2
    cy = height / 2 + offset_y
    s = min(width, height) * scale
    blue = (94, 167, 255, 255)
    green = (66, 214, 141, 255)
    panel = (238, 242, 245, 255)
    dark = (24, 28, 32, 255)
    muted = (168, 178, 188, 255)

    rect(pixels, width, height, cx - s * 0.25, cy - s * 0.34, cx + s * 0.25, cy + s * 0.34, (238, 242, 245, 245), s * 0.08)
    rect(pixels, width, height, cx - s * 0.19, cy - s * 0.27, cx + s * 0.19, cy + s * 0.22, dark, s * 0.05)
    rect(pixels, width, height, cx - s * 0.15, cy - s * 0.23, cx + s * 0.15, cy - s * 0.02, (38, 56, 74, 255), s * 0.035)
    rect(pixels, width, height, cx - s * 0.15, cy + s * 0.03, cx + s * 0.15, cy + s * 0.17, (39, 49, 58, 255), s * 0.025)

    line(pixels, width, height, cx - s * 0.08, cy - s * 0.18, cx + s * 0.1, cy - s * 0.18, blue, s * 0.022)
    line(pixels, width, height, cx - s * 0.08, cy - s * 0.12, cx + s * 0.04, cy - s * 0.04, green, s * 0.022)
    line(pixels, width, height, cx + s * 0.1, cy - s * 0.18, cx + s * 0.1, cy - s * 0.06, blue, s * 0.022)

    circle(pixels, width, height, cx - s * 0.08, cy - s * 0.18, s * 0.025, green)
    circle(pixels, width, height, cx + s * 0.1, cy - s * 0.18, s * 0.025, blue)
    circle(pixels, width, height, cx + s * 0.04, cy - s * 0.04, s * 0.025, green)

    rect(pixels, width, height, cx - s * 0.11, cy + s * 0.08, cx + s * 0.02, cy + s * 0.12, muted, s * 0.01)
    circle(pixels, width, height, cx + s * 0.105, cy + s * 0.105, s * 0.035, green)

    rect(pixels, width, height, cx - s * 0.11, cy + s * 0.27, cx + s * 0.11, cy + s * 0.32, panel, s * 0.025)


def app_icon():
    size = 1024
    pixels = canvas(size, size, (16, 20, 25), (29, 42, 48))
    rect(pixels, size, size, 80, 80, size - 80, size - 80, (18, 23, 28, 110), 190)
    rect(pixels, size, size, 132, 132, size - 132, size - 132, (94, 167, 255, 34), 150)
    draw_mark(pixels, size, size, 0.92)
    write_png(ASSETS / "AppIcon.appiconset" / "AppIcon-512@2x.png", size, size, pixels)


def brand_mark():
    size = 512
    pixels = [(0, 0, 0, 0)] * (size * size)
    draw_mark(pixels, size, size, 0.92)
    write_png(ASSETS / "BrandMark.imageset" / "brand-mark.png", size, size, pixels)


def splash():
    size = 1366
    pixels = canvas(size, size, (17, 19, 21), (27, 34, 39))
    rect(pixels, size, size, 0, int(size * 0.62), size, size, (10, 12, 14, 80), 0)
    rect(pixels, size, size, int(size * 0.16), int(size * 0.18), int(size * 0.84), int(size * 0.82), (24, 28, 32, 130), 180)
    draw_mark(pixels, size, size, 0.34, -160)
    for name in ("splash-2732x2732.png", "splash-2732x2732-1.png", "splash-2732x2732-2.png"):
        write_png(ASSETS / "Splash.imageset" / name, size, size, pixels)


def main():
    app_icon()
    brand_mark()
    splash()


if __name__ == "__main__":
    main()
