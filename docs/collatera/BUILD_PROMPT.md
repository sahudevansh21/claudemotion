# COLLATERA — Full-Stack Build Prompt

> Paste everything below the line into your AI coding agent (Claude Code, Cursor, etc.).
> It is self-contained: product, design system, hero spec, every page, backend,
> risk engine, worker, database, API, and acceptance criteria.

---

You are building **COLLATERA**, a production-quality, full-stack web app. Build the
whole thing end to end, runnable locally with one command, with real on-chain reads
and a seeded demo mode. Do not skip sections, do not leave TODO stubs in shipped code
paths, and do not invent features that the "Honest limits" section forbids.

## 0. Product in one paragraph

COLLATERA watches DeFi loans backed by **tokenized stocks and ETFs**. A user pastes a
wallet address (view-only). COLLATERA finds that wallet's positions on **one supported
lending market**, reads collateral, debt, liquidation thresholds and oracle prices
on-chain, and shows: how much price buffer is left before liquidation, whether the
price feed is fresh, whether the underlying stock exchange is closed (thin liquidity,
gap risk at the open), and whether the issuer has announced something (corporate
action, pause, redemption or allowlist change). It runs stress tests, sends alerts
(email, Telegram, web push), and **prepares** repayment / add-collateral transactions
that the user signs in their own wallet. COLLATERA never holds funds or keys and never
executes anything on its own.

- Tagline: **Know your collateral's risk before the market does.**
- Version 1 = read-only monitoring on one lending market. Automation is "coming later"
  and must only appear as a roadmap item, never as a working feature.

## 1. Tech stack (use exactly this unless a version is unavailable)

| Layer | Choice |
| --- | --- |
| Monorepo | pnpm workspaces + Turborepo: `apps/web`, `apps/worker`, `packages/risk-engine`, `packages/chain`, `packages/db`, `packages/config` |
| Frontend | Next.js 14 (App Router) + TypeScript (strict) + React 18 |
| Styling | Plain CSS Modules + one `globals.css` with design tokens (no Tailwind — the hero spec relies on exact CSS) |
| 3D hero | `three@0.169.0` from npm (`GLTFLoader`, `BufferGeometryUtils`, `RoundedBoxGeometry` from `three/examples/jsm/...`) |
| Wallet (signing only) | wagmi v2 + viem v2 + RainbowKit |
| Chain reads | viem `publicClient` with `multicall`, RPC URL from env |
| Auth (optional accounts) | Auth.js (NextAuth v5) email magic link via Resend; anonymous viewing needs no account |
| DB | PostgreSQL 16 + Prisma |
| Queue / worker | Redis 7 + BullMQ, separate Node process in `apps/worker` |
| Notifications | Resend (email), Telegram Bot API (bot + `/start <linkCode>` linking), Web Push (VAPID, `web-push` lib, service worker) |
| Billing | Stripe Checkout + Customer Portal + webhook |
| Validation | zod on every API input and env var |
| Tests | Vitest (risk engine, adapters with mocked RPC), Playwright (e2e: landing, add address, dashboard, stress test, planner) |
| Local infra | `docker-compose.yml` with postgres + redis; `pnpm dev` runs web + worker |

Provide `.env.example` with every variable, a `README.md` with setup steps, and
`pnpm db:seed` that creates demo data.

## 2. Design system (applies to every page)

The whole site uses the visual language of the hero: **pure black, white, Poppins,
thin white outlines, glass.**

```css
:root {
  --bg: #000; --fg: #fff;
  --fg-dim: rgba(255,255,255,.6); --line: rgba(255,255,255,.18); --line-strong: rgba(255,255,255,.85);
  --glass: rgba(255,255,255,.04); --glass-border: rgba(255,255,255,.12);
  --safe: #7CFFB2; --watch: #FFD66B; --risk: #FF6B6B; --info: #8AB4FF;
  --pad-x: clamp(20px, 6.95vw, 120px);
  --radius: 6px; --radius-lg: 14px;
}
```

- Font: Poppins 300/400/500/600/700/800 (Google Fonts, `next/font/google` is fine).
  Numbers use `font-variant-numeric: tabular-nums`.
- Headings 600–800, body 300–400. Large page titles may use the outlined style of the
  hero "07" (`color:transparent; -webkit-text-stroke:1.5px rgba(255,255,255,.9)`).
- Buttons: outlined like `.cta` (1.5px white border, 6px radius, 48px tall) that invert
  to white bg / black text on hover (.25s). Round icon buttons copy `.arrow`.
- Cards: `background: var(--glass); border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg); backdrop-filter: blur(12px)`.
- Status badges (pill, 1.5px border in the status colour, dot + label):
  **Safe** `--safe`, **Watch** `--watch`, **At Risk** `--risk`. Colour is never the
  only signal — always show the word.
