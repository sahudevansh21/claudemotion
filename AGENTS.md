# AGENTS.md — working in this Remotion project

This repo makes videos with **Remotion 4.0.533** (React → MP4). Every frame is
a React render of a pure function of the frame number. Read this file before
creating or editing a video.

The official **Remotion Agent Skills** are installed in `.agents/skills/`
(symlinked into `.claude/skills/`). Start from
`.agents/skills/remotion-best-practices/SKILL.md`; it routes to topic files
such as `remotion-markup/transitions.md`, `audio.md`, `sequencing.md`,
`text-highlights.md`, `voiceover.md`, `captions`. Prefer them over memory
when an API detail matters. Live docs: https://www.remotion.dev/docs

## Commands

| Task | Command |
| --- | --- |
| Install deps | `npm i` |
| Open Studio (preview, live reload, props editor, render UI) | `npm run dev` → http://localhost:3000 |
| Open a specific composition | http://localhost:3000/Showcase |
| New composition from template | `npm run new -- ProductLaunch` |
| Render the sample to MP4 | `npm run render` → `out/showcase.mp4` |
| Render any composition | `npx remotion render <Id> out/<Id>.mp4` |
| Render one frame (fast visual check) | `npx remotion still <Id> out/check.png --frame=60` |
| List compositions + format/duration | `npx remotion compositions` |
| Lint + typecheck | `npm run lint` |
| Check package versions are aligned | `npx remotion versions` |
| Upgrade Remotion (+ skills) | `npm run upgrade` / `npx remotion skills update` |

Add Remotion packages with `npx remotion add <pkg>` (pins the matching version).
All `@remotion/*` packages and `remotion` **must be the exact same version**.

## Layout

```
src/
  index.ts                 registerRoot() — entry point (don't change)
  Root.tsx                 registers every <Composition> (Studio sidebar = this file)
  config/
    video.ts               VIDEO {width,height,fps} defaults + DESIGN canvas (1920x1080)
    theme.ts               COLORS, TYPE scale, FONTS (self-hosted via @remotion/fonts)
  lib/
    timing.ts              seconds(), stagger(), framesPerBeat(), beatAt()
    animation.ts           springIn(), progress(), fadeOut(), enterUp(), mix(), SPRINGS, EASE, CLAMP
  components/
    Stage.tsx              1920x1080 design canvas scaled to any output size
    Background.tsx         animated gradient blobs + grid + vignette
    AnimatedText.tsx       kinetic typography (per word / per char stagger)
    Beat.tsx               <BeatProvider bpm> + useBeat() for music-synced motion
  compositions/
    Showcase/              sample: Showcase.tsx, schema.ts (zod props), timing.ts, scenes/*
    Polymate/              20 s brand film: timeline.json (cuts + SFX cues), brand.ts, scenes/*
    _Template/Template.tsx copied by `npm run new`
public/                    static assets → reference with staticFile("path")
  audio/beat-120bpm.mp3    generated 120 BPM loop (royalty-free)
  fonts/*.woff2            Inter + JetBrains Mono (OFL)
scripts/new-composition.mjs
scripts/polymate/generate_audio.py   Python music+SFX generator (reads Polymate/timeline.json)
out/                       render output (git-ignored)
```

## Golden rules (renders break or flicker if you ignore these)

1. **Animate only from the frame.** Derive every moving value from
   `useCurrentFrame()` via `interpolate()` / `spring()` (or the helpers in
   `src/lib/animation.ts`). Never use CSS `transition`, CSS `@keyframes`,
   `setTimeout`, `setInterval`, `requestAnimationFrame`, `Date.now()` or
   `Math.random()` — use `random("seed")` from `remotion` for randomness.
2. **Author time in seconds**, convert with `seconds(s, fps)` using `fps` from
   `useVideoConfig()`. Never hard-code frame counts that assume 30 fps.
3. `useCurrentFrame()` inside a `<Sequence>` / `<TransitionSeries.Sequence>` is
   **relative to that sequence** (starts at 0). Use that for scene-local
   animation; use `useBeat()` for anything that must line up with the music.
4. Clamp interpolations: `interpolate(f, [a, b], [x, y], CLAMP)`.
5. Assets go in `public/` and are referenced with `staticFile("audio/x.mp3")`.
   Use `<Img>` (from `remotion`), `<Video>`/`<Audio>` (from `@remotion/media`),
   never raw `<img>`/`<video>`/`<audio>` — Remotion's versions wait for loading.
6. Put each scene inside `<Stage>` and lay it out in 1920x1080 design pixels;
   keep text ≥80px from the sides and ≥100px from top/bottom. Minimum sizes:
   headline 84px, supporting text 44px (see `TYPE` in `theme.ts`).
7. Set `premountFor={fps}` on every `<Sequence>` / `<TransitionSeries.Sequence>`.
8. Keep the composition's `defaultProps` in `Root.tsx` an **inline object
   literal** so Studio can save sidebar edits back to the code.

## Recipes

### Create a new video

1. `npm run new -- MyVideo` → creates `src/compositions/MyVideo/MyVideo.tsx`,
   registers `<Composition id="MyVideo">` in `src/Root.tsx`.
2. Set its length: `MY_VIDEO_SECONDS` in that file.
3. For several scenes, mirror `compositions/Showcase/`: one file per scene in
   `scenes/`, scene lengths in seconds in `timing.ts`, and a
   `<TransitionSeries>` with a named `<TransitionSeries.Sequence>` per scene.
