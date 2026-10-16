import { C, iv, lerp } from "./shared";

/**
 * The temple as flat shapes on a 2D canvas, in world coordinates (1920x1080
 * design px). This is the "reference photo" the painter samples: it is never
 * shown directly, only as a blurred underpainting beneath brush dabs.
 */

type RGB = [number, number, number];
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const mixHex = (a: string, b: string, t: number, alpha = 1) => {
  const A = hex(a);
  const B = hex(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
};

/** Near → far column layout on the left; the right side mirrors it. */
export const COLUMNS = [
  { cx: 592, w: 60, top: 150, bot: 780 },
  { cx: 492, w: 84, top: 108, bot: 850 },
  { cx: 340, w: 122, top: 36, bot: 965 },
  { cx: 92, w: 200, top: -90, bot: 1200 },
];

const VP = { x: 960, y: 520 };

export type SceneState = {
  /** 0 dusk → 1 full sunrise */
  sun: number;
  /** 0 closed → 1 open */
  doors: number;
  /** warm glow of the awakening instrument */
  glow: number;
  /** sapphire light pooled around the altar */
  blue: number;
};

export const sceneState = (f: number): SceneState => ({
  sun: iv(f, [C.sunrise, C.sunrise + 220], [0, 1]),
  doors: iv(f, [C.doors, C.doors + 130], [0, 1]),
  glow: iv(f, [C.spinStart, C.beam], [0, 1]) * (1 - 0.5 * iv(f, [C.sunrise, C.sunrise + 200], [0, 1])),
  blue: iv(f, [C.beam, C.beam + 60], [0, 1]) * (1 - iv(f, [C.collapse, C.collapse + 120], [0, 1])),
});

const glyphRow = (ctx: CanvasRenderingContext2D, x0: number, y: number, w: number, size: number, seed: number) => {
  // Hieroglyph-inspired geometry: discs, triangles, bars, eyes — abstract, not text.
  let x = x0;
  let k = seed;
  while (x < x0 + w - size) {
    const kind = k % 5;
    ctx.beginPath();
    if (kind === 0) ctx.arc(x + size / 2, y + size / 2, size * 0.38, 0, Math.PI * 2);
    else if (kind === 1) {
      ctx.moveTo(x, y + size);
      ctx.lineTo(x + size / 2, y);
      ctx.lineTo(x + size, y + size);
    } else if (kind === 2) ctx.rect(x + size * 0.38, y, size * 0.24, size);
    else if (kind === 3) ctx.ellipse(x + size / 2, y + size / 2, size * 0.5, size * 0.22, 0, 0, Math.PI * 2);
    else ctx.rect(x, y + size * 0.4, size, size * 0.2);
    ctx.fill();
    x += size * 1.35;
    k = (k * 7 + 3) % 11;
  }
};

const column = (ctx: CanvasRenderingContext2D, c: (typeof COLUMNS)[number], mirror: boolean, st: SceneState) => {
  const cx = mirror ? 1920 - c.cx : c.cx;
  const { w, top, bot } = c;
  const capH = w * 0.62;
  const baseH = w * 0.16;
  const x0 = cx - w / 2;
  // Lit on the side facing the doorway.
  const g = ctx.createLinearGradient(x0, 0, x0 + w, 0);
  const dark = mixHex("#7D624A", "#9C7B58", st.sun);
  const mid = mixHex("#C9AD86", "#E2C79E", st.sun);
  const lit = mixHex("#E6D2AE", "#FFE9C2", st.sun);
  if (!mirror) {
    g.addColorStop(0, dark);
    g.addColorStop(0.55, mid);
    g.addColorStop(1, lit);
  } else {
    g.addColorStop(0, lit);
    g.addColorStop(0.45, mid);
    g.addColorStop(1, dark);
  }
  ctx.fillStyle = g;
  ctx.fillRect(x0, top + capH, w, bot - top - capH - baseH);
  // fluting
  ctx.fillStyle = "rgba(70,50,35,0.18)";
  for (const k of [0.2, 0.4, 0.6, 0.8]) ctx.fillRect(x0 + w * k, top + capH, Math.max(1, w * 0.025), bot - top - capH - baseH);
  // painted bands under the capital: sapphire / gold / burgundy
  const bands = ["#1A3FB0", "#D7AA55", "#7A1F2B", "#D7AA55"];
  bands.forEach((b, i) => {
    ctx.fillStyle = b;
    ctx.fillRect(x0, top + capH + i * w * 0.05, w, w * 0.045);
  });
  // cartouche of glyphs
  ctx.fillStyle = "rgba(90,62,40,0.45)";
  for (let i = 0; i < 4; i++) glyphRow(ctx, x0 + w * 0.2, top + capH + w * 0.45 + i * w * 0.32, w * 0.6, w * 0.16, i + (mirror ? 3 : 0));
  // papyrus capital (bell)
  ctx.fillStyle = mid;
  ctx.beginPath();
  ctx.moveTo(x0, top + capH);
  ctx.bezierCurveTo(x0 - w * 0.05, top + capH * 0.5, x0 - w * 0.25, top + capH * 0.25, x0 - w * 0.22, top + capH * 0.12);
  ctx.lineTo(x0 + w * 1.22, top + capH * 0.12);
  ctx.bezierCurveTo(x0 + w * 1.25, top + capH * 0.25, x0 + w * 1.05, top + capH * 0.5, x0 + w, top + capH);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(26,63,176,0.55)";
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    ctx.fillRect(x0 - w * 0.12 + t * w * 1.24 - w * 0.02, top + capH * 0.18, w * 0.04, capH * 0.5);
  }
  // abacus block
  ctx.fillStyle = dark;
  ctx.fillRect(x0 - w * 0.08, top, w * 1.16, capH * 0.14);
  // base
  ctx.fillStyle = dark;
  ctx.fillRect(x0 - w * 0.08, bot - baseH, w * 1.16, baseH);
  // banner on the second-nearest columns
  if (c.cx === 340) {
    const bx = mirror ? x0 - w * 0.02 : x0 + w * 0.12;
    ctx.fillStyle = "#7A1F2B";
    ctx.beginPath();
    ctx.moveTo(bx, top + capH + w * 0.25);
    ctx.lineTo(bx + w * 0.9, top + capH + w * 0.25);
    ctx.lineTo(bx + w * 0.9, top + capH + w * 2.6);
    ctx.lineTo(bx + w * 0.45, top + capH + w * 2.35);
    ctx.lineTo(bx, top + capH + w * 2.6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#D7AA55";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(bx + w * 0.45, top + capH + w * 1.1, w * 0.2, 0, Math.PI * 2);
    ctx.stroke();
  }
};

export const drawScene = (ctx: CanvasRenderingContext2D, st: SceneState, f: number) => {
  const { sun, doors, glow, blue } = st;
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  // --- sky -------------------------------------------------------------
  const sky = ctx.createLinearGradient(0, -100, 0, 640);
  sky.addColorStop(0, mixHex("#33406E", "#7C93C2", sun));
  sky.addColorStop(0.5, mixHex("#9C6A78", "#F2C489", sun));
  sky.addColorStop(1, mixHex("#E79A63", "#FFE4A8", sun));
  ctx.fillStyle = sky;
  ctx.fillRect(-400, -300, 2720, 1000);
  // sun behind the doorway (rises during the finale)
  const sy = lerp(sun, 690, 470);
  const halo = ctx.createRadialGradient(960, sy, 10, 960, sy, 700);
  halo.addColorStop(0, `rgba(255,248,225,${0.35 + 0.65 * sun})`);
  halo.addColorStop(0.12, `rgba(255,214,140,${0.3 + 0.5 * sun})`);
  halo.addColorStop(1, "rgba(255,190,110,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(-400, -300, 2720, 1100);
  ctx.fillStyle = `rgba(255,252,238,${sun})`;
  ctx.beginPath();
  ctx.arc(960, sy, 58, 0, Math.PI * 2);
  ctx.fill();
  // dusk clouds (horizontal smears)
  ctx.fillStyle = mixHex("#C98A86", "#FFF0D4", sun, 0.55);
  for (let i = 0; i < 9; i++) {
    const y = 40 + i * 52;
    const x = ((i * 397 + f * 0.08) % 2400) - 300;
    ctx.beginPath();
    ctx.ellipse(x, y, 260 - i * 12, 14, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- dunes -----------------------------------------------------------
  const dune = (base: number, amp: number, phase: number, a: string, b: string) => {
    ctx.fillStyle = mixHex(a, b, sun);
    ctx.beginPath();
    ctx.moveTo(-400, 1200);
    for (let x = -400; x <= 2320; x += 40) ctx.lineTo(x, base - amp * (Math.sin(x / 260 + phase) * 0.6 + Math.sin(x / 113 + phase * 2) * 0.25));
    ctx.lineTo(2320, 1200);
    ctx.closePath();
    ctx.fill();
  };
  dune(590, 40, 0.3, "#B9805A", "#EDB774");
  dune(640, 34, 1.7, "#A06A45", "#DFA160");
  dune(690, 28, 3.1, "#8A5A3A", "#CC8E52");

  // --- pylon gateway with doorway hole -----------------------------------
  const stone = mixHex("#B59672", "#EDD6AE", sun);
  const stoneDark = mixHex("#8B6D50", "#C9A97F", sun);
  ctx.fillStyle = stone;
  ctx.beginPath();
  // left tower (battered sides)
  ctx.moveTo(590, 712);
  ctx.lineTo(630, 170);
  ctx.lineTo(880, 170);
  ctx.lineTo(880, 712);
  ctx.closePath();
  // right tower
  ctx.moveTo(1330, 712);
  ctx.lineTo(1290, 170);
  ctx.lineTo(1040, 170);
  ctx.lineTo(1040, 712);
  ctx.closePath();
  ctx.fill();
  // lintel + cavetto cornice over the doorway
  ctx.fillRect(860, 262, 200, 76);
  ctx.fillStyle = stoneDark;
  ctx.fillRect(622, 160, 266, 18);
  ctx.fillRect(1032, 160, 266, 18);
  ctx.fillRect(852, 250, 216, 14);
  // block coursing
  ctx.fillStyle = "rgba(80,58,40,0.22)";
  for (let y = 210; y < 712; y += 46) {
    ctx.fillRect(600, y, 280, 2);
    ctx.fillRect(1040, y, 280, 2);
  }
  // relief bands: rows of geometric glyphs, gold-leaf highlights
  ctx.fillStyle = "rgba(96,66,42,0.5)";
  for (let i = 0; i < 5; i++) {
    glyphRow(ctx, 660, 380 + i * 52, 200, 26, i);
    glyphRow(ctx, 1062, 380 + i * 52, 200, 26, i + 2);
  }
  // winged sun disc above the door
  ctx.fillStyle = "#D7AA55";
  ctx.beginPath();
  ctx.arc(960, 300, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1A3FB0";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(960 + side * 20, 292);
    ctx.quadraticCurveTo(960 + side * 70, 278, 960 + side * 92, 296);
    ctx.quadraticCurveTo(960 + side * 60, 304, 960 + side * 20, 308);
    ctx.fill();
  }
  // burgundy banners on the towers
  for (const bx of [700, 1170]) {
    ctx.fillStyle = "#7A1F2B";
    ctx.beginPath();
    ctx.moveTo(bx, 200);
    ctx.lineTo(bx + 52, 200);
    ctx.lineTo(bx + 52, 360);
    ctx.lineTo(bx + 26, 345);
    ctx.lineTo(bx, 360);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#D7AA55";
    ctx.fillRect(bx, 200, 52, 6);
  }

  // --- door leaves ------------------------------------------------------
  const leafW = lerp(doors, 80, 10);
  const leaf = mixHex("#6A4630", "#8A6240", sun);
  ctx.fillStyle = leaf;
  ctx.fillRect(880, 338, leafW, 374);
  ctx.fillRect(1040 - leafW, 338, leafW, 374);
  ctx.fillStyle = "rgba(215,170,85,0.85)";
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 3; c++) {
      const s = leafW / 80;
      ctx.beginPath();
      ctx.arc(880 + (14 + c * 26) * s, 370 + r * 50, 3.2 * Math.max(0.3, s), 0, Math.PI * 2);
      ctx.arc(1040 - (14 + c * 26) * s, 370 + r * 50, 3.2 * Math.max(0.3, s), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // light leaking through the seam
  if (doors < 1) {
    ctx.fillStyle = `rgba(255,214,150,${0.8 * (1 - doors)})`;
    ctx.fillRect(955, 340, 10, 372);
  }

  // --- floor -----------------------------------------------------------
  const floor = ctx.createLinearGradient(0, 712, 0, 1200);
  floor.addColorStop(0, mixHex("#8E7256", "#E2C59A", sun));
  floor.addColorStop(1, mixHex("#5B4434", "#B8936A", sun));
  ctx.fillStyle = floor;
  ctx.fillRect(-400, 712, 2720, 600);
  // tile joints converging on the vanishing point
  ctx.strokeStyle = "rgba(50,34,22,0.25)";
  ctx.lineWidth = 2;
  for (let i = -12; i <= 12; i++) {
    const xb = 960 + i * 260;
    ctx.beginPath();
    ctx.moveTo(lerp((712 - VP.y) / (1200 - VP.y), VP.x, xb), 712);
    ctx.lineTo(xb, 1200);
    ctx.stroke();
  }
  for (let k = 1; k < 9; k++) {
    const y = 712 + k * k * 7;
    ctx.fillStyle = "rgba(50,34,22,0.2)";
    ctx.fillRect(-400, y, 2720, 2);
  }
  // polished reflection of the doorway light
  const refl = ctx.createLinearGradient(0, 712, 0, 1150);
  refl.addColorStop(0, `rgba(255,220,160,${0.35 + 0.6 * sun * Math.max(doors, 0.25)})`);
  refl.addColorStop(1, "rgba(255,220,160,0)");
  ctx.fillStyle = refl;
  ctx.beginPath();
  const rw = lerp(doors, 18, 150);
  ctx.moveTo(960 - rw * 0.6, 712);
  ctx.lineTo(960 + rw * 0.6, 712);
  ctx.lineTo(960 + rw * 2.2, 1200);
  ctx.lineTo(960 - rw * 2.2, 1200);
  ctx.closePath();
  ctx.fill();

  // --- columns (far → near) + floor shadows ------------------------------
  for (const c of COLUMNS) {
    for (const mirror of [false, true]) {
      const cx = mirror ? 1920 - c.cx : c.cx;
      // shadow thrown toward the viewer, away from the doorway
      ctx.fillStyle = `rgba(40,26,16,${0.18 + 0.25 * sun})`;
      const dir = cx < 960 ? -1 : 1;
      ctx.beginPath();
      ctx.moveTo(cx - c.w / 2, c.bot);
      ctx.lineTo(cx + c.w / 2, c.bot);
      ctx.lineTo(cx + c.w / 2 + dir * c.w * 2.4, c.bot + c.w * 1.6);
      ctx.lineTo(cx - c.w / 2 + dir * c.w * 2.4, c.bot + c.w * 1.6);
      ctx.closePath();
      ctx.fill();
    }
  }
  for (const c of COLUMNS) {
    column(ctx, c, false, st);
    column(ctx, c, true, st);
  }
  // architraves framing the open court
  ctx.fillStyle = mixHex("#7A5E45", "#B8986F", sun);
  for (const m of [false, true]) {
    const X = (x: number) => (m ? 1920 - x : x);
    ctx.beginPath();
    ctx.moveTo(X(-60), -120);
    ctx.lineTo(X(625), 135);
    ctx.lineTo(X(625), 152);
    ctx.lineTo(X(-60), -50);
    ctx.closePath();
    ctx.fill();
  }

  // --- altar -----------------------------------------------------------
  ctx.fillStyle = "rgba(30,20,12,0.35)";
  ctx.beginPath();
  ctx.ellipse(960, 872, 230, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  const marble = ctx.createLinearGradient(770, 0, 1150, 0);
  marble.addColorStop(0, mixHex("#B9AE9E", "#D9CCB6", sun));
  marble.addColorStop(0.5, mixHex("#EFE8DC", "#FFFBF2", sun));
  marble.addColorStop(1, mixHex("#A89C8A", "#CFC0A8", sun));
  ctx.fillStyle = marble;
  ctx.fillRect(770, 714, 380, 156);
  ctx.fillStyle = mixHex("#F4EEE4", "#FFFFFF", sun);
  ctx.beginPath();
  ctx.moveTo(800, 690);
  ctx.lineTo(1120, 690);
  ctx.lineTo(1150, 714);
  ctx.lineTo(770, 714);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#D7AA55";
  ctx.fillRect(770, 724, 380, 9);
  ctx.fillStyle = "#1A3FB0";
  ctx.fillRect(900, 762, 120, 70);
  ctx.strokeStyle = "rgba(120,104,86,0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(800, 760);
  ctx.bezierCurveTo(840, 790, 830, 830, 880, 868);
  ctx.moveTo(1060, 730);
  ctx.bezierCurveTo(1080, 780, 1120, 800, 1130, 860);
  ctx.stroke();

  // --- light ------------------------------------------------------------
  ctx.globalCompositeOperation = "lighter";
  // low dusk shafts through the right-hand colonnade
  const dusk = 1 - sun;
  for (let i = 0; i < 3; i++) {
    const x = 1500 - i * 190;
    const a = 0.12 * dusk * (0.8 + 0.2 * Math.sin(f / 50 + i));
    const g = ctx.createLinearGradient(x, 200, x - 700, 1000);
    g.addColorStop(0, `rgba(255,160,70,${a * 2})`);
    g.addColorStop(1, "rgba(255,170,95,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x, 180);
    ctx.lineTo(x + 70, 180);
    ctx.lineTo(x - 520, 1150);
    ctx.lineTo(x - 760, 1150);
    ctx.closePath();
    ctx.fill();
  }
  // sunrise rays fanning out of the doorway
  if (doors > 0) {
    for (let i = 0; i < 11; i++) {
      const ang = Math.PI * (0.08 + (i / 10) * 0.84);
      const spread = 0.05;
      const len = 1500;
      const a = 0.11 * doors * (0.75 + 0.25 * Math.sin(f / 40 + i * 1.7));
      const g = ctx.createRadialGradient(960, 520, 20, 960, 520, len);
      g.addColorStop(0, `rgba(255,226,160,${a * 2.2})`);
      g.addColorStop(1, "rgba(255,226,160,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(960, 520);
      ctx.lineTo(960 + Math.cos(ang - spread) * len, 520 + Math.sin(ang - spread) * len);
      ctx.lineTo(960 + Math.cos(ang + spread) * len, 520 + Math.sin(ang + spread) * len);
      ctx.closePath();
      ctx.fill();
    }
    const flood = ctx.createRadialGradient(960, 560, 20, 960, 560, 900);
    flood.addColorStop(0, `rgba(255,232,180,${0.55 * doors})`);
    flood.addColorStop(1, "rgba(255,232,180,0)");
    ctx.fillStyle = flood;
    ctx.fillRect(-400, -300, 2720, 1600);
  }
  // instrument glow + sapphire pool
  if (glow > 0) {
    const g = ctx.createRadialGradient(960, 540, 10, 960, 540, 420);
    g.addColorStop(0, `rgba(255,200,120,${0.3 * glow})`);
    g.addColorStop(1, "rgba(255,200,120,0)");
    ctx.fillStyle = g;
    ctx.fillRect(400, 100, 1120, 900);
  }
  if (blue > 0) {
    const g = ctx.createRadialGradient(960, 760, 10, 960, 760, 520);
    g.addColorStop(0, `rgba(60,110,255,${0.32 * blue})`);
    g.addColorStop(1, "rgba(60,110,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(300, 300, 1320, 900);
  }
  ctx.globalCompositeOperation = "source-over";
};
