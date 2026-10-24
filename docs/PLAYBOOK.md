# Claudemotion Playbook — how these brand films are made, from zero

This is the complete working method behind every video in this repo (Polymate,
TerraNode, Collatera, Allocra, Nightshift, Quantora, AegisNet). Give it to any
Claude (Claude Code, or a Claude project as knowledge) and it can reproduce the
same workflow and quality.

> Fastest way to "train" another Claude: give it this repo
> (`https://github.com/sahudevansh21/claudemotion`, branch
> `claude/new-session-1zkpzg`). Every film's code, timeline, audio script and
> notes are there to copy from. This file explains the method; the code is the
> worked examples.

---

## 1. What the system is

- **Remotion 4.0.533** (React → MP4). Every frame is a pure function of the
  frame number. No video editor, no After Effects.
- **Everything is code-built**: graphics, UI mock-ups, charts, particle
  effects, landscapes, typography. Real assets are only the client's logo,
  banner/site screenshots and screen recordings.
- **Audio is generated in Python** (numpy/scipy synthesis — no samples):
  music bed, SFX, mixing, ducking, limiting. Voiceover (when asked) is local
  **Kokoro TTS**.
- **One timeline file per film** (`timeline.json` / `*.json`) is the single
  source of truth for picture *and* sound: scene cuts, cue frames, SFX hits,
  VO placement.

## 2. Environment setup (once)

Requirements: Node 22+, Python 3.11+, ffmpeg/ffprobe, Chromium (for Remotion
and Playwright).

```bash
# Remotion project (or clone this repo and run npm i)
npx create-video@latest            # blank template, TypeScript
npx remotion add @remotion/fonts @remotion/media @remotion/shapes @remotion/transitions @remotion/zod-types
npx remotion skills add            # official Remotion Agent Skills → .agents/skills
npx remotion versions              # all @remotion/* must be the SAME version

# Python audio + analysis tools
pip install numpy scipy soundfile pillow kokoro-onnx faster-whisper
# Kokoro model files (download once, ~350 MB):
#   kokoro-v1.0.onnx, voices-v1.0.bin from
#   https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0

# Website capture
npm i --no-save playwright         # use the system Chromium; don't download browsers
```

`remotion.config.ts`: `Config.setRspack(true)`, `setVideoImageFormat("jpeg")`,
`setOverwriteOutput(true)`.

**Fonts are always self-hosted** (`@remotion/fonts` `loadFont()` with a
`.woff2` in `public/`). Google Fonts URLs fail inside headless Chromium. Get OFL
fonts with `npm pack @fontsource/<name>` and copy the `latin-<weight>-normal.woff2`
files + LICENSE into `public/<brand>/fonts/`.

## 3. Repo layout and conventions

```
src/Root.tsx                       registers every <Composition> (id, width, height, fps, durationInFrames)
src/components/Stage.tsx           1920x1080 design canvas scaled to any output (4K = scale 2)
src/compositions/<Brand>/
  <Brand>.tsx                      composition: Sequences per shot + <Audio>
  brand.ts                         palette, fonts (loadFont), easings, real copy/data
  timeline.json                    fps, durationInFrames, shots/scenes {id,start,end,cues,sfx}
  timeline.ts                      shot(id), cue(id,name), ez(), lerp() helpers
  components/                      reusable pieces (Mark, Cursor, Card, Wave…)
  scenes/ or shots/                one component per shot
public/<brand>/{img,fonts,audio,vo,clips,site}/
scripts/<brand>/generate_audio.py  reads the same timeline.json
docs/<brand>/NOTES.md|SOURCES.md   reference→shot mapping, sources, accuracy notes
deliverables/                      final MP4s / stills / zips that are sent to the client
```

**Golden rules** (break these and renders flicker):

1. Animate only from `useCurrentFrame()` via `interpolate()`/`spring()`.
   Never CSS transitions/keyframes, timers, `Date.now()`, `Math.random()` —
   use `random("seed")`.
2. Author time in seconds or in timeline frames; never assume 30 fps.
3. Frame inside a `<Sequence>` is relative to that sequence.
4. Clamp every interpolate (`extrapolateLeft/Right: "clamp"`).
5. Assets in `public/`, referenced with `staticFile()`; use `<Img>`,
   `<Video>/<Audio>` from `@remotion/media`, never raw tags.
6. Lay everything out on the 1920×1080 design canvas inside `<Stage>`; keep text
   ≥80 px from sides, ≥100 px from top/bottom.
