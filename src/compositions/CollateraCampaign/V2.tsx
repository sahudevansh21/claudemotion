import { AbsoluteFill } from "remotion";
import { Checklist, Cursor, cursorPath, ez, Film, Glyph, IO, K, lerp, LogoEnd, MONO, Plate, SANS, Scribble, SlotList, Tile, Underline, useT, useV, Words } from "./kit";
import TL from "./v2.json";

/**
 * V2 · "Know what changed before you act" (content plan Day 6).
 * 30 s · 1080p60 · recreates the locked Notion AI reference (ANALYSIS.md §2):
 * word reveals + underline, floating icon tiles, plate wipes, typed prompt +
 * cursor click, agent checklist with timer, scribble annotation, slot-list
 * roll, preview card + confirmation pill, rapid feature cards, logo.
 * Every number is ILLUSTRATIVE.
 */
const T = { fontFamily: SANS, fontWeight: 500, letterSpacing: -1.6, color: K.ink } as const;

const ICONS: [string, number, number, number][] = [
  ["buffer", 330, 210, 96],
  ["oracle", 1500, 180, 84],
  ["price", 1640, 520, 96],
  ["bell", 260, 700, 88],
  ["wallet", 1420, 800, 84],
  ["eye", 640, 860, 76],
  ["ltv", 1180, 120, 70],
];
const ICONS_V: [number, number][] = [[120, 300], [820, 280], [860, 1280], [110, 1330], [760, 1580], [360, 1650], [480, 170]];

