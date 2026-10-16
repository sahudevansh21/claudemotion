import { AbsoluteFill, Easing, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../../components/Stage";
import { BCM, BCM_FONTS, Logo, gradText } from "./brand";
import tl from "./bcm.json";

/**
 * BCM — 10 s super-fast promo (1920x1080 @ 30 fps). Same beat order and
 * motion grammar as the supplied reference (glitch-sliced kinetic words,
 * 3D button press, live counter, stripe wipe, logo lockup, leaderboard,
 * tilted donut, radar, glossy card, block chain, logo end card), restyled in
 * the BCM Wallet theme: black, blue → violet gradient, pixel grid, mono type.
 * Copy and data come from the Base Carbon Meter dashboard. Cuts: bcm.json.
 */
const S = tl.scenes;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const ez = (f: number, a: number, d: number, e: (t: number) => number = OUT) => interpolate(f, [a, a + d], [0, 1], { ...CL, easing: e });
const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

/* ---------------------------------------------------------------- shared */
const Grid: React.FC<{ color?: string }> = ({ color = "rgba(255,255,255,0.045)" }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <pattern id="bcm-grid" width={30} height={30} patternUnits="userSpaceOnUse">
        <rect x={3} y={3} width={24} height={24} rx={4} fill="none" stroke={color} strokeWidth={1.5} />
      </pattern>
    </defs>
    <rect width={1920} height={1080} fill="url(#bcm-grid)" />
  </svg>
);

const Pill: React.FC<{ children: React.ReactNode; dark?: boolean; grad?: boolean; size?: number; style?: React.CSSProperties }> = ({ children, dark, grad, size = 22, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: `${size * 0.4}px ${size * 0.9}px`,
      borderRadius: 999,
      fontFamily: BCM_FONTS.mono,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: size * 0.06,
      background: grad ? BCM.grad : dark ? BCM.ink : BCM.white,
      color: grad || dark ? BCM.white : BCM.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

/** The reference's signature glitch: the word is cut into strips that snap together. */
const Glitch: React.FC<{ f: number; dur: number; children: React.ReactNode; seed: string; outAt?: number; strips?: number; amp?: number }> = ({ f, dur, children, seed, outAt, strips = 6, amp = 380 }) => {
  const inT = ez(f, 0, 7);
  const outT = outAt === undefined ? 0 : ez(f, outAt, 5, Easing.in(Easing.cubic));
  const k = Math.max(1 - inT, outT);
  return (
    <div style={{ position: "relative" }}>
      {Array.from({ length: strips }, (_, i) => {
        const top = (i / strips) * 100;
        const bot = 100 - ((i + 1) / strips) * 100;
        const dx = (random(`${seed}${i}`) - 0.5) * 2 * amp * k * k;
        return (
          <div key={i} style={{ position: i === 0 ? "relative" : "absolute", inset: 0, clipPath: `inset(${top}% -20% ${bot}% -20%)`, transform: `translateX(${dx}px)`, opacity: f < dur ? 1 : 0 }}>
            {children}
          </div>
        );
      })}
    </div>
  );
};

const Center: React.FC<{ children: React.ReactNode; bg: string }> = ({ children, bg }) => (
  <AbsoluteFill style={{ background: bg, justifyContent: "center", alignItems: "center" }}>{children}</AbsoluteFill>
);

/* ------------------------------------------------- 1. kinetic word cards */
const WORDS = [
  { text: "What if", bg: BCM.black, color: BCM.white, grid: true },
  { text: "clean energy", bg: BCM.white, color: BCM.ink },
  { text: "paid", bg: BCM.grad, color: BCM.white },
  { text: "you?", bg: BCM.black, grad: true, grid: true },
];

const Word: React.FC<{ i: number; dur: number }> = ({ i, dur }) => {
  const f = useCurrentFrame();
  const w = WORDS[i];
  const s = lerp(ez(f, 0, dur), 1.06, 1);
  return (
    <Center bg={w.bg}>
      {w.grid ? <Grid /> : null}
      <div style={{ transform: `scale(${s})` }}>
        <Glitch f={f} dur={dur} seed={`w${i}`} outAt={i === 3 ? dur - 5 : undefined}>
          <div style={{ fontFamily: BCM_FONTS.mono, fontWeight: 800, fontSize: 230, letterSpacing: -8, lineHeight: 1.1, color: w.color, padding: "0 30px", ...(w.grad ? gradText : {}) }}>{w.text}</div>
        </Glitch>
      </div>
    </Center>
  );
};

/* ---------------------------------------------- 2. 3D "CONNECT" button */
const Button: React.FC = () => {
  const f = useCurrentFrame();
  const press = S.press - S.button;
  const enter = spring({ frame: f, fps: 30, config: { damping: 12, stiffness: 180 } });
  const down = interpolate(f, [press - 2, press, press + 4], [0, 1, 0], CL);
  const flash = interpolate(f, [press, press + 2, press + 9], [0, 1, 0], CL);
  const ring = ez(f, press, 14);
  const tilt = lerp(ez(f, 0, press), -14, 0);
  const W = 560;
  const H = 300;
  const depth = 70 * (1 - down * 0.6);
  return (
    <Center bg={BCM.white}>
      <AbsoluteFill style={{ background: BCM.grad, opacity: flash }} />
      {[0, 1].map((k) => (
        <div key={k} style={{ position: "absolute", left: 960 - 520 * (ring + k * 0.4), top: 560 - 260 * (ring + k * 0.4), width: 1040 * (ring + k * 0.4), height: 520 * (ring + k * 0.4), borderRadius: "50%", border: `3px solid ${flash > 0.1 ? BCM.white : BCM.blue}`, opacity: f > press ? (1 - ring) * 0.8 : 0 }} />
      ))}
      {/* illustrated 3D disc: side band + gradient top face */}
      <div style={{ position: "relative", width: W, height: H + 70, transform: `scale(${enter}) rotate(${tilt}deg)` }}>
        <div style={{ position: "absolute", left: 0, top: 70 - depth + down * 28, width: W, height: H + depth, borderRadius: `${W / 2}px / ${H / 2}px`, background: "linear-gradient(90deg, #2A16A8, #3A22D0 50%, #2A16A8)" }} />
        <div style={{ position: "absolute", left: 0, top: down * 28, width: W, height: H, borderRadius: "50%", background: BCM.grad, boxShadow: "inset 0 -10px 30px rgba(20,10,90,0.35), inset 0 8px 20px rgba(255,255,255,0.35)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontFamily: BCM_FONTS.mono, fontWeight: 800, fontSize: 92, color: BCM.white, letterSpacing: 2, transform: "scaleY(0.62)" }}>CONNECT</div>
        </div>
      </div>
    </Center>
  );
};

/* ------------------------------------------------ 3. live kWh counter */
const Meter: React.FC = () => {
  const f = useCurrentFrame();
  const dur = S.wipe - S.meter + 4;
  const v = Math.round(interpolate(f, [0, dur - 4], [147, 12480], { ...CL, easing: Easing.in(Easing.quad) }));
  const zoom = lerp(ez(f, 0, dur, (t) => t), 1.12, 1.0);
  const bracket = lerp(ez(f, 0, 10), 120, 0);
  return (
    <AbsoluteFill style={{ background: BCM.black, overflow: "hidden" }}>
      {/* pixel "solar array" — the banner's glowing square clusters */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
        {Array.from({ length: 64 * 36 }, (_, i) => {
          const x = i % 64;
          const y = Math.floor(i / 64);
          const cl = [
            [14, 10],
            [46, 9],
            [32, 22],
            [8, 27],
            [55, 28],
          ].reduce((m, [cx, cy]) => Math.max(m, Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / 40)), 0);
          const tw = 0.6 + 0.4 * Math.sin(f * 0.6 + random(`m${i}`) * 20);
          const a = Math.min(1, cl * 1.4 * tw + 0.05);
          const c = random(`c${i}`) < 0.5 ? BCM.sky : random(`c${i}`) < 0.8 ? BCM.blue : BCM.violet;
          return <rect key={i} x={x * 30 + 4} y={y * 30 + 4} width={22} height={22} rx={3} fill={c} opacity={a} />;
        })}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(7,9,15,0.15) 0%, rgba(7,9,15,0.7) 100%)" }} />
      {/* REC + corner brackets */}
      <div style={{ position: "absolute", left: 60, top: 44, display: "flex", alignItems: "center", gap: 12, fontFamily: BCM_FONTS.mono, fontWeight: 700, fontSize: 28, color: BCM.white }}>
        <span style={{ width: 16, height: 16, borderRadius: 8, background: "#FF3B5C", opacity: f % 16 < 10 ? 1 : 0.2 }} /> REC
      </div>
      {[0, 1, 2, 3].map((k) => {
        const r = k % 2 === 1;
        const b = k >= 2;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              width: 110,
              height: 110,
              left: r ? undefined : 40 - bracket,
              right: r ? 40 - bracket : undefined,
              top: b ? undefined : 30 - bracket,
              bottom: b ? 30 - bracket : undefined,
              borderColor: BCM.white,
              borderStyle: "solid",
              borderWidth: `${b ? 0 : 6}px ${r ? 6 : 0}px ${b ? 6 : 0}px ${r ? 0 : 6}px`,
            }}
          />
        );
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontFamily: BCM_FONTS.mono, fontWeight: 800, fontSize: 240, color: BCM.white, letterSpacing: -6, lineHeight: 1, textShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>{v.toLocaleString("en-US")}</div>
        <div style={{ fontFamily: BCM_FONTS.mono, fontWeight: 800, fontSize: 44, letterSpacing: 14, marginTop: 18, color: BCM.sky, textShadow: "0 0 24px rgba(77,37,247,0.8)" }}>kWh VERIFIED</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- 4. stripe wipe */
const Wipe: React.FC = () => {
  const f = useCurrentFrame();
  const cols = [BCM.blue, BCM.black, BCM.violet, BCM.white, BCM.sky, BCM.black, BCM.blue, BCM.white, BCM.violet, BCM.black];
  return (
    <AbsoluteFill>
      {cols.map((c, i) => {
        const inn = ez(f, i * 0.4, 4, Easing.out(Easing.cubic));
        const out = ez(f, 5 + i * 0.4, 4, Easing.in(Easing.cubic));
        const dir = i % 2 ? 1 : -1;
        return <div key={i} style={{ position: "absolute", left: i * 192, width: 194, top: 0, height: 1080, background: c, transform: `translateY(${dir * (1 - inn) * 1100 + -dir * out * 1100}px)` }} />;
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- 5. logo lockup */
const Lockup: React.FC = () => {
  const f = useCurrentFrame();
  const icon = spring({ frame: f - 2, fps: 30, config: { damping: 11, stiffness: 160 } });
  const w1 = ez(f, 4, 8);
  const w2 = ez(f, 7, 8);
  const pill = spring({ frame: f - 12, fps: 30, config: { damping: 12, stiffness: 200 } });
  const drift = lerp(ez(f, 0, 32, (t) => t), 1, 1.04);
  return (
    <Center bg={BCM.white}>
      <div style={{ display: "flex", alignItems: "center", gap: 46, transform: `scale(${drift})` }}>
        <div style={{ transform: `scale(${icon}) rotate(${(1 - icon) * -140}deg)` }}>
          <Logo size={230} id="lk" />
        </div>
        <div>
          <div style={{ fontFamily: BCM_FONTS.word, fontWeight: 700, fontSize: 170, lineHeight: 0.95, letterSpacing: 4, color: BCM.ink, clipPath: "inset(-10% -5% -10% -5%)", transform: `translateY(${(1 - w1) * 60}px)`, opacity: w1 }}>BCM</div>
          <div style={{ fontFamily: BCM_FONTS.word, fontWeight: 600, fontSize: 150, lineHeight: 1.05, ...gradText, transform: `translateY(${(1 - w2) * 60}px)`, opacity: w2 }}>Wallet</div>
          <div style={{ marginTop: 18, transform: `scale(${pill})`, transformOrigin: "left center" }}>
            <Pill dark size={26}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: "#22D08A" }} /> Live on BOT Chain
            </Pill>
          </div>
        </div>
      </div>
    </Center>
  );
};

/* ------------------------------------------------- 6. leaderboard */
const DEVICES = ["@solar.roof", "@wind.farm", "@hydro.dam", "@home.grid", "@agri.pv"];
const ICONS = ["☀", "✺", "≋", "⌂", "❖"];
const Ranks: React.FC = () => {
  const f = useCurrentFrame();
  const swap = ez(f, 12, 10, Easing.inOut(Easing.cubic));
  const zoom = lerp(ez(f, 16, 18), 1, 1.12);
  const title = ez(f, 0, 6);
  // device index → rank, before and after the swap
  const rankA = [4, 1, 0, 3, 2];
  const rankB = [0, 2, 1, 4, 3]; // the underdog climbs to #1; slots follow rank
  const HEIGHT = [440, 300, 250, 210, 180];
  return (
    <AbsoluteFill style={{ background: BCM.black, overflow: "hidden" }}>
      <Grid />
      <div style={{ position: "absolute", left: 80, top: 70, fontFamily: BCM_FONTS.mono, fontWeight: 800, fontSize: 84, color: BCM.white, letterSpacing: -2 }}>
        <Glitch f={f} dur={999} seed="rk" strips={4} amp={200}>
          Climb the ranks.
        </Glitch>
      </div>
      <div style={{ position: "absolute", right: 80, top: 92, opacity: title }}>
        <Pill size={20}>ENERGY · CO₂ · BC</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 860, transform: `scale(${zoom})`, transformOrigin: "50% 100%" }}>
        {DEVICES.map((d, i) => {
          const slot = lerp(swap, i, rankB[i]);
          const rank = swap < 0.5 ? rankA[i] : rankB[i];
          const grow = spring({ frame: f - 2 - i, fps: 30, config: { damping: 14, stiffness: 170 } });
          const h = lerp(swap, HEIGHT[rankA[i]], HEIGHT[rankB[i]]) * grow;
          const first = rank === 0;
          const x = 380 + slot * 290;
          return (
            <div key={d} style={{ position: "absolute", left: x - 100, bottom: 130, width: 200, height: h }}>
              <div style={{ position: "absolute", left: 40, top: -150, width: 120, height: 120, borderRadius: 60, background: first ? BCM.grad : BCM.panel, border: `4px solid ${first ? BCM.white : "#2A3045"}`, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 60, color: BCM.white }}>{ICONS[i]}</div>
              <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: first ? BCM.grad : BCM.panel, border: first ? "none" : "2px solid #232840", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 24, fontFamily: BCM_FONTS.mono, fontWeight: 800, fontSize: 48, color: BCM.white }}>#{rank + 1}</div>
              <div style={{ position: "absolute", left: -40, right: -40, bottom: -56, textAlign: "center", fontFamily: BCM_FONTS.mono, fontSize: 24, color: "rgba(246,248,255,0.6)" }}>{d}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- 7. tilted donut */
const SPLIT = [33, 22, 18, 15, 12];
const SHADES = [BCM.violet, BCM.blue, BCM.sky, "#8FC2FF", "#C6DDFF"];
const Donut: React.FC = () => {
  const f = useCurrentFrame();
  const sweep = ez(f, 2, 16, Easing.inOut(Easing.cubic));
  const count = Math.round(interpolate(f, [2, 20], [0, 1240], { ...CL, easing: OUT }));
  const spin = lerp(ez(f, 0, 30), -60, 0);
  let acc = 0;
  const R = 300;
  const r = 140;
  const seg = (a0: number, a1: number) => {
    const p = (a: number, rad: number) => `${960 + Math.cos(a) * rad} ${560 + Math.sin(a) * rad}`;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M${p(a0, R)} A${R} ${R} 0 ${large} 1 ${p(a1, R)} L${p(a1, r)} A${r} ${r} 0 ${large} 0 ${p(a0, r)} Z`;
  };
  return (
    <AbsoluteFill style={{ background: BCM.white }}>
      <div style={{ position: "absolute", left: 80, top: 60, fontFamily: BCM_FONTS.mono, fontWeight: 800, fontSize: 84, lineHeight: 1.02, letterSpacing: -2 }}>
        <Glitch f={f} dur={999} seed="dn" strips={4} amp={200}>
          <div style={{ color: BCM.ink }}>Rewards,</div>
          <div style={gradText}>split by rank.</div>
        </Glitch>
      </div>
      <div style={{ position: "absolute", left: -260, top: 60, width: 1920, height: 1000, perspective: 1600 }}>
        <svg width={1920} height={1000} style={{ transform: `rotateX(48deg) rotateZ(${spin}deg)`, transformOrigin: "960px 560px", overflow: "visible" }}>
          {SPLIT.map((p, i) => {
            const a0 = -Math.PI / 2 + (acc / 100) * Math.PI * 2 * sweep + 0.04;
            acc += p;
            const a1 = -Math.PI / 2 + (acc / 100) * Math.PI * 2 * sweep - 0.04;
            return a1 > a0 ? <path key={i} d={seg(a0, a1)} fill={SHADES[i]} /> : null;
          })}
          <circle cx={960} cy={560} r={r - 18} fill={BCM.white} />
        </svg>
        <div style={{ position: "absolute", left: 960 - 160, top: 470, width: 320, textAlign: "center", fontFamily: BCM_FONTS.mono, color: BCM.ink }}>
          <div style={{ fontWeight: 800, fontSize: 72, lineHeight: 1 }}>{count.toLocaleString("en-US")}</div>
          <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: 6, ...gradText }}>BC</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1290, top: 330, fontFamily: BCM_FONTS.mono, fontWeight: 800, fontSize: 48, lineHeight: 1.45 }}>
        {SPLIT.map((p, i) => {
          const t = ez(f, 8 + i * 2, 6);
          return (
            <div key={i} style={{ display: "flex", gap: 40, opacity: t, transform: `translateX(${(1 - t) * 40}px)` }}>
              <span style={{ ...gradText, width: 90 }}>#{i + 1}</span>
              <span style={{ color: BCM.ink }}>{p}%</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- 8. radar */
const DOTS = Array.from({ length: 30 }, (_, i) => ({ a: random(`ra${i}`) * Math.PI * 2, d: 0.12 + random(`rd${i}`) * 0.85, fake: i % 6 === 2 }));
const Radar: React.FC = () => {
  const f = useCurrentFrame();
  const caught = S.caught - S.radar;
  const ang = f * 0.32;
  const cx = 1290;
  const cy = 560;
  const R = 400;
  return (
    <AbsoluteFill style={{ background: BCM.black }}>
      <Grid />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="rd-fade">
            <stop offset="0" stopColor={BCM.violet} stopOpacity="0.9" />
            <stop offset="1" stopColor={BCM.blue} stopOpacity="0.15" />
          </radialGradient>
        </defs>
        {[1, 0.75, 0.5, 0.25].map((k) => (
          <circle key={k} cx={cx} cy={cy} r={R * k} fill="none" stroke="rgba(246,248,255,0.12)" strokeWidth={2} />
        ))}
        <path d={`M${cx} ${cy} L${cx + Math.cos(ang) * R} ${cy + Math.sin(ang) * R} A${R} ${R} 0 0 0 ${cx + Math.cos(ang - 0.9) * R} ${cy + Math.sin(ang - 0.9) * R} Z`} fill="url(#rd-fade)" opacity={0.85} />
        {DOTS.map((d, i) => {
          const t = ez(f, i * 0.5, 5);
          const x = cx + Math.cos(d.a) * d.d * R;
          const y = cy + Math.sin(d.a) * d.d * R;
          const flagged = d.fake && f > 6 + i * 0.6;
          return (
            <g key={i} opacity={t}>
              <circle cx={x} cy={y} r={flagged ? 12 : 9} fill={flagged ? BCM.sky : BCM.white} />
              {flagged ? (
                <text x={x + 18} y={y + 7} fontFamily="JetBrains Mono" fontWeight={800} fontSize={20} fill={BCM.sky}>
                  FAKE ✕
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 90, top: 460 }}>
        {f < caught ? (
          <Glitch f={f} dur={caught} seed="bt" strips={4} amp={220} outAt={caught - 4}>
            <div style={{ fontFamily: BCM_FONTS.mono, fontWeight: 800, fontSize: 120, color: BCM.white, letterSpacing: -4 }}>Fake data?</div>
          </Glitch>
        ) : (
          <>
            <Glitch f={f - caught} dur={999} seed="cg" strips={4} amp={220}>
              <div style={{ fontFamily: BCM_FONTS.mono, fontWeight: 800, fontSize: 140, letterSpacing: -4, ...gradText }}>Caught.</div>
            </Glitch>
            <div style={{ marginTop: 10, transform: `scale(${spring({ frame: f - caught - 3, fps: 30, config: { damping: 12, stiffness: 200 } })})`, transformOrigin: "left center" }}>
              <Pill size={26}>Verified readings only</Pill>
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- 9. glossy access card */
const TOOLS = ["Dashboard", "Marketplace", "Devices", "Contracts"];
const Card: React.FC = () => {
  const f = useCurrentFrame();
  const flip = spring({ frame: f, fps: 30, config: { damping: 13, stiffness: 120 } });
  const l1 = ez(f, 3, 6);
  const l2 = ez(f, 6, 7);
  return (
    <AbsoluteFill style={{ background: BCM.grad }}>
      <Grid color="rgba(255,255,255,0.08)" />
      <div style={{ position: "absolute", left: 100, top: 380 }}>
        <div style={{ fontFamily: BCM_FONTS.mono, fontWeight: 800, fontSize: 120, color: BCM.white, letterSpacing: -4, opacity: l1, transform: `translateX(${(1 - l1) * -60}px)` }}>Hold $BC.</div>
        <div style={{ fontFamily: BCM_FONTS.word, fontWeight: 600, fontSize: 72, color: BCM.ink, lineHeight: 1.1, opacity: l2, transform: `translateY(${(1 - l2) * 30}px)` }}>
          Unlock every tool.
        </div>
      </div>
      <div style={{ position: "absolute", right: 170, top: 170, width: 560, height: 740, perspective: 1600 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 36,
            padding: 50,
            boxSizing: "border-box",
            background: "linear-gradient(150deg, #FFFFFF 0%, #E4EBFF 45%, #C9C2FF 100%)",
            boxShadow: "0 50px 100px rgba(20,10,80,0.45), inset 0 0 0 2px rgba(255,255,255,0.7)",
            transform: `rotateY(${lerp(flip, 75, -6 + Math.sin(f / 12) * 3)}deg) rotateZ(${lerp(flip, 8, 0)}deg) translateY(${(1 - flip) * 80}px)`,
            fontFamily: BCM_FONTS.mono,
            color: BCM.ink,
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 6, fontWeight: 700, color: "#5A6080" }}>ALL ACCESS</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10 }}>
            <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -4, ...gradText }}>$BC</div>
          </div>
          <div style={{ marginTop: 40 }}>
            {TOOLS.map((t, i) => {
              const o = ez(f, 7 + i * 2.5, 5);
              return (
                <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 38, fontWeight: 700, padding: "16px 0", borderBottom: "2px solid rgba(11,13,20,0.08)", opacity: o, transform: `translateX(${(1 - o) * 40}px)` }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 6, background: BCM.blue }} />
                    {t}
                  </span>
                  <Pill dark size={18}>LIVE</Pill>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", right: 40, bottom: 40 }}>
            <Logo size={90} id="cd" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- 10. block chain */
const BLOCKS = ["674", "675", "676", "677", "678", "679", "680"];
const Chain: React.FC = () => {
  const f = useCurrentFrame();
  const pan = lerp(ez(f, 0, 26, (t) => t), 80, -40);
  const head = ez(f, 4, 7);
  const pills = spring({ frame: f - 9, fps: 30, config: { damping: 12, stiffness: 200 } });
  return (
    <AbsoluteFill style={{ background: BCM.white, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", fontFamily: BCM_FONTS.mono, fontWeight: 800, fontSize: 64, color: BCM.ink, letterSpacing: -1.5, opacity: head }}>
        Every reading settles on BOT Chain.
      </div>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14, transform: `scale(${pills})` }}>
        <Pill grad size={24}>On-chain</Pill>
        <Pill dark size={24}>Chain ID 677</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${pan}px)` }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="ch-g" x1="60" y1="0" x2="1860" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor={BCM.sky} />
              <stop offset="1" stopColor={BCM.violet} />
            </linearGradient>
          </defs>
          <line x1={60} y1={640} x2={60 + 1800 * ez(f, 2, 14)} y2={640} stroke="url(#ch-g)" strokeWidth={8} />
        </svg>
        {BLOCKS.map((b, i) => {
          const t = spring({ frame: f - i * 1.5, fps: 30, config: { damping: 13, stiffness: 150 } });
          const size = 120 + i * 18;
          const x = 140 + i * 265;
          const fromX = (random(`bx${i}`) - 0.5) * 900;
          const fromY = -500 - random(`by${i}`) * 300;
          const hot = b === "677";
          return (
            <div
              key={b}
              style={{
                position: "absolute",
                left: x - size / 2,
                top: 640 - size / 2,
                width: size,
                height: size,
                borderRadius: size * 0.22,
                background: hot ? BCM.grad : BCM.ink,
                color: BCM.white,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: BCM_FONTS.mono,
                fontWeight: 800,
                fontSize: size * 0.3,
                transform: `translate(${(1 - t) * fromX}px, ${(1 - t) * fromY}px) rotate(${(1 - t) * (i % 2 ? 40 : -40)}deg) scale(${hot ? 1 + 0.06 * Math.sin(f / 3) : 1})`,
                boxShadow: hot ? "0 20px 50px rgba(77,37,247,0.45)" : "0 14px 30px rgba(0,0,0,0.2)",
              }}
            >
              {b}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- 11–12. logo + end card */
const IconSpin: React.FC = () => {
  const f = useCurrentFrame();
  const t = spring({ frame: f, fps: 30, config: { damping: 10, stiffness: 170 } });
  return (
    <Center bg={BCM.black}>
      <Grid />
      <div style={{ transform: `scale(${t}) rotate(${(1 - t) * -220}deg)` }}>
        <Logo size={260} id="sp" />
      </div>
    </Center>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const letters = "BCM".split("");
  const tag = ez(f, 8, 8);
  const icon = spring({ frame: f - 6, fps: 30, config: { damping: 11, stiffness: 180 } });
  return (
    <Center bg={BCM.grad}>
      <Grid color="rgba(255,255,255,0.08)" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          {letters.map((ch, i) => {
            const t = spring({ frame: f - i * 2, fps: 30, config: { damping: 12, stiffness: 200 } });
            return (
              <span key={i} style={{ display: "inline-block", fontFamily: BCM_FONTS.word, fontWeight: 700, fontSize: 300, lineHeight: 1, letterSpacing: 10, color: BCM.white, transform: `translateY(${(1 - t) * -260}px)`, opacity: Math.min(1, t * 2) }}>
                {ch}
              </span>
            );
          })}
          <div style={{ marginLeft: 18, marginTop: 6, transform: `scale(${icon})` }}>
            <Logo size={90} mono={BCM.white} id="en" />
          </div>
        </div>
        <div style={{ fontFamily: BCM_FONTS.word, fontWeight: 600, fontSize: 64, color: BCM.ink, marginTop: 10, opacity: tag, transform: `translateY(${(1 - tag) * 20}px)` }}>Verify energy. Earn BC.</div>
        <div style={{ fontFamily: BCM_FONTS.mono, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "rgba(246,248,255,0.85)", marginTop: 18, opacity: ez(f, 12, 8) }}>basecarbonmeter.vercel.app</div>
      </div>
    </Center>
  );
};

/* ------------------------------------------------- timeline */
const ORDER: [number, number, React.ReactNode, string][] = [
  [S.w1, S.w2, <Word key="w1" i={0} dur={S.w2 - S.w1} />, "What if"],
  [S.w2, S.w3, <Word key="w2" i={1} dur={S.w3 - S.w2} />, "clean energy"],
  [S.w3, S.w4, <Word key="w3" i={2} dur={S.w4 - S.w3} />, "paid"],
  [S.w4, S.button, <Word key="w4" i={3} dur={S.button - S.w4} />, "you?"],
  [S.button, S.meter, <Button key="b" />, "Connect"],
  [S.meter, S.logo, <Meter key="m" />, "Meter"],
  [S.logo, S.ranks, <Lockup key="l" />, "Lockup"],
  [S.ranks, S.donut, <Ranks key="r" />, "Ranks"],
  [S.donut, S.radar, <Donut key="d" />, "Donut"],
  [S.radar, S.card, <Radar key="ra" />, "Radar"],
  [S.card, S.chain, <Card key="c" />, "Card"],
  [S.chain, S.icon, <Chain key="ch" />, "Chain"],
  [S.icon, S.end, <IconSpin key="i" />, "Icon"],
  [S.end, tl.durationInFrames, <End key="e" />, "End"],
];

export const BCMPromo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: BCM.black }}>
      <Stage>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          {ORDER.map(([from, to, el, name]) => (
            <Sequence key={name} name={name} from={from} durationInFrames={to - from} premountFor={fps}>
              {el}
            </Sequence>
          ))}
          <Sequence name="Wipe" from={S.wipe} durationInFrames={12} premountFor={fps}>
            <Wipe />
          </Sequence>
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
