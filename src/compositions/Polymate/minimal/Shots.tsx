import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { PM, PM_EASE, PM_FONTS } from "../brand";
import { PolymateMark } from "../components/PolymateMark";
import { ez, lerp } from "../components/motion";
import { DecodeCaption } from "./Caption";
import tl from "./minimal.json";

loadFont({
  family: "Silkscreen",
  url: staticFile("polymate/fonts/Silkscreen-Regular.ttf"),
  weight: "400",
});

export const mshot = (id: string) => {
  const s = tl.shots.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown shot ${id}`);
  return { ...s, duration: s.end - s.start, cues: s.cues as unknown as Record<string, number> };
};

/** Palette from the X banner: sunset sky, warm marble, Roman crimson, gold. */
const SKY = {
  top: "#5D6B8C",
  mid: "#C9967A",
  low: "#F2C48C",
  sun: "#FFF1D2",
  haze: "#E8B98A",
  stone: "#7A5E4E",
  shadow: "#1B120E",
};

/** Subtle filmic finish: warm tint, vignette, per-frame grain. */
export const Film: React.FC<{ children: React.ReactNode; vignette?: number }> = ({
  children,
  vignette = 0.55,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {children}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(10,6,4,${vignette}) 100%)`,
        }}
      />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "overlay" }}>
        <filter id={`pmm-grain-${f}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 97} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#pmm-grain-${f})`} />
      </svg>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ id: string; top?: number; tone?: "light" | "dark" }> = ({ id, top = 540, tone }) => {
  const s = mshot(id);
  return (
    <div style={{ position: "absolute", top, left: 0, width: 1920, display: "flex", justifyContent: "center", transform: "translateY(-50%)" }}>
      <DecodeCaption text={s.caption} at={s.cues.in} out={s.cues.out ?? Infinity} seed={id} tone={tone} />
    </div>
  );
};

const Column: React.FC<{ x: number; w: number; color: string }> = ({ x, w, color }) => (
  <g>
    <rect x={x - w * 0.12} y={-40} width={w * 1.24} height={70} fill={color} />
    <rect x={x} y={30} width={w} height={1100} fill={color} />
    {[0.2, 0.4, 0.6, 0.8].map((k) => (
      <rect key={k} x={x + w * k - 3} y={30} width={6} height={1100} fill="rgba(0,0,0,0.25)" />
    ))}
  </g>
);

/** 1. Golden-hour sky over a distant temple hill, framed by columns (after the banner). */
export const SkyShot: React.FC = () => {
  const f = useCurrentFrame();
  const { duration } = mshot("sky");
  const cam = interpolate(f, [0, duration], [1.0, 1.07]);
  return (
    <Film>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "50% 62%" }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs>
            <linearGradient id="pmm-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={SKY.top} />
              <stop offset="0.45" stopColor={SKY.mid} />
              <stop offset="0.72" stopColor={SKY.low} />
              <stop offset="1" stopColor={SKY.haze} />
            </linearGradient>
            <radialGradient id="pmm-sun" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor={SKY.sun} stopOpacity="1" />
              <stop offset="0.25" stopColor="#FFE2A8" stopOpacity="0.8" />
              <stop offset="1" stopColor="#FFC27A" stopOpacity="0" />
            </radialGradient>
            <filter id="pmm-soft"><feGaussianBlur stdDeviation="22" /></filter>
            <filter id="pmm-haze"><feGaussianBlur stdDeviation="2.5" /></filter>
          </defs>
          <rect width={1920} height={1080} fill="url(#pmm-sky)" />
          <circle cx={1180} cy={700} r={520} fill="url(#pmm-sun)" />
          {/* Drifting clouds */}
          {Array.from({ length: 9 }, (_, i) => {
            const y = 180 + random(`cy${i}`) * 420;
            const w = 360 + random(`cw${i}`) * 520;
            const x = ((random(`cx${i}`) * 2400 + f * (0.25 + random(`cv${i}`) * 0.35)) % 2600) - 400;
            return (
              <ellipse key={i} cx={x} cy={y} rx={w / 2} ry={30 + random(`ch${i}`) * 40} fill={i % 3 === 0 ? "#FCE3C0" : "#F0B993"} opacity={0.45} filter="url(#pmm-soft)" />
            );
          })}
          {/* Distant hill + temple */}
          <g filter="url(#pmm-haze)" opacity={0.75}>
            <path d="M480 840 Q 760 690 960 700 Q 1180 690 1460 840 Z" fill="#B98A70" />
            <rect x={820} y={640} width={280} height={14} fill="#A57B64" />
            <polygon points="812,640 960,600 1108,640" fill="#A57B64" />
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={832 + i * 34} y={654} width={14} height={50} fill="#A57B64" />
            ))}
            <rect x={815} y={702} width={290} height={10} fill="#A57B64" />
          </g>
          <path d="M-100 1080 L -100 880 Q 500 820 960 860 Q 1500 820 2020 880 L 2020 1080 Z" fill="#8F6650" opacity={0.85} />
          {/* Foreground columns + crimson banner (the banner's frame) */}
          <Column x={60} w={150} color={SKY.shadow} />
          <Column x={1720} w={150} color={SKY.shadow} />
          <g transform={`translate(1600 70) rotate(${Math.sin(f / 50) * 0.6})`}>
            <path d="M0 0 L 110 0 L 110 360 L 55 330 L 0 360 Z" fill={PM.red} opacity={0.92} />
            <circle cx={55} cy={150} r={34} fill="none" stroke={PM.goldLight} strokeWidth={3} opacity={0.8} />
          </g>
        </svg>
      </AbsoluteFill>
      <Caption id="sky" />
    </Film>
  );
};

