#!/usr/bin/env python3
"""
Generate the soft, minimal score + sound design for PolymateMinimal (10 s).

Synthesised from scratch with numpy/scipy (no samples). Reads
src/compositions/Polymate/minimal/minimal.json, the same file the shots read:
every caption character gets a quiet decode tick at the frame it appears,
and each `sfx` lands at shot.start + cue (60 fps).

    python3 scripts/polymate/generate_minimal_audio.py

Writes public/polymate/minimal-audio/{music,sfx,mix}.wav (48 kHz, 16-bit stereo).
"""
from __future__ import annotations

import json
import wave
from pathlib import Path

import numpy as np
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parents[2]
TL = json.loads((ROOT / "src/compositions/Polymate/minimal/minimal.json").read_text())
OUT = ROOT / "public/polymate/minimal-audio"
SR = 48_000
FPS = TL["fps"]
N = int(round(TL["durationInFrames"] / FPS * SR))
CHAR_STEP = 1.2  # frames per decoded character (matches Caption.tsx)
rng = np.random.default_rng(5)


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
    e = min(s + len(sig), len(buf))
    if e > s:
        buf[s:e] += sig[: e - s] * gain


def music():
    buf = np.zeros((N, 2))
    dur = N / SR
    t = t_axis(dur)
    # Warm, slowly breathing pad: D major add9 voiced wide, gentle detune.
    notes = [50, 57, 62, 64, 66, 69]
    pad = np.zeros_like(t)
    for i, n in enumerate(notes):
        f = midi(n)
        lfo = 1 + 0.002 * np.sin(2 * np.pi * (0.07 + 0.03 * i) * t)
        pad += np.sin(2 * np.pi * f * lfo * t) * (0.9 if n < 60 else 0.55)
    pad = lowpass(pad, 1400) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * t))
    env = np.minimum(1, t / 1.5) * np.clip((dur - 0.3 - t) / 1.2, 0, 1)
    pad *= env / len(notes)
    left = pad * 1.0
    right = np.roll(pad, int(0.012 * SR))
    buf += np.stack([left, right], axis=1)
    # Soft heartbeat pulse every second (low sine, very quiet).
    tp = t_axis(0.5)
    pulse = np.sin(2 * np.pi * (52 * tp + 30 / 25 * (1 - np.exp(-25 * tp)))) * np.exp(-tp * 9)
    for k in range(1, int(dur) - 1):
        place(buf, pulse, k * 1.0, 0.35)
    # Air bed.
    air = highpass(lowpass(rng.standard_normal(N), 6000), 1500) * 0.02 * env
    buf += np.stack([air, np.roll(air, 900)], axis=1)
    return buf


def tick():
    t = t_axis(0.018)
    f = rng.choice([3100, 3500, 3900])
    return np.sign(np.sin(2 * np.pi * f * t)) * np.exp(-t * 380) * 0.4


def air(L=0.9):
    t = t_axis(L)
    n = rng.standard_normal(len(t))
    shape = np.sin(np.pi * t / L) ** 2
    return highpass(lowpass(n, 2500), 300) * shape * 0.6


def chime():
    t = t_axis(1.4)
    s = sum(a * np.sin(2 * np.pi * midi(n) * t) for n, a in ((81, 1.0), (88, 0.5), (93, 0.3)))
    return s * np.exp(-t * 3.2) * np.minimum(1, t / 0.004) / 1.8


def swell(L=1.3):
    t = t_axis(L)
    s = sum(np.sin(2 * np.pi * midi(n) * t) for n in (38, 45, 50))
    return lowpass(s, 900) * (t / L) ** 2 * np.minimum(1, (L - t) / 0.08) / 3


def thump():
    t = t_axis(0.8)
    return np.tanh(1.3 * np.sin(2 * np.pi * (44 * t + 70 / 16 * (1 - np.exp(-16 * t)))) * np.exp(-t * 5))


def final():
    t = t_axis(2.0)
    s = sum(a * np.sin(2 * np.pi * midi(n) * t) for n, a in ((50, 1.0), (62, 0.6), (69, 0.4), (74, 0.3), (78, 0.18)))
    return s * np.minimum(1, t / 0.01) * np.exp(-t * 1.6) / 2.4


def sfx():
    buf = np.zeros((N, 2))
    for sh in TL["shots"]:
        st = sh["start"]
        cues = sh["cues"]
        for key, text in (("in", sh.get("caption", "")), ("in2", sh.get("caption2", ""))):
            if text and key in cues:
                n = len(text.replace("[", "").replace("]", ""))
                for i in range(n):
                    if text.replace("[", "").replace("]", "")[i] != " ":
                        place(buf, tick(), (st + cues[key] + i * CHAR_STEP) / FPS, 0.16, rng.uniform(-0.3, 0.3))
        if "out" in cues:
            for i in range(6):
                place(buf, tick(), (st + cues["out"] + i * 3) / FPS, 0.12, 0.2)
        for fx in sh["sfx"]:
            at = (st + fx["cue"]) / FPS
            g = fx["gain"]
            sig = {"air": air, "chime": chime, "swell": swell, "thump": thump, "final": final}[fx["type"]]()
            place(buf, sig, at, g)
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
    m *= db(-9) / (np.abs(m).max() + 1e-9)
    s *= db(-7) / (np.abs(s).max() + 1e-9)
    mix = m + s
    mix *= db(-1.5) / (np.abs(mix).max() + 1e-9)
    fade = int(0.4 * SR)
    mix[-fade:] *= (np.linspace(1, 0, fade) ** 2)[:, None]
    mix[-int(0.03 * SR):] = 0
    for name, x in (("music", m), ("sfx", s), ("mix", mix)):
        write(OUT / f"{name}.wav", x)
    assert len(mix) == N and np.abs(mix).max() <= db(-1.4)
    print(f"wrote {OUT.relative_to(ROOT)}/{{music,sfx,mix}}.wav  peak {20*np.log10(np.abs(mix).max()):.1f} dBFS")


if __name__ == "__main__":
    main()
