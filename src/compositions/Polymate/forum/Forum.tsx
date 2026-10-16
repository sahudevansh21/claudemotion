import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { PM, PM_EASE, PM_FONTS } from "../brand";
import { ez, lerp } from "../components/motion";
import tl from "./forum.json";

/** Absolute cue frames (60 fps) — shared with the audio script. */
const C = tl.cues;

const IVORY = "#F6F0E4";
const SAPPHIRE = "#0E2A7A";
const SAPPHIRE_DEEP = "#071645";
const GOLD = PM.goldLight;
const ANCHOR: [number, number] = [1340, 540];
const EMBLEM_W = 520;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const iv = (f: number, inp: number[], out: number[], easing = PM_EASE.inOut) =>
  interpolate(f, inp, out, { ...CLAMP, easing });

/* ------------------------------------------------------------------ */
/* Statements: left-aligned serif lines that type on behind a gold caret */
/* ------------------------------------------------------------------ */
const Typed: React.FC<{ text: string; at: number; size?: number; step?: number; style?: React.CSSProperties }> = ({
  text,
  at,
  size = 84,
  step = 2.2,
  style,
}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) / step)));
  if (f < at) return null;
  const typing = n < text.length;
  const blink = typing || Math.floor((f - at) / 30) % 2 === 0;
  const caretGone = f > at + text.length * step + 70;
  return (
    <div
      style={{
        fontFamily: PM_FONTS.serif,
        fontSize: size,
        lineHeight: 1.05,
        color: IVORY,
        letterSpacing: -0.5,
        whiteSpace: "pre",
        textShadow: "0 2px 30px rgba(20,10,4,0.45)",
        ...style,
      }}
    >
      {text.slice(0, n)}
      {!caretGone ? (
        <span
          style={{
            display: "inline-block",
            width: size * 0.06,
            height: size * 0.82,
            marginLeft: size * 0.08,
            transform: `translateY(${size * 0.1}px)`,
            background: GOLD,
            opacity: blink ? 1 : 0,
          }}
        />
      ) : null}
    </div>
  );
};

