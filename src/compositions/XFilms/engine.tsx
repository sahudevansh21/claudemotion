import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Stage } from "../../components/Stage";
import { Reveal, Swap, Typed, bgFrom, path, pulse } from "../Oryn/motion";

/** Reference-grammar film engine: in-place word swaps, cursor/typing caret leads, one idea per beat on one flat colour, cards rise from below, chips float and cluster, centred logo end. Everything is driven by the frame. */
export type Tone = { bg: string; ink: string; accent: string; mute: string; card: string; line: string; pill: string; pillInk: string };
export type Beat = {
  id: string; k: "swap" | "type" | "cards" | "rows" | "cluster" | "chart" | "end"; bg: string; start: number; end: number;
  label?: string; h?: string; sub?: string; swap?: string[]; text?: string; reply?: string; cards?: { t: string; d?: string }[]; rows?: { a: string; b?: string; c?: string }[]; pick?: number; chips?: string[]; chart?: string; note?: string;
  name?: string; line?: string; url?: string; foot?: string;
};
export type Film = { fps: number; durationInFrames: number; bpm: number; beats: Beat[] };
export type VTheme = {
  tones: Record<string, Tone>; cw: number; tilt?: boolean;
  backdrop?: (tone: Tone, beat: Beat, f: number) => React.ReactNode;
  h: (fs: number, tone: Tone) => React.CSSProperties; accent: (t: string, tone: Tone) => React.ReactNode;
  s: (fs: number, tone: Tone) => React.CSSProperties; mono: (fs: number, tone: Tone) => React.CSSProperties;
  card: (tone: Tone) => React.CSSProperties; chip: (tone: Tone, i: number) => React.CSSProperties;
  logo: (size: number, tone: Tone) => React.ReactNode; chartLine?: (tone: Tone) => { d: number[]; marks: { i: number; label: string }[] };
};
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = (f: number, a: number, d: number) => interpolate(f, [a, a + d], [0, 1], { ...CLAMP, easing: OUT });
const rise = (f: number, a: number) => { const p = ez(f, a, 28); return { opacity: p, transform: `translateY(${(1 - p) * 140}px)` } as React.CSSProperties; };

const Cur: React.FC<{ x: number; y: number; click: number; tone: Tone }> = ({ x, y, click, tone }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: 60 }}>
    {click > 0 && <div style={{ position: "absolute", left: -40 * click - 4, top: -40 * click - 4, width: 80 * click + 8, height: 80 * click + 8, borderRadius: 999, border: `4px solid ${tone.accent}`, opacity: 1 - click }} />}
    <svg width={54} height={62} viewBox="0 0 27 31" style={{ position: "absolute", left: -3, top: -3, filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.3))" }}><path d="M3 2 L3 24 L9 18.5 L13 28 L17.5 26 L13.5 16.8 L22 16.5 Z" fill={tone.accent} stroke={tone.bg} strokeWidth={2} strokeLinejoin="round" /></svg>
  </div>
);
type P = { b: Beat; th: VTheme; tone: Tone };
const Head: React.FC<P & { fs?: number; top?: number }> = ({ b, th, tone, fs = 84, top = 130 }) => (<>
  {b.label && <Reveal at={0}><div style={{ ...th.mono(22, tone), position: "absolute", left: 140, top: top - 54 }}>{b.label}</div></Reveal>}
  {b.h && <Reveal at={6}><div style={{ ...th.h(fs, tone), position: "absolute", left: 140, right: 140, top, lineHeight: 1.04 }}>{b.h}</div></Reveal>}
</>);