- Link underline wipe from the hero nav (`::after` scaleX, .35s) on all text links.
- Shared app header on inner pages = the hero `.nav` (logo left, links right), plus a
  wallet/account area on the right. Footer: black, thin top border, links + risk disclaimer.
- Charts: hand-rolled SVG or Recharts, white lines on black, status colours for
  thresholds, no gridline clutter.
- Responsive down to 360px; no horizontal page scroll at any width; respect
  `prefers-reduced-motion` (stop idle drift and slide transitions, keep drag).
- Accessibility: WCAG AA contrast, visible focus rings (2px white outline offset 3px),
  every icon button has `aria-label`, keyboard reachable everything.

## 3. Landing page hero (`/`) — port this spec exactly

Implement as `apps/web/components/hero/GlassHero.tsx` (client component, `"use client"`,
dynamic import with `ssr:false` for the WebGL part) + `GlassHero.module.css`. Also emit
a standalone `apps/web/public/hero-standalone.html` (inline CSS + JS, importmap with
the CDN URLs below) so the hero can be previewed with no build step.

Everything in this section is the original "Design World" hero spec, with COLLATERA
copy swapped in and the arrows/dots made functional (they switch hero slides).

### 3.1 Resources
- Three.js r169. Standalone file uses importmap:
  `"three": "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js"`,
  `"three/addons/": "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/"`.
  Imports: `GLTFLoader` (loaders/GLTFLoader.js), `mergeVertices` + `mergeGeometries`
  (utils/BufferGeometryUtils.js), `RoundedBoxGeometry` (geometries/RoundedBoxGeometry.js).
- Model (CORS-enabled, load directly, do not download or replace):
  `const MODEL_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260929_212926_92423081-b0e4-4f5a-b650-14af6c05c058.glb';`
  On failure fall back to `new RoundedBoxGeometry(1, 1, 1, 8, 0.12)`.
- Page title: `COLLATERA — Know your collateral's risk`.

### 3.2 Hero slides (content model)

```ts
const SLIDES = [
  { lines: ['Know', 'Your', 'Risk'],    tagline: ['Know your collateral’s', 'risk before the', 'market does.'],  count: '01' },
  { lines: ['Fresh', 'Price', 'Feeds'], tagline: ['Catch stale oracles', 'before they', 'catch you.'],       count: '02' },
  { lines: ['Stress', 'Every', 'Gap'],  tagline: ['See the overnight gap', 'before the', 'opening bell.'],    count: '03' },
];
```
The last tagline line is the `<strong>` (bold, block). The default slide is index 0,
so the first dot starts as the active (hollow) one. (The original design had the
middle dot active; here the active dot follows the current slide.)

### 3.3 HTML structure

```html
<section class="hero" id="hero">
  <canvas id="scene" aria-label="Rotatable glass cube. Drag to rotate."></canvas>
  <div class="ui">
    <h1 class="sr-only">Know your collateral's risk before the market does.</h1>
    <header class="nav">
      <a href="/" class="logo"><i class="logo-mark"></i><b>COLL</b><span>ATERA</span></a>
      <ul class="nav-links">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/docs">Docs</a></li>
      </ul>
    </header>
    <div class="arrows">
      <button class="arrow" id="prev" aria-label="Previous">[prev SVG]</button>
      <button class="arrow" id="next" aria-label="Next">[next SVG]</button>
    </div>
    <nav class="dots" aria-label="Hero slides">
      <button class="dot active" aria-label="Slide 1" aria-current="true"></button>
      <button class="dot" aria-label="Slide 2"></button>
      <button class="dot" aria-label="Slide 3"></button>
    </nav>
    <p class="tagline" aria-live="polite">Know your collateral’s<br>risk before the<strong>market does.</strong></p>
    <div class="cta-row">
      <a href="#check" class="cta">Check a wallet</a>
      <span class="cta-line"></span>
      <span class="count" aria-hidden="true">01</span>
    </div>
    <div class="loader" id="loader">Loading model</div>
  </div>
</section>
```
Arrow SVGs: `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"
stroke-linecap="round" stroke-linejoin="round"`; prev path `M19 12H5M11 6l-6 6 6 6`,
next path `M5 12h14M13 6l6 6-6 6`.

The big headline is **not HTML text** — it is drawn into a 2D canvas used as a WebGL
texture so the glass cube refracts it. Only the visually hidden `<h1>` exists in HTML.

### 3.4 CSS (exact values)

