import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { seconds } from "../../lib/timing";
import { PM, PM_EASE, PM_FONTS } from "./brand";

/**
 * POLYMATE — 20 s quick edit (1920x1080 @ 30 fps, silent). Text-led beats in
 * the same grammar as the Nyx interstitial (rise + de-blur entrances, typed
 * mono status lines, one idea per beat), dressed in the PolyMate brand:
 * warm black, cream type, antique gold + lapis, the supplied emblem unaltered.
 * Product copy from the X profile / banner (TryOdds live, OddsAlert and
 * CopyOdds upcoming, "Position Opened YES $50"). Market odds are illustrative.
 */
const C = {
  bg: "#0E0B08",
  cream: "#F4EFE6",
  dim: "#A39C90",
  faint: "#5E574D",
  gold: PM.goldLight,
  goldDeep: PM.gold,
  lapis: "#3E63E0",
  green: "#3FB37A",
  card: "#18130E",
} as const;

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = (f: number, a: number, d: number, e = PM_EASE.out) => interpolate(f, [a, a + d], [0, 1], { ...CL, easing: e });

const In: React.FC<{ at: number; out?: number; children: React.ReactNode; dy?: number; style?: React.CSSProperties }> = ({ at, out, children, dy = 40, style }) => {
  const f = useCurrentFrame();
  const t = ez(f, at, 14);
  const o = out === undefined ? 0 : ez(f, out, 10, PM_EASE.inOut);
  return <div style={{ opacity: t * (1 - o), transform: `translateY(${(1 - t) * dy - o * 24}px)`, filter: `blur(${(1 - t) * 10 + o * 8}px)`, ...style }}>{children}</div>;
};

const Typed: React.FC<{ text: string; at: number; cps?: number; size?: number; color?: string }> = ({ text, at, cps = 40, size = 30, color = C.gold }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - at) / fps) * cps)));
  const caret = f >= at && (n < text.length || Math.floor(f / 8) % 2 === 0);
  return (
    <div style={{ fontFamily: PM_FONTS.mono, fontSize: size, color, letterSpacing: 3, whiteSpace: "pre" }}>
      {text.slice(0, n)}
      <span style={{ opacity: caret ? 1 : 0 }}>▍</span>
    </div>
  );
};

/** The supplied emblem, unaltered, with a gentle float + gold glow. */
const Emblem: React.FC<{ w: number }> = ({ w }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "relative", width: w, height: (w * 1232) / 1476, transform: `translateY(${Math.sin(f / 18) * 5}px) rotate(${Math.sin(f / 30) * 1.5}deg)` }}>
      <div style={{ position: "absolute", inset: -w * 0.25, borderRadius: "50%", background: `radial-gradient(circle, color-mix(in srgb, ${C.gold} 28%, transparent) 0%, transparent 65%)` }} />
      <Img src={staticFile("polymate/img/emblem.png")} style={{ position: "relative", width: "100%", height: "100%", filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.55))" }} />
    </div>
  );
};

const Pill: React.FC<{ children: React.ReactNode; tone?: "gold" | "live" | "soon" }> = ({ children, tone = "gold" }) => {
  const border = tone === "live" ? C.green : tone === "soon" ? C.faint : C.gold;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 30px", borderRadius: 999, border: `2px solid ${border}`, background: `color-mix(in srgb, ${border} 12%, transparent)`, fontFamily: PM_FONTS.mono, fontSize: 28, letterSpacing: 2, color: tone === "soon" ? C.dim : C.cream }}>
      {tone === "live" ? <span style={{ width: 14, height: 14, borderRadius: 7, background: C.green, boxShadow: `0 0 12px ${C.green}` }} /> : null}
      {children}
    </div>
  );
};

const H: React.CSSProperties = { fontFamily: PM_FONTS.display, fontStyle: "italic", fontWeight: 800, fontSize: 116, color: C.cream, letterSpacing: -3, lineHeight: 1.05 };
const Serif: React.CSSProperties = { fontFamily: PM_FONTS.serif, fontStyle: "italic", color: C.gold };

/* ----------------------------------------------------------------- beats */
const Meet: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const em = spring({ frame: f - 8, fps, config: { damping: 13, stiffness: 140 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40 }}>
      <Typed text="THE TRADING LAYER FOR PREDICTION MARKETS" at={0} cps={55} />
      <div style={{ display: "flex", alignItems: "center", gap: 50 }}>
        <In at={6} out={d - 10}>
          <div style={{ ...H, fontSize: 150 }}>Meet PolyMate.</div>
        </In>
        <div style={{ transform: `scale(${em})`, opacity: 1 - ez(f, d - 10, 10) }}>
          <Emblem w={200} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MARKETS = [
  { q: "Who wins the next election?", yes: 62, up: true },
  { q: "Fed cuts rates next meeting?", yes: 28, up: false },
  { q: "BTC > $150K by year end?", yes: 68, up: true },
];

const Spark: React.FC<{ up: boolean; t: number }> = ({ up, t }) => {
  const pts = Array.from({ length: 16 }, (_, i) => `${i * 12},${30 + (up ? -1 : 1) * i * 1.4 + Math.sin(i * 1.7) * 6}`).join(" ");
  return (
    <svg width={190} height={60}>
      <polyline points={pts} fill="none" stroke={up ? C.green : "#D9776A"} strokeWidth={3} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t} />
    </svg>
  );
};

