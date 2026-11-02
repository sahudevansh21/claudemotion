#!/usr/bin/env python3
"""
Original music + SFX for the DevanshReel (numpy only, no samples).

Reads src/compositions/Reel/reel.json (same file the video reads) so the
groove starts on the first montage cut, a soft snap lands on every cut,
the beat lifts at ~8 s like the reference, and the music swells into the
handle card and is silent by `musicOut`.

    python3 scripts/reel/generate_audio.py   ->  public/reel/audio/mix.wav
"""
from __future__ import annotations

import json
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
TL = json.loads((ROOT / "src/compositions/Reel/reel.json").read_text())
OUT = ROOT / "public/reel/audio"

SR = 48_000
DUR = TL["durationSeconds"]
N = int(DUR * SR)
BEAT = 60 / TL["bpm"]
M0 = TL["montageStart"]
DROP = 8.0
NAME = TL["nameCard"]
HANDLE = TL["handleCard"]
OUTT = TL["musicOut"]
CUTS = [s["at"] for s in TL["shots"]][1:] + [NAME]
rng = np.random.default_rng(11)


def t(sec: float) -> np.ndarray:
    return np.arange(int(sec * SR)) / SR


def midi(n: float) -> float:
    return 440.0 * 2 ** ((n - 69) / 12)


def fft_filter(x: np.ndarray, lo: float | None = None, hi: float | None = None) -> np.ndarray:
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X = np.fft.rfft(x)
    g = np.ones_like(f)
    if hi:
        g /= np.sqrt(1 + (f / hi) ** 4)
    if lo:
        g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** 4)
    return np.fft.irfft(X * g, len(x))


def add(buf: np.ndarray, sig: np.ndarray, at: float, gain: float = 1.0) -> None:
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += gain * sig[: j - i]


# ---- instruments ---------------------------------------------------------- #
def kick() -> np.ndarray:
    x = t(0.35)
    f = 48 + 90 * np.exp(-x * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 9)


def clap() -> np.ndarray:
    x = t(0.25)
    n = fft_filter(rng.standard_normal(len(x)), lo=900, hi=5000)
    env = np.exp(-x * 22) + 0.6 * np.exp(-np.maximum(x - 0.012, 0) * 30) * (x > 0.012)
    return n * env * 0.5


def hat(open_: bool = False) -> np.ndarray:
    x = t(0.18 if open_ else 0.05)
    n = fft_filter(rng.standard_normal(len(x)), lo=7000)
    return n * np.exp(-x * (18 if open_ else 80)) * 0.35


def snap() -> np.ndarray:
    x = t(0.06)
    return fft_filter(rng.standard_normal(len(x)), lo=2500, hi=9000) * np.exp(-x * 90) * 0.4


def pad(notes: list[int], sec: float) -> np.ndarray:
    x = t(sec)
    s = np.zeros_like(x)
    for n in notes:
        for d in (-0.08, 0.0, 0.08):
            ph = rng.uniform(0, 1)
            s += 2 * (((midi(n) * (1 + d / 100)) * x + ph) % 1) - 1
    env = np.minimum(1, x / 0.25) * np.minimum(1, (sec - x) / 0.3)
    return fft_filter(s, hi=1400) * env / (3 * len(notes))


def bass(note: int, sec: float) -> np.ndarray:
    x = t(sec)
    s = np.sin(2 * np.pi * midi(note) * x) + 0.3 * np.sin(4 * np.pi * midi(note) * x)
    return s * np.minimum(1, x / 0.01) * np.exp(-x * 2.2)


def pluck(note: int) -> np.ndarray:
    x = t(0.5)
    s = np.sin(2 * np.pi * midi(note) * x) * np.exp(-x * 7)
    return s + 0.25 * np.sin(4 * np.pi * midi(note) * x) * np.exp(-x * 12)


def whoosh(sec: float, rise: bool = True) -> np.ndarray:
    x = t(sec)
    n = rng.standard_normal(len(x))
    env = (x / sec) ** 2 if rise else np.exp(-x * 8)
    return fft_filter(n, lo=300, hi=6000) * env * 0.5


