#!/usr/bin/env python3
"""
Generate the score + sound design for PolymateForum (one seamless 30 s take).

Synthesised from scratch with numpy/scipy (no samples). Reads
src/compositions/Polymate/forum/forum.json, the same file the film reads:
each `sfx` lands at its absolute frame (60 fps); `music` marks where the
soft pulse runs and where the score resolves.

    python3 scripts/polymate/generate_forum_audio.py

Writes public/polymate/forum-audio/{music,sfx,mix}.wav (48 kHz, 16-bit stereo).
"""
from __future__ import annotations

import json
import wave
from pathlib import Path

import numpy as np
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parents[2]
TL = json.loads((ROOT / "src/compositions/Polymate/forum/forum.json").read_text())
OUT = ROOT / "public/polymate/forum-audio"
SR = 48_000
FPS = TL["fps"]
N = int(round(TL["durationInFrames"] / FPS * SR))
DUR = N / SR
M = {k: v / FPS for k, v in TL["music"].items()}
rng = np.random.default_rng(9)


def t_axis(sec):
    return np.arange(int(sec * SR)) / SR


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def db(x):
    return 10 ** (x / 20)


def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    return lfilter([1 - a], [1, -a], x)


def highpass(x, fc):
    return x - lowpass(x, fc)


def place(buf, sig, at, gain=1.0, pan=0.0):
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.stack([sig * np.cos(a), sig * np.sin(a)], axis=1)
    s = int(round(at * SR))
    if s < 0:
        sig, s = sig[-s:], 0
    e = min(s + len(sig), len(buf))
    if e > s:
        buf[s:e] += sig[: e - s] * gain


def string_pad(notes, sec):
    """Warm 'string' pad: detuned saws, slow attack, gentle vibrato."""
    t = t_axis(sec)
    sig = np.zeros_like(t)
    for n in notes:
        f = midi(n)
        vib = 1 + 0.0025 * np.sin(2 * np.pi * 5.2 * t + rng.uniform(0, 6))
        for d in (0.995, 1.0, 1.005):
            sig += 2 * ((f * d * vib * t) % 1) - 1
    env = np.minimum(1, t / 1.2) * np.clip((sec - t) / 1.4, 0, 1)
    return lowpass(lowpass(sig, 1800), 2400) * env / (3 * len(notes))


# D major: Dmaj9 | Bm9 | Gmaj7(#11) | Asus4 → A ; one chord every 4 s, last bar resolves to D.
PROG = [[50, 57, 61, 64, 69], [47, 54, 57, 61, 66], [43, 50, 54, 59, 61], [45, 52, 57, 59, 64]]