/** Reference-style beat: a line types on, holds, then lifts away. */
const Beat: React.FC<{ lines: string[]; at: number; out: number; gap?: number }> = ({ lines, at, out, gap = 60 }) => {
  const f = useCurrentFrame();
  const o = 1 - iv(f, [out, out + 24], [0, 1]);
  const y = iv(f, [out, out + 24], [0, -30]);
  if (f < at || o <= 0) return null;
  let t = at;
  return (
    <div style={{ position: "absolute", left: 140, top: 540, transform: `translateY(-50%) translateY(${y}px)`, opacity: o }}>
      {lines.map((l, i) => {
        const start = t;
        t += l.length * 2.2 + gap * 0.2;
        return <Typed key={i} text={l} at={i === 0 ? at : start} />;
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Environment: the banner's forum as a plate, with dolly / defocus      */
/* ------------------------------------------------------------------ */
const Forum: React.FC = () => {
  const f = useCurrentFrame();
  const dolly = iv(f, [0, C.morphStart], [1.0, 1.16], PM_EASE.inOut);
  const hold = iv(f, [C.morphStart, C.pullStart], [0, 0.06], (x) => x);
  const pull = iv(f, [C.pullStart, C.pullEnd], [0, 1]);
  const scale = lerp(pull, dolly + hold, 1.03);
  const blur = lerp(pull, iv(f, [C.emblemIn, C.morphEnd], [0, 14]), 1.5);
  const dark = lerp(pull, iv(f, [C.emblemIn, C.morphEnd], [0.18, 0.62]), 0.3);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1B120C" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "52% 70%", filter: `blur(${blur}px) saturate(0.95)` }}>
        <Img src={staticFile("polymate/img/forum.jpg")} style={{ width: 1920, height: 1081, objectFit: "cover" }} />
      </AbsoluteFill>
      {/* warm haze + left falloff for the statements */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,214,160,0.10) 0%, rgba(255,190,120,0.06) 60%, rgba(40,20,10,0.25) 100%)" }} />
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(22,12,6,${0.55 + dark * 0.3}) 0%, rgba(22,12,6,${dark * 0.6}) 48%, rgba(22,12,6,${dark * 0.5}) 100%)` }} />
    </AbsoluteFill>
  );
};

/** Crisp foreground columns framing the plate; they part as the camera dollies in. */
const Columns: React.FC = () => {
  const f = useCurrentFrame();
  const open = iv(f, [0, C.emblemIn + 60], [0, 1]);
  const back = iv(f, [C.pullStart, C.pullEnd], [0, 1]);
  const spread = lerp(back, lerp(open, 0, 260), 40);
  const o = lerp(back, 1 - iv(f, [C.emblemIn, C.morphStart], [0, 1]), 1);
  const col = (x: number, flip: boolean) => (
    <g transform={`translate(${x} 0) ${flip ? "scale(-1 1)" : ""}`}>
      <defs>
        <linearGradient id={`pmf-col-${flip ? "r" : "l"}`} x1="0" x2="1">
          <stop offset="0" stopColor="#2A1C14" />
          <stop offset="0.55" stopColor="#6B5444" />
          <stop offset="1" stopColor="#24170F" />
        </linearGradient>
      </defs>
      <rect x={-30} y={-20} width={230} height={56} fill="#3A291E" />
      <rect x={-12} y={36} width={194} height={26} fill="#2E2017" />
      <rect x={0} y={62} width={170} height={1100} fill={`url(#pmf-col-${flip ? "r" : "l"})`} />
      {[0.18, 0.36, 0.54, 0.72].map((k) => (
        <rect key={k} x={170 * k} y={62} width={5} height={1100} fill="rgba(0,0,0,0.28)" />
      ))}
      <path d="M200 40 L 320 40 L 320 520 L 260 485 L 200 520 Z" fill={PM.red} opacity={0.9} transform={`rotate(${Math.sin(f / 70) * 0.5} 260 40)`} />
      <circle cx={260} cy={220} r={32} fill="none" stroke={GOLD} strokeWidth={3} opacity={0.75} />
    </g>
  );
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
      {col(-60 - spread, false)}
      {col(1980 + spread, true)}
    </svg>
  );
};

/** A faint golden signal that travels through the forum to the anchor point. */
const Signal: React.FC = () => {
  const f = useCurrentFrame();
  const d = `M 60 980 C 420 860, 700 900, 930 760 S 1220 590, ${ANCHOR[0]} ${ANCHOR[1]}`;
  const t = iv(f, [C.signalStart, C.signalEnd], [0, 1], PM_EASE.inOut);
  const fade = 1 - iv(f, [C.signalEnd + 20, C.signalEnd + 120], [0, 1]);
  const glow = iv(f, [C.signalEnd - 20, C.signalEnd + 10, C.signalEnd + 90], [0, 1, 0]);
  if (f < C.signalStart || fade <= 0) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: fade }}>
      <defs>
        <radialGradient id="pmf-point">
          <stop offset="0" stopColor="#FFF4D6" />
          <stop offset="0.3" stopColor={GOLD} stopOpacity="0.6" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={d} fill="none" stroke={GOLD} strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t} opacity={0.55} style={{ filter: `drop-shadow(0 0 6px ${GOLD})` }} />
      <path d={d} fill="none" stroke="#FFF1CF" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={`0.04 1`} strokeDashoffset={0.04 - t} opacity={t < 1 ? 0.95 : 0} style={{ filter: `drop-shadow(0 0 10px ${GOLD})` }} />
      <circle cx={ANCHOR[0]} cy={ANCHOR[1]} r={40 + 220 * glow} fill="url(#pmf-point)" opacity={glow} />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Emblem (the supplied logo, unaltered) with a gentle orbit + sheen      */
