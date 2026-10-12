# Allocra: "My allocation." Short film notes

**Format:** 2560×1440 (2K, 16:9), 60 fps, exactly 1,800 frames (30.000 s). The picture is letterboxed to 2.39:1. Composition `Allocra` lives in `src/compositions/Allocra/`.

## Story (structure mirrors the reference demo1.mp4)

| Time | Act | Shots | Voiceover (girl, Kokoro `af_heart`) |
|---|---|---|---|
| 0–10 s | **1. The noise.** Fast cuts, cold grades | Night city and train streaks → notification feed → lit profile → crowd of phones → wall of apps → scrolling tickers → chat full of "tips" → eye reflecting a chart → the girl at a rain-streaked window, who switches her phone off and looks up | "Everyone's telling you where to put your money." / "Every app. Every feed. Every tip." (one cut per phrase) / "But nobody ever asks…" / "what do you actually want to own?" |
| 10–10.8 s | Black | Hard cut, a faint ring | (none) |
| 10.8–25 s | **2. The answer.** Warm dawn, slow camera | Dawn at the desk → over the shoulder into "Your assets. Your allocation." → **My basket**: the weights move from 34/33/33 to 55/27/18 (total stays 100%) → **Basket diagnostics**: the camera finds overlap 11%, largest issuer 34%, est. cost $1.05 on each word → phone: "Before you trade" checks → the cursor waits by "Open workspace" while the footnote comes into focus | "So I stopped." / "And I looked closer." / "Three ETFs. My weights. My call." / "The overlap. The concentration. The cost." / "All of it, before I trade." / "And nothing moves until I say so." |
| 25–30 s | **3. Brand** | The painted asterisk lands → banner art "Your assets. Your allocation." with the Allocra lock-up, "PRIVATE ALLOCATION DESK / 01" and "ALLOCATION IS A DECISION, NOT A DEFAULT." | "My assets. My allocation." |

## Accuracy

- Every product claim comes from the supplied Allocra copy:
  - "See concentration, overlap, quotes, and trading costs before you confirm."
  - "Plan first. Assets remain individually held until you approve a trade."
  - "Allocation is a decision, not a default."
- **All UI is the real product UI** (supplied screenshots). The basket weights are animated in place. The values (55/27/18, 34%, 11%, $1.05) are the sample values shown in that UI.
- **Act 1 notifications and "tips" are generic.** No real tickers, apps or brands appear; they portray the noise the product is the answer to.
- **Faces are deliberately stylised** (silhouettes, screen light, an eye close-up) because the film is generated in code; no photoreal people are used.

## Grades ("LUTs") per shot (`components/Cinema.tsx`)

| Grade | Used for | Recipe |
|---|---|---|
| night | city, feed, profile, ticker, tips | teal-orange; crushed contrast, cool shadow tint, warm highlights |
| cold | crowd, apps | electric blue; high contrast |
| tension | eye, girl | bleach-bypass; low saturation, high contrast, heavy vignette |
| dawn | dawn, screen, phone | golden; lifted warm shadows, halation |
| warmUI | basket, diagnostics, approve | clean warm; gentle bloom |
| brand | end card | rich brand red |

All grades add per-frame film grain and a vignette.

## Sound (`scripts/allocra/`)

1. **Voiceover:** `generate_vo.py` produces the voice with Kokoro (open-source TTS, Apache-2.0, voice `af_heart`), one WAV per line. Durations go to `vo.json`, which times both the captions and the mix.
2. **Score and mix:** `generate_audio.py` builds the rest.
   - Act 1: sub drone, a ticking pulse that speeds up, notification pings and a hit on each cut, and a rising tone.
   - The black beat: a hard drop to near-silence.
   - Act 2: warm felt-piano chords, a pad and a slow heartbeat.
   - End: a low boom and a resolving chord.
   - Mix: the voice sits on top, with the music ducked 7 dB under it. Limited to a −1 dBFS ceiling with a clean ending.

```bash
pip install -r scripts/allocra/requirements.txt
python3 scripts/allocra/generate_vo.py --models <folder with kokoro-v1.0.onnx + voices-v1.0.bin>
python3 scripts/allocra/generate_audio.py
npx remotion render Allocra out/allocra.mp4 --crf=16
```
