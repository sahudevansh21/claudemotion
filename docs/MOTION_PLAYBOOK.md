# Motion playbook — how to turn a prompt into a finished SaaS / brand video

This is the exact process used to make every film in `src/compositions/`
(Polymate, BCM, Nightshift, Collatera, TerraNode, Allocra). Follow it in
order. `AGENTS.md` has the project rules and commands; this file is the
*method*. Worked examples are named at each step so you can open real code.

---

## 0. Mental model

- A video here is **a React page rendered once per frame** by Remotion, then
  encoded to MP4. There is no timeline editor: the "timeline" is code.
- Every visual value is a **pure function of the frame number**
  (`useCurrentFrame()`). Same frame in → same pixels out. That is what makes
  renders deterministic and lets us check single frames with `remotion still`.
- One **timeline JSON** per film holds the cue frames. The TSX reads it for
  visuals and the Python audio script reads it for sound, so picture and sound
  can never drift apart.
- Layout is always on a **1920×1080 design canvas** (`<Stage>`), scaled to the
  output size. Author once, render at 1080p or 4K without touching scene code.

---

## 1. Read the brief → write a spec (before any code)

Extract and write down (in your head or a scratch note):

| Field | Example | Default if not given |
| --- | --- | --- |
| Length | 10 s | ask only if nothing hints at it |
| Size / fps | 1920×1080 @ 30, or 3840×2160 @ 60 for "4K 60fps" | match the brand's earlier films |
| Audio | music + SFX / silent | if user says "leave audio", ship `--muted` |
| Required copy | "TRADE WHAT HAPPENS NEXT." | use verbatim, same case |
| Claims to avoid | "don't imply guaranteed outcomes" | add "Illustrative" labels, never invent real stats as fact |
| Must-use assets | exact logo | never redraw unless you can match it pixel-for-pixel |
| Reference video | uploaded mp4 | see step 2 |
| Theme | screenshots / banner / logo | see step 3 |

Rules:
- Ask a question **only** when the answer changes the work (format, approach,
  paid tools). Otherwise choose a sensible default and say so in one line.
- If the user changes their mind mid-way ("make it 1080p 30fps", "leave
  audio"), apply it immediately and keep going — don't restart.
- If the user asks "time?", answer with an honest estimate in one line and
  continue working.

## 2. Analyse the reference video (when one is supplied)

```bash
scripts/tools/analyze-reference.sh /path/to/reference.mp4 out/reference
```

It prints format, hard-cut times and an audio tempo estimate, and writes
`out/reference/sheet-NN.jpg` — 30 frames per sheet, 4 per second, each
stamped with its time. Open every sheet and write a **beat table**:

```
t (s)   background  content                         motion
0.00    black       "What if" white                 glitch-slice in
0.75    white       "streaming" black               slices slide together
1.75    pink        "paid" white                    glitch in
2.50    black       "you?" pink                     glitch in / out
3.50    white       3D GO LIVE button               tilt, press @4.4, flash + ripple
5.25    footage     counter 147 → 12,480 WATCHING   REC brackets, zoom
6.75    stripes     wipe                            bars slide up/down
...
```

What to copy from a reference: **order of beats, durations, cut points,
background rhythm (dark/light/brand), motion grammar** (how things enter and
leave), type scale, and how audio hits line up with cuts.
What NOT to copy: their brand, their footage, their music (compose original
audio at the same tempo instead).

If the user asks for a shorter cut ("10 s, super fast"), keep the **same beat
order** and compress each beat proportionally (see `compositions/BCM/bcm.json`:
the 30 s reference became 10 s at ~3× speed).

## 3. Extract the brand

From the logo / X banner / app screenshots:

1. **Colours** — sample real pixels, don't guess:
   ```bash
   ffmpeg -v error -y -i logo.png -f rawvideo -pix_fmt rgb24 logo.raw
   python3 -c "
   import numpy as np; im=np.fromfile('logo.raw',np.uint8).reshape(H,W,3)
   for x,y in [(105,130),(230,140),(260,290)]: print((x,y),'#%02X%02X%02X'%tuple(im[y,x]))"
   ```
   Put them in a `brand.ts(x)` token object (see `Polymate/brand.ts`,
   `BCM/brand.tsx`, `Nightshift/brand.ts`). Gradients become a `grad` string
   plus a `gradText` style (background-clip: text).
2. **Logo** — prefer the supplied file unchanged (`<Img src={staticFile(...)}>`,
   e.g. the Polymate emblem). If it's a simple geometric mark and small (e.g.
   400 px) but must be shown large, **trace it to SVG** by measuring row/column
   runs of the alpha mask (`BCM/brand.tsx` `Logo` was traced this way:
   two rounded tiles + an SVG mask for the overlap). Check the trace against
   the original before using it.