7. `premountFor={fps}` on every `<Sequence>`.
8. Inline object literal for `defaultProps` in `Root.tsx`.

## 4. The workflow, step by step

### Step 0 — Intake (what to get from the client)

- Brand assets: logo (ideally SVG/hi-res PNG), banner, X profile, website URL
  and/or screenshots, product UI screenshots or a screen recording.
- Reference video(s) to copy the motion grammar from. Standing preference:
  also study launch films on **http://whatships.com/**.
- Spec: duration, resolution (1080p / 2K / 4K), fps (30/60), aspect (16:9,
  9:16, 1:1, 4:5), voiceover yes/no (male/female, tone).
- Copy/data they want shown. **Only use real data**; anything else is labelled
  "illustrative".
- If something is missing, proceed with a sensible default and say so (don't
  block); ask only when the answer changes the build (e.g. stock footage vs
  code-built, paid AI generation).

### Step 1 — Analyse the reference video (every second, every scene)

```bash
V=reference.mp4
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of compact "$V"
# 1 fps contact sheet with timestamps
ffmpeg -i "$V" -vf "fps=1,scale=400:-1,drawtext=text='%{eif\:t\:d}s':x=6:y=6:fontsize=20:fontcolor=yellow:box=1:boxcolor=black" t%03d.png
ffmpeg -framerate 1 -i t%03d.png -vf tile=6x7 -frames:v 1 sheet.png
# hard cuts
ffmpeg -i "$V" -vf "select='gt(scene,0.3)',showinfo" -f null - 2>&1 | grep -o "pts_time:[0-9.]*"
# full-res frames at key moments (type, effects, UI detail)
ffmpeg -ss 5.5 -i "$V" -frames:v 1 r5.5.png
# audio: loudness, spectrogram, transcript (VO script + exact timings)
ffmpeg -i "$V" -ac 1 -ar 16000 a.wav
ffmpeg -i a.wav -af ebur128 -f null - 2>&1 | grep -A1 Integrated
ffmpeg -i a.wav -lavfi showspectrumpic=s=1600x400:legend=0 spec.png
python3 -c "from faster_whisper import WhisperModel as W; [print(f'{s.start:.2f}-{s.end:.2f} {s.text}') for s in W('base.en',device='cpu',compute_type='int8').transcribe('a.wav')[0]]"
```

Write down, per shot: time range, what's on screen, type treatment (font
style, size, colour accents, how words enter), camera move, transition, SFX/
music beat, VO line. Estimate VO gender from median pitch (~120 Hz male,
~200–230 Hz female) if unclear. No transcript = music-only film.

### Step 2 — Extract the brand

- **Palette**: sample from logo/banner/site screenshots.
- **Fonts**: closest OFL match via fontsource (e.g. Unbounded/Michroma for wide
  display, Newsreader/Instrument Serif for editorial, Jost for geometric
  wordmarks, Cinzel for engraved caps, Silkscreen for pixel). Note in docs that
  the wordmark is a lookalike unless the client sends their font.
- **Logo**: never redraw if the client says "exact logo". Cut it out:
  - on white bg → flood-fill from the border (keeps internal whites), feather;
  - white logo on dark/noisy bg → luminance → alpha, drop small components;
  - simple black mark → upscale 8×, Gaussian blur, soft threshold = crisp edges.
  Simple geometric marks can be redrawn as vector SVG for 4K sharpness.
- **Website**: `curl` the HTML and strip tags for copy; capture real UI with
  Playwright (2× device scale, dismiss modals, scroll positions). Sites
  rate-limit — space requests, retry, keep the good captures. WebGL heroes
  don't capture headless → rebuild them procedurally.

### Step 3 — Storyboard → timeline.json

Make a mapping table: *reference shot → brand shot* (same timing, same motion
grammar, brand content). Then encode it:

```json
{
  "fps": 60, "durationInFrames": 1800, "bpm": 120,
  "shots": [
    { "id": "logo", "start": 0, "end": 75,
      "cues": { "mark": 0, "word": 10 },
      "sfx": [ { "cue": 0, "type": "impact", "gain": 0.5 } ] }
  ]
}
```

- Cuts land on the beat (120 BPM = 15 frames @30 fps, 30 @60 fps).
- Cues are frames relative to the shot; the audio script places SFX at
  `shot.start + cue`, so picture and sound can't drift.
- For seamless one-take films, use absolute cue frames and drive every layer
  from the global frame.