```css
html, body { height:100%; background:#000; color:#fff; font-family:'Poppins',sans-serif; -webkit-font-smoothing:antialiased }
.hero { position:relative; width:100%; height:100vh; height:100svh; min-height:520px; overflow:hidden; background:#000 }
#scene { position:absolute; inset:0; width:100%; height:100%; display:block; cursor:grab; touch-action:none }
#scene.dragging { cursor:grabbing }
.ui { position:absolute; inset:0; pointer-events:none; z-index:2 }
.ui a, .ui button { pointer-events:auto }
.sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap }

.nav { position:absolute; top:clamp(24px,4.7vh,40px); left:var(--pad-x); right:var(--pad-x); display:flex; align-items:center; justify-content:space-between }
.logo { display:flex; align-items:center; gap:8px; color:#fff; text-decoration:none; font-size:15px; letter-spacing:-0.01em }
.logo-mark { width:20px; height:40px; background:#fff; border-radius:0 20px 20px 0 }
.logo b { font-weight:700 } .logo span { font-weight:400 }
.nav-links { display:flex; gap:clamp(20px,4.1vw,60px); list-style:none }
.nav-links a { color:#fff; text-decoration:none; font-size:15px; font-weight:500; position:relative }
.nav-links a::after { content:''; position:absolute; left:0; right:0; bottom:-4px; height:1px; background:currentColor; transform:scaleX(0); transform-origin:right; transition:transform .35s ease }
.nav-links a:hover::after { transform:scaleX(1); transform-origin:left }

.arrows { position:absolute; top:18.9%; left:76.7%; display:flex; gap:32px; transform:translate(-19px,-50%) }
.arrow { width:38px; height:38px; border-radius:50%; border:2.5px solid #fff; background:transparent; color:#fff; display:grid; place-items:center; cursor:pointer; transition:background .25s, color .25s }
.arrow svg { width:18px; height:18px }
.arrow:hover { background:#fff; color:#000 }

.dots { position:absolute; right:calc(var(--pad-x) - 7px); top:49.4%; transform:translateY(-50%); display:flex; flex-direction:column; gap:33px }
.dot { width:14px; height:14px; border-radius:50%; border:2px solid #fff; background:#fff; cursor:pointer; transition:background .25s }
.dot.active { background:transparent }

.tagline { position:absolute; left:var(--pad-x); bottom:clamp(40px,7.5vh,70px); font-size:clamp(24px,2.65vw,44px); line-height:1.2; font-weight:300; letter-spacing:-0.01em }
.tagline strong { font-weight:700; display:block }

.cta-row { position:absolute; left:45.6%; right:-1vw; top:88.7%; transform:translateY(-50%); display:flex; align-items:center }
.cta { flex:none; padding:0 15px; height:48px; display:inline-flex; align-items:center; border:1.5px solid rgba(255,255,255,.85); border-radius:6px; background:rgba(0,0,0,.15); color:#fff; font-size:14px; font-weight:400; text-decoration:none; cursor:pointer; transition:background .25s, color .25s }
.cta:hover { background:#fff; color:#000 }
.cta-line { flex:1; height:1.5px; background:rgba(255,255,255,.8); min-width:40px }
.count { flex:none; font-size:clamp(140px,19.8vw,360px); font-weight:400; line-height:1; letter-spacing:-0.02em; color:transparent; -webkit-text-stroke:1.5px rgba(255,255,255,.9); transform:translateY(6%); user-select:none }

.loader { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); font-size:12px; letter-spacing:.2em; text-transform:uppercase; opacity:.6; transition:opacity .6s }
.loader.done { opacity:0 }

@media (max-width:900px), (max-aspect-ratio:1/1) {
  .arrows { left:auto; right:var(--pad-x); top:15%; transform:translateY(-50%); gap:14px }
  .tagline { bottom:clamp(150px,20vh,220px) }
  .cta-row { left:var(--pad-x); right:-3vw; top:auto; bottom:24px; transform:none }
  .count { font-size:clamp(120px,22vw,200px) }
}
@media (max-width:640px) {
  .nav-links { gap:16px }
  .nav-links a, .logo { font-size:13px }
  .dots { gap:20px; right:16px }
  .dot { width:10px; height:10px }
  .cta-row { right:-8vw }
  .count { font-size:120px }
}
@media (max-width:420px) { .nav-links li:nth-child(2) { display:none } }
```
The hero must clip its own overflow; the page must never scroll horizontally.

### 3.5 WebGL scene
- `WebGLRenderer({ canvas, antialias:true, alpha:false })`, clear colour `#000`,
  `outputColorSpace = SRGBColorSpace`, `pixelRatio = min(devicePixelRatio, 2)`.
- `PerspectiveCamera(30, W/H, 0.1, 100)` at `(0,0,10)` looking at the origin.

