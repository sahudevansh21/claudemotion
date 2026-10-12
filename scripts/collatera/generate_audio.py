#!/usr/bin/env python3
"""
Generate original music + sound effects for the COLLATERA film.

Everything is synthesised from scratch with numpy/scipy (no samples). Timing is
read from src/compositions/Collatera/timeline.json, the same file the Remotion
scenes read, so every click, pulse and impact lands on its frame (60 fps).

    pip install -r scripts/collatera/requirements.txt
    python3 scripts/collatera/generate_audio.py

Writes public/collatera/audio/{music,sfx,mix}.wav (48 kHz, 16-bit stereo).
The video uses mix.wav.
"""
from __future__ import annotations

import json
import wave
from pathlib import Path

import numpy as np
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parents[2]
TL = json.loads((ROOT / "src/compositions/Collatera/timeline.json").read_text())
OUT = ROOT / "public/collatera/audio"

SR = 48_000
FPS = TL["fps"]
DURATION = TL["durationInFrames"] / FPS  # exactly 30.0 s
N = int(round(DURATION * SR))
BEAT = 60 / TL["bpm"]  # 0.5 s
SCENE = {s["id"]: (s["start"] / FPS, s["end"] / FPS) for s in TL["scenes"]}
FINAL = SCENE["closing"][0] + next(
    s for s in TL["scenes"] if s["id"] == "closing")["cues"]["lockup"] / FPS
rng = np.random.default_rng(23)


# --------------------------------------------------------------------------- #
def t_axis(sec: float) -> np.ndarray:
    return np.arange(int(sec * SR)) / SR


def midi(n: float) -> float:
    return 440.0 * 2 ** ((n - 69) / 12)


def db(x: float) -> float:
    return 10 ** (x / 20)


def lowpass(x: np.ndarray, fc: float) -> np.ndarray:
    a = np.exp(-2 * np.pi * fc / SR)
    return lfilter([1 - a], [1, -a], x)


def highpass(x: np.ndarray, fc: float) -> np.ndarray:
    return x - lowpass(x, fc)


def square(f: float, t: np.ndarray, duty=0.5) -> np.ndarray:
    return np.where((f * t) % 1 < duty, 1.0, -1.0)


def pan(sig: np.ndarray, p: float) -> np.ndarray:
    a = (p + 1) * np.pi / 4
    return np.stack([sig * np.cos(a), sig * np.sin(a)], axis=1)


def place(buf, sig, at, gain=1.0):
    if sig.ndim == 1:
        sig = np.stack([sig, sig], axis=1)
    s = int(round(at * SR))
    if s < 0:
        sig, s = sig[-s:], 0
    e = min(s + len(sig), len(buf))
    if e > s:
        buf[s:e] += sig[: e - s] * gain


# --------------------------------------------------------------------------- #
# music — A minor, 120 BPM: Am | F | C | G  (one chord per bar = 2 s)
# --------------------------------------------------------------------------- #
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
ROOTS = [45, 41, 48, 43]
BAR = 4 * BEAT


def chord_idx(t: float) -> int:
    return int(t // BAR) % 4


def pad(freqs, sec) -> np.ndarray:
    t = t_axis(sec)
    sig = sum(np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t) for f in freqs)
    env = np.minimum(1, t / 0.4) * np.clip((sec - t) / 0.5, 0, 1)
    return sig * env / len(freqs)


def make_music() -> np.ndarray:
    buf = np.zeros((N, 2))
    end_music = FINAL  # bed stops under the closing tone

    # Pads throughout (soft), last bar rings into the closing tone.
    t0 = 0.0
    while t0 < end_music:
        length = min(BAR + 0.4, end_music - t0 + 0.6)
        freqs = [midi(n) for n in CHORDS[chord_idx(t0)]]
        place(buf, pan(lowpass(pad(freqs, length), 1500), -0.1), t0, db(-24))
        t0 += BAR

    # Sub pulse on every beat from scene 2; quarter-note "heartbeat" in scene 1.
    t_k = t_axis(0.35)
    sub = np.sin(2 * np.pi * (45 * t_k + 50 / 30 * (1 - np.exp(-30 * t_k)))) * np.exp(-t_k * 10)
    for b in range(int(end_music / BEAT)):
        at = b * BEAT
        if at < SCENE["problem"][0] and b % 2:
            continue
        place(buf, sub, at, db(-14 if at >= SCENE["problem"][0] else -19))

    # Off-beat ticks (hats) from scene 2.
    t_h = t_axis(0.04)
    for b in range(int(end_music / BEAT)):
        at = b * BEAT + BEAT / 2
        if SCENE["problem"][0] <= at < end_music:
            h = highpass(rng.standard_normal(len(t_h)), 7000) * np.exp(-t_h * 120)
            place(buf, pan(h, 0.3), at, db(-30))

    # Filtered square arpeggio in 16ths through scenes 3–4.
    t_a = t_axis(BEAT / 4 * 0.9)
    pattern = [0, 1, 2, 1, 0, 2, 1, 2]
    for k in range(int(end_music / (BEAT / 4))):
        at = k * BEAT / 4
        if not (SCENE["dashboard"][0] <= at < SCENE["closing"][0]):
            continue
        n = CHORDS[chord_idx(at)][pattern[k % 8]] + 12
        sig = square(midi(n), t_a, 0.35) * np.exp(-t_a * 18)
        place(buf, pan(lowpass(sig, 2200), 0.25 if k % 2 else -0.25), at, db(-31))

    # Bass line: root eighths in scenes 3–4.
    t_b = t_axis(BEAT / 2 * 0.95)
    for k in range(int(end_music / (BEAT / 2))):
        at = k * BEAT / 2
        if not (SCENE["dashboard"][0] <= at < SCENE["closing"][0]):
            continue
        f = midi(ROOTS[chord_idx(at)])
        sig = lowpass(square(f, t_b, 0.5), 500) * np.exp(-t_b * 5)
        place(buf, sig, at, db(-22))

    # Clean ending.
    fade = int(1.5 * SR)
    buf[-fade:] *= (0.5 * (1 + np.cos(np.linspace(0, np.pi, fade))))[:, None]
    buf[-int(0.03 * SR):] = 0
    return buf