/** One meandering vein as a smooth path (seeded random walk). */
const veinPath = (seed: string) => {
  let x = -100 + random(`${seed}x`) * 600;
  let y = random(`${seed}y`) * 1080;
  let a = -0.6 + random(`${seed}a`) * 0.9;
  let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
  for (let i = 0; i < 26; i++) {
    a += (random(`${seed}t${i}`) - 0.5) * 0.9;
    const len = 50 + random(`${seed}l${i}`) * 60;
    const cx = x + Math.cos(a) * len * 0.5 + (random(`${seed}c${i}`) - 0.5) * 30;
    const cy = y + Math.sin(a) * len * 0.5 + (random(`${seed}d${i}`) - 0.5) * 30;
    x += Math.cos(a) * len;
    y += Math.sin(a) * len;
    d += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
};
const VEINS = Array.from({ length: 14 }, (_, i) => ({
  d: veinPath(`v${i}`),
  w: 0.8 + random(`vw${i}`) * 2.2,
  gold: random(`vg${i}`) < 0.3,
  o: 0.25 + random(`vo${i}`) * 0.45,
}));

/** Procedural warm marble: faint clouding plus thin grey and gold veins. */
const Marble: React.FC<{ id: string }> = ({ id }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <filter id={`${id}-cloud`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0016 0.0035" numOctaves={3} seed={4} />
      <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.49  0 0 0 0 0.42  1.4 0 0 0 -0.55" />
    </filter>
    <filter id={`${id}-vb`}><feGaussianBlur stdDeviation="0.7" /></filter>
    <filter id={`${id}-vw`}><feGaussianBlur stdDeviation="6" /></filter>
    <rect width={1920} height={1080} fill={PM.marble} />
    <rect width={1920} height={1080} filter={`url(#${id}-cloud)`} opacity={0.18} />
    <g fill="none" strokeLinecap="round">
      {VEINS.map((v, i) => (
        <path key={`w${i}`} d={v.d} stroke="#9C8F80" strokeWidth={v.w * 9} opacity={v.o * 0.18} filter={`url(#${id}-vw)`} />
      ))}
      {VEINS.map((v, i) => (
        <path key={i} d={v.d} stroke={v.gold ? PM.gold : "#7E7368"} strokeWidth={v.w} opacity={v.o} filter={`url(#${id}-vb)`} />
      ))}
    </g>
  </svg>
);

/** 2. Raking light across marble; a gold laurel sprig draws on. */
export const MarbleShot: React.FC = () => {
  const f = useCurrentFrame();
  const { duration } = mshot("marble");
  const sweep = interpolate(f, [0, duration], [-0.4, 1.2]);
  const draw = ez(f, 6, 70, PM_EASE.inOut);
  return (
    <Film vignette={0.7}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, duration], [1.16, 1.1])}) rotate(-2.5deg)` }}>
        <Marble id="pmm-m1" />
        <AbsoluteFill
          style={{
            background: `linear-gradient(105deg, rgba(40,22,12,0.55) ${(sweep - 0.4) * 100}%, rgba(255,226,170,0.45) ${sweep * 100}%, rgba(40,22,12,0.55) ${(sweep + 0.45) * 100}%)`,
            mixBlendMode: "multiply",
          }}
        />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="pmm-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#F4D98C" />
              <stop offset="0.5" stopColor={PM.goldLight} />
              <stop offset="1" stopColor={PM.gold} />
            </linearGradient>
          </defs>
          <g transform="translate(560 760) rotate(-18)" style={{ filter: "drop-shadow(0 10px 14px rgba(60,30,10,0.35))" }}>
            <path d="M0 0 Q 420 -120 820 -40" fill="none" stroke="url(#pmm-gold)" strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
            {Array.from({ length: 10 }, (_, i) => {
              const s = 0.08 + i * 0.09;
              const t = Math.min(1, Math.max(0, (draw - s) * 6));
              const x = s * 820;
              const y = -120 * 2 * s * (1 - s) * 1.6 + (-40) * s * s;
              const side = i % 2 ? 1 : -1;
              return (
                <path
                  key={i}
                  d="M0 0 C 18 -22, 56 -22, 78 0 C 56 22, 18 22, 0 0 Z"
                  fill="url(#pmm-gold)"
                  opacity={t}
                  transform={`translate(${x} ${y}) rotate(${side * 38 - 12}) scale(${0.5 + 0.5 * t})`}
                />
              );
            })}
          </g>
        </svg>
      </AbsoluteFill>
      <Caption id="marble" top={300} tone="dark" />
    </Film>
  );
};

/** 3. One illustrative trade card on marble (copy from the banner): Executing Trade… → Position Opened · YES · $50. */
export const TradeShot: React.FC = () => {
  const f = useCurrentFrame();
  const s = mshot("trade");
  const fill = ez(f, s.cues.exec, s.cues.fillEnd - s.cues.exec, PM_EASE.inOut);
  const opened = ez(f, s.cues.opened, 16);
  const card = ez(f, 0, 30);
  return (
    <Film vignette={0.65}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, s.duration], [1.06, 1.0])})` }}>
        <Marble id="pmm-m2" />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 40%, rgba(255,226,170,0.25) 0%, rgba(40,22,12,0.55) 80%)", mixBlendMode: "multiply" }} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 960 - 330,
          top: 600 - 120,
          width: 660,
          height: 240,
          borderRadius: 30,
          background: "linear-gradient(160deg, #FFFDF8, #F1EADD)",
          border: `2px solid ${PM.goldLight}`,
          boxShadow: "0 40px 90px rgba(40,22,12,0.45)",
          transform: `perspective(1600px) rotateX(${lerp(card, 14, 6)}deg) rotateZ(${lerp(card, -3, -1)}deg) translateY(${lerp(card, 40, 0)}px)`,
          opacity: card,
          fontFamily: PM_FONTS.ui,
          color: PM.ink,
          overflow: "hidden",
        }}
      >
        {/* Executing */}
        <div style={{ position: "absolute", inset: 0, padding: "52px 56px", opacity: 1 - opened }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 44, fontWeight: 600 }}>
            <span style={{ color: PM.gold }}>⚡</span> Executing Trade…
          </div>
          <div style={{ marginTop: 44, height: 16, borderRadius: 8, background: "#E6DDCB", overflow: "hidden" }}>
            <div style={{ width: `${fill * 100}%`, height: "100%", background: `linear-gradient(90deg, ${PM.gold}, ${PM.goldLight})` }} />
          </div>
        </div>
        {/* Opened */}
        <div style={{ position: "absolute", inset: 0, padding: "48px 56px", display: "flex", alignItems: "center", gap: 36, opacity: opened, transform: `translateY(${lerp(opened, 20, 0)}px)` }}>
          <div style={{ width: 120, height: 120, borderRadius: 26, background: "#2F8F4E", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", fontSize: 64, fontWeight: 700 }}>↗</div>
          <div>
            <div style={{ fontSize: 44, fontWeight: 600 }}>Position Opened</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: "#2F8F4E", marginTop: 8 }}>YES&nbsp;&nbsp;$50</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 110, bottom: 110, fontFamily: "Silkscreen, monospace", fontSize: 16, letterSpacing: 5, color: "rgba(26,22,18,0.5)" }}>
        ILLUSTRATIVE UI
      </div>
      <Caption id="trade" top={260} tone="dark" />
    </Film>
  );
};

