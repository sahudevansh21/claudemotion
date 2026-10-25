---
name: brand-film
description: Make a premium motion-graphics brand film, launch video or set of social stills for a client product in this Remotion repo — from a reference video, logo, banner, website or screen recording. Use for any "make a video like this reference for <brand>" or "make N posts/images for <brand>" request.
---

# Brand film workflow

> **House style lock:** all videos must recreate the five whatships reference
> films (`docs/reference/whatships/ANALYSIS.md` + `STYLE.md`). Use only that
> motion vocabulary, and no other animation styles, until the user renews the
> reference set. See AGENTS.md "Reference videos".

Follow `docs/PLAYBOOK.md` (full method, commands, recipes, pitfalls). In short:

1. **Analyse the reference** second by second: ffprobe, 1 fps timestamped
   contact sheet, scene-cut detection, full-res key frames, ebur128 loudness,
   spectrogram, faster-whisper transcript (VO lines + timings). Choose which
   of the 5 locked whatships references the film follows.
2. **Extract the brand**: palette, OFL lookalike fonts (`npm pack @fontsource/<font>`),
   logo cut-out (never alter an "exact" logo), site copy (`curl` + strip tags),
   real UI via `scripts/*/capture_site.mjs` (Playwright, 2×).
3. **Map reference shot → brand shot** in a table, then encode it in a timeline
   JSON (fps, durationInFrames, shots with start/end/cues/sfx; VO in vo.json).
4. **Build** `src/compositions/<Brand>/`: one component per shot inside
   `<Stage>`, animate only from the frame, reuse effects listed in the playbook.
   Register in `src/Root.tsx`.
5. **Audio**: copy the closest `scripts/*/generate_audio.py`; music + SFX from
   the same timeline, duck + soft-limit; Kokoro VO if requested.
6. **QA**: `npm run lint`, `remotion still --scale=0.5` across shots → contact
   sheet → fix → repeat.
7. **Render + verify**: `npx remotion render`, ffprobe (size/fps/frames),
   ebur128, whisper re-check for VO films, final contact sheet.
8. **Deliver**: `deliverables/`, `docs/<brand>/NOTES.md`, commit + push, send
   the file; report spec, shot table, illustrative vs real data, what to check.

Never invent metrics or claims; label mock data "Illustrative"; show upcoming
features as "Coming soon".
