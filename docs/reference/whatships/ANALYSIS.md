# whatships.com reference films: shot-by-shot analysis

The five launch films were supplied by the user on 2026-10-25. whatships.com itself is not reachable from the build environment.

Each film was analysed with 1 fps contact sheets, 5 fps zooms on key transitions, scene-cut detection, EBU R128 loudness, onset-based BPM estimates and log spectrograms. Whisper transcription was not possible because the model download is blocked by the network policy. The spectrograms show music-led beds; any voice is unconfirmed.

**Rule for recreating these:** copy the structure, timing, motion grammar and type treatment shot for shot. Rebuild every element for the client's brand, using its own UI, logos, copy and an original score. Never reuse the reference footage, logos or soundtrack.

---

## Common grammar: what makes these look like "whatships" films

1. **Almost no hard cuts.** Scene detection found 0–8 cuts per film. Shots hand off through continuous motion: text morphs into the next line, a UI element flies to become the next scene, the camera keeps travelling over one giant canvas.
2. **Type is the star.**
   - Big, clean grotesk at 64–110 px on a 1080p canvas, sentence case, centred or left. The look is Inter or SF Pro Display at medium weight with tight tracking.
   - Copy is 2–6 words per card: "A new frontier", "Your agents. Now doing more for less.", "Comes with built-in middleware".
   - Words arrive **per word or per letter with a blur-to-sharp resolve**, often with a slight y-offset or scale. Lines then reflow and shift up as the next line types in, so the layout animates rather than cuts.
3. **One accent move per line:** a hand-drawn underline ("for less."), a scribbled annotation with an arrow ("Frontier-level quality, 90% lower cost"), a highlight pill, or a single word swapped in place ("for Edge Functions → for Vercel Functions → for Bun → for NestJS").
4. **A cursor sells the product.** A big, friendly pointer (blue in Krea, black elsewhere) clicks, drags and hovers. Clicks are confirmed by a pill, a check ("Connected") or a state change.
5. **The UI is rebuilt clean, not screen-recorded.**
   - Flat vector re-creations of the product UI: cards, leaderboards, prompts and terminals, with large readable text.
   - The UI is often shown floating on a tinted plate (light blue, peach, butter, soft grey), never inside a full desktop.
6. **Floating icon constellations.** Partner and model logos orbit or drift around the headline, each in a white rounded tile with a soft shadow, and gently parallax.
7. **Camera = scale and position on a big canvas.** Slow push-ins (1.0 → 1.15), lateral glides, and dolly-outs to reveal a grid. Some films (Acceternity) tilt the whole site plane in 3D, about 25–35° rotateX and −15° rotateZ, and fly over it.
8. **Endings:** the logo alone, centred, on white or black. The wordmark types on or resolves with blur, sometimes over a field (pixel or particle). Then 1–2 s of hold or black.
9. **Pacing:** 25–75 s; a new line or beat every 1.5–3 s; music at 80–130 BPM. Picture events land on beats but never cut on every beat. Loudness is −14 to −18 LUFS, quieter than social trailers.
10. **Colour:** mostly white or near-black canvases with one brand accent. Tinted plates change per section (Notion: blue → peach → butter).

---

## 1. Krea 3: "A new frontier for image editing" (`download_16.mp4`)

**Specs:** 1920×1080, 30 fps, 34.7 s · music ≈121 BPM, sparse intro then a full groove from ≈10–11 s · −14.2 LUFS · white canvas, light grid lines.

| Time | On screen | Motion |
| --- | --- | --- |
| 0.0–2.0 | "Krea 3" built from **mismatched ransom-note letters** (each glyph a different font, colour and 3D object), surrounded by flying product images (phone, helmet, sweater, portraits) and small coloured triangle cursors | Letters drop in one at a time and swap fonts every ~0.1 s, then **all snap to clean Inter "Krea 3"** at 1.4 s; images spiral outward and leave |
| 2.0–2.4 | "Krea 3" blurs out → "A new frontier" blurs in | Blur cross-dissolve of the text, with grid lines fading in behind |
| 2.4–6.0 | "A new frontier" moves up; "for image editing" types in below; a **bar chart** grows from the bottom (outline bars in brand colours, the middle bar filled blue and selected by the cursor with handles); model logos (Meta, Google, Microsoft, others) pop above the bars | Headline reflows up line by line; the chart pans; the cursor drags the blue bar taller |
| 6.0–8.0 | Cursor pill "Krea 3 Fast" grows big, then shrinks to a node; logos float | Scale punch; the camera glides right |
| 8.0–10.0 | "Nano Banana quality": Krea node joined to a "Nano Banana 2" node by a dashed line drawing | Line draws on; the text blurs in letter by letter |
| 10.0–13.0 | "4x faster": scatter chart (Elo vs seconds), a dotted frontier staircase, a Krea dot far left; a green "New frontier" region fills | The camera pushes and pans along the axis; the region wipes up |
| 13.0–16.0 | The "Krea 3 Ultra" pill flies to centre, becomes a card, then a **leaderboard list** with rows ranked | Pill → card morph; list slides in |
| 16.0–27.0 | "Top 4 in [Arena]" → "Top 4 in [Artificial Analysis]" → "Top 4 in [DesignArena]": same list layout; the logo swaps each time, numbers update, the Krea row is highlighted black with the cursor on it | Logo swap in place; rows reshuffle and numbers roll; product images float behind, blurred |
| 27.0–30.0 | "Frontier quality" over a field of drifting product cutouts | Heavy motion blur in, then the type sharpens |
| 30.0–33.0 | "with precise edits": objects with selection boxes and labels (Lamp, Chair, Vase) are edited, then swap to new versions | Boxes draw, then objects swap with a pop |
| 33.0–34.7 | Krea logomark tiny, centred on white → black | Fade |