# --------------------------------------------------------------------------- #
# sound effects
# --------------------------------------------------------------------------- #
def fx_click() -> np.ndarray:
    t = t_axis(0.03)
    f = rng.choice([2200, 2600, 3100])
    return square(f, t, 0.5) * np.exp(-t * 260) * 0.5


def fx_type() -> np.ndarray:
    t = t_axis(0.03)
    return (0.5 * highpass(rng.standard_normal(len(t)), 3000) + 0.4 * np.sin(2 * np.pi * 1700 * t)) * np.exp(-t * 300)


def fx_whoosh() -> tuple[np.ndarray, float]:
    L = 0.45
    t = t_axis(L)
    peak = 0.6
    shape = np.where(t < L * peak, (t / (L * peak)) ** 2, ((L - t) / (L * (1 - peak))) ** 1.5)
    n = rng.standard_normal(len(t))
    # band-limited noise, swept by mixing two fixed filters with the envelope
    low, high = lowpass(n, 600), lowpass(n, 4000)
    sig = highpass((1 - shape) * low + shape * high, 200) * shape
    return sig / (np.abs(sig).max() + 1e-9), L * peak


def fx_accent(note: int) -> np.ndarray:  # low tonal accent
    t = t_axis(1.4)
    f = midi(45 + note)
    sig = (np.sin(2 * np.pi * f * t) + 0.35 * lowpass(square(f * 2, t, 0.5), 900)) * np.exp(-t * 2.6)
    return sig * np.minimum(1, t / 0.005)


def fx_impact() -> np.ndarray:
    t = t_axis(0.7)
    body = np.sin(2 * np.pi * (40 * t + 90 / 20 * (1 - np.exp(-20 * t)))) * np.exp(-t * 6)
    hit = lowpass(rng.standard_normal(len(t)), 2500) * np.exp(-t * 50)
    return np.tanh(1.3 * body + 0.4 * hit)


def fx_panel() -> np.ndarray:  # small panel "seat" sound
    t = t_axis(0.25)
    thump = np.sin(2 * np.pi * (90 * t + 60 / 30 * (1 - np.exp(-30 * t)))) * np.exp(-t * 18)
    return 0.8 * thump + 0.5 * np.pad(fx_click(), (0, len(t) - len(fx_click())))


def fx_pulse() -> np.ndarray:  # monitoring signal blip
    t = t_axis(0.12)
    return np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 35) * 0.7


def fx_warn() -> np.ndarray:
    out = np.zeros(int(0.5 * SR))
    for i, n in enumerate((69, 64)):
        t = t_axis(0.16)
        s = lowpass(square(midi(n), t, 0.5), 1800) * np.exp(-t * 10)
        off = int(i * 0.18 * SR)
        out[off:off + len(s)] += s
    return out * 0.6


def fx_rise(L: float) -> np.ndarray:
    t = t_axis(L)
    f = 300 + 600 * t / L
    sig = lowpass(square(1, np.cumsum(f) / SR, 0.5), 1500)
    return sig * np.minimum(1, t / 0.05) * np.minimum(1, (L - t) / 0.08) * 0.4


def fx_fall(L: float) -> np.ndarray:
    return fx_rise(L)[::-1]


def fx_drone(L: float) -> np.ndarray:
    t = t_axis(L)
    env = np.sin(np.pi * np.minimum(t / L, 1)) ** 1.5
    tone = np.sin(2 * np.pi * midi(33) * t) + 0.5 * np.sin(2 * np.pi * midi(45) * t)
    air = lowpass(rng.standard_normal(len(t)), 900)
    return (0.6 * tone + 0.4 * air / (np.abs(air).max() + 1e-9)) * env


