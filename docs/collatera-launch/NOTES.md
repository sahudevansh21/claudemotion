# COLLATERA launch: 20 s SaaS film (3840×2160, 120 fps, 2,400 frames)

Composition: `CollateraLaunch` (`src/compositions/CollateraLaunch/`). The timing source is
`launch.json`, which drives both the picture cuts and `scripts/collatera-launch/generate_audio.py`.

## Sources

- **Brand:** the logo, banner and X profile supplied by the client (@collatera_io, collatera.buzz). The mascot reuses the decoded 12×11 matrix from the earlier Collatera film.
- **Product UI and copy:** a 44 s screen recording of collatera.buzz supplied by the client. The site itself was not reachable from the build environment.
  - The recording is 832×448, and the browser area is only about 772×418. It is cropped and upscaled 2× with lanczos and sharpening, then shown only inside browser frames and a screen wall, where the softness reads as "screen".
  - The terminal and the feature, venue and step panels are rebuilt in code from the recording, so they stay sharp at 4K.
- **Motion reference:** the supplied SaaS launch reel. It provided the glitch-resolve type with corner marks, "Introducing X", tilted screens, a screen wall, ray bursts, neon waves, stacked end lines and the noise-to-logo close.

## Shots (120 BPM, every cut on a beat)

| Time | Shot | Notes |
| --- | --- | --- |
| 0–2.5 | Hook: "YOUR ORACLE / SAYS FINE. / IT'S STALE." | Mint plate, chromatic scan-line resolve |
| 2.5–4.0 | Real hero clip in a browser | "It's time to watch the oracle." |
| 4.0–5.5 | Introducing COLLATERA | Smear-out into the drop |
| 5.5–8.0 | Terminal (rebuilt) | Price, oracle-stale flag, candles and order book are labelled SIMULATED DATA, as on the site |
| 8.0–9.5 | Lending stack + real clip | Aave/Euler/Morpho/Sentora with the site's "not affiliated" wording |
| 9.5–11.0 | Screen wall | Stills from the recording |
| 11.0–12.5 | Know what backs your position | Three cards, site copy verbatim |
| 12.5–14.5 | Monitor clip + rays | "Read-only. No keys. No signatures." (paraphrase of the site's "We never ask for keys or signatures") |
| 14.5–16.5 | Four steps on neon waves | Site copy |
| 16.5–18.5 | End lines | Site headline + URL |
| 18.5–20.0 | Noise → mascot logo | @collatera_io |

## Music

Original composition, synthesised in Python: F minor, 120 BPM, a Drake-era pop/dancehall feel (Rhodes keys, 808 sub, rim 3-3-2, claps, hat rolls). No existing songs or samples are used. Loudness is about −11 LUFS with a −1 dBFS peak. To use a licensed track instead, remux without re-rendering:
`ffmpeg -i film.mp4 -i track.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest out.mp4`

## Check before posting

- Venue names and the Robinhood Chain visible in the clip come from the site's ecosystem section. They are not partnerships.
- The terminal numbers are the site's simulated demo values.
- Silkscreen is a lookalike of the site's pixel font.