- With VO: generate VO first, read its durations, then time scenes/words to it
  (`vo.json` with `at` + `seconds`).

### Step 4 — Build the film

Structure: `<Composition>` → `<AbsoluteFill>` → `<Sequence>` per shot (from
timeline) wrapped in `<Stage>` → one component per shot → `<Audio>`.

Reusable effect recipes (all in the repo):

| Effect | Where to copy from |
| --- | --- |
| Word-by-word blur/fade reveal with accent words | `Nightshift/launch/Launch.tsx` `Words` |
| Decode/scramble captions, highlight box, glitch-out | `Polymate/minimal/Caption.tsx` |
| Type-on with caret | `Polymate/forum/Forum.tsx` `Typed` |
| Multiplayer cursors / touch dot / click pulse | `Nightshift/components/Ui.tsx` `Cursor`, `Forum.tsx` touch |
| Node graph + bezier wires drawn on | `Nightshift/components/Ui.tsx` `Node`, `Wire` |
| Waffle chart, ring gauge, option tree, node ring | `Nightshift/launch/Launch.tsx` |
| Screenshot zoom with motion-blur in + captions | `Launch.tsx` `ScreenShot`, `Aegis.tsx` `Clip` |
| Particle wave / radial burst / glyph rain | `Aegis.tsx` `Wave`, `Launch.tsx` `Burst`, `GlyphField` |
| Procedural night city / landscape / sky | `Nightshift/components/City.tsx`, TerraNode |
| Marble (drawn veins), paper texture, film grain, vignette | `Polymate/minimal/Shots.tsx`, `Quantora/Posts.tsx`, `Allocra/components/Cinema.tsx` |
| Per-shot colour grade ("LUT") + 2.39:1 letterbox | `Allocra/components/Cinema.tsx` |
| Morph (logo stone → UI panel → back) | `Polymate/forum/Forum.tsx` `Interface` |
| Annotated editorial charts on dotted grid | `Quantora/Posts.tsx` |

Style rules that made these look premium: generous negative space, one accent
colour, one italic/serif accent word per headline, mono labels with wide
tracking, soft shadows, slow camera drift on every shot (nothing static),
expo-out easing `bezier(0.16,1,0.3,1)`, in-out `bezier(0.65,0,0.35,1)`.

### Step 5 — Audio

`scripts/<brand>/generate_audio.py` (copy the closest existing one):

- Music: chord progression (pads = detuned saws, low-passed), plucky arps,
  kick/clap/hats at the BPM, bass, a breakdown + riser into the drop/brand
  reveal, final resolving chord.
- SFX library: whoosh, swoosh, pop, click, tick/typing, impact, riser, chime,
  success, thud, glass — each a small synth function; placed from the timeline.
- Mix: normalise stems, **duck music under SFX/VO** (envelope follower),
  drive into a soft-knee limiter at −1 dBFS, fade to exact zero.
- Loudness targets: social launch films −12…−14 LUFS; calm/minimal −16…−18.
- VO: `scripts/nightshift/generate_launch_vo.py` pattern — Kokoro
  (`af_heart` female, `am_*`/`bm_*` male), trim silence, normalise, write
  per-line WAVs + `vo.json`; place each line with `<Sequence from>` + `<Audio>`.
- To change only the sound of a finished film, regenerate audio and remux —
  no re-render: `ffmpeg -i film.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest out.mp4`.

### Step 6 — QA loop (before any full render)

```bash
npm run lint                               # eslint + tsc, must be clean
npx remotion versions
for f in 30 120 300 …; do npx remotion still <Id> s$f.png --frame=$f --scale=0.5; done
ffmpeg -pattern_type glob -i 's*.png' -vf "scale=640:-1,tile=4x4" -frames:v 1 sheet.png
```

Look at the contact sheet like a client would: overlaps, text off-safe-area,
low contrast, empty frames, landing positions, logo crops. Fix, re-still the
broken frames only, repeat.

### Step 7 — Render and verify

```bash
npx remotion render <Id> out/<name>.mp4 --crf=17      # 4K/60 renders: run in background (10–30 min)
ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate,nb_frames,duration -of compact out/<name>.mp4
ffmpeg -i out/<name>.mp4 -af ebur128 -f null - 2>&1 | grep -A1 Integrated
# VO films: re-transcribe the render and compare line timings to the reference
ffmpeg -i out/<name>.mp4 -vf "fps=1,scale=320:-1,tile=8x5" -frames:v 1 final.png   # final look-through
```

