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

## PolymateMinimal (10 s, 4K @ 60 fps)

A second, minimal Polymate film: `src/compositions/Polymate/PolymateMinimal.tsx`,
timing in `minimal/minimal.json`, audio from
`scripts/polymate/generate_minimal_audio.py`.

- **Motion grammar** from the supplied reference (a laptop launch film):
  calm cinematic plates, tiny wide-tracked pixel-mono captions that decode in
  behind a block cursor, a highlight box on the key words, glitch scramble-out,
  small-logo end card with a CTA.
- **Look** from the Polymate X banner: golden-hour sky over a temple hill,
  framing columns, crimson banner with a gold laurel, marble with gold veins.
- **Copy** only from the X profile and banner: "The trading layer for
  prediction markets", "Trade the future, fast" (from "Building tools to trade
  the future, fast."), nav items Trade / Markets / Positions, the banner's
  "Executing Trade…" and "Position Opened · YES · $50" card (labelled
  ILLUSTRATIVE UI), CTA t.me/Tryoddsbot.
- Fonts: Silkscreen (OFL, pixel mono for captions), Inter (UI card).

## PolymateForum — "The Forum" (30 s, 4K @ 60 fps, one seamless take)

`src/compositions/Polymate/PolymateForum.tsx` + `forum/Forum.tsx`, all timing in
`forum/forum.json` (absolute frames), audio from
`scripts/polymate/generate_forum_audio.py`.

| Time | Beat |
| --- | --- |
| 0–6 s | The banner's Roman forum as a plate; slow dolly in, foreground columns with imperial-red banners part; a faint gold signal travels through the forum. "The future is uncertain." types on. |
| 6–12 s | The signal blooms into the supplied emblem; a gold ring draws round it; gentle orbit and specular sheen; the forum defocuses. "Trading it shouldn't / be complicated." |
| 12–20 s | The lapis stone grows into a sapphire-marble interface (gold border): Live Markets list, a soft touch dot scrolls (discovery) and taps a market (selection). "Discover markets." → "Pick a side." |
| 20–25 s | YES selected, $50, one slide-to-trade motion → "Executing Trade…" → "Position Opened · YES · $50" (banner copy). "Trade in one motion." |
| 25–30 s | The interface collapses back into the stone, the emblem returns, glides to centre and settles on a marble pedestal as the camera pulls back to the forum. Lockup: PolyMate / The trading layer for prediction markets.; "TryOdds is live · t.me/Tryoddsbot"; "OddsAlert · CopyOdds — coming soon". |

Notes:
- **Logo**: the supplied 400 px emblem is used as-is (white background removed,
  4× Lanczos upscale + light sharpening) — no change to shape, colour or
  proportion. At 4K it is shown at most ~1,040 px wide, so it is slightly soft;
  a high-resolution PNG or SVG of the emblem would make it pin-sharp.
- **Environment**: centre crop of the supplied 1500×500 banner (forum, Acropolis,
  Colosseum, banners), upscaled; it reads as a soft, hazy plate behind crisp
  vector foreground columns, interface and type.
- **Markets** in the interface are illustrative and labelled ILLUSTRATIVE.
- OddsAlert and CopyOdds are shown only as "coming soon"; TryOdds as live.
