# NightshiftLaunch — remake of the supplied launch film (39.4 s, 1080p30)

Composition `NightshiftLaunch` (`src/compositions/Nightshift/NightshiftLaunch.tsx`,
`launch/Launch.tsx`). Timing: `launch/launch.json` (scenes, word timings,
captions, SFX) + `launch/vo.json` (voiceover placement).

## Reference analysis (download_9.mp4, "agentplay by Entelligence", 39.36 s)

Transcribed with faster-whisper; scene structure from frame analysis:

| Ref time | Reference | Nightshift |
| --- | --- | --- |
| 0–3.3 | dark code field, words blur in, green keywords: "The future of coding isn't just the code." | market-glyph field: "The future of markets isn't just the opening bell." |
| 3.3–3.8 | green particle cluster, cut to white | same |
| 3.8–7 | floating UI cards (3D tilt) + "It's making sure agents get better at writing it." | oracle feed / stale feed / guardian / Monday gaps / confidence / error-vs-open cards + "It's making sure prices keep moving after it." |
| 7–8.6 | "Fewer repeated failures." waffle chart, red cells, "10 → 0" | "Fewer stale prices." waffle of frozen hours, "engine on" marker, "135 → 0" frozen hours/week (168 h − 32.5 h of NYSE session ≈ 135 h) |
| 8.6–10.8 | "Less wasted time and tokens." ring gauge red→green, stat card | "Smaller Monday gaps." ring red→green, 5.9 bps avg error vs next open, −82% vs frozen close |
| 10.8–13.6 | "Better approaches to the same task." Task → 5 approaches, one selected | "Safer loans on the same collateral." 10 SPY → 5 price sources, Nightshift fair value selected |
| 13.6–19.2 | logo + "At Entelligence, we're opening up a first step toward self-improving coding agents." node graph | "At Nightshift, we're building the after-hours layer for tokenized stocks and ETFs." Oracle at the centre; Vault, Guardian, Cloak, Ledger, Earn, Leaderboard |
| 19.2–21.6 | dark particle burst, "agentplay by Entelligence" — "Meet Agent Play." | burst, NIGHTSHIFT wordmark + nightshift.buzz — "Meet Nightshift." |
| 21.6–33.6 | product screens with captions + cursor: sessions, maps, timelines, explored, failed, retried, final change | live nightshift.buzz screenshots: Fair value for ETF tokens, Every minute all night, Confidence scores, A public API, Borrow on Base, Guardian on watch, Proven by Cloak, Locked on Algorand |
| 33.6–39.4 | dark end: wordmark, `$ uvx agentplay`, "Free · Local · Open source" | wordmark, `$ open nightshift.buzz`, "Live · Proven · On the record", site disclaimer |

## Sources

- Copy, product names and statuses: https://nightshift.buzz/ (home, /app,
  /oracle, /proof, /transparency, /leaderboard), captured with
  `scripts/nightshift/capture_site.mjs` (Playwright, 2×) on the render date.
  Screens in `public/nightshift/site/`.
- 5.9 bps / 82%: supplied by the user (Nightshift copy).
- Example prices on the "Safer loans" beat come from the Oracle page snapshot
  and are labelled as an example.
- Voice: Kokoro TTS (`af_heart`), `scripts/nightshift/generate_launch_vo.py`
  + `launch_vo_script.json`. Music/SFX: `scripts/nightshift/generate_launch_audio.py`.