**Background headline (2D canvas → `CanvasTexture`)**
- Canvas = viewport × DPR, filled `#000`. `mobile = W < 768 || W/H < 1`.
- `fs = min(H*0.21, W*(mobile ? 0.21 : 0.118))`, font `800 ${fs}px Poppins`. If the
  widest line of the current slide exceeds `W*(mobile ? 0.9 : 0.5)`, scale `fs` down to fit.
- Fill `#e9e9e9`, `textAlign center`, baseline alphabetic. Centre `x = W*(mobile ? 0.5 : 0.505)`,
  `cy = H*(mobile ? 0.45 : 0.468)`. Gap `fs*1.07`, cap height `fs*0.7`; line `i` baseline
  `cy + cap/2 + (i-1)*gap`.
- Texture: SRGB colour space, `LinearFilter`, no mipmaps. Redraw on resize and on
  `document.fonts` `loadingdone`.
- **Slide transition**: when the slide changes, cross-fade over 600ms (ease-in-out):
  draw old lines with `globalAlpha = 1-t` and new lines with `globalAlpha = t`, each
  shifted vertically by `±fs*0.12*(1-t or t)`, set `texture.needsUpdate = true` each
  frame while `0<t<1`. Tagline and count cross-fade in HTML (opacity .4s).
- Fullscreen quad in its own `bgScene`: `PlaneGeometry(2,2)`, `ShaderMaterial`,
  vertex outputs `position.xy` directly, fragment `gl_FragColor = texture2D(uTex, vUv);`
  then `#include <colorspace_fragment>` on its own line; `depthTest/depthWrite false`,
  `frustumCulled false`.
- Wait for fonts before first draw: `Promise.race([Promise.all([document.fonts.load('800 100px Poppins'), document.fonts.ready]), timeout(2500)])`, then `layout()` and start the loop.

**Model**
- `GLTFLoader.load(MODEL_URL)`; for each mesh: clone geometry, delete `uv`, `color`,
  `tangent`; `mergeVertices(g, 1e-4)`; `computeVertexNormals()`;
  `applyMatrix4(mesh.matrixWorld)`. Merge with `mergeGeometries`. Centre on bounding box,
  scale so the largest dimension = 1.
- Graph: `scene → pivot (position + scale) → spinner (rotation) → mesh`. On load add
  `done` to `#loader`.

**Placement (in `layout()`)**
- `visH = 2*tan(fov/2)*10`, `visW = visH*aspect`. `sx = mobile ? 0.5 : 0.517`,
  `sy = mobile ? 0.45 : 0.488`. `pivot.position = ((sx-0.5)*visW, (0.5-sy)*visH, 0)`.
- Edge px `= min(H*0.44, W*(mobile ? 0.45 : 0.29))`; `pivot.scale = (px/H)*visH`.
- Initial spinner rotation `Euler(-0.42, 0.62, 0.18)`.

**Glass material** — `ShaderMaterial`, screen-space refraction, 6-band chromatic
dispersion, two passes (back faces then front faces).
- Vertex: `worldPos = modelMatrix*position; mvPos = viewMatrix*worldPos;
  gl_Position = projectionMatrix*mvPos; vNormal = normalize(normalMatrix*normal);
  vEye = normalize(mvPos.xyz);`
- Fragment: `uv = gl_FragCoord.xy / uResolution` (drawing-buffer size).
  `n = normalize(vNormal); if (uBackside > 0.5) n = -n;` (do **not** use `gl_FrontFacing`).
  `eye = normalize(vEye)`. `LOOP = 16`, `slide = float(i)/LOOP * 0.045`.
  Per band: `refr = refract(eye, n, 1.0/ior)`; sample `uTexture` at
  `uv + refr.xy * (uRefractPower + slide*k) * uChromatic`, with k = 1 (R), 1 (Y), 2 (G),
  2.5 (C), 3 (B), 1 (P).
  ```
  r = tR.x*0.5
  y = (tY.x*2.0 + tY.y*2.0 - tY.z)/6.0
  g = tG.y*0.5
  c = (tC.y*2.0 + tC.z*2.0 - tC.x)/6.0
  b = tB.z*0.5
  p = (tP.z*2.0 + tP.x*2.0 - tP.y)/6.0
  R = r + (2p + 2y - c)/3;  G = g + (2y + 2c - p)/3;  B = b + (2c + 2p - y)/3
  color += vec3(R,G,B)
  ```
  `color /= LOOP`; saturation `mix(vec3(dot(color, vec3(0.2125,0.7154,0.0721))), color, uSaturation)`.
  Specular (Blinn-Phong, `lightVec = normalize(-light)`, `view = -eye`):
  `spec(L, sh, d) = pow(max(dot(n, normalize(lightVec+view)),0), sh) + max(0, dot(n, lightVec))*d`;
  `spec = spec(uLight, uShininess, uDiffuseness) + 0.6*spec(vec3(1,1,-1), uShininess*0.6, uDiffuseness*0.5)`;
  `color += spec * (backside ? 0.35 : 1.0)`.
  Fresnel `f = pow(1.0 + dot(eye, n), uFresnelPower)`; `color = mix(color, vec3(1), f*(backside ? 0.25 : 0.55))`.
  `color += vec3(0.004, 0.005, 0.007); gl_FragColor = vec4(color, 1.0);` then
  `#include <colorspace_fragment>` on its own line.