def fx_final() -> np.ndarray:  # controlled closing tone
    L = 2.7
    t = t_axis(L)
    sig = np.zeros_like(t)
    for n, a in ((45, 1.0), (57, 0.6), (64, 0.45), (69, 0.35), (76, 0.2)):
        sig += a * np.sin(2 * np.pi * midi(n) * t)
    env = np.minimum(1, t / 0.01) * np.exp(-t * 1.1)
    return sig * env / 2.2


def make_sfx() -> np.ndarray:
    buf = np.zeros((N, 2))
    for sc in TL["scenes"]:
        for fx in sc["sfx"]:
            c = fx["cue"]
            at = (sc["start"] + (sc["cues"][c] if isinstance(c, str) else c)) / FPS
            g, kind = fx["gain"], fx["type"]
            if kind == "click":
                place(buf, fx_click(), at, g)
            elif kind == "clicks":
                for k in range(fx["count"]):
                    place(buf, pan(fx_click(), rng.uniform(-0.4, 0.4)), at + k * fx["step"] / FPS, g)
            elif kind == "typing":
                for k in range(fx["count"]):
                    place(buf, pan(fx_type() * rng.uniform(0.7, 1), rng.uniform(-0.3, 0.3)),
                          at + k * fx["step"] / FPS, g)
            elif kind == "pulses":
                for k in range(fx["count"]):
                    place(buf, pan(fx_pulse(), 0.3), at + k * fx["step"] / FPS, g)
            elif kind == "whoosh":
                s, pk = fx_whoosh()
                place(buf, pan(s, -0.2), at - pk, g)
            elif kind == "accent":
                place(buf, fx_accent(fx.get("note", 0)), at, g)
            elif kind == "impact":
                place(buf, fx_impact(), at, g)
            elif kind == "panel":
                place(buf, fx_panel(), at, g)
            elif kind == "warn":
                place(buf, fx_warn(), at, g)
            elif kind == "rise":
                place(buf, fx_rise(fx["length"]), at, g)
            elif kind == "fall":
                place(buf, fx_fall(fx["length"]), at, g)
            elif kind == "drone":
                place(buf, fx_drone(fx["length"]), at, g)
            elif kind == "final":
                place(buf, fx_final(), at, g)
            else:
                raise ValueError(kind)
    return buf


# --------------------------------------------------------------------------- #
def envelope(x: np.ndarray, release=0.15) -> np.ndarray:
    mono = np.abs(x).max(axis=1)
    blk = 240
    peaks = np.maximum.reduceat(mono, np.arange(0, len(mono), blk))
    a = np.exp(-blk / (release * SR))
    env = np.empty_like(peaks)
    acc = 0.0
    for i, v in enumerate(peaks):
        acc = max(v, a * acc)
        env[i] = acc
    return np.repeat(env, blk)[: len(mono)]


def limit(x: np.ndarray, ceiling_db=-1.0) -> np.ndarray:
    c, knee = db(ceiling_db), db(-6)
    m = np.abs(x)
    o = m > knee
    y = x.copy()
    y[o] = np.sign(x[o]) * (knee + (c - knee) * np.tanh((m[o] - knee) / (c - knee)))
    return y


def write_wav(path: Path, x: np.ndarray) -> None:
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def stats(name: str, x: np.ndarray) -> None:
    p, r = np.abs(x).max(), np.sqrt(np.mean(x ** 2))
    print(f"{name:6s} peak {20*np.log10(p+1e-12):6.1f} dBFS  rms {20*np.log10(r+1e-12):6.1f} dBFS  "
          f"last-30ms {np.abs(x[-int(0.03*SR):]).max():.5f}  length {len(x)/SR:.3f}s")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    music, sfx = make_music(), make_sfx()
    music *= db(-14) / (np.abs(music).max() + 1e-9)
    sfx *= db(-5) / (np.abs(sfx).max() + 1e-9)
    duck = 1 - (1 - db(-4)) * np.clip(envelope(sfx) / db(-12), 0, 1)
    mix = music * duck[:, None] + sfx
    mix *= db(-1.5) / (np.abs(mix).max() + 1e-9)
    mix = limit(mix, -1.0)
    fade = int(0.5 * SR)
    mix[-fade:] *= (np.linspace(1, 0, fade) ** 2)[:, None]
    mix[-int(0.03 * SR):] = 0
    for name, x in (("music", music), ("sfx", sfx), ("mix", mix)):
        write_wav(OUT / f"{name}.wav", x)
        stats(name, x)
    assert np.abs(mix).max() <= db(-1.0) + 1e-6
    assert len(mix) == N
    print(f"wrote {OUT.relative_to(ROOT)}/{{music,sfx,mix}}.wav")


if __name__ == "__main__":
    main()