const Markets: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 150px", gap: 110 }}>
      <div style={{ width: 640 }}>
        <In at={0} out={d - 10}>
          <div style={H}>Every headline is a market.</div>
        </In>
        <In at={12} out={d - 10} style={{ marginTop: 26 }}>
          <div style={{ ...Serif, fontSize: 56 }}>Elections. Rates. Crypto.</div>
        </In>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22, opacity: 1 - ez(f, d - 10, 10) }}>
        {MARKETS.map((m, i) => {
          const t = spring({ frame: f - 8 - i * 6, fps, config: { damping: 14, stiffness: 150 } });
          const yes = Math.round(m.yes * ez(f, 10 + i * 6, 24));
          return (
            <div key={m.q} style={{ display: "flex", alignItems: "center", gap: 28, padding: "26px 34px", borderRadius: 26, background: C.card, border: `2px solid color-mix(in srgb, ${C.gold} 35%, transparent)`, transform: `translateX(${(1 - t) * 120}px)`, opacity: Math.min(1, t * 1.5) }}>
              <div style={{ flex: 1, fontFamily: PM_FONTS.ui, fontSize: 38, fontWeight: 600, color: C.cream }}>{m.q}</div>
              <Spark up={m.up} t={ez(f, 12 + i * 6, 24)} />
              <div style={{ width: 170, textAlign: "right", fontFamily: PM_FONTS.ui, fontWeight: 800, fontSize: 44, color: m.up ? C.green : "#D9776A" }}>
                {yes}% <span style={{ fontSize: 28, fontWeight: 600, color: C.dim }}>Yes</span>
              </div>
            </div>
          );
        })}
        <div style={{ fontFamily: PM_FONTS.mono, fontSize: 20, letterSpacing: 3, color: C.faint, marginTop: 4 }}>ILLUSTRATIVE ODDS</div>
      </div>
    </AbsoluteFill>
  );
};

const Swap: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const words = ["in seconds.", "from Telegram.", "on your view."];
  const step = (d - 20) / words.length;
  const pos = interpolate(f, words.map((_, i) => 10 + i * step), words.map((_, i) => i), { ...CL, easing: PM_EASE.inOut });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <In at={0} out={d - 10}>
        <div style={{ ...H, textAlign: "center" }}>Trade the future</div>
      </In>
      <In at={6} out={d - 10}>
        <div style={{ position: "relative", height: 150, width: 1500, overflow: "hidden", marginTop: 4 }}>
          {words.map((w, i) => (
            <div key={w} style={{ position: "absolute", inset: 0, textAlign: "center", ...Serif, fontSize: 128, lineHeight: "150px", transform: `translateY(${(i - pos) * 150}px)`, opacity: 1 - Math.min(1, Math.abs(i - pos)) }}>
              {w}
            </div>
          ))}
        </div>
      </In>
    </AbsoluteFill>
  );
};