/* ------------------------------------------------------------------ */
const Emblem: React.FC<{ x: number; y: number; w: number; opacity: number; orbit?: number }> = ({ x, y, w, opacity, orbit = 1 }) => {
  const f = useCurrentFrame();
  const h = (w * 1232) / 1476;
  const ry = Math.sin(f / 120) * 9 * orbit;
  const rx = Math.cos(f / 150) * 3 * orbit;
  const float = Math.sin(f / 90) * 6 * orbit;
  const sheen = ((f % 300) / 300) * 2.4 - 0.7;
  const mask = { WebkitMaskImage: `url(${staticFile("polymate/img/emblem.png")})`, WebkitMaskSize: "100% 100%", maskImage: `url(${staticFile("polymate/img/emblem.png")})`, maskSize: "100% 100%" } as React.CSSProperties;
  if (opacity <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2 + float, width: w, height: h, perspective: 1800, opacity }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotateY(${ry}deg) rotateX(${rx}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", left: "8%", right: "8%", bottom: -h * 0.08, height: h * 0.14, borderRadius: "50%", background: "rgba(10,5,2,0.45)", filter: "blur(18px)" }} />
        <Img src={staticFile("polymate/img/emblem.png")} style={{ position: "absolute", inset: 0, width: w, height: h, filter: "drop-shadow(0 18px 30px rgba(20,10,4,0.45))" }} />
        <div style={{ position: "absolute", inset: 0, ...mask, background: `linear-gradient(110deg, transparent ${(sheen - 0.12) * 100}%, rgba(255,250,235,0.42) ${sheen * 100}%, transparent ${(sheen + 0.12) * 100}%)`, mixBlendMode: "screen" }} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Sapphire interface                                                    */
/* ------------------------------------------------------------------ */
const MARKETS = [
  { q: "Fed cuts rates at the next meeting?", yes: 41, seed: "m1" },
  { q: "BTC above $100K by year end?", yes: 68, seed: "m2" },
  { q: "ETH ETF inflows positive this week?", yes: 57, seed: "m3" },
  { q: "Rain in Rome tomorrow?", yes: 22, seed: "m4" },
];

const Spark: React.FC<{ seed: string; up: boolean }> = ({ seed, up }) => {
  const pts = Array.from({ length: 24 }, (_, i) => {
    const y = 0.5 + (up ? -0.3 : 0.3) * (i / 23) + (random(`${seed}${i}`) - 0.5) * 0.35;
    return `${(i / 23) * 150},${Math.max(0.05, Math.min(0.95, y)) * 44}`;
  }).join(" ");
  return (
    <svg width={150} height={44}>
      <polyline points={pts} fill="none" stroke={up ? GOLD : "#C98B7A"} strokeWidth={2.5} strokeLinejoin="round" />
    </svg>
  );
};

/** Tile geometry of the lapis stone inside the logo (measured on the supplied image). */
const tileRect = (cx: number, cy: number, w: number) => {
  const h = (w * 1232) / 1476;
  return { x: cx - w / 2 + 0.17 * w, y: cy - h / 2 + 0.03 * h, w: 0.66 * w, h: 0.74 * h };
};

const PANEL = { x: 960, y: 230, w: 760, h: 640 };

const Interface: React.FC<{ morph: number; contentO: number }> = ({ morph, contentO }) => {
  const f = useCurrentFrame();
  const tile = tileRect(ANCHOR[0], ANCHOR[1], EMBLEM_W);
  const x = lerp(morph, tile.x, PANEL.x);
  const y = lerp(morph, tile.y, PANEL.y);
  const w = lerp(morph, tile.w, PANEL.w);
  const h = lerp(morph, tile.h, PANEL.h);
  const skew = lerp(morph, -12, 0);
  const radius = lerp(morph, 46, 34);
  if (morph <= 0.001) return null;

  // discovery / selection / trade state
  const scroll = iv(f, [C.scrollStart, C.scrollEnd], [0, -70]);
  const tapPulse = iv(f, [C.tap, C.tap + 30], [0, 1], (t) => t);
  const selected = f >= C.tap;
  const detail = iv(f, [C.detail, C.detail + 40], [0, 1]);
  const slide = iv(f, [C.slideStart, C.slideEnd], [0, 1], PM_EASE.inOut);
  const exec = iv(f, [C.slideEnd, C.execEnd], [0, 1], (t) => t);
  const opened = iv(f, [C.opened, C.opened + 30], [0, 1], PM_EASE.out);

  // touch indicator path (reference grammar): absolute design coords
  const touch: [number, number, number][] = [
    [C.cards + 40, 1500, 980],
    [C.scrollStart, 1360, 760],
    [C.scrollEnd, 1360, 600],
    [C.tap, 1300, 568],
    [C.detail + 60, 1310, 700],
    [C.slideStart, 1052 + 40, 776],
    [C.slideEnd, 1052 + 600, 776],
    [C.opened + 40, 1700, 960],
  ];
  const tf = touch.map((p) => p[0]);
  const tx = interpolate(f, tf, touch.map((p) => p[1]), { ...CLAMP, easing: PM_EASE.inOut });
  const ty = interpolate(f, tf, touch.map((p) => p[2]), { ...CLAMP, easing: PM_EASE.inOut });
  const touchO = iv(f, [C.cards + 20, C.cards + 50], [0, 1]) * (1 - iv(f, [C.opened + 20, C.opened + 50], [0, 1])) * contentO;
  const pressing = (f >= C.tap - 4 && f < C.tap + 8) || (f >= C.slideStart && f <= C.slideEnd);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          transform: `skewX(${skew}deg)`,
          borderRadius: radius,
          overflow: "hidden",
          background: `radial-gradient(ellipse at 30% 20%, #2149C9 0%, ${SAPPHIRE} 45%, ${SAPPHIRE_DEEP} 100%)`,
          border: `2px solid ${GOLD}`,
          boxShadow: `0 40px 120px rgba(5,10,40,0.55), 0 0 0 1px rgba(255,240,200,0.15) inset`,
        }}
      >
        {/* marble veining */}
        <svg width={PANEL.w} height={PANEL.h} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox={`0 0 ${PANEL.w} ${PANEL.h}`} preserveAspectRatio="none">
          <g fill="none" stroke="#DDE6FF" strokeLinecap="round">
            <path d="M-20 520 C 120 430, 210 470, 320 360 S 520 210, 790 130" strokeWidth={1.6} opacity={0.18} />
            <path d="M60 660 C 200 560, 330 590, 460 470 S 650 380, 800 360" strokeWidth={1} opacity={0.12} />
            <path d="M-10 120 C 90 140, 160 90, 260 -10" strokeWidth={1.2} opacity={0.14} />
            <path d="M320 360 C 360 420, 340 520, 420 660" stroke={GOLD} strokeWidth={1.2} opacity={0.35} />
          </g>
        </svg>
        <div style={{ position: "absolute", inset: 0, transform: `skewX(${-skew}deg)`, opacity: contentO, fontFamily: PM_FONTS.ui, color: IVORY }}>
          {/* header */}
          <div style={{ position: "absolute", left: 44, top: 36, right: 44, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: PM_FONTS.serif, fontSize: 46 }}>{detail < 0.5 ? "Live Markets" : "Trade"}</div>
            <div style={{ fontFamily: PM_FONTS.mono, fontSize: 15, letterSpacing: 3, color: "rgba(246,240,228,0.55)" }}>ILLUSTRATIVE</div>
          </div>
          <div style={{ position: "absolute", left: 44, right: 44, top: 108, height: 1, background: "rgba(221,184,104,0.45)" }} />
          {/* market list */}
          <div style={{ position: "absolute", left: 44, right: 44, top: 134, bottom: 0, overflow: "hidden", opacity: 1 - detail }}>
            <div style={{ transform: `translateY(${scroll}px)` }}>
              {MARKETS.map((m, i) => {
                const t = iv(f, [C.cards + i * 30, C.cards + i * 30 + 36], [0, 1], PM_EASE.out);
                const sel = selected && i === 1;
                const dim = selected && i !== 1 ? 0.45 : 1;
                return (
                  <div
                    key={m.seed}
                    style={{
                      height: 112,
                      marginBottom: 18,
                      borderRadius: 22,
                      padding: "0 28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: sel ? "rgba(246,240,228,0.14)" : "rgba(246,240,228,0.07)",
                      border: `1.5px solid ${sel ? GOLD : "rgba(246,240,228,0.12)"}`,
                      opacity: t * dim,
                      transform: `translateY(${lerp(t, 24, 0)}px) scale(${sel ? 1 + 0.02 * (1 - Math.abs(1 - tapPulse * 2)) : 1})`,
                    }}
                  >
                    <div style={{ fontSize: 26, fontWeight: 500, maxWidth: 380, lineHeight: 1.25 }}>{m.q}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                      <Spark seed={m.seed} up={m.yes >= 50} />
                      <div style={{ fontSize: 28, fontWeight: 700, color: m.yes >= 50 ? GOLD : "#E3A99A", width: 70, textAlign: "right" }}>{m.yes}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* detail + trade */}
          <div style={{ position: "absolute", left: 44, right: 44, top: 134, opacity: detail, transform: `translateY(${lerp(detail, 30, 0)}px)` }}>
            <div style={{ fontSize: 32, fontWeight: 600 }}>{MARKETS[1].q}</div>
            <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
              <div style={{ flex: 1, height: 96, borderRadius: 20, background: `linear-gradient(135deg, ${GOLD}, ${PM.gold})`, color: PM.ink, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 28px", fontSize: 32, fontWeight: 700 }}>
                YES <span>68¢</span>
              </div>
              <div style={{ flex: 1, height: 96, borderRadius: 20, border: "1.5px solid rgba(246,240,228,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 28px", fontSize: 32, fontWeight: 600, color: "rgba(246,240,228,0.7)" }}>
                NO <span>32¢</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 34, fontSize: 26, color: "rgba(246,240,228,0.75)" }}>
              <span>Amount</span>
              <span style={{ fontWeight: 700, color: IVORY }}>$50</span>
            </div>
            {/* slide to trade → executing → opened */}
            <div style={{ position: "relative", marginTop: 40, height: 96, borderRadius: 48, background: "rgba(246,240,228,0.08)", border: "1.5px solid rgba(221,184,104,0.5)", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 26, letterSpacing: 1, color: "rgba(246,240,228,0.7)", opacity: (1 - slide) * (1 - exec) }}>
                Slide to trade
              </div>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${8 + 92 * slide}%`, background: `linear-gradient(90deg, rgba(221,184,104,0.15), rgba(221,184,104,0.45))`, opacity: 1 - opened }} />
              <div style={{ position: "absolute", top: 8, left: `calc(${slide * 100}% - ${slide * 88}px + 8px)`, width: 80, height: 80, borderRadius: 40, background: `linear-gradient(135deg, #F6DE9C, ${PM.gold})`, boxShadow: "0 6px 18px rgba(0,0,0,0.35)", opacity: 1 - exec, display: "flex", justifyContent: "center", alignItems: "center", color: PM.ink, fontSize: 34, fontWeight: 700 }}>
                →
              </div>
              <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, fontSize: 26, opacity: exec > 0 && opened < 1 ? 1 - opened : 0 }}>
                <span style={{ color: GOLD }}>⚡</span> Executing Trade…
              </div>
              <div style={{ position: "absolute", left: 0, bottom: 0, height: 4, width: `${exec * 100}%`, background: GOLD, opacity: 1 - opened }} />
            </div>
            <div style={{ marginTop: 26, height: 96, borderRadius: 20, background: "rgba(246,240,228,0.95)", color: PM.ink, display: "flex", alignItems: "center", gap: 22, padding: "0 26px", opacity: opened, transform: `translateY(${lerp(opened, 16, 0)}px)` }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, #F6DE9C, ${PM.gold})`, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 30, fontWeight: 700 }}>✓</div>
              <div style={{ fontSize: 28, fontWeight: 600 }}>Position Opened</div>
              <div style={{ marginLeft: "auto", fontSize: 28, fontWeight: 700, color: PM.gold }}>YES · $50</div>
            </div>
          </div>
        </div>
      </div>
      {/* touch indicator */}
      <div
        style={{
          position: "absolute",
          left: tx - 22,
          top: ty - 22,
          width: 44,
          height: 44,
          borderRadius: 22,
          background: "rgba(246,240,228,0.55)",
          border: "2px solid rgba(255,255,255,0.85)",
          transform: `scale(${pressing ? 0.82 : 1})`,
          opacity: touchO,
          boxShadow: "0 4px 18px rgba(0,0,0,0.3)",
        }}
      />
      {f >= C.tap && f < C.tap + 30 ? (
        <div style={{ position: "absolute", left: 1300 - 60 * tapPulse - 22, top: 568 - 60 * tapPulse - 22, width: 44 + 120 * tapPulse, height: 44 + 120 * tapPulse, borderRadius: "50%", border: `2px solid ${GOLD}`, opacity: 1 - tapPulse }} />
      ) : null}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Pedestal + finale                                                     */
/* ------------------------------------------------------------------ */
const Pedestal: React.FC<{ rise: number; scale: number }> = ({ rise, scale }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: `translateY(${lerp(rise, 520, 0)}px) scale(${scale})`, transformOrigin: "960px 1080px", opacity: Math.min(1, rise * 2) }}>
    <defs>
      <linearGradient id="pmf-ped" x1="0" x2="1">
        <stop offset="0" stopColor="#B9AC98" />
        <stop offset="0.45" stopColor="#FBF7EE" />
        <stop offset="1" stopColor="#A89A86" />
      </linearGradient>
      <linearGradient id="pmf-ped-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFDF7" />
        <stop offset="1" stopColor="#D9CDB8" />
      </linearGradient>
    </defs>
    <ellipse cx={960} cy={782} rx={250} ry={22} fill="rgba(20,10,4,0.35)" />
    <rect x={700} y={760} width={520} height={34} rx={6} fill="url(#pmf-ped-top)" />
    <rect x={700} y={790} width={520} height={6} fill={GOLD} opacity={0.8} />
    <rect x={730} y={796} width={460} height={26} fill="url(#pmf-ped)" />
    <rect x={790} y={822} width={340} height={400} fill="url(#pmf-ped)" />
    {[0.12, 0.27, 0.42, 0.58, 0.73, 0.88].map((k) => (
      <rect key={k} x={790 + 340 * k - 3} y={822} width={6} height={400} fill="rgba(90,75,60,0.22)" />
    ))}
    <path d="M820 880 C 880 920, 900 1000, 960 1060" stroke="#9C8F80" strokeWidth={1.2} fill="none" opacity={0.45} />
  </svg>
);

const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const word = ez(f, C.wordmark, 50);
  const tag = ez(f, C.tagline, 40);
  const cta = ez(f, C.cta, 40);
  const soon = ez(f, C.soon, 40);
  if (f < C.wordmark) return null;
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,10,4,0.55) 0%, rgba(20,10,4,0.0) 40%, rgba(20,10,4,0.0) 70%, rgba(20,10,4,0.55) 100%)", opacity: word }} />
      <div style={{ position: "absolute", top: 150, width: 1920, textAlign: "center", opacity: word, transform: `translateY(${lerp(word, 20, 0)}px)`, letterSpacing: lerp(word, 8, 0) }}>
        <div style={{ fontFamily: PM_FONTS.serif, fontSize: 132, color: IVORY, lineHeight: 1, textShadow: "0 4px 40px rgba(20,10,4,0.5)" }}>PolyMate</div>
      </div>
      <div style={{ position: "absolute", top: 312, width: 1920, textAlign: "center", opacity: tag, fontFamily: PM_FONTS.ui, fontSize: 44, color: "rgba(246,240,228,0.92)", letterSpacing: 0.5 }}>
        The trading layer for prediction markets.
      </div>
      <div style={{ position: "absolute", left: 140, bottom: 110, opacity: cta, fontFamily: PM_FONTS.ui, color: IVORY }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 600 }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: GOLD, boxShadow: `0 0 12px ${GOLD}` }} />
          TryOdds is live
        </div>
        <div style={{ fontFamily: PM_FONTS.mono, fontSize: 22, letterSpacing: 2, color: "rgba(246,240,228,0.7)", marginTop: 8 }}>t.me/Tryoddsbot</div>
      </div>
      <div style={{ position: "absolute", right: 140, bottom: 110, textAlign: "right", opacity: soon, fontFamily: PM_FONTS.ui, color: "rgba(246,240,228,0.75)" }}>
        <div style={{ fontSize: 26, fontWeight: 500 }}>OddsAlert · CopyOdds</div>
        <div style={{ fontFamily: PM_FONTS.mono, fontSize: 18, letterSpacing: 3, marginTop: 8, color: GOLD }}>COMING SOON</div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
