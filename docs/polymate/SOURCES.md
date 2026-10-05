# Polymate video: research sources and production notes

## Verified facts (checked 2026-10-05)

| Fact used on screen | Source |
| --- | --- |
| Name "Polymate" / "PolyMate", handle @Polymatedotfun | https://x.com/Polymatedotfun (profile) |
| Tagline "The trading layer for prediction markets" | X profile bio |
| "Building tools to trade the future, fast." (headline shot) | X profile bio |
| Telegram bot "TryOdds Trading Bot", @Tryoddsbot (end-card CTA) | https://t.me/Tryoddsbot |
| Compass motif (EXPLORE shot) | 🧭 in the X bio |
| UI vocabulary: Trade, Markets, Positions, Strategy, Balance, "Live Markets", "Executing Trade…", "Position Opened · YES · $50" | Polymate X banner image (supplied by the user) |
| Logo: lapis gem tile, marble tile, gold laurel, black heavy-italic wordmark on cream | Logo image (supplied by the user) |

## Gaps (stated honestly, not filled in)

- I found **no published user, volume or performance statistics** for Polymate, so the video contains **no metrics**.
- `polymate.fun` did not resolve from the research environment, so the video shows **no website**.
- The markets, odds and the trade ticket are **illustrative UI**, and the video says so on screen ("ILLUSTRATIVE UI", "ILLUSTRATIVE MARKETS", and the end-card footnote). The example questions are generic and neutral.

## Brand system

- Colours sampled from the logo: cream `#F4EFE6`, marble `#FBF9F5`, ink `#141414`, lapis `#2445C4` (light `#3E63E0`, deep `#132A80`), gold `#B48A3C` / `#DDB868`.
- Type: Poppins ExtraBold Italic (closest open match to the wordmark), Instrument Serif (editorial taglines, matching the reference's serif treatment), Inter / JetBrains Mono for UI. All fonts are self-hosted under SIL OFL 1.1.
- The mark is redrawn as vector SVG (`components/PolymateMark.tsx`) because the supplied logo is a 400 px photo.

## Reference-style mapping

| Reference technique | Polymate shot |
| --- | --- |
| Logo mark assembling from spinning fragments on a solid field | 1 Mark (laurel leaves spin in) |
| Glyph built from binary characters | 2 "P" built from odds characters |
| App-icon tile with the icon spinning on Y | 3 Tile |
| Serif text resolving grey → black | 4 Wordmark + tagline |
| Phone-frame UI with typing text | 5 Dashboard "Live markets" |
| Staggered card stack on dark | 6 Market cards with YES/NO bars |
| Swapping-word stacked headline | 9 "TRADE THE NEWS / ODDS / FUTURE, FAST." |
| Camera track: EXPLORE → P·L·A·N stepped line → AND ✓ BOOK | 8 EXPLORE → T·R·A·D·E → AND ✓ TRACK |
| Stamp-style logo end card | 10 End card |

Hard cuts on a 120 BPM grid, expo-out easing (`cubic-bezier(.16,1,.3,1)`), and a slow camera push on every shot.

## Structure (three beats, 20.000 s = 600 frames @ 30 fps)

1. **Introduce**, 0–6.0 s: mark, glyph, tile, wordmark + tagline.
2. **Product**, 6.0–13.5 s: dashboard, markets (odds bars), trade ticket.
3. **How to start**, 13.5–20.0 s: explore → trade → track, headline, end card with `@Tryoddsbot`.

## Audio

`scripts/polymate/generate_audio.py` uses numpy/scipy only and no samples. It reads `src/compositions/Polymate/timeline.json`, the same file that sets every cut and animation cue, so clicks, whooshes, accents, impacts, typing ticks and the success chime land on their frames. The music is a 120 BPM D-minor bed, ducked under the effects. The master is limited at a −1 dBFS ceiling (the result is a −2.2 dBFS peak and −16.9 LUFS integrated), and the last 30 ms are digital silence.