- Uniforms: `uIorR 1.15, uIorY 1.16, uIorG 1.18, uIorC 1.22, uIorB 1.22, uIorP 1.22,
  uRefractPower 0.30 (front) / 0.22 (back), uChromatic 0.5, uSaturation 1.08,
  uShininess 90, uDiffuseness 0.02, uFresnelPower 5.0, uLight (-1,1,1),
  uBackside 0 (frontMat, FrontSide) / 1 (backMat, BackSide)`.

**Render pipeline (every frame)**
- Two `WebGLRenderTarget`s at drawing-buffer size, `HalfFloatType`: `rtBack`, `rtFront`.
  `backMat.uTexture = rtBack.texture`, `frontMat.uTexture = rtFront.texture`.
  1. bgScene → rtBack
  2. bgScene → rtFront, then (`autoClear=false`) cube with backMat → rtFront
  3. bgScene → screen, then (`autoClear=false`, `clearDepth()`) cube with frontMat → screen

### 3.6 Interaction
- Drag (pointer events, `setPointerCapture`): `dx = Δx*0.008`, `dy = Δy*0.008`;
  `spinner.quaternion.premultiply(qY(dx)).premultiply(qX(dy))` (world-space). Track
  velocity per 16.67ms; `.dragging` class while dragging.
- Inertia after release, damped `0.94^(dt*60)`.
- Idle drift: 0.6s after release blend in 0.0035 rad/frame around Y and 0.0012 around X
  (blend ramps 0→1 over 1s). Also runs from page load. Off under reduced motion.
- **Prev / Next**: rotate the cube −90° / +90° around Y (each frame apply
  `remaining*min(1, 0.09*dt*60)` until `|remaining| < 0.0005`), cancel inertia, AND go to
  previous / next slide (wraps). Dragging cancels the spin.
- **Dots**: clicking dot `i` sets that slide (rotating the cube by `±90° × distance`),
  makes it the only `.active` with `aria-current="true"`.
- Keyboard: ←/→ on the focused hero act like prev/next.
- Auto-advance every 7s if the user hasn't interacted in the last 10s (off under reduced motion).
- Clamp `dt` to 0.05s. On resize recompute renderer size, camera aspect, RT sizes,
  `uResolution`, headline canvas, cube position/scale. Pause the loop when the hero is
  off-screen (IntersectionObserver) or the tab is hidden. Dispose all GPU resources on unmount.
- If WebGL is unavailable: render the current slide headline as large HTML text with a
  CSS glass square over it; everything else unchanged.

## 4. Rest of the landing page (below the hero)

Sections, in order, all in the design system:
1. **`#check` — Wallet check bar**: large input "Paste a wallet address or ENS name"
   + "Scan" button. Validates (viem `isAddress` / ENS resolve), then routes to
   `/dashboard?address=0x…`. Small print: "View-only. We never ask for keys or move funds."
   A "Try the demo wallet" link loads the seeded demo address.
2. **Why it matters**: three glass cards — *Thin buffers*, *Stale prices*,
   *Closed markets & issuer events* — each one sentence.
3. **How it works**: the 7-step flow (Connect → Detect → Fetch → Score → Display →
   Monitor → Act) as a horizontal numbered line on desktop, vertical on mobile, numbers
   in the outlined "count" style.
4. **Feature grid**: position dashboard, price-freshness checks, alerts (email, Telegram,
   push), stress scenarios, user-confirmed repayment plans. Each card shows a tiny live
   mock (e.g. a buffer bar, a feed age ticker).
5. **Who it's for**: individuals, lending platforms, DAOs, treasuries → link to `/pricing`.
6. **Honest limits** (must be visible, not hidden in a footer): v1 covers one lending
   market in read-only mode; data can lag or fail; COLLATERA improves risk awareness but
   does not guarantee protection from liquidation; automation and any token are proposals.
7. Footer with nav, docs links, disclaimer, "Not financial advice".

## 5. App pages

All app pages read state from the API; loading states are skeletons (shimmering glass
cards using a frame-independent CSS animation is fine here), empty and error states are
written in plain language.

