# NIGHTSHIFT teaser — notes

30 s motion-graphics teaser, 1920×1080 @ 30 fps (900 frames), 120 BPM.
Composition `Nightshift` (`src/compositions/Nightshift/`). Everything is
code-built: no stock footage, no AI-generated video.

## Reference → Nightshift mapping

The supplied reference (a 45 s "Comfy Agent" teaser) was analysed shot by
shot. Its structure and motion grammar are kept, condensed to 30 s, and every
cut lands on a beat:

| Time | Reference | Nightshift |
| --- | --- | --- |
| 0–2.5 s | logo types on, "AGENT" pill, image card flies in on a "YOU" cursor | N mark snaps together, NIGHTSHIFT types on, "ENGINE" pill, SPY fair-value card flies in on "YOU" |
| 2.5–4.5 s | node canvas, YOU drags the image | YOU drags the card onto the node canvas, camera pans to the prompt box |
| 4.5–7 s | prompt types, send button | the site line "When Wall Street sleeps, the Nightshift engine keeps pricing." types, YOU presses "Start the engine" |
| 7–10 s | AGENT cursor builds nodes + wires | ENGINE cursor builds Overnight futures / World markets / Sentiment → Oracle → SPY fair value |
| 10–12 s | white card "IT MASTERS MODELS…" | "IT PRICES / AFTER THE BELL" |
| 12–15 s | zoom-out wall of outputs | wall of ETF-token and top-stock fair values |
| 15–17 s | prompt / chat beat | Engine state card: Standby → Online (YOU taps) |
| 17–19.5 s | nodes IMAGE TO VIDEO… | Oracle feeds Vault and Guardian (product page) |
| 19.5–21.5 s | white card "IT BUILDS WHILE YOU WORK" | "WALL STREET SLEEPS. / THE ENGINE DOESN'T." |
| 21.5–23.5 s | big-zoom SAMPLER node, cursors trade | big-zoom Oracle node, CONF ring to 78, YOU + ENGINE |
| 23.5–27.5 s | live-action footage + giant type + chip tags | procedural night city (rain, light trails, ticker ring) + "PRICE / LEND / GUARD", "EVERY / MINUTE", chips "NIGHTS / AND / WEEKENDS" |
| 27.5–30 s | "NOW ON" pill + logo | "LIVE ORACLE" pill + mark + wordmark, "Real prices, every minute." + disclaimer |

## Copy and values (accuracy)

All copy and numbers come from the supplied site screenshots: ETF fair values
(SPY $779.36 +0.10% conf 78, QQQ $750.77 −0.07% conf 75, GLD $383.15 −0.37%
conf 72, IBIT $47.14 +1.26% conf 59), top stocks (AAPL, NVDA, MSFT, TSLA with
their fair value, change vs close and conf), "LIVE · NYSE CLOSED · MON 06:36
ET", "Standby / Touch to start", "The city never closes", the product page
(Oracle Live · 6 properties, Vault Testnet-ready · 8, Guardian Testnet-ready ·
6) and the disclaimer "Nightshift doesn't sell tokens. Buy them from a
regulated provider." Sparklines are illustrative. The prompt box and the
cursors are a stylistic device borrowed from the reference, not a product
feature claim.

## Assets

- Fonts (OFL, from @fontsource): Unbounded (display), Michroma (wordmark),
  plus the project's Inter + JetBrains Mono. Licences in `public/nightshift/fonts/`.
- `public/nightshift/img/logo.png`: the supplied logo.
- Audio: `scripts/nightshift/generate_audio.py` synthesises the music
  (D minor, 120 BPM, kick / clap / hats, stabs, gliding sub-bass, a breakdown
  and riser into the city drop) and every SFX from `timeline.json`.

## Rebuild

```bash
python3 scripts/nightshift/generate_audio.py
npx remotion render Nightshift out/nightshift.mp4 --crf=18
```
