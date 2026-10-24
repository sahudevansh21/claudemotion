# Oryn films

- `Oryn` — 3840x2160 @ 120 fps, 30 s (3,600 frames), -12.8 LUFS. Hybrid: code-built UI + the supplied screen recording (cropped to the page, 800x480 source upscaled, so it is kept inside framed windows).
- `OrynSite` — 1920x1080 @ 60 fps, 15 s. Fully code-built website walkthrough.
- Reference motion grammar: supplied Tapmac launch film (big blur-in type, tilted device, one-take camera).
- Copy and verdicts are verbatim from the Oryn board data ("Simulated issuer data · Not investment advice").
- Illustrative: the Time Machine slider cycling through verdicts, and the Guard form values.
- Audio: original synthesised 96 BPM track (scripts/oryn/generate_audio.py). No third-party music. Swap a licensed track with:
  `ffmpeg -i film.mp4 -i track.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest out.mp4`
- Fonts: Anton, Space Grotesk, Space Mono (OFL) as lookalikes for the site's type.

## Posts (OrynPosts, 6 stills, 1080x1350 rendered at 2x = 2160x2700, JPEG)
1 Is it safe to act? · 2 The Board · 3 xTSLA divergent · 4 Six verdicts · 5 Time machine · 6 Unknown means not actionable.
All copy is verbatim from the Oryn board data. Illustrative: Time machine slider position (+41.25h is from the site; handle position is decorative).

## Large file
`deliverables/oryn-4k120.mp4` (119 MB) exceeds GitHub's 100 MB limit and is not in git. Re-create it with
`npx remotion render Oryn deliverables/oryn-4k120.mp4 --crf=17` (about 35 min on 4 cores after `python3 scripts/oryn/generate_audio.py`).