### `/dashboard`
- Address switcher (saved addresses for signed-in users; `?address=` for anonymous).
- Summary strip: total collateral (USD), total debt, lowest health factor, # positions
  by badge, market status ("NYSE open — closes in 2h 14m" / "Closed — opens Mon 09:30 ET").
- Positions table/cards: asset(s), collateral value, debt, health factor, **buffer to
  liquidation** (bar + %), price freshness chip (Fresh / Stale + age), issuer-event
  chip, badge (Safe / Watch / At Risk), one-line plain-language explanation, links
  to Detail / Stress / Plan.
- Auto-refresh every 30s via SWR; show "Last checked 12s ago".

### `/positions/[id]`
- Header: badge, health factor, buffer %, liquidation price per collateral asset.
- "What this means" plain-language paragraph generated by the engine (see §7.6).
- Collateral breakdown: per asset amount, oracle price, last oracle update, heartbeat,
  liquidation threshold, share of collateral.
- Oracle panel: oracle price vs. reference price (if available), age vs. expected interval.
- Market hours panel for each underlying (exchange, open/closed, next open/close).
- Issuer events timeline.
- 7-day history chart of health factor and buffer from snapshots, with 1.0 and the
  user's alert threshold drawn as lines.

### `/stress`
- Pick a position (or "all positions").
- Scenario buttons: **−10%**, **−20%**, **Overnight gap-down** (default 8%, editable),
  **Oracle delay** (assume real price moved X% during a Y-minute stale window,
  defaults 5% / 60 min), plus a custom slider 0–60%.
- Output cards: new health factor, new buffer, liquidation point (price per asset),
  **repay needed** and **collateral to add** to reach the target HF (default 1.5,
  editable), with before/after.

### `/alerts`
- Channels: email (verified), Telegram (linking flow: show `/start <code>` deep link to
  the bot), web push (subscribe button + test notification).
- Rules per address/position: buffer below X% (default 15%), feed stale, issuer/contract
  event, market close/open while buffer below Y% (default 25%). Quiet hours option.
- Alert history list: what changed, why it matters, what to do, timestamp, channel status.
- Requires sign-in (magic link). Anonymous users see a sign-in prompt.

### `/plan/[positionId]`
- Target HF input (default 1.5).
- Options: "Repay X <debtAsset> to restore HF 1.5" and "Add Y <collateralAsset>".
  Show before/after HF and buffer, estimated gas fee, token approvals needed, and the
  **exact transactions** (to, function, args, decoded + raw calldata).
- Simulate each tx with `eth_call` / `simulateContract` from the user's address and
  show the result. Warn if wallet balance is insufficient.
- "Connect wallet to sign" → RainbowKit. The connected wallet must equal the position
  owner; otherwise block with an explanation. User signs approve then repay/supply in
  their wallet. Nothing is ever sent without the user clicking and confirming.
- After confirmation, poll the receipt and re-score the position.

### `/pricing`
- Free: 1 address, dashboard, email alerts, hourly checks.
- Pro (e.g. $19/mo): 10 addresses, all channels, 1-minute checks, stress history.
- B2B / Team (contact form + Stripe for self-serve tier): API access, many addresses,
  webhooks, for lending platforms, DAOs, treasuries.
- "Automation (later)" card marked *Not available — roadmap*.
- Contact form posts to `/api/contact` (stored + emailed).

### `/docs`
MDX pages: Getting started, How the risk score works (all formulas from §7), Price
freshness, Market hours, Issuer events, Stress tests, Repayment planner safety,
Supported market & assets, **Risk notes & honest limits**, FAQ, Roadmap (automation with
bonded operators and a *proposal-only* token section stating: launch only after paid
usage and demonstrated need; stablecoin bonds compared first; tokens guarantee no
returns or market cap).

### `/account`
Saved addresses (add/label/remove), notification settings, subscription (Stripe portal),
API keys (B2B), delete account.

## 6. Chain layer (`packages/chain`)

- **Adapter interface** so more markets can be added later; implement exactly one now:

```ts
interface LendingMarketAdapter {
  id: string; chainId: number; name: string;
  findPositions(owner: Address): Promise<RawPosition[]>;
  readPosition(owner: Address): Promise<RawPosition | null>;
  buildRepayTx(p: { owner: Address; asset: Address; amount: bigint }): Promise<TxRequest[]>; // approve + repay
  buildSupplyTx(p: { owner: Address; asset: Address; amount: bigint }): Promise<TxRequest[]>; // approve + supply
}
```
- First adapter: an **Aave v3-compatible Pool** (address, chain and data provider from
  env/config). Use `Pool.getUserAccountData`, `UiPoolDataProvider` / `PoolDataProvider`
  reserve + user reserve data, `AaveOracle.getSourceOfAsset` to find each asset's
  Chainlink-style feed.
