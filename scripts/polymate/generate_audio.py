#!/usr/bin/env python3
"""
Generate original music + sound effects for the Polymate video.

Everything is synthesised from scratch with numpy/scipy (no samples). Timing is read
from src/compositions/Polymate/timeline.json, the same file the Remotion scenes
use, so every click/whoosh/impact lands on the exact frame of its animation.

    python3 scripts/polymate/generate_audio.py

Writes to public/polymate/audio/:
    music.wav  - 120 BPM bed (pads, bass, soft kick, hats, pluck arp)
    sfx.wav    - clicks, whooshes, tonal accents, impacts, chime, typing
    mix.wav    - final mix used by the video (music ducked under SFX,
                 peak-limited to -1 dBFS, clean fade to digital silence)
"""
from __future__ import annotations

import json
import wave
from pathlib import Path

import numpy as np
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parents[2]
TIMELINE = json.loads(
    (ROOT / "src/compositions/Polymate/timeline.json").read_text()
)
OUT = ROOT / "public/polymate/audio"

SR = 48_000
FPS = TIMELINE["fps"]
DURATION = TIMELINE["durationInFrames"] / FPS  # exactly 20.0 s
N = int(round(DURATION * SR))
BPM = TIMELINE["bpm"]
BEAT = 60 / BPM
rng = np.random.default_rng(7)  # deterministic output


# --------------------------------------------------------------------------- #
# helpers
# --------------------------------------------------------------------------- #
def t_axis(seconds: float) -> np.ndarray:
    return np.arange(int(seconds * SR)) / SR


def midi(n: float) -> float:
    return 440.0 * 2 ** ((n - 69) / 12)


def db(x: float) -> float:
    return 10 ** (x / 20)


def onepole_lowpass(x: np.ndarray, cutoff) -> np.ndarray:
    """One-pole lowpass; cutoff may be a scalar or a per-sample array."""
    if np.isscalar(cutoff):
        a = np.exp(-2 * np.pi * cutoff / SR)
        return lfilter([1 - a], [1, -a], x)
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def highpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    return x - onepole_lowpass(x, cutoff)


def place(buf: np.ndarray, sig: np.ndarray, at_seconds: float, gain=1.0):
    """Mix a mono or stereo signal into buf (stereo) at a time offset."""
    if sig.ndim == 1:
        sig = np.stack([sig, sig], axis=1)
    start = int(round(at_seconds * SR))
    if start < 0:
        sig = sig[-start:]
        start = 0
    end = min(start + len(sig), len(buf))
    if end > start:
        buf[start:end] += sig[: end - start] * gain


def pan(sig: np.ndarray, p: float) -> np.ndarray:
    """p in [-1, 1], equal-power."""
    ang = (p + 1) * np.pi / 4
    return np.stack([sig * np.cos(ang), sig * np.sin(ang)], axis=1)


# --------------------------------------------------------------------------- #
# music
# --------------------------------------------------------------------------- #
def pad_voice(freq: float, seconds: float) -> np.ndarray:
    t = t_axis(seconds)
    sig = np.zeros_like(t)
    for detune in (-0.12, 0.0, 0.11):  # cents-ish chorus
        f = freq * 2 ** (detune / 12)
        for h, amp in ((1, 1.0), (2, 0.35), (3, 0.18), (4, 0.08)):
            sig += amp * np.sin(2 * np.pi * f * h * t + rng.uniform(0, 6.28))
    env = np.minimum(1, t / 0.35) * np.minimum(1, (seconds - t) / 0.45)
    return sig * np.clip(env, 0, 1) / 6


