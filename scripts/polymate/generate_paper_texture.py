#!/usr/bin/env python3
"""Paper grain for PolymateGoldenHour: writes public/polymate/golden/paper.png
(1920x1080 greyscale, mid-grey = neutral, used with mix-blend-mode: overlay)."""
import struct
import zlib
from pathlib import Path

import numpy as np
from scipy.ndimage import gaussian_filter

ROOT = Path(__file__).resolve().parents[2]
W, H = 1920, 1080
rng = np.random.default_rng(21)
fine = gaussian_filter(rng.standard_normal((H, W)), 0.7)
fibre = gaussian_filter(rng.standard_normal((H, W)), (0.6, 5.0))  # horizontal fibres
blot = gaussian_filter(rng.standard_normal((H, W)), 40)
x = fine * 0.55 + fibre * 2.2 + blot * 18
x = (x - x.mean()) / (x.std() + 1e-9)
img = np.clip(128 + x * 16, 0, 255).astype(np.uint8)
raw = b"".join(b"\x00" + img[y].tobytes() for y in range(H))
def chunk(t, d):
    return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", W, H, 8, 0, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
out = ROOT / "public/polymate/golden/paper.png"
out.write_bytes(png)
print("wrote", out.relative_to(ROOT))