/** 4. The mark assembles in warm dark, lit like the banner's gold. */
export const MarkShot: React.FC = () => {
  const f = useCurrentFrame();
  const s = mshot("mark");
  const a = ez(f, s.cues.assemble, s.cues.assembleLen, PM_EASE.out);
  const glow = interpolate(f, [0, s.duration], [0.2, 0.75]);
  return (
    <Film vignette={0.8}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, rgba(120,70,30,${glow}) 0%, #0D0906 55%)`, justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `scale(${interpolate(f, [0, s.duration], [1.08, 1.0])}) rotate(${lerp(a, -4, 0)}deg)` }}>
          <PolymateMark size={560} assemble={a} />
        </div>
      </AbsoluteFill>
    </Film>
  );
};

/** 5. End card: small mark, START TRADING / T.ME/TRYODDSBOT decode (the reference's pre-order card). */
export const EndShot: React.FC = () => {
  const f = useCurrentFrame();
  const s = mshot("end");
  const fade = interpolate(f, [s.cues.fade, s.duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mark = ez(f, 0, 24);
  return (
    <AbsoluteFill style={{ background: "#060504", opacity: fade }}>
      <div style={{ position: "absolute", top: 380, width: 1920, display: "flex", justifyContent: "center", opacity: mark, transform: `translateY(${lerp(mark, 10, 0)}px)` }}>
        <PolymateMark size={150} />
      </div>
      <div style={{ position: "absolute", top: 600, width: 1920, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <DecodeCaption text={s.caption} at={s.cues.in} size={26} seed="end1" />
        <DecodeCaption text={s.caption2 ?? ""} at={s.cues.in2} size={26} seed="end2" />
      </div>
    </AbsoluteFill>
  );
};