def make_music() -> np.ndarray:
    buf = np.zeros((N, 2))
    # D minor colour: Dm9 | Bbmaj7 | Gm9 | Asus4->A  (2 bars each = 4 s), then resolve.
    chords = [
        [50, 57, 62, 65, 69, 76],  # Dm9
        [46, 53, 57, 62, 65, 69],  # Bbmaj7
        [43, 50, 55, 58, 62, 69],  # Gm9
        [45, 52, 57, 62, 64, 69],  # Asus4 (add9)
        [50, 57, 62, 65, 69, 74],  # Dm (add9) - sections repeat
    ]
    roots = [38, 34, 31, 33, 38]
    bar = 4 * BEAT
    end_card = TIMELINE["scenes"][-1]["start"] / FPS  # 17.5 s

    # Pads: 2 bars per chord, last chord rings out from the end card.
    for i, chord in enumerate(chords):
        start = i * 2 * bar
        if start >= end_card:
            break
        length = min(2 * bar + 0.4, end_card - start + 0.3)
        sig = sum(pad_voice(midi(n), length) for n in chord)
        sig = onepole_lowpass(sig, 1800)
        place(buf, pan(sig, -0.15 + 0.1 * i), start, db(-20))
    # Final resolve chord on the end card, long clean tail.
    final = sum(pad_voice(midi(n), DURATION - end_card) for n in [38, 50, 57, 62, 66, 69])
    final = onepole_lowpass(final, 1500)
    place(buf, final, end_card, db(-19))

    # Bass: root on beats 1 and 3, from the glyph scene (1.5 s) to the end card.
    t_bass = t_axis(BEAT * 1.6)
    for b in range(int(DURATION / BEAT)):
        at = b * BEAT
        if at < 1.5 or at >= end_card or b % 2:
            continue
        root = roots[min(int(at // (2 * bar)), len(roots) - 1)]
        f = midi(root)
        sig = np.sin(2 * np.pi * f * t_bass) + 0.25 * np.sin(4 * np.pi * f * t_bass)
        sig *= np.exp(-t_bass * 2.2) * np.minimum(1, t_bass / 0.01)
        place(buf, np.tanh(sig * 1.3), at, db(-17))

    # Soft kick every beat 1.5 s -> end card; hats on the off-beats from 3.5 s.
    t_k = t_axis(0.35)
    kick = np.sin(2 * np.pi * (48 * t_k + 70 / 25 * (1 - np.exp(-25 * t_k))))
    kick *= np.exp(-t_k * 11)
    t_h = t_axis(0.06)
    for b in range(int(DURATION / BEAT)):
        at = b * BEAT
        if 1.5 <= at < end_card:
            place(buf, kick, at, db(-15))
        if 3.5 <= at < end_card:
            hat = highpass(rng.standard_normal(len(t_h)), 7000) * np.exp(-t_h * 70)
            place(buf, pan(hat, 0.3), at + BEAT / 2, db(-30))

    # Pluck arpeggio in eighths, 3.5 s -> 16 s, gently panned.
    t_p = t_axis(0.5)
    for k in range(int(DURATION / (BEAT / 2))):
        at = k * BEAT / 2
        if not (3.5 <= at < 16.0):
            continue
        chord = chords[min(int(at // (2 * bar)), len(chords) - 1)]
        note = chord[[2, 3, 4, 3, 5, 4, 3, 2][k % 8]] + 12
        f = midi(note)
        sig = (np.sin(2 * np.pi * f * t_p) + 0.3 * np.sin(4 * np.pi * f * t_p)) * np.exp(-t_p * 9)
        place(buf, pan(sig, 0.35 if k % 2 else -0.35), at, db(-27))

    # Clean ending: cosine fade over the last 1.6 s to exact silence.
    fade_len = int(1.6 * SR)
    fade = 0.5 * (1 + np.cos(np.linspace(0, np.pi, fade_len)))
    buf[-fade_len:] *= fade[:, None]
    buf[-int(0.03 * SR):] = 0
    return buf


# --------------------------------------------------------------------------- #
# sound effects
# --------------------------------------------------------------------------- #
def sfx_click() -> np.ndarray:
    t = t_axis(0.05)
    noise = highpass(rng.standard_normal(len(t)), 3000) * np.exp(-t * 400)
    tone = np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 180)
    return 0.6 * noise + 0.5 * tone


def sfx_whoosh(length=0.45) -> tuple[np.ndarray, float]:
    """Returns (signal, peak_offset) so the loudest point can sit on the cue."""
    t = t_axis(length)
    peak = 0.7
    shape = np.where(t < length * peak, (t / (length * peak)) ** 2,
                     ((length - t) / (length * (1 - peak))) ** 1.5)
    cutoff = 400 + 4200 * shape
    noise = onepole_lowpass(rng.standard_normal(len(t)), cutoff)
    noise = highpass(noise, 250)
    sig = noise * shape
    return sig / (np.abs(sig).max() + 1e-9), length * peak


def bell(freq: float, seconds=1.2) -> np.ndarray:
    t = t_axis(seconds)
    sig = (np.sin(2 * np.pi * freq * t) * np.exp(-t * 3.2)
           + 0.4 * np.sin(2 * np.pi * freq * 2.0 * t) * np.exp(-t * 5)
           + 0.15 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t * 8))
    return sig * np.minimum(1, t / 0.004)


def sfx_accent(note: int) -> np.ndarray:
    return bell(midi(74 + note)) * 0.8  # D5 + offset, in key


def sfx_impact() -> np.ndarray:
    t = t_axis(0.7)
    body = np.sin(2 * np.pi * (45 * t + 110 / 18 * (1 - np.exp(-18 * t)))) * np.exp(-t * 6)
    hit = onepole_lowpass(rng.standard_normal(len(t)), 2500) * np.exp(-t * 45)
    return np.tanh(1.4 * body + 0.5 * hit)


def sfx_glitch() -> np.ndarray:
    out = np.zeros(int(0.3 * SR))
    pos = 0
    for _ in range(7):
        length = int(rng.uniform(0.012, 0.03) * SR)
        t = np.arange(length) / SR
        f = rng.choice([880, 1320, 1760, 2640, 660])
        blip = np.sign(np.sin(2 * np.pi * f * t)) * 0.5
        blip = np.round(blip * 4) / 4  # bit-crush
        out[pos:pos + length] += blip[: len(out) - pos]
        pos += length + int(rng.uniform(0.005, 0.02) * SR)
        if pos >= len(out):
            break
    return onepole_lowpass(out, 6000)


def sfx_rise(length: float) -> np.ndarray:
    t = t_axis(length)
    f = 330 * (1 + 1.6 * (t / length) ** 1.5)
    phase = 2 * np.pi * np.cumsum(f) / SR
    sig = np.sin(phase) + 0.25 * np.sin(2 * phase)
    env = np.minimum(1, t / 0.1) * np.minimum(1, (length - t) / 0.12) * (0.4 + 0.6 * t / length)
    return sig * env * 0.6


def sfx_chime() -> np.ndarray:
    out = np.zeros(int(1.4 * SR))
    a = bell(midi(81), 1.2)  # A5
    b = bell(midi(86), 1.2)  # D6
    out[: len(a)] += a
    off = int(0.09 * SR)
    out[off: off + len(b)] += b[: len(out) - off]
    return out * 0.7


def make_sfx() -> np.ndarray:
    buf = np.zeros((N, 2))
    for scene in TIMELINE["scenes"]:
        cues = scene["cues"]
        for fx in scene["sfx"]:
            cue = fx["cue"]
            frame = scene["start"] + (cues[cue] if isinstance(cue, str) else cue)
            at = frame / FPS
            g = fx["gain"]
            kind = fx["type"]
            if kind == "click":
                place(buf, pan(sfx_click(), rng.uniform(-0.2, 0.2)), at, g)
            elif kind == "whoosh":
                sig, peak = sfx_whoosh()
                place(buf, pan(sig, -0.3), at - peak, g)
            elif kind == "accent":
                place(buf, sfx_accent(fx.get("note", 0)), at, g)
            elif kind == "impact":
                place(buf, sfx_impact(), at, g)
            elif kind == "glitch":
                place(buf, pan(sfx_glitch(), 0.15), at, g)
            elif kind == "rise":
                place(buf, sfx_rise(fx.get("length", 0.8)), at, g)
            elif kind == "chime":
                place(buf, sfx_chime(), at, g)
            elif kind == "typing":
                for k in range(fx["count"]):
                    tick = sfx_click() * rng.uniform(0.6, 1.0)
                    place(buf, pan(tick, rng.uniform(-0.3, 0.3)), at + k * fx["step"] / FPS, g)
            else:
                raise ValueError(f"unknown sfx type {kind}")
    return buf


# --------------------------------------------------------------------------- #
# mix + master
# --------------------------------------------------------------------------- #
def envelope(x: np.ndarray, release=0.15) -> np.ndarray:
    mono = np.abs(x).max(axis=1)
    a = np.exp(-1 / (release * SR))
    env = np.empty_like(mono)
    acc = 0.0
    for i, v in enumerate(mono):
        acc = v if v > acc else a * acc
        env[i] = acc
    return env


def limit(x: np.ndarray, ceiling_db=-1.0) -> np.ndarray:
    """Soft-knee peak limiter: transparent below -6 dBFS, never exceeds ceiling."""
    c = db(ceiling_db)
    knee = db(-6)
    mag = np.abs(x)
    over = mag > knee
    out = x.copy()
    out[over] = np.sign(x[over]) * (knee + (c - knee) * np.tanh((mag[over] - knee) / (c - knee)))
    return out


def write_wav(path: Path, x: np.ndarray) -> None:
    pcm = np.clip(x, -1, 1)
    pcm = (pcm * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def stats(name: str, x: np.ndarray) -> None:
    peak = np.abs(x).max()
    rms = np.sqrt(np.mean(x ** 2))
    tail = np.abs(x[-int(0.03 * SR):]).max()
    print(f"{name:9s} peak {20*np.log10(peak+1e-12):6.1f} dBFS   "
          f"rms {20*np.log10(rms+1e-12):6.1f} dBFS   last-30ms peak {tail:.5f}   "
          f"length {len(x)/SR:.3f}s")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    music = make_music()
    sfx = make_sfx()

    # Normalise stems so SFX sit clearly above the bed.
    music *= db(-16) / (np.abs(music).max() + 1e-9)
    sfx *= db(-4) / (np.abs(sfx).max() + 1e-9)

    # Sidechain: duck music up to 5 dB while effects are sounding.
    duck = 1 - (1 - db(-5)) * np.clip(envelope(sfx) / db(-10), 0, 1)
    mix = music * duck[:, None] + sfx
    # Make-up gain to a -1.5 dBFS peak, then the limiter guarantees the ceiling.
    mix *= db(-1.5) / (np.abs(mix).max() + 1e-9)
    mix = limit(mix, -1.0)

    # Clean ending: tail fades to true zero.
    fade_len = int(0.4 * SR)
    mix[-fade_len:] *= np.linspace(1, 0, fade_len)[:, None] ** 2
    mix[-int(0.03 * SR):] = 0

    write_wav(OUT / "music.wav", music)
    write_wav(OUT / "sfx.wav", sfx)
    write_wav(OUT / "mix.wav", mix)
    for name, x in (("music", music), ("sfx", sfx), ("mix", mix)):
        stats(name, x)
    assert np.abs(mix).max() <= db(-1.0) + 1e-6, "mix exceeds -1 dBFS ceiling"
    assert len(mix) == int(round(DURATION * SR)), "mix length must equal video length"
    print(f"wrote {OUT.relative_to(ROOT)}/{{music,sfx,mix}}.wav")


if __name__ == "__main__":
    main()