def music():
    buf = np.zeros((N, 2))
    t0 = 0.0
    k = 0
    while t0 < M["resolve"] - 0.1:
        sec = min(4.6, M["resolve"] - t0 + 0.8)
        place(buf, string_pad(PROG[k % 4], sec), t0, 1.0, -0.15 if k % 2 else 0.15)
        t0 += 4.0
        k += 1
    # Resolve: Dmaj9 swell into the brand reveal.
    place(buf, string_pad([38, 50, 57, 61, 64, 69], DUR - M["resolve"]), M["resolve"], 1.2)
    # Soft pulse under the interface (felt, not heard): low sine every half second.
    tp = t_axis(0.45)
    pulse = np.sin(2 * np.pi * (55 * tp + 25 / 20 * (1 - np.exp(-20 * tp)))) * np.exp(-tp * 8)
    at = M["pulseFrom"]
    i = 0
    while at < M["pulseTo"]:
        place(buf, pulse, at, 0.5 if i % 2 == 0 else 0.3)
        at += 0.5
        i += 1
    # Harp-like arpeggio shimmer through the interface section.
    th = t_axis(0.9)
    at = M["pulseFrom"]
    j = 0
    while at < M["pulseTo"]:
        chord = PROG[int(at // 4.0) % 4]
        n = chord[[1, 2, 3, 4, 3, 2][j % 6]] + 12
        s = (np.sin(2 * np.pi * midi(n) * th) + 0.3 * np.sin(4 * np.pi * midi(n) * th)) * np.exp(-th * 5)
        place(buf, s, at, 0.10, 0.4 if j % 2 else -0.4)
        at += 0.25
        j += 1
    # Room: very quiet air.
    air = lowpass(highpass(rng.standard_normal(N), 400), 3000) * 0.004
    buf += np.stack([air, np.roll(air, 1200)], axis=1)
    fade = int(1.0 * SR)
    buf[-fade:] *= (0.5 * (1 + np.cos(np.linspace(0, np.pi, fade))))[:, None]
    return buf


def shimmer(L):
    t = t_axis(L)
    f = 1200 + 1600 * (t / L)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.5 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR)
    return s * np.sin(np.pi * t / L) ** 2 * 0.25


def bloom():
    t = t_axis(2.4)
    s = sum(a * np.sin(2 * np.pi * midi(n) * t) for n, a in ((62, 1), (69, 0.7), (74, 0.5), (78, 0.35), (81, 0.25)))
    return s * np.minimum(1, t / 0.3) * np.exp(-t * 1.3) / 2.5


def chime():
    t = t_axis(1.6)
    s = sum(a * np.sin(2 * np.pi * midi(n) * t) for n, a in ((81, 1.0), (88, 0.5), (93, 0.3)))
    return s * np.exp(-t * 2.8) * np.minimum(1, t / 0.004) / 1.8


def glass():
    L = 0.8
    t = t_axis(L)
    n = rng.standard_normal(len(t))
    s = highpass(lowpass(n, 7000), 2500) * (np.sin(np.pi * t / L) ** 3)
    tone = np.sin(2 * np.pi * np.cumsum(900 + 700 * t / L) / SR) * np.exp(-t * 3) * 0.3
    return s * 0.35 + tone


def tap():
    t = t_axis(0.05)
    return np.sin(2 * np.pi * 1900 * t) * np.exp(-t * 160) * 0.6


def press():
    t = t_axis(0.12)
    return (np.sin(2 * np.pi * 900 * t) * np.exp(-t * 60) + 0.5 * np.sin(2 * np.pi * 140 * t) * np.exp(-t * 40)) * 0.7


def swish():
    L = 0.5
    t = t_axis(L)
    return highpass(lowpass(rng.standard_normal(len(t)), 3000), 500) * np.sin(np.pi * t / L) ** 2 * 0.4


def slide():
    L = 70 / FPS
    t = t_axis(L)
    f = 300 + 500 * (t / L)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.2 + highpass(lowpass(rng.standard_normal(len(t)), 2500), 600) * 0.25
    return s * np.minimum(1, t / 0.05) * np.minimum(1, (L - t) / 0.05)


def thud():
    t = t_axis(0.8)
    return np.tanh(1.2 * np.sin(2 * np.pi * (42 * t + 60 / 14 * (1 - np.exp(-14 * t)))) * np.exp(-t * 5))


def final():
    t = t_axis(DUR - 1620 / FPS)
    s = sum(a * np.sin(2 * np.pi * midi(n) * t) for n, a in ((38, 1.0), (50, 0.7), (57, 0.5), (62, 0.45), (66, 0.3), (69, 0.25), (76, 0.12)))
    return s * np.minimum(1, t / 0.6) * np.exp(-t * 0.5) / 3


def sfx():
    buf = np.zeros((N, 2))
    for fx in TL["sfx"]:
        at, g, k = fx["at"] / FPS, fx["gain"], fx["type"]
        if k == "shimmer":
            place(buf, shimmer(fx["length"]), at, g, -0.3)
        elif k == "ticks":
            for i in range(fx["count"]):
                place(buf, tap() * 0.6, at + i * fx["step"] / FPS, g, 0.2)
        else:
            sig = {"bloom": bloom, "chime": chime, "glass": glass, "tap": tap, "press": press,
                   "swish": swish, "slide": slide, "thud": thud, "final": final}[k]()
            place(buf, sig, at, g, 0.15 if k in ("tap", "press") else 0.0)
    return buf


def write(path, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    m, s = music(), sfx()
    m *= db(-7) / (np.abs(m).max() + 1e-9)
    s *= db(-6) / (np.abs(s).max() + 1e-9)
    mix = m + s
    mix *= db(-1.5) / (np.abs(mix).max() + 1e-9)
    fade = int(0.5 * SR)
    mix[-fade:] *= (np.linspace(1, 0, fade) ** 2)[:, None]
    mix[-int(0.03 * SR):] = 0
    for name, x in (("music", m), ("sfx", s), ("mix", mix)):
        write(OUT / f"{name}.wav", x)
    assert len(mix) == N and np.abs(mix).max() <= db(-1.4)
    print(f"wrote {OUT.relative_to(ROOT)}/{{music,sfx,mix}}.wav")


if __name__ == "__main__":
    main()