- **Supported assets registry** (`packages/config/assets.ts`): for each tokenized
  stock/ETF: token address, symbol, underlying ticker, exchange (`XNYS`/`XNAS`), oracle
  feed address, expected heartbeat seconds, issuer name, issuer contract (for pause /
  allowlist events). Only positions with at least one registry asset as collateral are
  shown; others are listed as "unsupported collateral".
- Oracle read: `latestRoundData()` → price, `updatedAt`, decimals. Batch everything with
  `multicall`. Cache reads in Redis for 15s.
- Issuer/contract events: watch `Paused`, `Unpaused`, allowlist/whitelist and
  redemption-related events on registry contracts (ABI fragments configurable per
  issuer) via `getLogs` in the worker; plus an admin form to log off-chain corporate
  actions (splits, dividends, delistings) with source URL.
- **Demo mode** (`DEMO_MODE=true` or the demo address): a mock adapter returning seeded
  positions that cover Safe, Watch (stale feed), At Risk (thin buffer, market closed)
  and an issuer-paused case, so the whole UI works without RPC access.

## 7. Risk engine (`packages/risk-engine`, pure TypeScript, 100% unit-tested)

All money maths in `bigint` or decimal (use `decimal.js`), never floats for balances.

1. **Health factor** `HF = Σ(collateral_i × price_i × LT_i) ÷ debtValue`. `debt = 0 → HF = ∞`
   (show "No debt"). Liquidation risk begins at `HF ≤ 1.0`.
2. **Buffer to liquidation** `buffer = 1 − 1/HF` (fraction all collateral prices can fall
   before HF hits 1, assuming debt is stable). Liquidation price per asset for
   single-collateral positions: `price × (1 − buffer)`.
3. **Price freshness** `age = now − updatedAt`. Fresh if `age ≤ heartbeat × 1.1`; Stale if
   above; Critical if `age > heartbeat × 2` or the feed reverts.
4. **Market-hours check** using an exchange calendar (`packages/config/calendar.ts`: NYSE/
   Nasdaq regular hours 09:30–16:00 America/New_York, full-day holidays and early closes
   for the current and next year, DST handled with a tz library). When the underlying is
   closed: `effectiveBuffer = buffer − gapHaircut` (default 8%, config per asset), and
   the explanation says why.
5. **Badges**:
   - **At Risk**: `HF < 1.1` or `effectiveBuffer < 10%` or issuer pause active.
   - **Watch**: `effectiveBuffer < 25%`, or feed Stale/Critical, or a new issuer event in
     the last 72h, or market closes within 60 min and `buffer < 30%`.
   - **Safe**: otherwise.
6. **Explanation generator**: deterministic templates (no LLM needed) that produce
   "What changed / Why it matters / What to do", e.g. *"Your TSLAx collateral can fall
   about 14% before liquidation. Nasdaq is closed until Monday 09:30 ET, so prices can
   gap at the open — treat your buffer as about 6%. Repaying 820 USDC brings you back
   to a 1.5 health factor."*
7. **Stress**: apply shock `d` to registry (tokenized) collateral only:
   `HF' = (Σ_tok coll×p×(1−d)×LT + Σ_other coll×p×LT) ÷ debt`. Oracle-delay scenario uses
   `d = assumed move` and flags that the on-chain HF would not yet reflect it.
8. **Repay / add to reach target HF `T`**:
   `repay = max(0, debt − Σ(coll×p×LT)/T)`;
   `addCollateral(asset a) = max(0, (T×debt − Σ(coll×p×LT)) ÷ (p_a × LT_a))` in asset units.
   Round **up** to asset decimals; show both in token and USD.
9. Snapshot type returned for every scoring run, persisted by the worker.

Tests must cover: no debt, exact HF = 1, multi-collateral, stale/critical boundaries,
weekend + holiday + early-close calendar cases, DST switch, each badge rule, stress maths,
repay/add rounding.

## 8. Worker (`apps/worker`)

BullMQ repeatable jobs:
- `scan-addresses` — every 60s (Pro) / 60min (Free): for each watched address, read via
  adapter, score, write `PositionSnapshot`, diff with previous, enqueue alerts.
- `check-feeds` — every 30s: read all registry feeds, store `FeedStatus`, alert on stale.
- `market-calendar` — every minute: emit "closing in 60 min" / "opened" transitions.
- `issuer-events` — every 2 min: `getLogs` from last processed block (stored per
  contract), persist `IssuerEvent`, alert affected positions.
- `send-notification` — fan out to email / Telegram / push with retries (exp backoff,
  5 attempts), store delivery status.
- Alert de-duplication: same rule + position won't fire again for 6h unless severity
  worsens; respect quiet hours (except At Risk).
- Health endpoint + structured logs (pino). Graceful shutdown.

