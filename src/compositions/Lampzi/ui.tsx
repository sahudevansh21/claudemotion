import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import widths from "./widths.json";

loadFont({ family: "Poppins", url: staticFile("lampzi/fonts/poppins-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: "Poppins", url: staticFile("lampzi/fonts/poppins-latin-500-normal.woff2"), weight: "500" });
loadFont({ family: "Poppins", url: staticFile("lampzi/fonts/poppins-latin-600-normal.woff2"), weight: "600" });
loadFont({ family: "Poppins", url: staticFile("lampzi/fonts/poppins-latin-700-normal.woff2"), weight: "700" });
loadFont({ family: "Fredoka", url: staticFile("lampzi/fonts/fredoka-latin-700-normal.woff2"), weight: "700" });

/** Lampzi palette sampled from the supplied site screenshots. */
export const L = { green: "#67a285", greenDeep: "#4f8a6b", greenSoft: "#e3f0e9", ink: "#353e49", paper: "#fbfbfb", white: "#ffffff", muted: "#7b8591", line: "#e6e8eb", dark: "#121414", darkRow: "#1d2020", red: "#e5484d", amber: "#e5a03a", blue: "#3b82f6" };
export const SANS = "Poppins, system-ui, sans-serif";
export const BRAND = "Fredoka, Poppins, sans-serif";
export const MONO = "'JetBrains Mono', ui-monospace, monospace";
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IO = Easing.bezier(0.65, 0, 0.35, 1);
export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ez = (f: number, a: number, d: number, e = OUT) => interpolate(f, [a, a + d], [0, 1], { ...CL, easing: e });
export const W = widths as Record<string, number>;

/** Camera: keys [frame, scale, focalX, focalY] in 1920x1080 design space; eased between keys. */
export type CamKey = [number, number, number, number];
export const camStyle = (f: number, keys: CamKey[]): React.CSSProperties => {
  const fr = keys.map((k) => k[0]);
  const e = { ...CL, easing: IO };
  const s = interpolate(f, fr, keys.map((k) => k[1]), e);
  const cx = interpolate(f, fr, keys.map((k) => k[2]), e);
  const cy = interpolate(f, fr, keys.map((k) => k[3]), e);
  return { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})` };
};

/* ------------------------------- marks ------------------------------- */
export const FanMark: React.FC<{ size: number; color?: string; grow?: number }> = ({ size, color = L.green, grow = 1 }) => {
  const rays = Array.from({ length: 9 }, (_, i) => {
    const th = ((100 + i * 20) * Math.PI) / 180;
    const k = 1 - 0.18 * Math.abs(i - 4) / 4;
    const r1 = 40, r2 = 40 + 62 * k * grow;
    return { x1: 110 + Math.cos(th) * r1, y1: 100 - Math.sin(th) * r1, x2: 110 + Math.cos(th) * r2, y2: 100 - Math.sin(th) * r2 };
  });
  return (
    <svg width={size * 0.6} height={size} viewBox="0 0 120 200" style={{ overflow: "visible" }}>
      {rays.map((r, i) => (<line key={i} {...r} stroke={color} strokeWidth={6.5} strokeLinecap="round" />))}
    </svg>
  );
};
/** Loader: full radial burst, rotating, rays chase. */
export const Burst: React.FC<{ size: number; color?: string; t: number; n?: number }> = ({ size, color = L.green, t, n = 12 }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + t * 0.09;
      const ph = (((i / n) - t * 0.035) % 1 + 1) % 1;
      const op = 0.22 + 0.78 * ph;
      return <line key={i} x1={Math.cos(a) * 20} y1={Math.sin(a) * 20} x2={Math.cos(a) * 42} y2={Math.sin(a) * 42} stroke={color} strokeWidth={9} strokeLinecap="round" opacity={op} />;
    })}
  </svg>
);

/* ------------------------------- status line ------------------------------- */
export type StatusItem = { text: string; at: number; out?: number; font?: string; weight?: number };
/** Centred [loader + text] with width-animated text and in-place vertical swap. */
export const StatusLine: React.FC<{ items: StatusItem[]; size: number; color?: string; loader?: React.ReactNode; y?: number; collapseAt?: number }> = ({ items, size, color = L.ink, loader, y = 540, collapseAt }) => {
  const f = useCurrentFrame();
  let cur = 0;
  items.forEach((it, i) => { if (f >= it.at) cur = i; });
  const it = items[cur], prev = items[Math.max(0, cur - 1)];
  const p = ez(f, it.at, 22, OUT);
  const wNow = W[it.text] * size, wPrev = cur === 0 ? 0 : W[prev.text] * size;
  let width = wPrev + (wNow - wPrev) * p;
  if (collapseAt !== undefined) width *= 1 - ez(f, collapseAt, 22, IO);
  const loaderSize = size * 0.92;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y - size, height: size * 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: loaderSize, height: loaderSize, flexShrink: 0 }}>{loader ?? <Burst size={loaderSize} t={f} color={color} />}</div>
      <div style={{ width, height: size * 1.4, marginLeft: width > 2 ? size * 0.16 : 0, overflow: "hidden", position: "relative" }}>
        {cur > 0 && p < 1 && (
          <div style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", fontFamily: prev.font ?? SANS, fontWeight: prev.weight ?? 600, fontSize: size, letterSpacing: -size * 0.03, color, lineHeight: `${size * 1.4}px`, transform: `translateY(${-p * size * 1.1}px)`, filter: `blur(${p * 6}px)`, opacity: 1 - p }}>{prev.text}</div>
        )}
        <div style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", fontFamily: it.font ?? SANS, fontWeight: it.weight ?? 600, fontSize: size, letterSpacing: -size * 0.03, color, lineHeight: `${size * 1.4}px`, transform: `translateY(${(1 - p) * size * 1.1}px)`, filter: `blur(${(1 - p) * 6}px)`, opacity: Math.min(1, p * 1.6) }}>{it.text}</div>
      </div>
    </div>
  );
};

/* ------------------------------- icons ------------------------------- */
const I: React.FC<{ s?: number; c?: string; children: React.ReactNode }> = ({ s = 28, c = L.ink, children }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
export const IcoSearch: React.FC<{ s?: number; c?: string }> = (p) => (<I {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></I>);
export const IcoFile: React.FC<{ s?: number; c?: string }> = (p) => (<I {...p}><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5" /></I>);
export const IcoPen: React.FC<{ s?: number; c?: string }> = (p) => (<I {...p}><path d="M4 20l4-1 11-11a2.1 2.1 0 00-3-3L5 16z" /><path d="M14 7l3 3" /></I>);
export const IcoTerm: React.FC<{ s?: number; c?: string }> = (p) => (<I {...p}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M7 10l3 2-3 2M12 15h4" /></I>);
export const IcoAlert: React.FC<{ s?: number; c?: string }> = (p) => (<I {...p} c={p.c ?? L.red}><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5v.1" /></I>);
export const IcoChev: React.FC<{ s?: number; c?: string; up?: boolean }> = ({ s = 22, c = L.muted, up }) => (<I s={s} c={c}><path d={up ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} /></I>);
export const IcoPlus: React.FC<{ s?: number; c?: string }> = (p) => (<I {...p}><path d="M12 5v14M5 12h14" /></I>);
export const IcoSliders: React.FC<{ s?: number; c?: string }> = (p) => (<I {...p}><path d="M4 8h9M17 8h3M4 16h3M11 16h9" /><circle cx="15" cy="8" r="2" /><circle cx="9" cy="16" r="2" /></I>);
export const Spin: React.FC<{ s?: number; c?: string }> = ({ s = 26, c = L.ink }) => <Burst size={s} t={useCurrentFrame()} color={c} n={8} />;
export const CheckDot: React.FC<{ s?: number; on: number; color?: string }> = ({ s = 40, on, color = L.ink }) => (
  <svg width={s} height={s} viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="18" fill={on > 0.5 ? color : "none"} stroke={color} strokeWidth={2.4} opacity={on > 0.5 ? 1 : 0.55} />
    {on > 0.5 && <path d="M12 20.5l5.5 5.5L28.5 14.5" stroke="#fff" strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);
export const Tag: React.FC<{ children: React.ReactNode; fs?: number; dark?: boolean; mono?: boolean; green?: boolean }> = ({ children, fs = 22, dark, mono, green }) => (
  <span style={{ fontFamily: mono ? MONO : SANS, fontSize: fs, padding: `${fs * 0.14}px ${fs * 0.55}px`, borderRadius: 99, border: `1.5px solid ${dark ? "rgba(255,255,255,0.22)" : green ? L.greenSoft : L.line}`, background: green ? L.greenSoft : "transparent", color: dark ? "rgba(255,255,255,0.85)" : green ? L.greenDeep : L.ink, whiteSpace: "nowrap" }}>{children}</span>
);
export const IllustrativeTag: React.FC<{ dark?: boolean; at?: number }> = ({ dark, at = 0 }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 60, bottom: 46, fontFamily: MONO, fontSize: 15, letterSpacing: 5, textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.4)" : "rgba(53,62,73,0.45)", opacity: ez(f, at, 14) }}>Illustrative</div>;
};
