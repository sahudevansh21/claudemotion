import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AL, AL_FONTS } from "../brand";
import tl from "./launch.json";

/**
 * ALLOCRA launch film — Renaissance finance meets fintech.
 * Brief storyboard (signature → philosophy → product reveal → capabilities →
 * payoff → final frame) in the motion grammar of the supplied openstick film:
 * word swap with a strike-through, numbered feature beats with a live card on
 * the right and progress dashes, a step line, a typed URL pill.
 * All copy is from allocra.buzz / the X profile. Times in seconds (60 fps).
 */
const RED = AL.red; // website vermilion
const VERM = "#E23A1E";
const CREAM = AL.cream;
const INK = "#0A0605";
const UI = AL.ui;
const SERIF = AL_FONTS.serif;
const SANS = AL_FONTS.sans;
const MONO = AL_FONTS.mono;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 between seconds a and a+d (scene-local), eased. */
const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = f / fps;
  const ez = (a: number, d: number, e = OUT) => interpolate(s, [a, a + d], [0, 1], { ...CL, easing: e });
  return { f, fps, s, ez };
};
const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

/* ------------------------------ textures -------------------------------- */
/** Painted-canvas texture (static) for the vermilion grounds. */
const Canvas: React.FC<{ color?: string; id: string; strength?: number }> = ({ color = RED, id, strength = 1 }) => (
  <AbsoluteFill style={{ background: color }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.55 * strength, mixBlendMode: "multiply" }}>
      <filter id={`cv-${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves={4} seed={7} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.16  0 0 0 0 0.08  0.9 0 0 0 -0.15" />
      </filter>
      <rect width={1920} height={1080} filter={`url(#cv-${id})`} />
    </svg>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.18 * strength, mixBlendMode: "overlay" }}>
      <filter id={`cvf-${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={1920} height={1080} filter={`url(#cvf-${id})`} />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 45%, rgba(255,180,140,0.10) 0%, transparent 55%, rgba(20,4,2,0.45) 100%)" }} />
  </AbsoluteFill>
);

/** Film grain refreshed at 30 Hz + vignette (on top of everything). */
const Grain: React.FC = () => {
  const { f, fps } = useT();
  const seed = Math.floor((f / fps) * 30) % 97;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.08, mixBlendMode: "overlay", pointerEvents: "none" }}>
        <filter id={`gr-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1920} height={1080} filter={`url(#gr-${seed})`} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.42) 100%)", pointerEvents: "none" }} />
    </>
  );
};

const Emblem: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <Img src={staticFile("allocra/launch/emblem.png")} style={{ width: size, height: (size * 1322) / 1270, ...style }} />
);

const Label: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = CREAM, style }) => (
  <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: 5, color, textTransform: "uppercase", ...style }}>{children}</div>
);