**Rebuild notes:** per-letter font-swap intro (`FontSwapTitle`), chart with draggable bar, leaderboard with a logo-swap header, selection-box edit demo.

---

## 2. Notion AI: "Your agents. Now doing more for less." (`download_17.mp4`)

**Specs:** 1920×1080, 24 fps, 51.5 s · ≈110 BPM.
- **Sound:** soft pluck/click rhythm 0–17 s; a dead-silent beat at ≈17 s; **808 slides** 18–31 s; a four-on-the-floor groove 31–49 s.
- **Loudness and look:** −17.9 LUFS · white canvas with section plates in pastel blue, peach and butter.

| Time | On screen | Motion |
| --- | --- | --- |
| 0–3 | "Your agents." then "Now doing more for less." with a **hand-drawn underline under "less."**. Notion-style icons (folder, cube, terminal, face sketch, checkbox, sunburst) float around in a ring | Each word types in by word with a quick blur; icons drift slowly, never static |
| 3–5 | "Bigger tasks, handled efficiently." | The previous text clears; the new line types in by word |
| 5–7 | A light-blue plate slides in; a prompt box "Design programs to win customers in new markets." is typed with a blue send button | Plate wipes in from below; typing at ~25 chars/s |
| 7–12 | The prompt becomes a chat bubble; a "Working for 16s / 33s / 49s" timer and a growing checklist (Analyzing Marketing Plans, Researching customer needs, Opening computer, Using browser, Running marketing analysis, Creating acquisition ads and budget, Creating GTM Market Campaign Hub) with app icons | Rows append one by one with a fade and slide-up; the timer counts |
| 12–15 | Zoom out to a phone-sized panel on blue: a result message and an attached "GTMMarketBudget.xlsx" card | Dolly out |
| 15–18 | "[Auto] picks the model. You save." Then a **scribble annotation with an arrow**: "FRONTIER-LEVEL QUALITY, 90% LOWER COST" | "Auto" pill first, words after; the scribble writes on |
| 18–31 | Peach plate: prompt "Migrate my team's task tracking systems into Notion." → "Planning" → a vertical **model list** (Gemini 3.7 Flash, GPT-6 Sol, GPT-6.1 Sol, GPT-6 Luna, GPT-5.6 Terra, Grok 4.5/4.6, Opus 5.5, Haiku 5.5, Sonnet 4.6) scrolling like a slot machine; the label switches "Thinking → Switching" | Zoom into the list; the slot-roll scroll is synced to the 808 slides |
| 31–35 | "Use AI plans you already pay for." → a horizontal **marquee of AI provider logos** → a "Connect ChatGPT Plan" button with a big cursor click | Logos scroll left; click with a press-scale |
| 35–37 | "✓ Connected" → "✓ Connected subscription" | Text extends in place |
| 37–40 | "One place to track everything." | Word reveal |
| 40–46 | Butter plate: the Notion AI usage dashboard, with line chart and bar chart animating up | Charts draw on; slight push-in |
| 46–48 | Rapid feature cards: "Long-running tasks" → "Auto model router" → "Notion MCP" | One per ~0.7 s, hard text swaps on beats |
| 48–51 | Notion logo → "Notion" wordmark, then black | Logo pops; the wordmark slides out from behind it |

**Rebuild notes:** `WordType` with blur per word, `Scribble` (SVG stroke write-on), `SlotList` (vertical roll with fading edges), `LogoMarquee`, `PlateWipe`, `AgentChecklist` with timer.

---

