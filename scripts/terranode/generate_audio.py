#!/usr/bin/env python3
"""
Generate original music + sound effects for the TerraNode film.

Everything is synthesised from scratch with numpy/scipy (no samples). Timing is
read from src/compositions/TerraNode/timeline.json, the same file the Remotion
scenes read, so every tick, ping and impact lands on the frame of its
animation.

    pip install -r scripts/terranode/requirements.txt
    python3 scripts/terranode/generate_audio.py

Writes public/terranode/audio/{music,sfx,mix}.wav (48 kHz, 16-bit stereo).
The video uses mix.wav.
"""
from __future__ import annotations

import json
import wave
from pathlib import Path

import numpy as np
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parents[2]
TIMELINE = json.loads((ROOT / "src/compositions/TerraNode/timeline.json").read_text())
OUT = ROOT / "public/terranode/audio"

SR = 48_000
FPS = TIMELINE["fps"]
DURATION = TIMELINE["durationInFrames"] / FPS  # exactly 20.0 s
N = int(round(DURATION * SR))
BEAT = 60 / TIMELINE["bpm"]  # 0.6 s
SKY = next(s for s in TIMELINE["scenes"] if s["id"] == "sky")["start"] / FPS  # 16.8 s
rng = np.random.default_rng(11)


# --------------------------------------------------------------------------- #
# helpers
# --------------------------------------------------------------------------- #
def t_axis(seconds: float) -> np.ndarray:
    return np.arange(int(seconds * SR)) / SR


def midi(n: float) -> float:
    return 440.0 * 2 ** ((n - 69) / 12)


def db(x: float) -> float:
    return 10 ** (x / 20)


def lowpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    a = np.exp(-2 * np.pi * cutoff / SR)
    return lfilter([1 - a], [1, -a], x)


def highpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    return x - lowpass(x, cutoff)


def sweep_lowpass(x: np.ndarray, cutoff: np.ndarray) -> np.ndarray:
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def pan(sig: np.ndarray, p: float) -> np.ndarray:
    ang = (p + 1) * np.pi / 4
    return np.stack([sig * np.cos(ang), sig * np.sin(ang)], axis=1)


def place(buf: np.ndarray, sig: np.ndarray, at: float, gain=1.0) -> None:
    if sig.ndim == 1:
        sig = np.stack([sig, sig], axis=1)
    start = int(round(at * SR))
    if start < 0:
        sig, start = sig[-start:], 0
    end = min(start + len(sig), len(buf))
    if end > start:
        buf[start:end] += sig[: end - start] * gain


def echo(sig: np.ndarray, delay: float, fb: float, taps=4) -> np.ndarray:
    d = int(delay * SR)
    out = np.zeros(len(sig) + d * taps)
    for k in range(taps + 1):
        out[k * d: k * d + len(sig)] += sig * fb ** k
    return out


# --------------------------------------------------------------------------- #
# instruments
# --------------------------------------------------------------------------- #
def pluck(freq: float, seconds=1.6, bright=0.5) -> np.ndarray:
    """Karplus-Strong plucked string (warm acoustic-guitar-like)."""
    n = int(seconds * SR)
    period = int(SR / freq)
    buf = lowpass(rng.uniform(-1, 1, period), 2000 + 6000 * bright)
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % period]
        nxt = buf[(i + 1) % period]
        buf[i % period] = 0.996 * 0.5 * (out[i] + nxt)
    return out * np.minimum(1, np.arange(n) / 30)


def pad_voice(freq: float, seconds: float) -> np.ndarray:
    t = t_axis(seconds)
    sig = np.zeros_like(t)
    for det in (-0.08, 0.0, 0.07):
        f = freq * 2 ** (det / 12)
        sig += np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28))
        sig += 0.3 * np.sin(4 * np.pi * f * t + rng.uniform(0, 6.28))
    env = np.minimum(1, t / 0.6) * np.clip((seconds - t) / 0.8, 0, 1)
    return sig * env / 4