/** The trade, as on the banner: tap YES $50 → Executing Trade… → Position Opened. */
const Trade: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const press = interpolate(f, [20, 24, 30], [1, 0.94, 1], CL);
  const exec = ez(f, 26, 40, (t) => t);
  const opened = spring({ frame: f - 70, fps, config: { damping: 12, stiffness: 170 } });
  const out = 1 - ez(f, d - 10, 10);
  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 150px", gap: 110, opacity: out }}>
      <div style={{ width: 620 }}>
        <In at={0}>
          <div style={H}>Trade in one tap.</div>
        </In>
        <In at={10} style={{ marginTop: 26 }}>
          <div style={{ fontFamily: PM_FONTS.ui, fontSize: 46, color: C.dim }}>Pick a side. Set your size. Done.</div>
        </In>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
        <In at={4}>
          <div style={{ padding: "30px 36px", borderRadius: 28, background: C.card, border: `2px solid color-mix(in srgb, ${C.gold} 35%, transparent)` }}>
            <div style={{ fontFamily: PM_FONTS.ui, fontSize: 38, fontWeight: 600, color: C.cream }}>BTC &gt; $150K by year end?</div>
            <div style={{ display: "flex", gap: 20, marginTop: 24 }}>
              <div style={{ flex: 1, padding: "22px 0", textAlign: "center", borderRadius: 18, background: f >= 24 ? C.green : "transparent", border: `2px solid ${C.green}`, color: f >= 24 ? "#06140C" : C.green, fontFamily: PM_FONTS.ui, fontWeight: 800, fontSize: 36, transform: `scale(${press})` }}>YES $50</div>
              <div style={{ flex: 1, padding: "22px 0", textAlign: "center", borderRadius: 18, border: `2px solid ${C.faint}`, color: C.dim, fontFamily: PM_FONTS.ui, fontWeight: 700, fontSize: 36 }}>NO</div>
            </div>
          </div>
        </In>
        {f >= 26 ? (
          <div style={{ padding: "26px 36px", borderRadius: 24, background: C.cream, color: PM.ink, opacity: 1 - ez(f, 70, 8) * 0.0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: PM_FONTS.ui, fontSize: 34, fontWeight: 600 }}>
              <span style={{ color: C.goldDeep }}>⚡</span> {opened > 0.5 ? "Position Opened" : "Executing Trade…"}
              {opened > 0.5 ? <span style={{ marginLeft: "auto", color: "#1F8A55", fontWeight: 800, transform: `scale(${opened})` }}>✓ YES $50</span> : null}
            </div>
            <div style={{ marginTop: 18, height: 12, borderRadius: 6, background: "rgba(14,11,8,0.12)", overflow: "hidden" }}>
              <div style={{ width: `${exec * 100}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${C.goldDeep}, ${C.gold})` }} />
            </div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const Live: React.FC<{ d: number }> = ({ d }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 46 }}>
    <In at={0} out={d - 10}>
      <div style={{ ...H, textAlign: "center" }}>TryOdds is live.</div>
    </In>
    <In at={8} out={d - 10}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <Pill tone="live">LIVE NOW</Pill>
        <div style={{ fontFamily: PM_FONTS.mono, fontSize: 44, color: C.gold }}>t.me/Tryoddsbot</div>
      </div>
    </In>
  </AbsoluteFill>
);

const Soon: React.FC<{ d: number }> = ({ d }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 50 }}>
    <In at={0} out={d - 10}>
      <div style={{ ...H, textAlign: "center" }}>More tools are coming.</div>
    </In>
    <div style={{ display: "flex", gap: 30 }}>
      {["OddsAlert", "CopyOdds"].map((n, i) => (
        <In key={n} at={8 + i * 5} out={d - 10}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "30px 60px", borderRadius: 28, border: `2px solid color-mix(in srgb, ${C.gold} 35%, transparent)`, background: C.card }}>
            <div style={{ fontFamily: PM_FONTS.ui, fontWeight: 700, fontSize: 52, color: C.cream }}>{n}</div>
            <Pill tone="soon">COMING SOON</Pill>
          </div>
        </In>
      ))}
    </div>
  </AbsoluteFill>
);

const Lockup: React.FC<{ d: number }> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const em = spring({ frame: f, fps, config: { damping: 12, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
        <div style={{ transform: `scale(${em})` }}>
          <Emblem w={280} />
        </div>
        <div>
          <In at={4}>
            <div style={{ ...H, fontSize: 170, letterSpacing: -5, lineHeight: 1 }}>PolyMate</div>
          </In>
          <In at={10} style={{ marginTop: 10 }}>
            <div style={{ ...Serif, fontSize: 56 }}>The trading layer for prediction markets.</div>
          </In>
          <In at={16} style={{ marginTop: 22 }}>
            <Pill tone="live">Start trading · t.me/Tryoddsbot</Pill>
          </In>
        </div>
      </div>
      <In at={20} style={{ position: "absolute", bottom: 100 }}>
        <div style={{ fontFamily: PM_FONTS.ui, fontSize: 24, color: C.faint }}>Prediction markets carry risk. Outcomes are never guaranteed.</div>
      </In>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- timeline */
const BEATS: [string, number, number, React.FC<{ d: number }>][] = [
  ["Meet", 0, 2.6, Meet],
  ["Markets", 2.6, 3.4, Markets],
  ["Swap", 6.0, 3.0, Swap],
  ["Trade", 9.0, 4.4, Trade],
  ["Live", 13.4, 2.2, Live],
  ["Soon", 15.6, 2.2, Soon],
  ["Lockup", 17.8, 2.2, Lockup],
];

export const PolymateQuick20: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, color-mix(in srgb, ${C.gold} 12%, transparent) 0%, transparent 62%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 85% 10%, color-mix(in srgb, ${C.lapis} 10%, transparent) 0%, transparent 45%)` }} />
      {BEATS.map(([name, at, len, Beat]) => (
        <Sequence key={name} name={name} from={seconds(at, fps)} durationInFrames={seconds(len, fps)} premountFor={fps}>
          <Beat d={seconds(len, fps)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
