# TerraNode film: research sources and production notes

## Verified facts (checked 2026-10-12)

| Used on screen | Source |
| --- | --- |
| Name "TerraNode", handle @terraanode | https://x.com/terraanode (profile) |
| "AI-powered farming, without the internet" (shots 1–2) | X bio, also the profile's meta description |
| "Crop disease & pest detection" (shot 5) | X bio |
| "Smart irrigation • LoRa • Solar" (shots 3, 6, 7) | X bio |
| "Farmer-approved actions" (shot 6) | X bio |
| "Offline Edge-AI for Smarter Farms" (shot 3 and end card) | X banner (supplied by the user) |
| Field unit design: pole, tilted solar panel, antenna, white enclosure with wordmark and leaf | X banner |
| Readings: Soil Moisture 68%, Temperature 24°C, Humidity 56%, Light 820 lux, Air Quality Good; Leaf Analysis "Healthy" | X banner UI |
| Logo ".TerraNode", black wordmark, violet dots `#701CD0` (sampled) | Logo image (supplied by the user) |

## Gaps (stated, not filled)

- No website was found, and no published metrics (farms, accuracy, water savings). The film shows **no statistics**.
- The tablet, phone and leaf-scan screens are **illustrative UI** built from the banner's example values. They are labelled on screen ("ILLUSTRATIVE DATA / UI") and in the end-card footnote. The irrigation prompt ("Zone 2 soil moisture is low, irrigate for 15 min?") is an example of the "smart irrigation / farmer-approved actions" claim, not a documented feature screen.
- The wordmark is set in Quicksand Bold, the closest open font to the logotype, not the original logo file.

## How the reference was adapted

The reference is a 32 s, 24 fps, 4:3 live-action film: golden-hour fields, handheld camera and walking shots, the product shown on a tablet and laptop outdoors, and a ring sculpture. It ends with a tilt up into a blue sky, where a white ring becomes the "o" and "on.design" types on.

| Reference | TerraNode (1920×1080, 30 fps, exactly 20 s) |
| --- | --- |
| Golden-hour fields, backlit, handheld | Procedural golden-hour farmland: 3D-projected crop rows, low sun with bloom and lens flare, layered hills, defocused foreground grass, film grain, warm grade, light leak, handheld drift (shots 1, 2, 7) |
| Walking / dolly shots | Low dolly down a crop row; the TerraNode unit grows out of the field (shot 2) |
| Product on tablet / laptop outdoors | Dashboard tablet held in hands over a soft-focus field (shot 4); phone in hand (shot 6) |
| Close details | Node close-up with LoRa rings and callouts (shot 3); leaf macro with scan (shot 5) |
| Ring sculpture in the landscape | White ring rising out of the field (shot 8) |
| Tilt up to sky, ring becomes the "o", wordmark types on | Tilt up to sky, ring collapses into the leading violet dot, ".TerraNode" types on, second dot pops, tagline (shot 8) |

The reference has no captions. A teaser that explains the product needs a little copy, so short documentary-style captions (the bio lines) sit bottom-left.

## Structure (three beats)

1. **Promise**, 0–4.2 s: "AI-powered farming, / without the internet."
2. **Product at work**, 4.2–16.8 s: node hardware (LoRa, solar, edge AI), then live readings, then disease detection, then a farmer-approved irrigation action, then a network of units with no internet.
3. **Brand**, 16.8–20 s: sky end card, ".TerraNode", "Offline Edge-AI for Smarter Farms".

## Audio

`scripts/terranode/generate_audio.py` uses numpy/scipy only and no samples. It reads `src/compositions/TerraNode/timeline.json`, the same file that sets every cut and animation cue.
- **Music:** 100 BPM in G major. Karplus-Strong plucked-string arpeggio, pads, bass, soft kick and shaker. It resolves on a final strum at the end card and fades to digital silence.
- **Effects:** swells, whooshes, wooden ticks, LoRa pings with echo, a scan sweep, a "healthy" chime, a notification, an impact, and typing ticks for the wordmark.
- **Master:** music ducked under the effects, limited at a −1 dBFS ceiling. The final MP4 measures −17.0 LUFS integrated with a −1.5 dBFS peak.