def bell(freq: float, seconds=1.4) -> np.ndarray:
    t = t_axis(seconds)
    sig = (np.sin(2 * np.pi * freq * t) * np.exp(-t * 3)
           + 0.35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 5)
           + 0.12 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t * 8))
    return sig * np.minimum(1, t / 0.003)


# --------------------------------------------------------------------------- #
# music: 100 BPM, G major warmth  (Gadd9 | Em7 | Cmaj7 | Dsus4 ...)
# --------------------------------------------------------------------------- #
CHORDS = [
    [43, 50, 55, 57, 59, 62],  # Gadd9
    [40, 47, 52, 55, 59, 62],  # Em7
    [36, 43, 48, 52, 55, 59],  # Cmaj7
    [38, 45, 50, 55, 57, 62],  # Dsus4
]
BAR = 4 * BEAT  # 2.4 s


def chord_at(t: float) -> list[int]:
    return CHORDS[int(t // BAR) % len(CHORDS)]


def make_music() -> np.ndarray:
    buf = np.zeros((N, 2))

    # Pads, one chord per bar, until the sky scene; then a long resolving Gadd9.
    bar = 0
    while bar * BAR < SKY:
        start = bar * BAR
        length = min(BAR + 0.5, SKY - start + 0.4)
        sig = sum(pad_voice(midi(n + 12), length) for n in chord_at(start)[2:])
        place(buf, pan(lowpass(sig, 1400), -0.1), start, db(-24))
        bar += 1
    final = sum(pad_voice(midi(n + 12), DURATION - SKY) for n in [43, 50, 55, 57, 59, 62, 66])
    place(buf, lowpass(final, 1600), SKY, db(-20))

    # Plucked arpeggio in eighths (enters softly, then full from the node shot).
    pattern = [0, 2, 3, 4, 5, 4, 3, 2]
    for k in range(int(SKY / (BEAT / 2))):
        at = k * BEAT / 2
        chord = chord_at(at)
        note = chord[pattern[k % 8]] + 12
        level = db(-22) if at < 4.2 else db(-18)
        sig = pluck(midi(note), 1.4, bright=0.4 + 0.2 * (k % 2))
        place(buf, pan(sig, 0.3 if k % 2 else -0.3), at, level)
    # Final strum on the end card.
    for i, n in enumerate([43, 50, 55, 59, 62, 67]):
        place(buf, pan(pluck(midi(n + 12), 3.0, 0.5), -0.2 + 0.08 * i), SKY + 0.04 * i, db(-17))

    # Bass: root on beats 1 and 3, plus a push on the "and" of 2, from 2.4 s.
    t_b = t_axis(BEAT * 1.5)
    for b in range(int(SKY / BEAT)):
        at = b * BEAT
        if at < 2.4 or b % 2:
            continue
        hits = (0.0, BEAT * 1.5) if b % 4 == 0 else (0.0,)
        f = midi(chord_at(at)[0])
        sig = np.sin(2 * np.pi * f * t_b) * np.exp(-t_b * 2.5) * np.minimum(1, t_b / 0.01)
        for off in hits:
            place(buf, np.tanh(1.2 * sig), at + off, db(-19))

    # Soft kick on 1 and 3, shaker on eighths — from 2.4 s to the sky scene.
    t_k = t_axis(0.4)
    kick = np.sin(2 * np.pi * (52 * t_k + 60 / 22 * (1 - np.exp(-22 * t_k)))) * np.exp(-t_k * 9)
    t_s = t_axis(0.09)
    for k in range(int(SKY / (BEAT / 2))):
        at = k * BEAT / 2
        if at < 2.4:
            continue
        if k % 4 == 0:
            place(buf, kick, at, db(-16))
        shaker = highpass(rng.standard_normal(len(t_s)), 5000) * np.exp(-t_s * (40 if k % 2 else 60))
        place(buf, pan(shaker, 0.35), at, db(-31 if k % 2 == 0 else -28))

    # Clean ending: cosine fade over the final 1.8 s to exact silence.
    fade = int(1.8 * SR)
    buf[-fade:] *= (0.5 * (1 + np.cos(np.linspace(0, np.pi, fade))))[:, None]
    buf[-int(0.03 * SR):] = 0
    return buf


# --------------------------------------------------------------------------- #
# sound effects
# --------------------------------------------------------------------------- #
def fx_tick() -> np.ndarray:  # soft wooden tick
    t = t_axis(0.06)
    return np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 160) + 0.3 * highpass(
        rng.standard_normal(len(t)), 2500) * np.exp(-t * 500)


def fx_click() -> np.ndarray:
    t = t_axis(0.05)
    return 0.6 * highpass(rng.standard_normal(len(t)), 3000) * np.exp(-t * 400) + \
        0.5 * np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 200)