3. **Fonts** — identify the closest OFL font and self-host it:
   ```bash
   U=$(curl -sS -A "Mozilla/5.0 Chrome/120" "https://fonts.googleapis.com/css2?family=Lexend:wght@100..900" \
       | grep -A6 "/\* latin \*/" | grep -o "https://[^)]*")
   curl -sS -o public/<brand>/fonts/Lexend-Variable-latin.woff2 "$U"
   ```
   Register with `loadFont()` from `@remotion/fonts` in the brand file. Also
   save the OFL licence text next to it. JetBrains Mono and Inter are already
   loaded by `src/config/theme.ts`.
4. **Copy and data** — pull labels from the product UI (tab names, button
   text, chain IDs, disclaimers). If you need numbers that aren't supplied,
   make them obviously illustrative and tell the user they are placeholders.

## 4. Plan the film as a timeline JSON

Create `src/compositions/<Brand>/<film>.json`:

```json
{
  "_comment": "what this film is, fps, size; cues are ABSOLUTE frames",
  "fps": 30,
  "durationInFrames": 300,
  "scenes": { "w1": 0, "w2": 9, "button": 39, "press": 51, "meter": 63, "end": 276 },
  "sfx": [ { "at": 51, "type": "press", "gain": 0.55 } ]
}
```

- Cues are **absolute frames** at the composition fps. Duration of a scene =
  next scene's start − its start.
- With music, put cuts on the beat grid: frames per beat = fps × 60 / BPM
  (30 fps @ 120 BPM = 15 frames; 60 fps @ 120 BPM = 30 frames).
- Fast SaaS cuts: 0.3–0.6 s for single words, 0.8–1.5 s for UI beats, 1–2 s
  for the end card. Calm/premium films: 2–5 s per idea.

## 5. Build the composition

### 5.1 Files

```
src/compositions/<Brand>/
  brand.ts(x)        tokens: colours, fonts, eases, Logo component
  <film>.json        timeline (shared with audio)
  <Film>.tsx         scenes + timeline; or scenes/*.tsx for long films
public/<brand>/      fonts/, img/, audio/
scripts/<brand>/generate_audio.py   (only if the film has sound)
```

Register in `src/Root.tsx` with an explicit `width/height/fps/
durationInFrames` and a comment saying the format is fixed by the brief.

### 5.2 Skeleton

```tsx
const S = tl.scenes;
export const Film: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: BRAND.black }}>
      <Stage>
        <Sequence name="Hook"  from={S.w1}     durationInFrames={S.w2 - S.w1}       premountFor={fps}><Word i={0} /></Sequence>
        <Sequence name="Press" from={S.button} durationInFrames={S.meter - S.button} premountFor={fps}><Button /></Sequence>
        {/* … one Sequence per beat, overlays (wipes) as extra Sequences on top … */}
      </Stage>
      <Audio src={staticFile("<brand>/audio/mix.wav")} />   {/* omit when silent */}
    </AbsoluteFill>
  );
};
```

Inside a `<Sequence>`, `useCurrentFrame()` starts at 0 — animate scene-locally.
For **one continuous take** (no cuts, e.g. `Polymate/forum`, `golden`), skip
Sequences and drive every layer from the global frame + the cue table.

### 5.3 The motion toolkit (copy these patterns)

All in `BCM/BCMPromo.tsx`, `Nightshift/NightshiftNyx.tsx`,
`Polymate/forum/Forum.tsx`:

| Pattern | How | Where |
| --- | --- | --- |
| Eased 0→1 | `ez(f, start, dur)` = clamped `interpolate` with expo-out `bezier(0.16,1,0.3,1)` | everywhere |
| Rise + de-blur entrance | opacity t, `translateY((1-t)*40)`, `blur((1-t)*10px)`; mirrored exit | `In` in NightshiftNyx |
| Glitch-slice word | render text N times clipped to horizontal strips (`clip-path: inset`), offset each strip by `random(seed)*amp*(1-t)²` | `Glitch` in BCMPromo |
| Typed line + caret | `text.slice(0, floor((f-at)/fps*cps))` + blinking `▍` | `Typed` in NightshiftNyx, Forum |
| Pop-in | `spring({frame: f - at, fps, config: {damping: 12, stiffness: 180}})` → `scale()` | cards, pills, logo |
| Stagger | start each item `i * 2–4` frames later | lists, bars, letters |
| Counter | `Math.round(interpolate(f,[a,b],[from,to]))` + `toLocaleString` | Meter, Donut |
| Word swap | two stacked lines in an `overflow:hidden` box, `translateY((i - swap)*h)` | Ask beat in NightshiftNyx |
| Stripe wipe | 10 full-height bars, alternate up/down, staggered 0.4 frames | `Wipe` in BCMPromo |
| Reorder / leaderboard | lerp each item's slot index between two orderings | `Ranks` in BCMPromo |
| Donut | SVG arc paths swept by `t`, tilted with CSS `rotateX` | `Donut` in BCMPromo |
| Radar | concentric circles + rotating wedge path + seeded dots | `Radar` in BCMPromo |
| Camera move | wrap a world layer in `translate(tx,ty) scale(s)`; compute `toScreen()` for overlays | `golden/shared.ts` |
| Painterly / procedural BG | draw a flat scene into an offscreen canvas, then paint seeded brush dabs sampled from it in `useLayoutEffect` | `golden/Painting.tsx` |
| Pixel mosaic BG | SVG grid of rects, opacity from gaussian clusters × sin twinkle | `Meter` in BCMPromo |

Feel rules for "SaaS energy": fast expo-out entrances (6–14 frames), small
overshoot on springs, everything staggered, hard cuts or wipes on the beat,
one idea per beat, big type (≥84 px headline), generous empty space.
Feel rules for "premium/minimal": slower (20–40 frame) eases, no overshoot,
fewer elements, slow push-in camera on every shot so nothing is static.

### 5.4 Hard rules (renders break if ignored)

- No CSS transitions/keyframes, `setTimeout`, `Date.now()`, `Math.random()`.
  Use `random("seed")` from `remotion`.
- Always clamp interpolations; set `premountFor={fps}` on Sequences.
- `<Img>`, `<Audio>`/`<Video>` from Remotion only; assets via `staticFile()`.
- Text ≥80 px from the sides, ≥100 px from top/bottom; headline ≥84 px,
  supporting ≥44 px (small UI labels inside mock UIs may be smaller).
- Alpha via `color-mix(in srgb, X 40%, transparent)`, not hex concatenation.

### 5.5 Gotchas we actually hit (check these first when something looks wrong)

- **CSS 3D stacks (`preserve-3d` + many `translateZ` layers) can drop layers
  in headless Chrome** — the CONNECT button lost its top face and label. Fake
  3D instead: a top ellipse + an offset darker band underneath.
- **SVG gradient on a perfectly horizontal/vertical `<line>` is invisible**
  (zero-height bounding box). Use `gradientUnits="userSpaceOnUse"` with real
  coordinates, and define `<defs>` before use.
- Gradient text needs `backgroundClip: "text"` **and** `color: "transparent"`.
- Canvas drawing must happen synchronously in `useLayoutEffect` keyed on the
  frame; size the canvas at the real output resolution and CSS-size it to
  1920×1080 so it stays sharp at 4K.