export const PolymateForumFilm: React.FC = () => {
  const f = useCurrentFrame();
  // Emblem: reveal at the signal point, hide during the interface, return and settle on the pedestal.
  const reveal = iv(f, [C.emblemIn, C.emblemIn + 120], [0, 1], PM_EASE.out);
  const hideForUI = iv(f, [C.morphStart, C.morphStart + 40], [0, 1]);
  const back = iv(f, [C.morphBackEnd - 40, C.morphBackEnd + 10], [0, 1]);
  // Return: glide to centre first, then descend onto the risen pedestal.
  const settle = iv(f, [C.morphBackEnd, C.morphBackEnd + 90], [0, 1]);
  const descend = iv(f, [C.morphBackEnd + 40, C.morphBackEnd + 140], [0, 1]);
  const emblemO = f < C.morphBack ? reveal * (1 - hideForUI) : back;
  const ex = lerp(settle, ANCHOR[0], 960);
  const ey = lerp(descend, lerp(settle, ANCHOR[1], 470), 640);
  const ew = lerp(settle, EMBLEM_W * lerp(reveal, 0.92, 1), 300);
  // Interface morph out of (and back into) the lapis stone.
  const morph = f < C.morphBack ? iv(f, [C.morphStart, C.morphEnd], [0, 1]) : 1 - iv(f, [C.morphBack, C.morphBackEnd], [0, 1]);
  const contentO = iv(f, [C.morphEnd - 10, C.morphEnd + 20], [0, 1]) * (1 - iv(f, [C.morphBack - 20, C.morphBack + 6], [0, 1]));
  const ring = iv(f, [C.emblemIn, C.emblemIn + 90], [0, 1]);
  const ringO = iv(f, [C.emblemIn, C.emblemIn + 30, C.emblemIn + 200], [0, 1, 0]);
  const pedestalRise = iv(f, [C.pedestal, C.pedestal + 90], [0, 1], PM_EASE.out);
  const pedScale = lerp(iv(f, [C.pullStart, C.pullEnd], [0, 1]), 1.12, 1);
  const end = iv(f, [1785, 1800], [1, 0.9]);
  return (
    <AbsoluteFill style={{ background: "#120B07", opacity: end }}>
      <Forum />
      <Columns />
      <Signal />
      {/* gold ring that draws around the revealed emblem */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ringO }}>
        <circle cx={ANCHOR[0]} cy={ANCHOR[1]} r={340} fill="none" stroke={GOLD} strokeWidth={1.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring} transform={`rotate(-90 ${ANCHOR[0]} ${ANCHOR[1]})`} />
      </svg>
      {f >= C.pedestal ? <Pedestal rise={pedestalRise} scale={pedScale} /> : null}
      <Emblem x={ex} y={ey} w={ew} opacity={emblemO} orbit={1 - settle * 0.7} />
      <Interface morph={morph} contentO={contentO} />
      <Beat lines={["The future is uncertain."]} at={C.line1} out={C.linesOut} />
      {f >= C.line2 && f < C.linesOut + 30 ? (
        <div style={{ position: "absolute", left: 140, top: 640, opacity: 1 - iv(f, [C.linesOut, C.linesOut + 24], [0, 1]) }}>
          <Typed text={"Trading it shouldn't"} at={C.line2} />
          <Typed text={"be complicated."} at={C.line2 + 46} />
        </div>
      ) : null}
      <Beat lines={["Discover markets."]} at={C.discover} out={C.pick - 30} />
      <Beat lines={["Pick a side."]} at={C.pick} out={C.tradeLine - 30} />
      <Beat lines={["Trade in one motion."]} at={C.tradeLine} out={C.textOut} />
      <Finale />
    </AbsoluteFill>
  );
};