def fx_whoosh(length=0.5) -> tuple[np.ndarray, float]:
    t = t_axis(length)
    peak = 0.65
    shape = np.where(t < length * peak, (t / (length * peak)) ** 2,
                     ((length - t) / (length * (1 - peak))) ** 1.5)
    sig = highpass(sweep_lowpass(rng.standard_normal(len(t)), 300 + 3800 * shape), 200) * shape
    return sig / (np.abs(sig).max() + 1e-9), length * peak


def fx_swell(length: float) -> np.ndarray:
    t = t_axis(length)
    env = np.sin(np.pi * t / length) ** 2
    noise = sweep_lowpass(rng.standard_normal(len(t)), 200 + 1500 * env)
    tone = sum(np.sin(2 * np.pi * midi(n) * t) for n in (67, 74, 79)) / 3
    return (0.6 * noise / (np.abs(noise).max() + 1e-9) + 0.4 * tone) * env


def fx_ping() -> np.ndarray:  # LoRa radio ping with echo
    t = t_axis(0.25)
    p = np.sin(2 * np.pi * 1568 * t) * np.exp(-t * 18)
    return echo(p, 0.12, 0.45, taps=3) * 0.8


def fx_scan(length: float) -> np.ndarray:
    t = t_axis(length)
    f = 500 + 900 * t / length
    sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.5 + 0.5 * np.sin(2 * np.pi * 14 * t))
    return sig * np.minimum(1, t / 0.08) * np.minimum(1, (length - t) / 0.1) * 0.5


def fx_chime() -> np.ndarray:
    out = np.zeros(int(1.6 * SR))
    for i, n in enumerate((79, 83, 86)):  # G5 B5 D6
        b = bell(midi(n), 1.4)
        off = int(i * 0.08 * SR)
        out[off:off + len(b)] += b[: len(out) - off]
    return out * 0.55


def fx_notify() -> np.ndarray:
    out = np.zeros(int(0.9 * SR))
    for i, n in enumerate((81, 88)):
        b = bell(midi(n), 0.7)
        off = int(i * 0.11 * SR)
        out[off:off + len(b)] += b[: len(out) - off]
    return out * 0.6


def fx_impact() -> np.ndarray:
    t = t_axis(1.0)
    body = np.sin(2 * np.pi * (40 * t + 80 / 14 * (1 - np.exp(-14 * t)))) * np.exp(-t * 4)
    air = lowpass(rng.standard_normal(len(t)), 1800) * np.exp(-t * 20)
    return np.tanh(1.2 * body + 0.4 * air)