- Fonts must be self-hosted + `loadFont()`ed or stills render in fallback fonts.
- Big blur/filters at 4K are slow; keep them small or pre-render textures as
  PNG (e.g. `scripts/polymate/generate_paper_texture.py`).

## 6. Sound (only if the user wants it)

`scripts/<brand>/generate_audio.py` (see `scripts/polymate/generate_golden_audio.py`):

1. Read the same timeline JSON. `fps`, `durationInFrames` → exact sample
   count, so audio length always equals video length.
2. Synthesise everything with numpy/scipy (no samples → no licensing):
   - music: kick / clap / hats / sub bass / plucky arp / pads on a BPM grid
     matching the reference tempo; break before the finale, impact on the drop;
   - SaaS SFX: `pop` (pitch-dropping sine), `click` (2.6 kHz blip), `whoosh`
     (filtered noise with a sine envelope), `riser` (sweeping noise ending on
     the next cut), `impact` (sub sweep + noise crash), `success` (rising
     4-note arpeggio), `bell` (inharmonic partials), `ticks` for counters.
3. Place each SFX at `at / fps` seconds; normalise music and SFX separately,
   soft-limit (`tanh`), peak ≈ −1.2 dBFS, short fade-out.
4. Write `public/<brand>/audio/{music,sfx,mix}.wav` (48 kHz stereo) and
   reference `mix.wav` from the composition.
5. Use `lru_cache` for repeated notes and block-wise filters for time-varying
   cutoffs, or generation gets slow.

You cannot listen; verify with `volumedetect` (`scripts/tools/verify-render.sh`)
and tell the user the mix is unheard.

## 7. QA loop (never skip)

```bash
npm run lint                                            # eslint + tsc
npx remotion still <Id> out/f.png --frame=120 --scale=0.5   # single frames while building
npx remotion render <Id> out/draft.mp4 --muted          # quick full draft (1080p30 ≈ 1 min)
scripts/tools/contact-sheet.sh out/draft.mp4 out/sheet.jpg 5 14 24 33 50 80 92 115 150 175 198 210 235 260 272 295
```

Open the sheet and check **every scene**: text clipped or overlapping? element
missing? contrast too low? safe margins kept? fonts right? transition frames
clean? Fix, re-render only the frames you changed (`remotion still`), then
re-check. Repeat until clean.

## 8. Export and deliver

```bash
npx remotion render <Id> deliverables/<name>.mp4 --crf=16 [--muted]
scripts/tools/verify-render.sh deliverables/<name>.mp4   # size, fps, frames, duration, loudness
```

- 1080p30 10 s ≈ 1–2 MB… 6 MB; 4K60 30 s at crf 18 can exceed 250 MB.
  **GitHub rejects files > 100 MB** — re-encode a delivery copy:
  `ffmpeg -i in.mp4 -c:v libx264 -preset slow -b:v 18M -maxrate 24M -bufsize 36M -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 256k out.mp4`
- Commit source + deliverable with a clear message, push to the working branch.
- Bundles for the user: build in `out/` (git-ignored), `zip -0 -r` (MP4s don't
  compress). Never `rm` with globs after `cd`; copy with absolute paths.
- Report back briefly: what was made, format verified, what is placeholder
  data, what wasn't checked (e.g. audio unheard), and the one-line way to
  change it.

## 9. Time estimates to give the user

| Job | Build | Render |
| --- | --- | --- |
| 10 s text interstitial, 1080p30 | 10–15 min | < 1 min |
| 10 s multi-scene promo, 1080p30 | 15–25 min | 1–2 min |
| 30 s cinematic, 4K60, procedural | 1–2 h | 15–25 min |

## 10. Checklist (copy into your reply's head before starting)

- [ ] spec written (length, size, fps, audio, copy, claims, assets)
- [ ] reference broken into a beat table (if given)
- [ ] brand tokens sampled, fonts self-hosted, logo exact
- [ ] timeline JSON with absolute cues
- [ ] one component per beat, frame-driven only
- [ ] audio generated from the same JSON (or `--muted`)
- [ ] lint passes; contact sheet reviewed; fixes re-checked
- [ ] final render verified with ffprobe; committed; pushed; user told what's placeholder