## 3. Conqueror: "Agents for SEO" (`download_18.mp4`)

**Specs:** 1920×1080, 25 fps, 38.3 s · ≈129 BPM electronic, with a drop/break at ≈13.4 s · −18.7 LUFS.
**Look:** coral/terracotta brand colour (#D9614A-ish), a halftone/dither texture over desert landscape photos, and a white canvas for the product.

| Time | On screen | Motion |
| --- | --- | --- |
| 0–3.3 | "Introducing [icon] Claude for SEO" → "Grok Bot for SEO" → "Codex for SEO" → "OpenClaw for SEO" → "Hermes for SEO". Small text centred with **corner crop marks**, over a soft blurred gradient blob (red/blue/white) | The product name and icon swap every ~0.6 s; the blob morphs |
| 3.3–4.0 | **Pixel-dissolve transition**: the blob breaks into blocky pixels and reveals a coral halftone landscape with a huge "Conqueror" wordmark | Blocky pixel wipe |
| 4.0–6.6 | "Just enter your website" + a frosted input over "Conqueror"; "higgsfield.ai" types; the camera **zooms extremely close** into the input, so the typed text fills the screen with a blinking caret | Extreme push-in, then pull back |
| 6.6–7.0 | White canvas: "{ Your website }" with ← → arrows | Hard cut on the beat |
| 7–13 | "Your website is… ranking #1 / booking demos / getting cited by AI / building authority", with a small UI vignette above each (Google result, Calendly, AI answer, "Domain Rating 23 → 89" ring) | Each ending swaps in place; vignettes pop above; the ring counter rolls |
| 13–19 | An Apple-style monitor shows a keyword table; columns fill with coloured status chips | The camera glides down the screen, then into it |
| 19–23 | Coral plate: "Agents are working" → a "Keyword rankings" card where rows get "Researching / Writing / Updating / Finding" status pills → "Ranked #1" → "Ranked #1 for 317 new keywords" | Rows fill in sequence; the card scales |
| 23–27 | A desktop at night with a lofi pixel-art wallpaper; macOS notifications stack (Calendly "42 new demos booked", DataFast "Huge traffic spike", Vercel "Your deployment is growing!") | Notifications slide in from the top right, about 1 per beat |
| 27–31 | iPhone close-up: Stripe "You received a payment of $250.00" notifications stacking | The phone glides in; the stack grows |
| 31–34 | "Your coding looks like this" (green contribution grid) / "now your SEO looks like this" (coral grid) | Grids fill cell by cell |
| 34–38 | Black: coin-style logo + "conquerorapp.com" types on | Type-on with caret |

**Rebuild notes:** `NameCycler`, `PixelDissolve`, halftone shader (SVG pattern or CSS mask), `ExtremeZoomInput`, `PhraseSwap` ("Your website is…"), `NotificationStack` (macOS and iOS), `ContributionGrid`.

---

## 4. Acceternity: "Pages. Every section, done." (`download_19.mp4`)

**Specs:** 1920×1080, 60 fps, 75.6 s.
- **Sound:** almost silent, −44.8 LUFS, 79% silence. Only soft whooshes and ticks on moves, and no music, so it is meant to be scored by the user or watched muted.
- **Look:** pure black, with a **spotlight/vignette** that only lights the area under the camera.

| Time | On screen | Motion |
| --- | --- | --- |
| 0–9 | Many landing-page sections (research-assistant site, pricing, FAQs, notes, "At home on every screen", testimonials, curved photo carousel) laid out on a **huge tilted plane** | A continuous 3D fly-over: rotateX ≈ 30°, rotateZ ≈ −12°. The camera glides across sections every ~0.8 s; a dark vignette hides everything outside the focus |
| 9–13 | "Ready to serve your first model?" hero; a node diagram with a blue square node and wires | Settles, then pushes in on the diagram |
| 13–19 | Chat/inbox section, rows highlighting | Slow lateral pan |
| 19–25 | "Made by people who used to take the notes." with a **curved fanned carousel** of photo cards | Cards rotate along the arc |
| 25–30 | "Wire up an endpoint in a minute": a node graph with **glowing coloured bezier wires** (orange, pink, purple, blue) | Wires pulse with travelling light |
| 30–35 | A mountain-photo hero with a floating stats card ("48 ms", "64") | Push-in; the numbers roll |
| 35–41 | "Run any model, close to every user" full hero page, nearly flat (tilt eases to ~5°) | The camera rises from the page bottom to the hero |
| 41–52 | Detail moves: a segmented control (Summary / Ask / Search), a search answer, the blue node with wires, a "Connect all" button | Each element is shot extremely close with shallow depth (blurred edges) |
| 52–65 | Model selector list (mistral-large-2, others), batch-job progress bars, a response streaming | Close tilted macro shots |
| 65–68 | A "p50 latency 84 ms" card lit by a **white spotlight** with a sparkline | The light sweeps across |
| 68–72 | "Pages." → "Pages. Every section, done." small, centred, grey on black | The second phrase fades in to the right |
| 72–75.6 | Acceternity logo + wordmark, then black | Fade |

**Rebuild notes:** one big `SitePlane` (screenshots of the client's site laid out in a grid), a `CameraPath` of keyframes (x, y, z, rotX, rotZ) with smooth splines, a radial `Spotlight` mask, `GlowWires`, `ArcCarousel`. Easy to rebuild with real site captures, and it suits a client with many polished pages.

---

## 5. Supabase Middleware (`download_20.mp4`)

**Specs:** 1280×720, 60 fps, 25.2 s · ≈80 BPM (or 160 half-time) chilled electronic, with a final ringing chord at ≈23 s · −14.2 LUFS.
**Look:** near-black #121212, white type, Supabase green accent, mono code.

| Time | On screen | Motion |
| --- | --- | --- |
| 0–1 | "Introducing" | Letter-by-letter blur-up reveal, about 35 ms per letter |
| 1–2.2 | "Introducing" shrinks and moves up; "Supabase Middleware" resolves below | Scale/position morph |
| 2.2–4 | Title splits into 2 lines and slides left; a code editor window slides in from the right; lines `withCors`, `withRequiredClaims`, `withSupabaseClient` get a green highlight | Blur slide; highlight bar sweeps |
| 4–8 | "Add per-request logic for [Edge Functions → Vercel Functions → Bun → NestJS]" with a **vertical icon carousel** on the right (one active icon, neighbours faded) | Only the last word swaps (blur out/in) while the icon reel rolls one step |
| 8–10 | "…for all of them": every icon flies out into a scattered constellation around the text | Burst-out with parallax |
| 10–13 | "Comes with built-in middleware": a 3×3 grid of middleware cards fills, then a few highlight green | Cards stagger in |
| 13–16 | The code editor in 3D perspective (tilted ~20°) with green inline annotation pills ("CORS headers", "ctx.jwtClaims", "ctx.supabase") | The camera dollies across the tilted code |
| 16–18 | "Or define your own" | Word reveal |
| 18–21 | Editor: `defineMiddleware(...)` types on, line by line | Typing with caret |
| 21–23 | Terminal: `$ npm install @supabase/middleware` types | Type-on |
| 23–25 | "Try it today" above the terminal | Fade/settle; the music resolves |

**Rebuild notes:** `LetterBlurIn`, `TitleMorph`, `WordSwap` + `IconReel`, `CodeWindow` with highlight bars and annotation pills, `TerminalType`. This is the cleanest template for any dev-tool or API launch.

---

## Mapping to reusable Remotion building blocks (to build next)

| Block | Used by | Notes |
| --- | --- | --- |
| `LetterBlurIn` / `WordBlurIn` | all | per-glyph blur 12→0 px, y 12→0, opacity 0→1, 25–40 ms stagger, expo-out |
| `TextReflow` | Notion, Supabase, Krea | lines animate position when a new line is added (FLIP-style interpolate) |
| `WordSwap` | Supabase, Conqueror, Krea | swaps the last phrase in place with a blur cross-fade; width animates |
| `Scribble` / `Underline` | Notion | SVG path write-on, slightly wobbly hand stroke |
| `Cursor` + `ClickPulse` | Krea, Notion | big pointer, eased bezier paths, press-scale |
| `IconOrbit` / `IconReel` / `LogoMarquee` | Notion, Supabase, Krea | white rounded tiles, soft shadow, drift |
| `Plate` (tinted section bg) | Notion, Conqueror | wipe in/out between sections |
| `Leaderboard` / `SlotList` | Krea, Notion | rows roll, highlight row black or brand |
| `CodeWindow` + `TerminalType` | Supabase | mono, highlight sweep, annotation pills |
| `SitePlane` + `CameraPath` + `Spotlight` | Acceternity | one 3D plane of site captures |
| `PixelDissolve`, `Halftone`, `NotificationStack`, `ContributionGrid` | Conqueror | |
| `LogoEnd` | all | centred mark, wordmark slide/type, hold, black |

Audio templates:
- **Krea / Conqueror:** upbeat electronic, 120–130 BPM, with the drop on the first product reveal.
- **Notion:** plucks → silence → 808 slides → groove, ≈110 BPM.
- **Supabase:** chill, 80 BPM, resolving chord.
- **Acceternity:** silent with whoosh/tick foley only.