4. If the video needs editable inputs, add a zod `schema.ts` (see Showcase) and
   pass `schema` + inline `defaultProps` to the `<Composition>`.
5. Preview in Studio, then verify with `npm run lint` and a few `remotion still`
   frames before rendering.

### Scenes and transitions

```tsx
<TransitionSeries>
  <TransitionSeries.Sequence name="Intro" durationInFrames={seconds(3, fps)} premountFor={fps}>
    <IntroScene />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}                       // also slide(), wipe(), flip(), clockWipe(), iris()...
    timing={linearTiming({ durationInFrames: seconds(0.6, fps) })}
  />
  <TransitionSeries.Sequence name="Next" durationInFrames={seconds(4, fps)} premountFor={fps}>
    <NextScene />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

Each transition **overlaps** the two scenes, so total length =
sum(scenes) − sum(transitions). Showcase computes this in
`showcaseDurationInFrames()` and returns it from `calculateMetadata` — keep a
function like that whenever durations change, so the composition never ends
early or holds on a blank frame. Use `<Series>` for hard cuts and
`<Sequence from={…}>` for overlapping layers within a scene.

### Typography

```tsx
<AnimatedText text="Hello world" by="word" delay={seconds(0.3, fps)} step={4} />
<AnimatedText text="LOGO" by="char" step={2} config={SPRINGS.snappy} distance={80} />
```

For one-off elements: `const t = springIn(frame, fps, { delay: 10 });` then
`style={enterUp(t)}` (fade + rise + de-blur), or `transform: scale(${t})`.
Fonts: use `FONTS.sans` / `FONTS.mono`; to add a font, drop a `.woff2` into
`public/fonts/` and add a `loadFont()` call in `src/config/theme.ts`.

### Graphics

- Shapes: `@remotion/shapes` — `<Circle>`, `<Rect>`, `<Triangle>`, `<Star>`,
  `<Pie progress={t}>`, `<Polygon>`, `<Heart>`, `<Arrow>`… (see `ShapesScene`).
- Plain `<div>`s / inline `<svg>` animated with transforms work too.
- Colours come from `COLORS` in `theme.ts`; use `color-mix()` for alpha
  instead of string-concatenating hex digits.

### Audio and beat sync

```tsx
<BeatProvider bpm={120}>                  {/* at composition root */}
  <AbsoluteFill>…scenes…</AbsoluteFill>
  <Audio src={staticFile("audio/beat-120bpm.mp3")} volume={(f) => …} />
</BeatProvider>

const { beat, progress, pulse } = useBeat();  // in any nested component
style={{ transform: `scale(${1 + 0.1 * pulse})` }}
```

- `pulse` is 1 exactly on each beat and decays — ideal for kicks/flashes.
- `bpm` must match the track; use `offsetSeconds` if beat 1 isn't at 0 s.
- Place `<Audio>` inside a `<Sequence from={…}>` to start it later; use
  `trimBefore` / `trimAfter` (frames) to cut it; `volume` accepts a function
  of the audio-relative frame for fades.
- For voiceover / SFX / captions / waveform visualisation, read
  `.agents/skills/remotion-markup/{voiceover,sfx,audio-visualization}.md`
  and `.agents/skills/remotion-captions/`.
- To derive duration from an audio file, use `calculateMetadata` (see
  `.agents/skills/remotion-markup/calculate-metadata.md`).

### Change resolution / fps / duration

- Showcase: edit `width`/`height`/`fps` in its `defaultProps` in `Root.tsx`
  (or in the Studio sidebar), scene lengths in
  `compositions/Showcase/timing.ts`. Per render, without code changes:
  `npx remotion render Showcase out/v.mp4 --props='{"width":1080,"height":1920,"fps":60}'`.
- Other compositions: `VIDEO` in `src/config/video.ts`, length constant in
  the composition file.
- Because layouts use `<Stage>` and timing uses seconds, these changes never
  require touching scene code.

### Preview

`npm run dev`, open http://localhost:3000/<CompositionId>. Space plays/pauses,
←/→ step frames. Props declared with a schema are editable in the right
sidebar. Agents without a browser: `npx remotion still <Id> out/f.png --frame=N`
and inspect the image.

### Render

```bash
npm run render                                         # Showcase → out/showcase.mp4
npx remotion render MyVideo out/my-video.mp4           # H.264 MP4 by default
npx remotion render MyVideo out/my-video.mp4 --crf=18  # higher quality
npx remotion render MyVideo out/clip.mp4 --frames=0-89 # first 3 s at 30 fps
npx remotion render MyVideo out/my-video.mov --codec=prores --prores-profile=4444  # alpha
```

Render settings live in `remotion.config.ts` (rspack bundler, JPEG frames,
overwrite on). Only render when the user asks for an export; otherwise show
the Studio preview.

## Definition of done for a video change

1. `npm run lint` passes (ESLint with Remotion rules + `tsc`).
2. `npx remotion versions` reports all packages aligned.
3. `npx remotion still` frames from each scene look right (no overflow,
   nothing clipped by the safe area, fonts loaded).
4. If asked for an export: `npx remotion render …` completes and
   `ffprobe out/<file>.mp4` shows the expected size, fps and duration.