const Hook: React.FC = () => {
  const t = useT();
  const v = useV();
  return (
    <AbsoluteFill style={{ background: K.paper }}>
      {ICONS.map(([k, x0, y0, s], i) => {
        const [x, y] = v ? ICONS_V[i] : [x0, y0];
        const p = ez(t, 0.05 + i * 0.07, 0.6 + i * 0.07);
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y + Math.sin(t * 1.2 + i) * 8, opacity: p, transform: `scale(${0.7 + 0.3 * p}) rotate(${(i % 2 ? 1 : -1) * 6}deg)` }}>
            <Tile light size={s}>
              <Glyph kind={k} size={s * 0.48} color={i % 3 === 0 ? "#1E9B4F" : K.ink} />
            </Tile>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: v ? 720 : 400, width: v ? 1080 : 1920, textAlign: "center", ...T, fontSize: 86 }}>
        <div>
          <Words text="Your position." at={0.05} />
        </div>
        {v ? (
          <div>
            <Words text="Now with a second" at={0.5} step={0.08} />
          </div>
        ) : null}
        <div style={{ display: "inline-block", position: "relative" }}>
          <Words text={v ? "pair of eyes." : "Now with a second pair of eyes."} at={v ? 0.82 : 0.5} step={0.08} />
          <div style={{ position: "absolute", right: -6, bottom: -18 }}>
            <Underline width={210} at={1.35} color="#1E9B4F" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Know: React.FC = () => (
  <AbsoluteFill style={{ background: K.paper, justifyContent: "center", alignItems: "center" }}>
    <div style={{ ...T, fontSize: 92, textAlign: "center", lineHeight: 1.12 }}>
      <div>
        <Words text="Know what changed" at={0.05} />
      </div>
      <div>
        <Words text="before you act." at={0.4} />
      </div>
    </div>
  </AbsoluteFill>
);

const InputCard: React.FC<{ typed: string; caret: boolean; send: number; w?: number }> = ({ typed, caret, send, w = 1080 }) => (
  <div style={{ width: w, boxSizing: "border-box", background: "#FFFFFF", borderRadius: 26, boxShadow: "0 30px 70px rgba(0,48,31,0.16)", padding: "30px 34px" }}>
    <div style={{ fontFamily: SANS, fontSize: 34, color: typed ? K.ink : "#9AAEA3", minHeight: 46 }}>
      {typed || "Paste an Algorand address…"}
      {caret ? <span style={{ color: "#1E9B4F" }}>|</span> : null}
    </div>
    <div style={{ display: "flex", alignItems: "center", marginTop: 34, gap: 16, color: "#7D9488", fontFamily: SANS, fontSize: 24 }}>
      <span style={{ whiteSpace: "nowrap" }}>No wallet handy? Try a sample:</span>
      {["DEMO 1", "DEMO 2", "DEMO 3"].map((d) => (
        <span key={d} style={{ fontFamily: MONO, fontSize: 18, padding: "6px 12px", border: "1.5px solid #D5E2D9", borderRadius: 8 }}>
          {d}
        </span>
      ))}
      <span style={{ marginLeft: "auto", padding: "14px 26px", borderRadius: 14, background: send > 0.5 ? "#1E9B4F" : K.ink, color: "#FFFFFF", fontFamily: SANS, fontWeight: 700, fontSize: 24, transform: `scale(${1 - send * 0.06})` }}>WATCH</span>
    </div>
  </div>
);

const Input: React.FC = () => {
  const t = useT();
  const s = "DEMO 1 · sample position";
  const n = Math.max(0, Math.min(s.length, Math.floor((t - 0.5) * 16)));
  const v = useV();
  const c = cursorPath(t, v ? [
    [0, 900, 1500],
    [1.6, 905, 1000],
    [2.3, 908, 1002],
  ] : [
    [0, 1500, 900],
    [1.6, 1335, 575],
    [2.3, 1338, 577],
  ], [2.35]);
  return (
    <AbsoluteFill>
      <Plate color={K.mintPlate} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <InputCard w={v ? 1000 : 1080} typed={s.slice(0, n)} caret={n < s.length || Math.floor(t * 2.4) % 2 === 0} send={c.press} />
      </AbsoluteFill>
      <Cursor x={c.x} y={c.y} press={c.press} opacity={ez(t, 0.8, 1.1)} />
    </AbsoluteFill>
  );
};

const Check: React.FC = () => {
  const t = useT();
  const z = ez(t, 0, 6, IO);
  const v = useV();
  return (
    <AbsoluteFill style={{ background: K.mintPlate }}>
      <AbsoluteFill style={{ transform: `scale(${1.04 + z * 0.06})` }}>
        <div style={{ position: "absolute", right: v ? 60 : 300, top: v ? 330 : 150, padding: "18px 28px", background: "#FFFFFF", borderRadius: 22, fontFamily: SANS, fontSize: 30, color: K.ink, boxShadow: "0 16px 40px rgba(0,48,31,0.10)" }}>Watch DEMO 1 · sample position</div>
        <div style={{ position: "absolute", left: v ? 70 : 300, top: v ? 520 : 290 }}>
          <Checklist
            size={v ? 40 : 42}
            at={0.2}
            items={["Reading position (public data)", "Checking oracle age", "Comparing to liquidation line", "Stress-testing a −10% move", "Checking market hours"]}
          />
        </div>
        <div style={{ position: "absolute", left: v ? 72 : 302, top: v ? 1260 : 900, fontFamily: MONO, fontSize: 20, color: "#6E8578", opacity: ez(t, 1, 1.4) }}>ILLUSTRATIVE · READ-ONLY · NO KEYS</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Stress: React.FC = () => {
  const t = useT();
  const v = useV();
  return (
    <AbsoluteFill style={{ background: K.paper }}>
      <div style={{ position: "absolute", top: v ? 760 : 400, width: v ? 1080 : 1920, display: "flex", justifyContent: "center", alignItems: "center", gap: 22, ...T, fontSize: v ? 72 : 80 }}>
        <span style={{ fontSize: 46, padding: "10px 26px", borderRadius: 99, background: "#E6EFE9", color: "#3E5A4C", opacity: ez(t, 0.05, 0.3) }}>Stress test</span>
        <Words text="shows the gap." at={0.25} />
      </div>
      <div style={{ position: "absolute", top: v ? 870 : 510, width: v ? 1080 : 1920, textAlign: "center", ...T, fontSize: v ? 72 : 80 }}>
        <Words text="You decide." at={0.75} />
      </div>
      <div style={{ position: "absolute", left: v ? 330 : 1190, top: v ? 1060 : 650 }}>
        <Scribble lines={["Price drops", "Stale feeds", "Overnight gaps"]} at={1.2} size={28} />
      </div>
    </AbsoluteFill>
  );
};

const Slots: React.FC = () => {
  const t = useT();
  const z = ez(t, 0, 1.2, IO);
  const label = t < 4.6 ? "Simulating" : "Comparing";
  const v = useV();
  return (
    <AbsoluteFill>
      <Plate color={K.peach} />
      <AbsoluteFill style={{ transform: v ? `scale(${lerp(z, 0.92, 1.05)})` : `scale(${lerp(z, 0.9, 1.15)}) translate(${lerp(z, 0, -60)}px, 0)` }}>
        <div style={{ position: "absolute", left: v ? 70 : 260, top: v ? 380 : 410, width: 520, background: "#FFFFFF", borderRadius: 24, padding: "26px 30px", boxShadow: "0 24px 60px rgba(120,60,20,0.12)" }}>
          <div style={{ fontFamily: SANS, fontSize: 28, color: K.ink }}>Stress test · DEMO 1</div>
          <div style={{ fontFamily: MONO, fontSize: 18, color: "#9A7B66", marginTop: 12 }}>ILLUSTRATIVE SCENARIOS</div>
        </div>
        <div style={{ position: "absolute", left: v ? 640 : 800, top: v ? 436 : 466, display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontSize: 28, color: "#9A7B66" }}>
          <span style={{ width: 60, height: 2, background: "#D9BBA6" }} />
          {label}
          <span style={{ width: 60, height: 2, background: "#D9BBA6" }} />
        </div>
        <div style={{ position: "absolute", left: v ? 160 : 1130, top: v ? 720 : 240 }}>
          <SlotList
            items={["Price −5%", "Price −10%", "Price −20%", "Feed 90 min stale", "Market closed", "Overnight gap", "Thin liquidity", "Issuer event", "Price −10% + stale feed"]}
            at={0.6}
            speed={1.35}
            size={44}
            visible={7}
            stopAt={5.5}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Bar: React.FC<{ label: string; v: number; color: string }> = ({ label, v, color }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 24, color: "#5D6F64" }}>
      <span>{label}</span>
      <span style={{ fontFamily: MONO }}>{v.toFixed(1)}%</span>
    </div>
    <div style={{ height: 16, background: "#EFE6C4", borderRadius: 8, marginTop: 8 }}>
      <div style={{ height: 16, width: `${v * 3}%`, background: color, borderRadius: 8 }} />
    </div>
  </div>
);

const Preview: React.FC = () => {
  const t = useT();
  const a = ez(t, 0.4, 1.2);
  const b = ez(t, 0.9, 1.7);
  const v = useV();
  const c = cursorPath(t, v ? [
    [0, 900, 1600],
    [1.5, 880, 1100],
    [1.85, 883, 1102],
  ] : [
    [0, 1560, 960],
    [1.5, 1250, 688],
    [1.85, 1253, 690],
  ], [1.9]);
  const ok = ez(t, 1.95, 2.25);
  return (
    <AbsoluteFill>
      <Plate color={K.butter} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: 820, background: "#FFFFFF", borderRadius: 26, padding: "34px 40px", boxShadow: "0 30px 70px rgba(110,90,20,0.14)" }}>
          <div style={{ fontFamily: SANS, fontSize: 36, fontWeight: 600, color: K.ink }}>Preview repayment</div>
          <div style={{ fontFamily: MONO, fontSize: 17, color: "#9A8A55", margin: "8px 0 26px" }}>ILLUSTRATIVE · BEFORE → AFTER</div>
          <Bar label="Buffer before" v={8.2 * a} color="#E2A23B" />
          <Bar label="Buffer after" v={21.5 * b} color="#1E9B4F" />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <span style={{ padding: "16px 28px", borderRadius: 14, background: ok > 0.5 ? "#1E9B4F" : K.ink, color: "#FFFFFF", fontFamily: SANS, fontWeight: 700, fontSize: 24 }}>{ok > 0.5 ? "✓ You confirm it yourself" : "Review"}</span>
          </div>
        </div>
      </AbsoluteFill>
      <Cursor x={c.x} y={c.y} press={c.press} opacity={ez(t, 0.6, 0.9)} />
    </AbsoluteFill>
  );
};

const CARDS = ["Monitor", "Stress test", "Get alerts", "Preview repayment"];
const Cards: React.FC = () => {
  const t = useT();
  const i = Math.min(CARDS.length - 1, Math.floor(t / 0.45));
  return (
    <AbsoluteFill style={{ background: K.paper, justifyContent: "center", alignItems: "center" }}>
      <div style={{ ...T, fontSize: 96 }}>{CARDS[i]}</div>
    </AbsoluteFill>
  );
};

const Logo: React.FC = () => <LogoEnd light at={-0.25} />;

export const CollateraV2: React.FC = () => (
  <Film
    scenes={TL.scenes}
    map={{ hook: Hook, know: Know, input: Input, check: Check, stress: Stress, slots: Slots, preview: Preview, cards: Cards, logo: Logo }}
    audio="collatera-campaign/v2/mix.wav"
    bg={K.paper}
    glow={false}
  />
);
