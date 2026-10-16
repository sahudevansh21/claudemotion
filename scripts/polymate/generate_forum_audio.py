#!/usr/bin/env python3
"""
Generate the energetic SaaS-launch score + UI sound design for PolymateForum
(one seamless 30 s take): 120 BPM groove, whooshes, pops, clicks, risers,
success chime and per-character type ticks.

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


# Energetic SaaS-launch bed, 120 BPM (30 frames per beat at 60 fps).
# D major: Dmaj9 | Bm9 | Gmaj7 | A — one chord per bar (2 s).
PROG = [[50, 57, 61, 64, 69], [47, 54, 57, 61, 66], [43, 50, 54, 59, 62], [45, 52, 57, 61, 64]]
BEAT = 60 / M["bpm"]
BAR = 4 * BEAT


def chord_at(t):
    return PROG[int(t // BAR) % 4]


def kick():
    t = t_axis(0.35)
    body = np.sin(2 * np.pi * (50 * t + 120 / 30 * (1 - np.exp(-30 * t)))) * np.exp(-t * 8)
    click = highpass(rng.standard_normal(len(t)), 4000) * np.exp(-t * 500) * 0.35
    return np.tanh(1.8 * body + click)


def clap():
    t = t_axis(0.22)
    n = highpass(lowpass(rng.standard_normal(len(t)), 6000), 1000)
    env = np.exp(-t * 24) + 0.6 * np.exp(-((t - 0.011) ** 2) / 8e-6) + 0.5 * np.exp(-((t - 0.022) ** 2) / 8e-6)
    return n * env * 0.8


def hat(open_=False):
    t = t_axis(0.16 if open_ else 0.04)
    return highpass(rng.standard_normal(len(t)), 8500) * np.exp(-t * (20 if open_ else 120))


def pluck(f, sec=0.35):
    t = t_axis(sec)
    s = sum(((2 * ((f * d * t) % 1) - 1)) for d in (0.997, 1.003))
    return lowpass(s, 1800 + 3000 * np.exp(-t * 12)) * np.exp(-t * 9) * np.minimum(1, t / 0.002) / 2


def music():
    buf = np.zeros((N, 2))
    g0, drop, brk, fin = M["groove"] / FPS, M["drop"] / FPS, M["breakFrom"] / FPS, M["final"] / FPS
    # Pads all the way (lighter), resolving chord at the brand reveal.
    t0 = 0.0
    while t0 < fin - 0.05:
        sec = min(BAR + 0.5, fin - t0 + 0.6)
        place(buf, string_pad(chord_at(t0), sec), t0, 0.55, -0.15)
        t0 += BAR
    place(buf, string_pad([38, 50, 57, 61, 64, 69], DUR - fin), fin, 1.0)
    k, c = kick(), clap()
    beats = int(DUR / BEAT) + 1
    for b in range(beats):
        at = b * BEAT
        if at >= fin + 2 * BAR:
            break
        in_break = brk <= at < fin
        if at >= g0 and not in_break and at < fin:
            # half-time kick in the reveal, four-on-the-floor from the drop
            if at >= drop or b % 2 == 0:
                place(buf, k, at, 0.9 if at >= drop else 0.7)
            if at >= drop and b % 2 == 1:
                place(buf, c, at, 0.45, 0.05)
        if at >= drop and not in_break and at < fin:
            place(buf, hat(), at + BEAT / 2, 0.22, 0.35)
            place(buf, hat(), at + BEAT / 4, 0.1, -0.3)
            place(buf, hat(), at + 3 * BEAT / 4, 0.1, -0.3)
            if b % 4 == 3:
                place(buf, hat(True), at + BEAT / 2, 0.18, 0.4)
    # Plucky 16th arpeggio: sparse in the intro, full after the drop.
    step = BEAT / 4
    pattern = [0, 2, 3, 4, 3, 2, 1, 2]
    for i in range(int(fin / step)):
        at = i * step
        if brk <= at < fin:
            continue
        if at < g0 and i % 4:
            continue
        if g0 <= at < drop and i % 2:
            continue
        n = chord_at(at)[pattern[i % 8]] + 12
        place(buf, pluck(midi(n)), at, 0.22 if at >= drop else 0.16, 0.35 if i % 2 else -0.35)
    # Bass: offbeat eighths after the drop, roots.
    tb = t_axis(BEAT / 2 * 0.9)
    for i in range(int(fin / (BEAT / 2))):
        at = i * BEAT / 2
        if at < drop or brk <= at:
            continue
        f = midi(chord_at(at)[0] - 12)
        s = lowpass(np.sin(2 * np.pi * f * tb) + 0.4 * (2 * ((f * tb) % 1) - 1), 500) * np.exp(-tb * 4) * np.minimum(1, tb / 0.005)
        place(buf, s, at, 0.55 if i % 2 else 0.35)
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


def impact():
    t = t_axis(1.1)
    body = np.sin(2 * np.pi * (38 * t + 110 / 16 * (1 - np.exp(-16 * t)))) * np.exp(-t * 4)
    hit = lowpass(rng.standard_normal(len(t)), 3500) * np.exp(-t * 28)
    return np.tanh(1.6 * body + 0.5 * hit)


def whoosh():
    L = 0.6
    t = t_axis(L)
    shape = np.where(t < L * 0.65, (t / (L * 0.65)) ** 2, ((L - t) / (L * 0.35)) ** 1.5)
    n = rng.standard_normal(len(t))
    sig = highpass((1 - shape) * lowpass(n, 700) + shape * lowpass(n, 6000), 200) * shape
    return sig / (np.abs(sig).max() + 1e-9) * 0.8


def swoosh():
    L = 0.45
    t = t_axis(L)
    f = 2400 * np.exp(-t * 5) + 300
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6) * 0.35
    return tone + whoosh()[: len(t)] * 0.6


def pop():
    t = t_axis(0.12)
    f = 500 + 1100 * np.exp(-t * 45)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 28) * 0.8


def click():
    t = t_axis(0.06)
    return (np.sign(np.sin(2 * np.pi * 2600 * t)) * np.exp(-t * 220) * 0.4 + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 60) * 0.6)


def success():
    out = np.zeros(int(1.4 * SR))
    for i, (n, a) in enumerate(((81, 1.0), (86, 0.9), (93, 0.8))):
        t = t_axis(1.2)
        s = (np.sin(2 * np.pi * midi(n) * t) + 0.3 * np.sin(4 * np.pi * midi(n) * t)) * np.exp(-t * 4) * a
        o = int(i * 0.07 * SR)
        out[o:o + len(s)] += s[: len(out) - o]
    return out / 2.2


def riser(L):
    t = t_axis(L)
    shape = (t / L) ** 2
    n = rng.standard_normal(len(t))
    noise = highpass((1 - shape) * lowpass(n, 900) + shape * lowpass(n, 8000), 300)
    tone = np.sin(2 * np.pi * np.cumsum(250 + 1400 * shape) / SR) * 0.3
    return (noise / (np.abs(noise).max() + 1e-9) + tone) * shape * 0.6


def typetick():
    t = t_axis(0.025)
    f = rng.choice([1800, 2100, 2400])
    return (0.6 * highpass(rng.standard_normal(len(t)), 3000) + 0.4 * np.sin(2 * np.pi * f * t)) * np.exp(-t * 280)


def sfx():
    buf = np.zeros((N, 2))
    for fx in TL["sfx"]:
        at, g, k = fx["at"] / FPS, fx["gain"], fx["type"]
        if k == "shimmer":
            place(buf, shimmer(fx["length"]), at, g, -0.3)
        elif k == "riser":
            place(buf, riser(fx["length"]), at, g)
        elif k == "ticks":
            for i in range(fx["count"]):
                place(buf, tap() * 0.6, at + i * fx["step"] / FPS, g, 0.2)
        else:
            sig = {"bloom": bloom, "chime": chime, "glass": glass, "tap": tap, "press": press,
                   "swish": swish, "slide": slide, "thud": thud, "final": final,
                   "impact": impact, "whoosh": whoosh, "swoosh": swoosh, "pop": pop,
                   "click": click, "success": success}[k]()
            place(buf, sig, at, g, 0.15 if k in ("tap", "press") else 0.0)
    # Type-on ticks for every statement character.
    for ty in TL.get("typing", []):
        for i in range(ty["chars"]):
            place(buf, typetick(), (ty["at"] + i * 2.2) / FPS, 0.22, rng.uniform(-0.3, 0.3))
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
    m *= db(-6) / (np.abs(m).max() + 1e-9)
    s *= db(-5) / (np.abs(s).max() + 1e-9)
    mix = m + s
    mix *= db(-1.5) / (np.abs(mix).max() + 1e-9)
    mix *= db(4)  # drive into a soft limiter: punchy, launch-film loudness
    c, knee = db(-1.0), db(-6)
    m_ = np.abs(mix)
    o = m_ > knee
    mix[o] = np.sign(mix[o]) * (knee + (c - knee) * np.tanh((m_[o] - knee) / (c - knee)))
    fade = int(0.5 * SR)
    mix[-fade:] *= (np.linspace(1, 0, fade) ** 2)[:, None]
    mix[-int(0.03 * SR):] = 0
    for name, x in (("music", m), ("sfx", s), ("mix", mix)):
        write(OUT / f"{name}.wav", x)
    assert len(mix) == N and np.abs(mix).max() <= db(-1.0) + 1e-6
    print(f"wrote {OUT.relative_to(ROOT)}/{{music,sfx,mix}}.wav")


if __name__ == "__main__":
    main()