/* ------------------------------ 1. signature ----------------------------- */
const Signature: React.FC = () => {
  const { s, ez } = useT();
  const sweep = interpolate(s, [0.25, 1.35], [-0.12, 1.12], { ...CL, easing: IO });
  const beamX = sweep * 1920;
  const tex = ez(1.0, 0.8);
  const word = ez(1.7, 0.7);
  const push = interpolate(s, [0, 3.33], [1.06, 1.0]);
  const flash = interpolate(s, [0.98, 1.04, 1.5], [0, 0.55, 0], CL);
  return (
    <AbsoluteFill style={{ background: "#050302" }}>
      <AbsoluteFill style={{ opacity: tex * 0.55 }}>
        <Canvas color="#2A0905" id="sig" strength={1.3} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", left: 960 - 190, top: 400 - 198, clipPath: `inset(0 ${Math.max(0, 100 - ((beamX - 770) / 380) * 100)}% 0 0)` }}>
          <Emblem size={380} style={{ filter: `drop-shadow(0 0 ${40 * (1 - tex) + 10}px rgba(226,58,30,0.55))` }} />
        </div>
        <div style={{ position: "absolute", top: 690, width: 1920, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 44, letterSpacing: 44 * 0.6, marginLeft: 44 * 0.3, color: CREAM, opacity: word, filter: `blur(${(1 - word) * 8}px)` }}>
          ALLOCRA
        </div>
      </AbsoluteFill>
      {/* the vermilion light */}
      <div style={{ position: "absolute", left: beamX - 40, top: 0, width: 80, height: 1080, background: `linear-gradient(90deg, transparent, ${VERM}, transparent)`, opacity: sweep > 0 && sweep < 1.05 ? 0.9 : 0, filter: "blur(6px)", boxShadow: `0 0 120px 40px rgba(226,58,30,0.35)` }} />
      <AbsoluteFill style={{ background: VERM, opacity: flash * 0.35, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------ 2. philosophy ---------------------------- */
const Philosophy: React.FC = () => {
  const { s, ez } = useT();
  const pin = ez(0, 1.2);
  const l1 = ez(0.45, 0.6);
  const l2 = ez(1.05, 0.6);
  const strike = ez(1.85, 0.35, IO);
  const swap = ez(2.3, 0.45);
  const arc = ez(0.2, 1.6, IO);
  const cam = interpolate(s, [0, 4], [1.0, 1.05]);
  return (
    <AbsoluteFill>
      <Canvas id="phil" />
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        {/* the portrait, from the brand banner */}
        <div style={{ position: "absolute", right: 0, bottom: 0, width: 960, height: 1020, overflow: "hidden", opacity: pin, transform: `translateX(${lerp(pin, 60, 0) - s * 6}px)` }}>
          <Img src={staticFile("allocra/img/banner.jpg")} style={{ position: "absolute", width: 3180, height: 1060, left: -2180, top: -40 }} />
          <AbsoluteFill style={{ background: `linear-gradient(90deg, ${RED} 0%, rgba(193,46,25,0) 38%)` }} />
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle cx={1360} cy={560} r={420} fill="none" stroke="rgba(246,218,195,0.45)" strokeWidth={1.4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arc} transform="rotate(200 1360 560)" />
          <line x1={150} y1={140} x2={lerp(arc, 150, 520)} y2={140} stroke="rgba(246,218,195,0.6)" strokeWidth={1.2} />
        </svg>
        <Label style={{ position: "absolute", left: 150, top: 108, opacity: arc }}>MMXXVI  +</Label>
        <div style={{ position: "absolute", left: 150, top: 350, fontFamily: SERIF, fontSize: 134, lineHeight: 1.0, letterSpacing: -2.5, color: CREAM }}>
          <div style={{ opacity: l1, filter: `blur(${(1 - l1) * 10}px)`, transform: `translateY(${(1 - l1) * 20}px)` }}>Your assets.</div>
          <div style={{ position: "relative", opacity: l2, filter: `blur(${(1 - l2) * 10}px)`, transform: `translateY(${(1 - l2) * 20}px)` }}>
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ opacity: 1 - swap, color: "rgba(246,218,195,0.55)", display: "inline-block", transform: `translateY(${swap * 40}px) rotate(${swap * -6}deg)` }}>Their</span>
              <span style={{ position: "absolute", left: 0, top: 0, opacity: swap, fontStyle: "italic", transform: `translateY(${(1 - swap) * -30}px)` }}>Your</span>
              <span style={{ position: "absolute", left: -6, top: "54%", height: 6, width: `${strike * 104}%`, background: CREAM, opacity: 1 - swap, transform: "rotate(-4deg)" }} />
            </span>{" "}
            allocation.
          </div>
          <div style={{ height: 4, width: lerp(swap, 0, 420), background: CREAM, marginTop: 18, opacity: 0.85 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------ browser window --------------------------- */
const Browser: React.FC<{ x: number; y: number; w: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, borderRadius: 16, overflow: "hidden", background: "#120A08", boxShadow: "0 50px 120px rgba(10,2,0,0.55), 0 0 0 1px rgba(246,218,195,0.12)", ...style }}>
    <div style={{ height: 34, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: "#1A0F0C", borderBottom: "1px solid rgba(246,218,195,0.08)" }}>
      {["#3A2620", "#3A2620", "#3A2620"].map((c, i) => (
        <div key={i} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />
      ))}
      <div style={{ marginLeft: 16, fontFamily: MONO, fontSize: 13, color: "rgba(246,218,195,0.55)", letterSpacing: 1 }}>allocra.buzz</div>
    </div>
    <div style={{ position: "relative", overflow: "hidden" }}>{children}</div>
  </div>
);

const Pointer: React.FC<{ x: number; y: number; press?: number }> = ({ x, y, press = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${1 - press * 0.15})`, zIndex: 20 }}>
    <svg width={30} height={34} viewBox="0 0 30 34">
      <path d="M3 3 L27 14 L16 17 L11 30 Z" fill={CREAM} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
    </svg>
    <div style={{ position: "absolute", left: -18, top: -18, width: 66, height: 66, borderRadius: 33, border: `2px solid ${CREAM}`, opacity: press, transform: `scale(${0.5 + press})` }} />
  </div>
);

/* ------------------------------ 3. product reveal ------------------------ */
const Reveal: React.FC = () => {
  const { s, ez } = useT();
  // match cut: full-bleed red hero → framed browser on the right
  const frame = ez(0.0, 1.4, IO);
  const bx = lerp(frame, -180, 760);
  const by = lerp(frame, -120, 236);
  const bw = lerp(frame, 2280, 1040);
  const text = ez(1.1, 0.7);
  const click = 2.75;
  const ct = interpolate(s, [1.6, click - 0.1], [0, 1], { ...CL, easing: IO });
  const press = interpolate(s, [click - 0.05, click + 0.05, click + 0.3], [0, 1, 0], CL);
  const toDash = ez(click + 0.15, 0.55, IO);
  const scroll = interpolate(s, [3.9, 5.7], [0, 1], { ...CL, easing: IO });
  const ih = (bw * 1086) / 2000; // hero image height in the window
  const dh = (bw * 2000) / 3200; // dashboard capture height
  return (
    <AbsoluteFill>
      <Canvas id="rev" />
      <div style={{ position: "absolute", left: 150, top: 380, opacity: text, transform: `translateY(${(1 - text) * 20}px)` }}>
        <Label>Private allocation desk / 01</Label>
        <div style={{ fontFamily: SERIF, fontSize: 104, lineHeight: 1.0, letterSpacing: -2, color: CREAM, marginTop: 26 }}>
          A smarter way
          <br />
          <span style={{ fontStyle: "italic" }}>to allocate.</span>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 24, lineHeight: 1.45, color: "rgba(246,218,195,0.8)", marginTop: 26, width: 520 }}>Tokenized assets. Custom baskets. Portfolio intelligence.</div>
      </div>
      <Browser x={bx} y={by} w={bw} style={{ borderRadius: lerp(frame, 0, 16) }}>
        <div style={{ height: lerp(frame, 1400, ih + 6), position: "relative" }}>
          <Img src={staticFile("allocra/launch/site/hero.jpg")} style={{ position: "absolute", width: bw, height: ih, transform: `translateY(${-toDash * 40}px)`, opacity: 1 - toDash }} />
          <div style={{ position: "absolute", inset: 0, opacity: toDash, transform: `translateY(${(1 - toDash) * 60}px)` }}>
            <Img src={staticFile("allocra/launch/site/dashboard.jpg")} style={{ position: "absolute", width: bw, height: dh, transform: `translateY(${-scroll * (dh * 0.42)}px)` }} />
            <Img src={staticFile("allocra/launch/site/dashboard2.jpg")} style={{ position: "absolute", width: bw, height: dh, top: dh * 0.9, transform: `translateY(${-scroll * (dh * 0.42)}px)` }} />
          </div>
        </div>
      </Browser>
      {s > 1.5 && s < click + 0.6 ? <Pointer x={lerp(ct, 1500, 760 + 1040 * 0.105)} y={lerp(ct, 900, 236 + 34 + ih * 0.86)} press={press} /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------ 4. capabilities -------------------------- */
const CAPS = [
  { n: "01", title: ["Tokenized", "assets."], sub: "Plan a tokenized ETF basket around the positions you actually want to own." },
  { n: "02", title: ["Custom", "baskets."], sub: "Adjust target weights and see how the total adds up before you save." },
  { n: "03", title: ["Portfolio", "intelligence."], sub: "Understand concentration, overlap, and the scenarios behind your allocation." },
];

const SlateCard: React.FC<{ t: number }> = ({ t }) => {
  const rows = [
    ["US equity", 55],
    ["International equity", 25],
    ["US bonds", 20],
  ] as const;
  const R = 70;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div style={{ width: 760, padding: "34px 40px", boxSizing: "border-box", borderRadius: 14, background: "#2A0D07", border: "1px solid rgba(246,218,195,0.18)", boxShadow: "0 40px 100px rgba(10,2,0,0.5)", fontFamily: SANS, color: CREAM }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Label style={{ fontSize: 14 }}>Allocation slate / draft</Label>
        <div style={{ fontFamily: MONO, fontSize: 14, color: AL.green }}>● Preview</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 24 }}>
        <div style={{ position: "relative", width: 180, height: 180 }}>
          <svg width={180} height={180}>
            {rows.map(([n, v], i) => {
              const seg = (v / 100) * C * t;
              const off = acc;
              acc += (v / 100) * C;
              return <circle key={n} cx={90} cy={90} r={R} fill="none" stroke={["#F6DAC3", "#CF3321", "#7A2A1C"][i]} strokeWidth={22} strokeDasharray={`${seg} ${C}`} strokeDashoffset={-off * t} transform="rotate(-90 90 90)" />;
            })}
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", fontFamily: SERIF, fontSize: 30 }}>3 ETFs</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: SERIF, fontSize: 44 }}>Core allocation</div>
          {rows.map(([n, v], i) => (
            <div key={n} style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20 }}>
                <span>{n}</span>
                <span style={{ fontFamily: MONO }}>{Math.round(v * Math.min(1, t * 1.2))}%</span>
              </div>
              <div style={{ height: 4, background: "rgba(246,218,195,0.12)", marginTop: 8 }}>
                <div style={{ height: 4, width: `${v * Math.min(1, t * 1.1 - i * 0.05)}%`, background: ["#F6DAC3", "#CF3321", "#B05A40"][i] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 0, marginTop: 30, borderTop: "1px solid rgba(246,218,195,0.12)", paddingTop: 20 }}>
        {[
          ["Monthly purchase", "$1,200"],
          ["Overlap", "0%"],
          ["Est. cost / yr", "$0.50"],
        ].map(([k, v]) => (
          <div key={k} style={{ flex: 1 }}>
            <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: "rgba(246,218,195,0.6)", textTransform: "uppercase" }}>{k}</div>
            <div style={{ fontFamily: SERIF, fontSize: 38, marginTop: 6 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 12, color: "rgba(246,218,195,0.45)", marginTop: 18, letterSpacing: 1 }}>Values from the allocra.buzz preview slate</div>
    </div>
  );
};

const ShotZoom: React.FC<{ src: string; aspect: number; t: number; from: [number, number, number]; to: [number, number, number]; w?: number }> = ({ src, aspect, t, from, to, w = 900 }) => {
  const h = w / aspect;
  const z = lerp(t, from[0], to[0]);
  const x = lerp(t, from[1], to[1]);
  const y = lerp(t, from[2], to[2]);
  return (
    <Browser x={0} y={0} w={w} style={{ position: "relative" }}>
      <div style={{ width: w, height: Math.min(h, 560), overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ width: w, height: h, transform: `translate(${x}px, ${y}px) scale(${z})`, transformOrigin: "0 0" }} />
      </div>
    </Browser>
  );
};

const Capabilities: React.FC = () => {
  const { s, ez } = useT();
  const idx = Math.min(2, Math.floor(s / 2));
  const ls = s - idx * 2;
  const c = CAPS[idx];
  const tin = interpolate(ls, [0, 0.45], [0, 1], { ...CL, easing: OUT });
  const card = interpolate(ls, [0.05, 0.6], [0, 1], { ...CL, easing: OUT });
  const push = interpolate(ls, [0, 2], [0, 1], { ...CL, easing: IO });
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill style={{ opacity: 0.35 }}>
        <Canvas color="#3A0E07" id="caps" />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 330, width: 620 }}>
        <Label style={{ color: VERM, opacity: tin }}>{c.n} / 03</Label>
        <div style={{ fontFamily: SERIF, fontSize: 112, lineHeight: 0.98, letterSpacing: -2.5, color: CREAM, marginTop: 24, opacity: tin, filter: `blur(${(1 - tin) * 10}px)`, transform: `translateY(${(1 - tin) * 24}px)` }}>
          {c.title[0]}
          <br />
          <span style={{ fontStyle: "italic" }}>{c.title[1]}</span>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 26, lineHeight: 1.45, color: "rgba(246,218,195,0.75)", marginTop: 26, opacity: ez(idx * 2 + 0.2, 0.5) }}>{c.sub}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 44 }}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ width: 70, height: 3, background: "rgba(246,218,195,0.18)" }}>
              <div style={{ height: 3, width: `${k < idx ? 100 : k === idx ? push * 100 : 0}%`, background: VERM }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 880, top: 220, opacity: card, transform: `translateY(${(1 - card) * 60}px) perspective(2000px) rotateY(${lerp(push, -6, -2)}deg)` }}>
        {idx === 0 ? <SlateCard t={ez(0.2, 1.2)} /> : null}
        {idx === 1 ? <ShotZoom src="allocra/launch/site/basket.jpg" aspect={2000 / 1102} t={push} from={[1.0, 0, 0]} to={[1.6, -100, -290]} w={900} /> : null}
        {idx === 2 ? <ShotZoom src="allocra/launch/site/insights.jpg" aspect={2000 / 1092} t={push} from={[1.0, 0, 0]} to={[1.5, -440, -230]} w={900} /> : null}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------ 5. payoff -------------------------------- */
const STEPS = ["Choose eligible assets and target weights.", "Set a recurring purchase plan.", "Review overlap, quotes, costs, and market windows.", "Confirm each trade yourself."];

const Payoff: React.FC = () => {
  const { s, ez } = useT();
  const partB = s >= 3.333;
  if (!partB) {
    const pull = interpolate(s, [0, 3.333], [1.25, 1.0], { ...CL, easing: OUT });
    const orbit = interpolate(s, [0, 3.333], [-14, 10]);
    const head = ez(0.3, 0.7);
    const panels = [
      { src: "allocra/launch/site/basket.jpg", a: -1 },
      { src: "allocra/launch/site/dashboard.jpg", a: 0 },
      { src: "allocra/launch/site/insights.jpg", a: 1 },
    ];
    return (
      <AbsoluteFill>
        <Canvas id="pay" />
        <AbsoluteFill style={{ transform: `scale(${pull})` }}>
          <Img src={staticFile("allocra/launch/art/chess.jpg")} style={{ position: "absolute", left: 110, top: 330, width: 560, height: 385, opacity: 0.85, boxShadow: "0 40px 100px rgba(10,2,0,0.5)", border: `10px solid ${CREAM}`, transform: `rotate(-3deg) translateY(${s * -8}px)` }} />
          <div style={{ position: "absolute", left: 960, top: 560, perspective: 2400, transformStyle: "preserve-3d" }}>
            {panels.map((p, i) => {
              const ang = p.a * 34 + orbit;
              const rad = (ang * Math.PI) / 180;
              const x = Math.sin(rad) * 520;
              const z = Math.cos(rad) * 260 - 260;
              const o = ez(0.15 + i * 0.15, 0.6);
              return (
                <div key={p.src} style={{ position: "absolute", left: x - 330 + 220, top: -200, width: 660, transform: `translateZ(${z}px) rotateY(${-ang * 0.8}deg)`, opacity: o, zIndex: p.a === 0 ? 3 : 1 }}>
                  <Browser x={0} y={0} w={660} style={{ position: "relative" }}>
                    <Img src={staticFile(p.src)} style={{ width: 660, height: 380, objectFit: "cover", objectPosition: "top left" }} />
                  </Browser>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 1600, top: 720, opacity: ez(0.6, 0.8), transform: `rotate(${s * 4}deg)` }}>
            <Emblem size={170} style={{ filter: "drop-shadow(0 20px 40px rgba(10,2,0,0.5))" }} />
          </div>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 150, top: 104, opacity: head }}>
          <Label>The collection / 02</Label>
          <div style={{ fontFamily: SERIF, fontSize: 92, color: CREAM, letterSpacing: -2, marginTop: 14, filter: `blur(${(1 - head) * 8}px)` }}>
            Old masters. <span style={{ fontStyle: "italic" }}>New allocation.</span>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  const ls = s - 3.333;
  const line = interpolate(ls, [0.2, 2.4], [0, 1], { ...CL, easing: IO });
  const head = interpolate(ls, [0, 0.6], [0, 1], { ...CL, easing: OUT });
  const x0 = 150;
  const x1 = 1770;
  return (
    <AbsoluteFill style={{ background: UI }}>
      <Img src={staticFile("allocra/launch/art/scholars.jpg")} style={{ position: "absolute", right: 0, top: 0, width: 1100, height: 626, opacity: 0.22, objectFit: "cover", maskImage: "linear-gradient(90deg, transparent, black 40%)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 40%)" }} />
      <div style={{ position: "absolute", left: x0, top: 170, opacity: head, filter: `blur(${(1 - head) * 8}px)` }}>
        <Label>From idea to informed preview</Label>
        <div style={{ fontFamily: SERIF, fontSize: 100, lineHeight: 1.0, letterSpacing: -2, color: CREAM, marginTop: 22 }}>
          A recurring plan should feel
          <br />
          <span style={{ fontStyle: "italic" }}>considered, not automatic.</span>
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={x0} x2={x0 + (x1 - x0) * line} y1={720} y2={720} stroke={VERM} strokeWidth={3} />
        <line x1={x0} x2={x1} y1={720} y2={720} stroke="rgba(246,218,195,0.15)" strokeWidth={3} />
        {STEPS.map((_, i) => {
          const px = x0 + ((x1 - x0) * (i + 0.5)) / 4;
          const on = line >= (i + 0.5) / 4;
          return <circle key={i} cx={px} cy={720} r={on ? 11 : 8} fill={on ? VERM : "#3A2620"} stroke={on ? CREAM : "none"} strokeWidth={2} />;
        })}
      </svg>
      {STEPS.map((t, i) => {
        const px = x0 + ((x1 - x0) * (i + 0.5)) / 4;
        const on = line >= (i + 0.5) / 4;
        return (
          <div key={t} style={{ position: "absolute", left: px - 190, top: 760, width: 380, textAlign: "center", fontFamily: SANS, color: on ? CREAM : "rgba(246,218,195,0.35)" }}>
            <div style={{ fontFamily: MONO, fontSize: 18, color: on ? VERM : "rgba(246,218,195,0.35)" }}>0{i + 1}</div>
            <div style={{ fontSize: 24, lineHeight: 1.35, marginTop: 8 }}>{t}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: x0 + (x1 - x0) * Math.min(line, 0.875) - 70, top: 650, padding: "6px 14px", borderRadius: 14, background: VERM, color: CREAM, fontFamily: MONO, fontSize: 15, opacity: line > 0.05 ? 1 : 0 }}>you approve</div>
      <div style={{ position: "absolute", left: x0, bottom: 110, fontFamily: MONO, fontSize: 18, letterSpacing: 1.5, color: "rgba(246,218,195,0.6)", opacity: interpolate(ls, [1.6, 2.2], [0, 1], CL) }}>
        ⓘ Plan first. Assets remain individually held until you approve a trade.
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------ 6. final frame --------------------------- */
const Final: React.FC = () => {
  const { s, ez } = useT();
  const m = ez(0.05, 0.9);
  const w = ez(0.55, 0.6);
  const tg = ez(0.9, 0.6);
  const url = "allocra.buzz";
  const n = Math.max(0, Math.min(url.length, Math.floor((s - 1.6) / 0.07)));
  const pill = ez(1.45, 0.3);
  const accent = interpolate(s, [3.33, 3.37, 3.7], [0, 1, 0], CL);
  return (
    <AbsoluteFill>
      <Canvas id="fin" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", transform: `scale(${1 + accent * 0.01})` }}>
        <div style={{ opacity: m, transform: `scale(${lerp(m, 0.8, 1)})`, filter: `blur(${(1 - m) * 12}px) drop-shadow(0 26px 50px rgba(10,2,0,0.45))` }}>
          <Emblem size={250} />
        </div>
        <div style={{ marginTop: 44, fontFamily: SANS, fontWeight: 500, fontSize: 64, letterSpacing: 64 * 0.5, marginRight: -64 * 0.5, color: CREAM, opacity: w, filter: `blur(${(1 - w) * 8}px)` }}>ALLOCRA</div>
        <div style={{ marginTop: 18, fontFamily: SERIF, fontSize: 56, color: CREAM, opacity: tg }}>
          Your assets. <span style={{ fontStyle: "italic" }}>Your allocation.</span>
        </div>
        <div style={{ marginTop: 34, padding: "12px 24px", borderRadius: 30, background: INK, color: CREAM, fontFamily: MONO, fontSize: 28, display: "flex", alignItems: "center", gap: 6, opacity: pill }}>
          {url.slice(0, n)}
          <span style={{ display: "inline-block", width: 14, height: 30, background: VERM, opacity: Math.floor(s * 3) % 2 ? 0.4 : 1 }} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: accent * 0.12, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

const SCENES: Record<string, React.FC> = { signature: Signature, philosophy: Philosophy, reveal: Reveal, capabilities: Capabilities, payoff: Payoff, final: Final };

export const AllocraLaunchFilm: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {tl.scenes.map((sc) => {
        const C = SCENES[sc.id];
        const from = Math.round(sc.from * fps);
        return (
          <Sequence key={sc.id} name={sc.id} from={from} durationInFrames={Math.round(sc.to * fps) - from} premountFor={fps}>
            <C />
          </Sequence>
        );
      })}
      <Grain />
    </AbsoluteFill>
  );
};
