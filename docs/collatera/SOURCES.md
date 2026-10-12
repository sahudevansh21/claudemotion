# COLLATERA film: sources, accuracy notes and production notes

## Sources

- **Product scope and copy:** the client brief, treated as authoritative. COLLATERA is a read-only collateral risk monitoring platform for supported DeFi loans backed by tokenized stocks and ETFs, starting with a demo vault modelled on Algorand lending markets.
- **Website screenshot (supplied):**
  - nav: MONITOR / ROADMAP / TOKEN ROLE / OPEN DEMO;
  - label: "COLLATERAL RISK MONITORING / 001";
  - headline: "CATCH STALE ORACLES / BEFORE / THEY CATCH YOU.";
  - CTAs: "MONITOR A POSITION", "SEE WHAT WE WATCH";
  - layout, dotted grid, bordered panels with offset shadow.
- **Logo and banner (supplied):** the mascot was decoded cell by cell from the 400 px logo, using a 24.75 px grid (12 × 11 cells). It is rendered from that matrix, so the silhouette, crown pixels, eye notch and mouth slit are exact.
- **Public web check (2026-10-12):** no reachable COLLATERA website or X account was found (`collatera.app/.io/.xyz` were unreachable, and `@collatera` on X is an unrelated person). Nothing from the open web is used; every claim comes from the brief.

## Accuracy safeguards

- **No statistics:** no performance figures, integrations, customers or live metrics.
- **Illustrative data, labelled:** every number on screen is demo data and says so ("ILLUSTRATIVE · NO REAL DATA", "ILLUSTRATIVE DEMO DATA").
  - The feed age counter runs 30× fast so staleness is visible within 3 s.
  - The −20% price drop is a user-chosen stress scenario, not a forecast.
- **Read-only and human decisions:** stated repeatedly. "READ-ONLY" chips; "PREVIEW ONLY · NO TRANSACTION IS SENT · YOU DECIDE"; "SEE IT. UNDERSTAND IT. DECIDE."; "MONITORING FIRST. AUTOMATION LATER."
- **No protection claims:** the film never claims liquidation prevention, guaranteed protection, automatic repayment or custody of funds.
- **Overnight-gap copy is generic:** "Prices can gap between market close and the next open."

## Reference mapping (supplied demo reel → COLLATERA)

| Reference technique | Where |
| --- | --- |
| Mono pixel text typing on, with a block cursor | COLLATERA name, closing lines, principle card |
| Flat colour text card (orange in the reference) | Lime "SEE IT. UNDERSTAND IT. DECIDE." card |
| Sideways push between shots | Scene 1 → 2, Scene 3 → 4, card → closing |
| Deep zoom into UI, camera pans between regions, zoom out to the whole | Scene 3 dashboard (panel 01 → 02 → 03 → full view) |
| Cursor that points, drags and clicks | Dashboard hover, stress-test slider drag, repayment toggle click |
| Feed items stacking and scrolling up | Oracle price feed (Scene 2) |
| Highlight sweep over text | Hard lime block wipe revealing each headline word |

## Structure (1920×1080, 60 fps, 1,800 frames = 30.000 s)

| Time | Scene |
| --- | --- |
| 00:00–00:05 | Signal: grid emerges, signal pixels, mascot assembles pixel by pixel, name, label |
| 00:05–00:11 | Problem: headline in three beats; the oracle feed stops updating and goes STALE |
| 00:11–00:18 | Capabilities: 01 Buffer, 02 Price freshness, 03 Closed-market liquidity risk |
| 00:18–00:24 | Workflow: Monitor → Stress test → Get alerts → Preview repayment; scenario; principle card |
| 00:24–00:30 | Closing: mascot with monitoring frame; "MONITORING FIRST. AUTOMATION LATER."; lock-up; "READ-ONLY RISK MONITORING"; "STARTING ON ALGORAND · DEMO V1" |

## Audio

`scripts/collatera/generate_audio.py` uses numpy/scipy only and no samples. It reads `src/compositions/Collatera/timeline.json`, the same file that sets every scene boundary and cue, at 60 fps.
- **Music:** understated 120 BPM A minor. Sub pulse, off-beat ticks, a filtered square arpeggio and bass in scenes 3–4, and pads. The bed stops under the closing tone and fades to digital silence.
- **Effects:** pixel clicks, typing ticks, whooshes, low tonal accents, monitoring pulses, a two-tone warning, panel impacts, a rise for the buffer fill, a fall for the stress drag, and the closing tone.
- **Master:** music ducked under the effects, limited at a −1 dBFS ceiling. The final MP4 measures −16.8 LUFS integrated with a −2.2 dBFS peak.

## Fonts

Silkscreen (SIL OFL), self-hosted in `public/collatera/fonts`. It is the closest open match to the site's pixel display and nav type. JetBrains Mono is used for small captions.
