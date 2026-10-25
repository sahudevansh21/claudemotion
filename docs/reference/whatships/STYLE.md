# House style lock: whatships references (active until the user renews it)

Set by the user on 2026-10-25: "I'll need videos like these only, no other animations, until it is renewed."

Every new video recreates one of these five films. Each film's shot-by-shot breakdown is in `ANALYSIS.md`, and contact sheets are in `sheets/`.

| Key | Reference | Use it for |
| --- | --- | --- |
| `krea` | Krea 3: "A new frontier for image editing" | AI or model products with benchmarks, leaderboards and before/after edits |
| `notion` | Notion AI: "Your agents. Now doing more for less." | Agents, workflows, integrations, plans/pricing |
| `conqueror` | Conqueror: SEO agents | Growth or marketing tools, outcome-driven ("Your website is… ranking #1") |
| `acceternity` | Acceternity: "Pages. Every section, done." | Products with a strong website or many UI screens (3D fly-over) |
| `supabase` | Supabase Middleware | Dev tools, APIs, SDKs, CLIs (code and terminal) |

## Allowed motion vocabulary (only these)

- **Type:**
  - letter-by-letter or word-by-word **blur-in** (blur → sharp, small y-offset, expo-out);
  - **text reflow** when a line is added;
  - **word swap** in place;
  - name cycling;
  - type-on with a caret;
  - a hand-drawn **underline or scribble** annotation with an arrow;
  - the ransom-note font-swap title (Krea intro only).
- **Layout:**
  - clean sans-serif (Inter-like), 2–6 words per line, centred or left;
  - white, near-black or one pastel/brand **tinted plate** per section, with plate wipes between sections;
  - corner crop marks around small titles (Conqueror).
- **Product:**
  - UI **rebuilt as clean vectors**: prompt boxes, checklists with timers, leaderboards, slot-roll lists, charts drawing on, code windows with highlight bars and annotation pills, terminals;
  - floating rounded **icon or logo tiles** (orbit, reel, marquee);
  - a big **cursor** with clicks and press-scale, and confirmation pills ("✓ Connected").
- **Camera:**
  - slow push-ins and glides on one big canvas;
  - dolly in or out to reveal;
  - the extreme zoom into an input (Conqueror);
  - a tilted 3D site plane with a spotlight vignette (Acceternity only);
  - 3D-tilted code (Supabase).
- **Transitions:**
  - continuous morphs: text → next text, element → next scene;
  - blur cross-fade;
  - pixel dissolve (Conqueror only);
  - hard cuts only on a beat, and rarely.
- **Device moments:** macOS and iOS notification stacks, a monitor or phone mockup, contribution grids (Conqueror).
- **End card:** the logo alone, centred, with a wordmark slide or type-on, a hold, then black.
- **Audio:**
  - an original score in the reference's genre and BPM (≈80–130), at −14 to −18 LUFS;
  - soft UI clicks, ticks and whooshes;
  - Acceternity-style may be near-silent foley only.

## Not allowed until renewed

Chromatic or scan-line glitch text, pixel-noise fields, neon waves, light-ray bursts, beat-pulse zooms, flash frames, film grain, LUT grades, letterboxing, particle bursts or glyph rain, procedural landscapes or cities, heavy 3D device spins, and any style not listed above. This applies even when such components already exist in this repo.

## Still client-specific

The logo, colours, fonts, copy, UI and data come from the client. The accuracy rules in `docs/PLAYBOOK.md` still apply.