const SwapBeat: React.FC<P> = ({ b, th, tone }) => {
  const items = b.swap ?? []; const each = 72; const at = 40;
  const fs2 = Math.min(190, 1640 / (Math.max(...items.map((s) => s.length)) * th.cw * 1.04));
  return (<AbsoluteFill>
    {b.label && <Reveal at={0}><div style={{ ...th.mono(24, tone), position: "absolute", left: 140, top: 270 }}>{b.label}</div></Reveal>}
    <Reveal at={6}><div style={{ ...th.h(Math.min(124, 1640 / ((b.h ?? "").length * th.cw * 1.04)), tone), position: "absolute", left: 140, top: 330, whiteSpace: "nowrap" }}>{b.h}</div></Reveal>
    <div style={{ position: "absolute", left: 140, top: 480 }}><Swap items={items.map((t) => th.accent(t, tone))} at={at} each={each} style={th.h(fs2, tone)} /></div>
    {b.sub && <Reveal at={at + each * (items.length - 1) + 10}><div style={{ ...th.s(40, tone), position: "absolute", left: 140, right: 200, top: 790 }}>{b.sub}</div></Reveal>}
  </AbsoluteFill>);
};
const TypeBeat: React.FC<P> = ({ b, th, tone }) => {
  const f = useCurrentFrame(); const text = b.text ?? ""; const cps = 22; const startT = 78; const done = startT + Math.ceil((text.length * 60) / cps);
  const c = path(f, [[0, 1500, 900], [56, 980, 560], [80, 980, 560], [110, 1560, 860]] as [number, number, number][]);
  const fs = Math.min(64, 1180 / (text.length * th.cw * 0.62 / 1) ) ;
  return (<AbsoluteFill>
    {b.label && <Reveal at={0}><div style={{ ...th.mono(24, tone), position: "absolute", left: 260, top: 290 }}>{b.label}</div></Reveal>}
    <div style={{ position: "absolute", left: 260, top: 360, width: 1400, minHeight: 260, padding: "56px 64px", boxSizing: "border-box", ...th.card(tone), ...rise(f, 6) }}>
      <Typed text={text} at={startT} cps={cps} color={tone.accent} style={{ ...th.s(Math.max(54, Math.min(78, fs * 1.15)), tone), color: tone.ink, lineHeight: 1.2 }} />
    </div>
    {b.reply && <Reveal at={done + 14}><div style={{ ...th.h(66, tone), position: "absolute", left: 260, right: 260, top: 700, lineHeight: 1.1 }}>{th.accent(b.reply, tone)}</div></Reveal>}
    <Cur x={c.x} y={c.y} click={pulse(f, 56)} tone={tone} />
  </AbsoluteFill>);
};
const tiltWrap = (th: VTheme, f: number, kids: React.ReactNode) => th.tilt ? (<AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 45%" }}><div style={{ position: "absolute", inset: 0, transform: `rotateX(${7 + Math.sin(f / 90) * 1}deg) rotateY(${-9 + Math.sin(f / 110) * 1.5}deg) scale(0.94)`, transformStyle: "preserve-3d" }}>{kids}</div></AbsoluteFill>) : <>{kids}</>;
const CardsBeat: React.FC<P> = ({ b, th, tone }) => {
  const f = useCurrentFrame(); const cs = b.cards ?? []; const n = cs.length; const gap = 30; const w = (1640 - gap * (n - 1)) / n; const pick = b.pick ?? 0; const top = 420; const h = 480;
  const px = 140 + pick * (w + gap) + w / 2;
  const c = path(f, [[0, 1700, 940], [120, px + 30, top + h - 120], [190, px + 30, top + h - 120]] as [number, number, number][]);
  const hl = ez(f, 190, 18);
  return (<AbsoluteFill>
    <Head b={b} th={th} tone={tone} />
    {tiltWrap(th, f, cs.map((card, i) => (
      <div key={i} style={{ position: "absolute", left: 140 + i * (w + gap), top, width: w, height: h, padding: 36, boxSizing: "border-box", ...th.card(tone), ...rise(f, 24 + i * 14), outline: i === pick ? `${6 * hl}px solid ${tone.accent}` : "none", transform: `${rise(f, 24 + i * 14).transform} scale(${i === pick ? 1 + 0.035 * hl : 1})` }}>
        <div style={{ ...th.h(n > 3 ? 44 : 54, tone), lineHeight: 1.05 }}>{card.t}</div>
        {card.d && <div style={{ ...th.s(n > 3 ? 26 : 30, tone), color: tone.mute, marginTop: 22, lineHeight: 1.3 }}>{card.d}</div>}
      </div>)))}
    <Cur x={c.x} y={c.y} click={pulse(f, 190)} tone={tone} />
  </AbsoluteFill>);
};
const RowsBeat: React.FC<P> = ({ b, th, tone }) => {
  const f = useCurrentFrame(); const rows = b.rows ?? []; const rh = 118; const top = 340; const pick = b.pick ?? 0; const hl = ez(f, 200, 16);
  const c = path(f, [[0, 1700, 950], [150, 1250, top + pick * rh + 50], [200, 1250, top + pick * rh + 50]] as [number, number, number][]);
  return (<AbsoluteFill>
    <Head b={b} th={th} tone={tone} fs={78} top={150} />
    {tiltWrap(th, f, <>{rows.map((r, i) => (
      <div key={i} style={{ position: "absolute", left: 140, width: 1640, top: top + i * rh, height: rh - 10, ...rise(f, 24 + i * 12) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: tone.pill, opacity: i === pick ? hl : 0, transform: `scale(${1 + (i === pick ? 0.02 * hl : 0)})`, boxShadow: i === pick ? "0 18px 40px rgba(0,0,0,0.25)" : "none" }} />
        {i !== pick && <div style={{ position: "absolute", left: 20, right: 20, bottom: 0, height: 2, background: tone.line }} />}
        <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center", padding: "0 44px", gap: 30, color: i === pick && hl > 0.5 ? tone.pillInk : tone.ink }}>
          <div style={{ ...th.s(46, tone), color: "inherit", flex: 1.9, fontWeight: 600 }}>{r.a}</div>
          <div style={{ ...th.s(42, tone), color: "inherit", flex: 1 }}>{r.b}</div>
          <div style={{ ...th.mono(26, tone), color: "inherit", flex: 1.3, textAlign: "right", opacity: 0.8, whiteSpace: "nowrap" }}>{r.c}</div>
        </div>
      </div>))}</>)}
    {b.sub && <Reveal at={215}><div style={{ ...th.s(36, tone), position: "absolute", left: 140, right: 200, top: top + rows.length * rh + 30, color: tone.mute }}>{b.sub}</div></Reveal>}
    <Cur x={c.x} y={c.y} click={pulse(f, 200)} tone={tone} />
  </AbsoluteFill>);
};
const ClusterBeat: React.FC<P> = ({ b, th, tone }) => {
  const f = useCurrentFrame(); const chips = b.chips ?? [];
  return (<AbsoluteFill>
    <Head b={b} th={th} tone={tone} />
    <div style={{ position: "absolute", left: 200, right: 200, top: 440, display: "flex", flexWrap: "wrap", gap: 26, justifyContent: "center" }}>
      {chips.map((t, i) => {
        const p = ez(f, 16 + i * 10, 56); const dx = (random(`cx${b.id}${i}`) - 0.5) * 1400; const dy = (random(`cy${b.id}${i}`) - 0.5) * 700;
        return <div key={i} style={{ ...th.chip(tone, i), padding: "24px 38px", opacity: p, transform: `translate(${(1 - p) * dx + Math.sin(f / 38 + i) * 7}px, ${(1 - p) * dy + Math.cos(f / 44 + i * 2) * 7}px) rotate(${(1 - p) * (random(`cr${i}`) - 0.5) * 30}deg)`, filter: `blur(${(1 - p) * 10}px)` }}>{t}</div>;
      })}
    </div>
    {b.sub && <Reveal at={150}><div style={{ ...th.s(36, tone), position: "absolute", left: 140, right: 200, top: 860, color: tone.mute }}>{b.sub}</div></Reveal>}
  </AbsoluteFill>);
};
const ChartBeat: React.FC<P> = ({ b, th, tone }) => {
  const f = useCurrentFrame(); const ch = th.chartLine?.(tone); if (!ch) return null;
  const w = 1640; const h = 420; const x0 = 140; const y0 = 470; const lo = Math.min(...ch.d); const hi = Math.max(...ch.d);
  const pts = ch.d.map((v, i) => [x0 + (i / (ch.d.length - 1)) * w, y0 + h - ((v - lo) / (hi - lo)) * h] as [number, number]);
  const dstr = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const prog = ez(f, 30, 150);
  return (<AbsoluteFill>
    <Head b={b} th={th} tone={tone} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={x0} y1={y0 + h + 14} x2={x0 + w} y2={y0 + h + 14} stroke={tone.line} strokeWidth={2} />
      <path d={dstr} fill="none" stroke={tone.ink} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog} strokeLinejoin="round" />
      {ch.marks.map((m) => { const p = pts[m.i]; const on = ez(f, 30 + (m.i / ch.d.length) * 150 + 6, 14); return (<g key={m.label} opacity={on}><circle cx={p[0]} cy={p[1]} r={9} fill={tone.ink} /><text x={p[0]} y={p[1] + (m.label === "Peak" ? -28 : 46)} textAnchor="middle" style={{ ...th.mono(22, tone), fill: tone.ink }}>{m.label}</text></g>); })}
    </svg>
    {b.note && <Reveal at={190}><div style={{ ...th.mono(20, tone), position: "absolute", left: 140, top: 960 }}>{b.note}</div></Reveal>}
  </AbsoluteFill>);
};
const EndBeat: React.FC<P> = ({ b, th, tone }) => {
  const f = useCurrentFrame(); const p = ez(f, 14, 40);
  return (<AbsoluteFill>
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", opacity: p, filter: `blur(${(1 - p) * 18}px)`, transform: `scale(${0.86 + 0.14 * p})` }}>{th.logo(340, tone)}</div>
    {b.name && <Reveal at={40}><div style={{ ...th.h(104, tone), position: "absolute", left: 0, right: 0, top: 500, textAlign: "center" }}>{b.name}</div></Reveal>}
    <Reveal at={70}><div style={{ ...th.s(58, tone), position: "absolute", left: 180, right: 180, top: 650, textAlign: "center", lineHeight: 1.15 }}>{b.line}</div></Reveal>
    {b.url && <Reveal at={110}><div style={{ ...th.mono(30, tone), position: "absolute", left: 0, right: 0, top: 860, textAlign: "center" }}>{b.url}</div></Reveal>}
    {b.foot && <Reveal at={130}><div style={{ ...th.mono(15, tone), position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", opacity: 0.6 }}>{b.foot}</div></Reveal>}
  </AbsoluteFill>);
};
const BEATS: Record<Beat["k"], React.FC<P>> = { swap: SwapBeat, type: TypeBeat, cards: CardsBeat, rows: RowsBeat, cluster: ClusterBeat, chart: ChartBeat, end: EndBeat };

export const makeFilm = (th: VTheme, film: Film, audio: string): React.FC => () => {
  const f = useCurrentFrame();
  const keys: [number, string][] = film.beats.map((b) => [b.start, th.tones[b.bg].bg]);
  return (
    <AbsoluteFill style={{ background: bgFrom(keys)(f) }}>
      <Stage>
        {film.beats.map((b) => {
          const tone = th.tones[b.bg]; const B = BEATS[b.k];
          return (
            <Sequence key={b.id} name={b.id} from={b.start} durationInFrames={b.end - b.start + 14} premountFor={60}>
              {th.backdrop?.(tone, b, f - b.start)}
              <B b={b} th={th} tone={tone} />
            </Sequence>
          );
        })}
      </Stage>
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};
