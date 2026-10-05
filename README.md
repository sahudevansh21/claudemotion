# claudemotion

Programmatic motion graphics with [Remotion](https://www.remotion.dev) **4.0.533**, set up for AI coding agents (Claude Code, Codex, Cursor…).

- Sample composition **Showcase**: 1920×1080, 30 fps, ~14 s — kinetic typography, animated shapes, scene transitions (fade / slide / wipe) and beat-synced motion over a music track.
- Reusable building blocks in `src/components` and `src/lib`; starter template + `npm run new` scaffolder.
- Official **Remotion Agent Skills** in `.agents/skills` (+ `.claude/skills`), and project rules for agents in [`AGENTS.md`](AGENTS.md).

## Requirements

Node.js 18+ (tested with Node 22, npm 10). Remotion downloads its own headless Chrome and bundles FFmpeg on first render.

## Quick start

```bash
npm i                       # install dependencies
npm run dev                 # open Remotion Studio at http://localhost:3000
npm run render              # export out/showcase.mp4
```

## Commands

| What | Command |
| --- | --- |
| Preview in Studio | `npm run dev` (open http://localhost:3000/Showcase) |
| Create a new composition | `npm run new -- MyVideo` |
| Export MP4 | `npx remotion render Showcase out/showcase.mp4` (or `npm run render`) |
| Export a new composition | `npx remotion render MyVideo out/my-video.mp4` |
| Single frame | `npx remotion still Showcase out/frame.png --frame=60` |
| Vertical 60 fps variant | `npx remotion render Showcase out/vertical.mp4 --props='{"width":1080,"height":1920,"fps":60}'` |
| Lint + typecheck | `npm run lint` |
| Upgrade Remotion | `npm run upgrade` |

## Changing format

- **Showcase**: `width`, `height`, `fps` in its `defaultProps` in `src/Root.tsx` (also editable in the Studio sidebar); scene lengths in seconds in `src/compositions/Showcase/timing.ts`. Total duration is computed automatically.
- **Other compositions**: `VIDEO` in `src/config/video.ts`; length constant in the composition file.

## Working with an AI agent

```bash
npm run dev            # terminal 1 — keep Studio open
claude                 # terminal 2 — then e.g. "Make a 10s product launch video for …"
```

The agent reads `CLAUDE.md` → `AGENTS.md` and the Remotion skills.

## Docs used

- AI / Claude Code setup: https://www.remotion.dev/docs/ai/claude-code
- Agent Skills: https://www.remotion.dev/docs/ai/skills
- Fundamentals: https://www.remotion.dev/docs/the-fundamentals
- Transitions: https://www.remotion.dev/docs/transitions
- Audio: https://www.remotion.dev/docs/audio
- Fonts: https://www.remotion.dev/docs/fonts-api
- Props / schemas: https://www.remotion.dev/docs/schemas · `calculateMetadata`: https://www.remotion.dev/docs/calculate-metadata
- CLI render: https://www.remotion.dev/docs/cli/render

## License

Remotion is free for individuals and teams of up to 3; larger companies need a [company license](https://www.remotion.pro/license). Bundled fonts are SIL OFL 1.1; the music loop in `public/audio` was synthesized for this project.