def impact() -> np.ndarray:
    x = t(1.6)
    boom = np.sin(2 * np.pi * np.cumsum(40 + 60 * np.exp(-x * 12)) / SR) * np.exp(-x * 3)
    air = fft_filter(rng.standard_normal(len(x)), lo=200, hi=4000) * np.exp(-x * 5) * 0.3
    return boom + air


# ---- arrangement ---------------------------------------------------------- #
music = np.zeros(N)
drums = np.zeros(N)
sfx = np.zeros(N)

# Am  F  C  G, one chord per bar (4 beats)
CHORDS = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 55, 60, 64], [55, 59, 62, 67]]
ROOTS = [45, 41, 36, 43]
BAR = 4 * BEAT

# Intro (hook): pad + sparse plucks, filtered, from 0 to the montage.
add(music, pad(CHORDS[0], M0 + 0.2), 0.0, 0.55)
for k, n in enumerate([69, 72, 76, 72, 69, 76]):
    add(music, pluck(n), 0.25 + k * BEAT, 0.18)

# Groove: bars start on the first montage cut.
bar_t, k = M0, 0
while bar_t < NAME:
    ln = min(BAR, NAME - bar_t)
    add(music, pad(CHORDS[k % 4], ln + 0.05), bar_t, 0.6)
    for b in range(4):
        bt = bar_t + b * BEAT
        if bt >= NAME:
            break
        add(music, bass(ROOTS[k % 4], BEAT * 0.95), bt, 0.55)
        add(drums, kick(), bt, 0.95 if bt >= DROP else 0.6)
        if bt >= DROP and b % 2 == 1:
            add(drums, clap(), bt, 0.7)
        add(drums, hat(open_=bt >= DROP and b == 3), bt + BEAT / 2, 0.9)
        if bt >= DROP:
            add(drums, hat(), bt + BEAT / 4, 0.4)
            add(drums, hat(), bt + 3 * BEAT / 4, 0.4)
        add(music, pluck([76, 72, 79, 74][k % 4] + (12 if b == 2 else 0)), bt + BEAT / 2, 0.12)
    bar_t += BAR
    k += 1

# Pre-drop: filter the first montage section, open it at the drop.
pre = slice(int(M0 * SR), int(DROP * SR))
drums[pre] = fft_filter(drums[pre], hi=2200)
add(sfx, whoosh(0.6), DROP - 0.6, 0.35)

# SFX: whip on the first frame, riser into the montage, snap on every cut.
add(sfx, whoosh(0.35, rise=False), 0.0, 0.6)
add(sfx, whoosh(1.0), M0 - 1.0, 0.45)
add(sfx, impact(), M0, 0.45)
for c in CUTS:
    if M0 < c < NAME:
        add(sfx, snap(), c, 0.5)

# End: groove stops on the name card, swell into the handle card, then silence.
add(music, pad(CHORDS[0], HANDLE - NAME + 0.3), NAME, 0.35)
add(sfx, whoosh(HANDLE - NAME), NAME, 0.4)
add(sfx, impact(), HANDLE, 0.7)
add(music, pad([45, 57, 64, 69, 72], OUTT - HANDLE + 0.6), HANDLE, 0.8)

mix = music * 0.8 + drums * 0.75 + sfx
# Sidechain-ish duck of the pad under kicks after the drop is implied by levels.
fade = np.ones(N)
tt = np.arange(N) / SR
fade *= np.clip((OUTT + 0.4 - tt) / 1.0, 0, 1)  # silent shortly after musicOut
mix *= fade
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.89

# Simple stereo: slight Haas widening on music.
left = mix
right = np.concatenate([np.zeros(int(0.006 * SR)), mix])[:N] * 0.6 + mix * 0.4
stereo = np.stack([left, right], 1)

OUT.mkdir(parents=True, exist_ok=True)
with wave.open(str(OUT / "mix.wav"), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((stereo * 32767).astype("<i2").tobytes())
print("wrote", OUT / "mix.wav", f"{DUR}s")
