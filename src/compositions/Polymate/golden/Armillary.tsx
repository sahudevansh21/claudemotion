import { useCurrentFrame } from "remotion";
import { C, GOLD, GOLD_HI, INK, RING, iv, lerp } from "./shared";

/**
 * The astronomical instrument: four gilded rings in true 3D (rotated normals,
 * light perspective), drawn as ink-outlined line art like the reference's
 * characters. Split into a back and a front layer so the emblem can sit
 * inside the rings.
 */
type V = [number, number, number];
const norm = (v: V): V => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** Rotation phase: still, then the mechanism wakes and accelerates. */
const phase = (f: number) => {
  const a = C.spinStart;
  const ramp = 180;
  if (f < a) return 0;
  if (f < a + ramp) return ((f - a) * (f - a)) / (2 * ramp);
  return ramp / 2 + (f - a - ramp);
};

const RINGS = [
  { r: 1.0, normal: (p: number): V => [Math.cos(p * 0.006 + 1.25), 0.05, Math.sin(p * 0.006 + 1.25)], spin: 0.002 },
  { r: 0.92, normal: (p: number): V => [Math.sin(p * 0.004) * 0.25, Math.cos(0.41), Math.sin(0.41)], spin: 0.012 },
  { r: 0.82, normal: (p: number): V => [Math.sin(p * 0.009 + 2) * 0.7, Math.cos(p * 0.009 + 2) * 0.7, 0.55], spin: -0.008 },
  { r: 0.6, normal: (p: number): V => [Math.cos(p * 0.017), Math.sin(p * 0.013) * 0.6, Math.sin(p * 0.017)], spin: 0.02 },
];

type Seg = { back: string; front: string; ticksB: [number, number][]; ticksF: [number, number][] };