Stills/posters: a composition with `fps=1` and one frame per poster, rendered
with `remotion still --frame=N` (use `--scale` for 4K); export JPEG q≈94
(grainy PNGs are 12 MB+), zip them.

### Step 8 — Deliver

- Copy to `deliverables/`, commit + push, send the file to the client.
- `docs/<brand>/NOTES.md`: reference analysis table, shot list, sources,
  what is illustrative, what to check.
- Reply format: what was made (spec + verified numbers), shot table, what's
  real vs illustrative, things the client must check (claims like "live",
  handles, lookalike fonts, low-res logo), offers (vertical cut, 1080p, stills).

## 5. Accuracy rules (non-negotiable)

- Never invent metrics, users, prices or partnerships. Use the site/client copy
  verbatim; label mock data "Illustrative".
- Flag claims that the source contradicts (e.g. "live" vs "testnet-ready").
- Spell names as the client's assets show them; say so if the request differs.
- Upcoming features shown as "Coming soon", never live.
- Partner logos only as provided; check X handles before tagging.

## 6. Known pitfalls (already hit and fixed)

| Problem | Fix |
| --- | --- |
| Google Fonts fail in render | self-host with `@remotion/fonts` |
| `@remotion/*` version mismatch errors | `npx remotion add <pkg>` / align versions |
| scipy `lfilter` "inhomogeneous shape" | filter cutoff must be a scalar; crossfade two fixed filters instead of a swept cutoff |
| JSON import typing errors in TS | cast `as unknown as Record<…>` |
| `premountFor` + `layout="none"` type error | drop `layout="none"` |
| `objectFit` in `<Video style>` warning | size the clip to the box instead |
| `mixHex` returning `rgb()` broke colours | keep colour helpers returning hex |
| Marble from noise looks like camouflage | draw veins as random-walk SVG paths |
| Rotated full-bleed layer shows black corners | scale ≥1.1 when rotating |
| Text over light marble unreadable | dark caption tone on light plates |
| Playwright capture 404/retries | wait between pages, retry, keep good shots |
| Huge PNG stills | export JPEG q94 |
| Long renders time out | run in background, commit source first |
| Repo stop-hook wants clean tree | commit + push after every milestone |

## 7. Copy-paste instructions for another Claude

> You make premium motion-graphics brand films and social stills in code with
> Remotion 4 (React → MP4) and Python-generated audio, following
> `docs/PLAYBOOK.md` in the claudemotion repo. For every request: (1) analyse
> the reference video second by second (contact sheets, cut detection, full-res
> frames, loudness, whisper transcript); also study whatships.com launch films;
> (2) extract the brand (palette, OFL lookalike fonts via fontsource, logo
> cut-out, site copy via curl, real UI via Playwright); (3) map every reference
> shot to a brand shot and encode it in a timeline JSON that drives both picture
> and sound; (4) build one component per shot on a 1920×1080 Stage, animating
> only from the frame; (5) generate music/SFX (and Kokoro VO if asked) from the
> same timeline, ducked and limited; (6) lint, render stills, inspect a contact
> sheet, fix; (7) render, verify with ffprobe + ebur128 (+ whisper for VO);
> (8) deliver to `deliverables/`, document sources and illustrative data, commit
> and push. Never invent data or claims; label mock UI as illustrative; flag
> anything the client should verify.

## 8. Index of finished work (study these)

| Film | Spec | Highlights |
| --- | --- | --- |
| Polymate | 20 s 1080p30 | brand film, Roman theme |
| PolymateMinimal | 10 s 4K60 | decode captions, marble, minimal |
| PolymateForum | 30 s 4K60 one take | forum plate, emblem → UI morph, pedestal |
| TerraNode | 20 s 1080p30 | procedural golden-hour landscape |
| Collatera | 30 s 1080p60 | pixel art, decoded mascot |
| Allocra | 30 s 2K60 | cinematic grades, female VO, captions |
| Nightshift | 30 s 1080p30 | node canvas + cursors, procedural city |
| NightshiftLive | 15 s 1080p30 | partner "now live" announcement |
| NightshiftLaunch | 39 s 1080p30 | shot-for-shot launch-film remake + VO + real site |
| AegisLaunch | 30 s 1080p30 | title cards + real screen-recording clips |
| QuantoraPosts | 10 stills 4K | editorial chart posters |
| Allocra stills | 17 stills 4K | frames pulled from the film for posts |