## 9. Database (Prisma models, minimum)

`User`, `Account`/`Session`/`VerificationToken` (Auth.js), `WatchedAddress` (userId,
address, label, chainId), `Position` (adapterId, owner, externalId), `PositionSnapshot`
(positionId, hf, buffer, effectiveBuffer, badge, collateralJson, debtJson, explanation,
createdAt), `FeedStatus` (feed, price, updatedAt, ageSec, state), `IssuerEvent` (asset,
kind, txHash/sourceUrl, description, occurredAt), `AlertRule` (userId, scope, kind,
threshold, enabled), `AlertEvent` (ruleId, positionId, severity, whatChanged,
whyItMatters, whatToDo, createdAt), `NotificationDelivery` (alertEventId, channel,
status, error), `TelegramLink`, `PushSubscription`, `Subscription` (Stripe ids, plan,
status), `ApiKey` (hashed), `ContactRequest`, `WorkerCursor`. Indices on
`(positionId, createdAt)` and `(userId)`.

## 10. API (Next.js route handlers, zod-validated, JSON)

```
GET  /api/positions?address=0x…         scan + score (cached 15s), works anonymously, rate-limited
GET  /api/positions/:id                 detail + latest snapshot + 7d history
POST /api/stress                        { positionId|address, scenario, params, targetHf } → results
POST /api/plan                          { positionId, kind: 'repay'|'add', targetHf } → amounts + txs + simulation
GET  /api/market-status                 exchanges open/closed + next transitions
GET  /api/feeds                         registry feed freshness
GET/POST/DELETE /api/addresses          saved addresses (auth)
GET/POST/PATCH/DELETE /api/alerts/rules (auth)
GET  /api/alerts/events                 (auth)
POST /api/notify/push/subscribe         (auth)   POST /api/notify/test (auth)
POST /api/telegram/webhook              Telegram bot updates (secret-token header checked)
POST /api/stripe/checkout | /api/stripe/portal | /api/stripe/webhook (signature verified)
POST /api/contact
GET  /api/v1/positions?address=…        B2B, `Authorization: Bearer <apiKey>`
```
Rate limit anonymous endpoints (Redis sliding window, e.g. 30 req/min/IP). Never accept
or store private keys or seed phrases; reject any input that looks like one with a
warning.

## 11. Security & compliance requirements

- Read-only by design: the backend has no signer and no funded keys. Tx building is
  done server-side, signing only client-side in the user's wallet.
- Strict CSP (allow `cdn.jsdelivr.net` only for the standalone hero, the CloudFront
  model host, Google Fonts, RPC and WalletConnect hosts), HSTS, `X-Frame-Options: DENY`.
- CSRF protection on mutating routes, secure cookies, hashed API keys, secrets only in env.
- Every page with risk numbers shows the "Data can lag or fail — not a guarantee" note
  and the timestamp of the data.
- Plain-language legal pages: Terms, Privacy, Risk Disclosure (placeholders clearly
  marked "requires legal review").

## 12. Acceptance criteria (verify before you say you're done)

1. `docker compose up -d && pnpm i && pnpm db:migrate && pnpm db:seed && pnpm dev` starts
   web on :3000 and the worker with no errors.
2. Landing hero matches §3 at 1440×806 (logo at ~(100,38), arrows ~(1105,152) and
   ~(1175,152), dots x≈1340, headline centred x≈727, cube ≈ x 510–1000 / y 145–600,
   tagline bottom-left, CTA ~(657,691) with the line running to a huge outlined count
   clipped by the right/bottom edges) and at 390×844 mobile. Drag, inertia, idle drift,
   arrows, dots, and slide cross-fade all work; text through the cube is magnified,
   mirrored and fringed blue/yellow; bevelled edges glow.
3. Demo wallet shows four positions with Safe / Watch / At Risk badges and correct
   explanations; stress tests and the planner produce numbers matching the unit tests.
4. With a real RPC + an address holding a supported position, the dashboard shows live
   values within 15s, and the planner produces simulated, signable txs.
5. Alerts: a forced stale feed / low buffer in demo mode produces an email (Resend test
   mode), a Telegram message, and a push notification, de-duplicated on repeat.
6. `pnpm lint`, `pnpm typecheck`, `pnpm test` (Vitest) and `pnpm e2e` (Playwright) pass;
   Lighthouse a11y ≥ 95 on landing and dashboard; no horizontal scroll at 360px.
7. Nowhere in the UI or docs does it promise protection, guaranteed returns, live
   automation, or a token sale.

Deliver: the full repository, `README.md` (setup, env, architecture diagram in
Mermaid, how to add a second lending-market adapter, how to add a tokenized asset to
the registry), and a short `CHANGELOG.md`.