def make_sfx() -> np.ndarray:
    buf = np.zeros((N, 2))
    for scene in TIMELINE["scenes"]:
        for fx in scene["sfx"]:
            c = fx["cue"]
            at = (scene["start"] + (scene["cues"][c] if isinstance(c, str) else c)) / FPS
            g, kind = fx["gain"], fx["type"]
            if kind == "tick":
                place(buf, pan(fx_tick(), rng.uniform(-0.25, 0.25)), at, g)
            elif kind == "click":
                place(buf, fx_click(), at, g)
            elif kind == "whoosh":
                sig, peak = fx_whoosh()
                place(buf, pan(sig, -0.25), at - peak, g)
            elif kind == "swell":
                place(buf, pan(fx_swell(fx["length"]), 0.1), at, g)
            elif kind == "ping":
                place(buf, pan(fx_ping(), rng.uniform(-0.4, 0.4)), at, g)
            elif kind == "scan":
                place(buf, fx_scan(fx["length"]), at, g)
            elif kind == "chime":
                place(buf, fx_chime(), at, g)
            elif kind == "notify":
                place(buf, fx_notify(), at, g)
            elif kind == "accent":
                place(buf, bell(midi(79 + fx.get("note", 0))) * 0.7, at, g)
            elif kind == "impact":
                place(buf, fx_impact(), at, g)
            elif kind == "typing":
                for k in range(fx["count"]):
                    place(buf, pan(fx_tick() * rng.uniform(0.6, 1), rng.uniform(-0.3, 0.3)),
                          at + k * fx["step"] / FPS, g)
            else:
                raise ValueError(f"unknown sfx type {kind}")
    return buf


# --------------------------------------------------------------------------- #
# mix + master
# --------------------------------------------------------------------------- #
def envelope(x: np.ndarray, release=0.15) -> np.ndarray:
    mono = np.abs(x).max(axis=1)
    # Peak follower: instant attack, exponential release (vectorised via lfilter
    # on a running max over short blocks).
    block = 240
    peaks = np.maximum.reduceat(mono, np.arange(0, len(mono), block))
    a = np.exp(-block / (release * SR))
    env_b = np.empty_like(peaks)
    acc = 0.0
    for i, v in enumerate(peaks):
        acc = max(v, a * acc)
        env_b[i] = acc
    return np.repeat(env_b, block)[: len(mono)]


def limit(x: np.ndarray, ceiling_db=-1.0) -> np.ndarray:
    c, knee = db(ceiling_db), db(-6)
    mag = np.abs(x)
    over = mag > knee
    out = x.copy()
    out[over] = np.sign(x[over]) * (knee + (c - knee) * np.tanh((mag[over] - knee) / (c - knee)))
    return out


def write_wav(path: Path, x: np.ndarray) -> None:
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def stats(name: str, x: np.ndarray) -> None:
    peak, rms = np.abs(x).max(), np.sqrt(np.mean(x ** 2))
    print(f"{name:6s} peak {20*np.log10(peak+1e-12):6.1f} dBFS  rms {20*np.log10(rms+1e-12):6.1f} dBFS  "
          f"last-30ms peak {np.abs(x[-int(0.03*SR):]).max():.5f}  length {len(x)/SR:.3f}s")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    music, sfx = make_music(), make_sfx()
    music *= db(-14) / (np.abs(music).max() + 1e-9)
    sfx *= db(-5) / (np.abs(sfx).max() + 1e-9)

    duck = 1 - (1 - db(-4)) * np.clip(envelope(sfx) / db(-12), 0, 1)
    mix = music * duck[:, None] + sfx
    mix *= db(-1.5) / (np.abs(mix).max() + 1e-9)
    mix = limit(mix, -1.0)
    fade = int(0.4 * SR)
    mix[-fade:] *= (np.linspace(1, 0, fade) ** 2)[:, None]
    mix[-int(0.03 * SR):] = 0

    for name, x in (("music", music), ("sfx", sfx), ("mix", mix)):
        write_wav(OUT / f"{name}.wav", x)
        stats(name, x)
    assert np.abs(mix).max() <= db(-1.0) + 1e-6, "mix exceeds -1 dBFS"
    assert len(mix) == N, "mix length must equal the video length"
    print(f"wrote {OUT.relative_to(ROOT)}/{{music,sfx,mix}}.wav")


if __name__ == "__main__":
    main()