const ringPaths = (f: number, radius: number, flat: number): Seg[] => {
  const p = phase(f);
  return RINGS.map((ring) => {
    let n = norm(ring.normal(p));
    n = norm([lerp(flat, n[0], 0), lerp(flat, n[1], 0), lerp(flat, n[2], 1)]);
    const a: V = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    const u = norm(cross(a, n));
    const v = cross(n, u);
    const R = radius * lerp(flat, ring.r, 1 - (1 - ring.r) * 0.35);
    const spin = p * ring.spin;
    const N = 120;
    let back = "";
    let front = "";
    let prevF: boolean | null = null;
    const ticksB: [number, number][] = [];
    const ticksF: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2 + spin;
      const P: V = [R * (Math.cos(t) * u[0] + Math.sin(t) * v[0]), R * (Math.cos(t) * u[1] + Math.sin(t) * v[1]), R * (Math.cos(t) * u[2] + Math.sin(t) * v[2])];
      const persp = 1 / (1 - P[2] / 1800);
      const x = RING.x + P[0] * persp;
      const y = RING.y - P[1] * persp;
      const isF = P[2] >= 0;
      const cmd = prevF === isF ? "L" : "M";
      if (isF) front += `${cmd}${x.toFixed(1)} ${y.toFixed(1)} `;
      else back += `${cmd}${x.toFixed(1)} ${y.toFixed(1)} `;
      // close the gap across the front/back boundary
      if (prevF !== null && prevF !== isF) {
        if (isF) back += `L${x.toFixed(1)} ${y.toFixed(1)} `;
        else front += `L${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      prevF = isF;
      if (i % 10 === 0 && i < N) (isF ? ticksF : ticksB).push([x, y]);
    }
    return { back, front, ticksB, ticksF };
  });
};

const Strokes: React.FC<{ d: string; ink: number; gold: number; dim?: number; w?: number }> = ({ d, ink, gold, dim = 1, w = 1 }) => (
  <g opacity={dim}>
    <path d={d} fill="none" stroke={INK} strokeWidth={9.5 * w} strokeLinecap="round" strokeLinejoin="round" opacity={ink} />
    <path d={d} fill="none" stroke={GOLD} strokeWidth={6 * w} strokeLinecap="round" strokeLinejoin="round" opacity={gold} />
    <path d={d} fill="none" stroke={GOLD_HI} strokeWidth={1.6 * w} strokeLinecap="round" opacity={gold * 0.75} />
  </g>
);

export const useArmillary = () => {
  const f = useCurrentFrame();
  const flat = iv(f, [C.flatten, C.morph], [0, 1]);
  const open = iv(f, [C.emblemIn - 30, C.emblemIn + 60], [0, 1]);
  const radius = RING.r * lerp(open, 1, 1.12) * lerp(flat, 1, 1.0);
  const segs = ringPaths(f, radius, flat);
  const draw = iv(f, [C.ringsInk, C.ringsInk + 110], [0.25, 1]);
  const gold = iv(f, [C.ringsGold - 20, C.ringsGold + 40], [0, 1]);
  const fade = 1 - iv(f, [C.morph, C.morph + 24], [0, 1]);
  return { f, segs, draw, gold, fade };
};

export const ArmillaryBack: React.FC = () => {
  const { f, segs, draw, gold, fade } = useArmillary();
  if (fade <= 0) return null;
  const glow = iv(f, [C.spinStart, C.beam], [0, 1]);
  const core = iv(f, [C.beam, C.beam + 40], [0, 1]) * (1 - iv(f, [C.emblemIn - 40, C.emblemIn + 20], [0, 1]));
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: fade }}>
      <defs>
        <radialGradient id="gh-core">
          <stop offset="0" stopColor="#E9F0FF" />
          <stop offset="0.35" stopColor="#3E6BFF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#1A3FB0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gh-warm">
          <stop offset="0" stopColor="#FFE2A6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFB060" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={RING.x} cy={RING.y} r={260} fill="url(#gh-warm)" opacity={glow * 0.8} />
      {/* stand */}
      <g opacity={draw}>
        <path d={`M ${RING.x - 46} 690 L ${RING.x + 46} 690 L ${RING.x + 22} 672 L ${RING.x - 22} 672 Z`} fill={GOLD} stroke={INK} strokeWidth={3} strokeLinejoin="round" fillOpacity={gold} />
        <path d={`M ${RING.x} 672 L ${RING.x} ${RING.y + RING.r * 0.98}`} stroke={INK} strokeWidth={8} />
        <path d={`M ${RING.x} 672 L ${RING.x} ${RING.y + RING.r * 0.98}`} stroke={GOLD} strokeWidth={4} opacity={gold} />
      </g>
      {segs.map((s, i) => (
        <g key={i}>
          <Strokes d={s.back} ink={0.55 * draw} gold={0.55 * gold} w={0.85} />
          {s.ticksB.map(([x, y], j) => (
            <circle key={j} cx={x} cy={y} r={3} fill={GOLD_HI} opacity={0.4 * gold} />
          ))}
        </g>
      ))}
      <circle cx={RING.x} cy={RING.y} r={70 + 40 * core} fill="url(#gh-core)" opacity={core} />
      <circle cx={RING.x} cy={RING.y} r={13} fill="#1A3FB0" stroke={INK} strokeWidth={3} opacity={draw * (1 - iv(f, [C.emblemIn - 40, C.emblemIn], [0, 1]))} />
    </svg>
  );
};

export const ArmillaryFront: React.FC = () => {
  const { segs, draw, gold, fade } = useArmillary();
  if (fade <= 0) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: fade }}>
      {segs.map((s, i) => (
        <g key={i}>
          <Strokes d={s.front} ink={draw} gold={gold} />
          {s.ticksF.map(([x, y], j) => (
            <circle key={j} cx={x} cy={y} r={3.4} fill={GOLD_HI} stroke={INK} strokeWidth={1.2} opacity={gold} />
          ))}
        </g>
      ))}
    </svg>
  );
};
