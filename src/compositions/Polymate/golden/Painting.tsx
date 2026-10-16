import { useLayoutEffect, useMemo, useRef } from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { drawScene, sceneState } from "./scene";
import { C, camera, iv } from "./shared";

/**
 * Painterly renderer (the reference's gouache look). Each frame the temple is
 * drawn flat into a half-resolution "sample" canvas through the camera; the
 * visible canvas then gets a soft underpainting plus ~14k brush dabs whose
 * colour is sampled from that image and whose direction follows its edges.
 * Dabs live in world space so the painting moves coherently with the camera,
 * and re-jitter every 8 frames for a gentle hand-painted boil.
 */
const K = 0.5; // sample canvas scale vs design px
const SW = 1920 * K;
const SH = 1080 * K;

type Dab = { x: number; y: number; len: number; wid: number; b: number; h: number; ang: number; t0: number; seed: number };

const makeDabs = (): Dab[] => {
  const dabs: Dab[] = [];
  const add = (n: number, lenA: number, lenB: number, widA: number, widB: number, key: string) => {
    for (let i = 0; i < n; i++) {
      const x = -80 + random(`${key}x${i}`) * 2080;
      const y = -80 + random(`${key}y${i}`) * 1240;
      const order = ((x + 0.5 * y) / 2500) * 110 + random(`${key}t${i}`) * 45;
      dabs.push({
        x,
        y,
        len: lenA + random(`${key}l${i}`) * (lenB - lenA),
        wid: widA + random(`${key}w${i}`) * (widB - widA),
        b: (random(`${key}b${i}`) - 0.5) * 0.26,
        h: (random(`${key}h${i}`) - 0.5) * 0.1,
        ang: (random(`${key}a${i}`) - 0.5) * 0.5,
        t0: C.paintStart + order,
        seed: i,
      });
    }
  };
  add(8000, 26, 48, 9, 16, "L");
  add(5000, 12, 22, 5, 9, "S");
  return dabs;
};

export const Painting: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const sample = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = SW;
    c.height = SH;
    return c;
  }, []);
  const dabs = useMemo(makeDabs, []);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const sctx = sample.getContext("2d", { willReadFrequently: true });
    const ctx = canvas.getContext("2d");
    if (!sctx || !ctx) return;
    const { s, tx, ty } = camera(f);
    const st = sceneState(f);

    sctx.setTransform(K * s, 0, 0, K * s, K * (960 - 960 * s + tx), K * (540 - 540 * s + ty));
    sctx.clearRect(-2000, -2000, 6000, 6000);
    drawScene(sctx, st, f);
    const px = sctx.getImageData(0, 0, SW, SH).data;

    const R = width / 1920;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // underpainting
    const under = iv(f, [C.paintStart + 90, C.paintEnd + 30], [0, 1]);
    if (under > 0) {
      ctx.globalAlpha = under;
      ctx.filter = `blur(${5 * R}px)`;
      ctx.drawImage(sample, 0, 0, width, height);
      ctx.filter = "none";
    }

    const boil = Math.floor(f / 8);
    const lum = (i: number) => px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11;
    for (const d of dabs) {
      if (f < d.t0) continue;
      const pop = Math.min(1, (f - d.t0) / 10);
      const jx = (random(`bx${d.seed}-${boil}`) - 0.5) * 3;
      const jy = (random(`by${d.seed}-${boil}`) - 0.5) * 3;
      const X = 960 + (d.x + jx - 960) * s + tx;
      const Y = 540 + (d.y + jy - 540) * s + ty;
      if (X < -40 || X > 1960 || Y < -40 || Y > 1120) continue;
      const sx = Math.min(SW - 3, Math.max(2, Math.round(X * K)));
      const sy = Math.min(SH - 3, Math.max(2, Math.round(Y * K)));
      const i = (sy * SW + sx) * 4;
      const gx = lum(i + 8) - lum(i - 8);
      const gy = lum(i + SW * 8) - lum(i - SW * 8);
      const g2 = gx * gx + gy * gy;
      // stroke along edges; horizontal-ish in flat areas (sky, sand, floor)
      // flat areas: vertical strokes on columns and walls, horizontal in sky / sand / floor
      const upright = (Math.abs(d.x - 960) > 420 && d.y > 0) || (d.y > 170 && d.y < 712);
      const ang = g2 > 160 ? Math.atan2(gy, gx) + Math.PI / 2 : (upright ? Math.PI / 2 : 0) + d.ang * 0.7;
      const k = 1 + d.b;
      const r = Math.min(255, px[i] * k * (1 + d.h));
      const g = Math.min(255, px[i + 1] * k);
      const b = Math.min(255, px[i + 2] * k * (1 - d.h));
      ctx.globalAlpha = 0.93 * pop;
      ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
      ctx.beginPath();
      ctx.ellipse(X * R, Y * R, (d.len / 2) * s * R * (0.4 + 0.6 * pop), (d.wid / 2) * s * R, ang + (random(`ba${d.seed}-${boil}`) - 0.5) * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [f, width, height, sample, dabs]);

  return <canvas ref={ref} width={width} height={height} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }} />;
};
