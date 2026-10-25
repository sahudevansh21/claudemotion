import { AbsoluteFill, random } from "remotion";
import { CL } from "../Collatera/brand";
import { ez, Film, Glyph, IO, K, lerp, Letters, LogoEnd, MONO, SANS, Swap, Tile, useT, useV } from "./kit";
import TL from "./v6.json";

/**
 * V6 · "Built around the lending stack" (content plan Day 9).
 * 20 s · 1080p60 · recreates the locked Supabase Middleware reference
 * (ANALYSIS.md §5): letter blur-in title, word swap + name reel, burst-out,
 * settlement card slide-up, card grid stagger with highlights, footnote fade,
 * logo. Venue names and descriptions verbatim from collatera.buzz; shown as
 * coverage targets only (no logos, no partnership implied).
 */
const T = { fontFamily: SANS, fontWeight: 500, letterSpacing: -2, color: K.text } as const;
const VENUES: [string, string, string][] = [
  ["Aave", "Lending market", "Largest on-chain money market. Collateral buffers and oracle freshness for Aave positions."],
  ["Euler", "Lending market", "Modular credit vaults. Track vault LTVs and the oracles each vault depends on."],
  ["Morpho", "Lending network", "Isolated, fixed-parameter markets. Watch LLTV distance and stale prices per market."],
  ["Sentora", "Vault curator", "Institutional DeFi curator. Follow curated markets on Aave and Morpho."],
];

const Title: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <div style={{ ...T, fontSize: 96, maxWidth: 960, textAlign: "center", lineHeight: 1.12 }}>
      <Letters text="Built around the lending stack." at={0.05} step={0.025} />
    </div>
  </AbsoluteFill>
);

const NameTile: React.FC<{ name: string; active?: boolean; size?: number }> = ({ name, active, size = 96 }) => (
  <div style={{ height: size, padding: "0 30px", borderRadius: size * 0.24, background: active ? "#0E2E22" : K.panel, border: `1.5px solid ${active ? "#2F6A4E" : K.edge}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontSize: size * 0.3, color: active ? CL.lime : K.dim, whiteSpace: "nowrap" }}>
    <Glyph kind="vault" size={size * 0.36} color={active ? CL.lime : K.dim} />
    {name}
  </div>
);

const SwapScene: React.FC = () => {
  const t = useT();
  const base = TL.scenes.find((s) => s.id === "swap")!.from;
  const sw = TL.swaps.map((s) => s - base);
  const roll = sw.reduce((a, s) => a + ez(t, s - 0.05, s + 0.35, IO), 0) - 1;
  const inP = ez(t, 0, 0.5);
  const v = useV();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: v ? 80 : 120, top: v ? 560 : 420, ...T, fontSize: 76, lineHeight: 1.18, opacity: inP }}>
        <div style={{ display: "flex", gap: 22 }}>
          Watch <Swap items={["LTVs", "oracles", "LLTV distance", "curated markets"]} times={sw} minWidth={560} />
        </div>
        <div style={{ display: "flex", gap: 22 }}>
          on <Swap items={["Aave", "Euler", "Morpho", "Sentora"]} times={sw} color={K.text} minWidth={300} />
        </div>
      </div>
      <div style={{ position: "absolute", left: v ? 380 : 1380, top: v ? 1240 : 540 - 48 }}>
        {VENUES.map(([n], i) => {
          const off = i - Math.max(0, roll);
          const d = Math.abs(off);
          return (
            <div key={n} style={{ position: "absolute", top: off * 140, left: 0, opacity: Math.max(0, 1 - d * 0.55) * inP, transform: `scale(${1 - Math.min(1, d) * 0.25}) perspective(800px) rotateX(${-off * 22}deg)`, filter: d > 0.05 ? `blur(${Math.min(1, d) * 2}px)` : undefined }}>
              <NameTile name={n} active={d < 0.5} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Settle: React.FC = () => {
  const t = useT();
  const b = ez(t, 0.0, 0.8);
  const card = ez(t, 0.7, 1.3, IO);
  const v = useV();
  const [cx, cy, rx, ry] = v ? [540, 760, 330, 230] : [960, 380, 620, 130];
  return (
    <AbsoluteFill>
      {VENUES.map(([n], i) => {
        const ang = (i / 4) * Math.PI * 2 + 0.6;
        const x = lerp(b, v ? 540 : 1380, cx + Math.cos(ang) * rx);
        const y = lerp(b, v ? 1240 : 540, cy + Math.sin(ang) * ry);
        return (
          <div key={n} style={{ position: "absolute", left: x - 110, top: y - 40 + Math.sin(t * 1.4 + i) * 6, opacity: 1 - card * 0.35 }}>
            <NameTile name={n} size={80} />
          </div>
        );
      })}
      {Array.from({ length: 16 }, (_, i) => {
        const ang = random(`sd${i}`) * Math.PI * 2;
        const R = 200 + random(`sr${i}`) * 520;
        return <div key={i} style={{ position: "absolute", left: lerp(b, v ? 540 : 1380, cx + Math.cos(ang) * R * (v ? 0.55 : 1)), top: lerp(b, v ? 1240 : 540, cy - 60 + Math.sin(ang) * R * (v ? 0.5 : 0.35)), width: 8, height: 8, borderRadius: 2, background: i % 3 ? K.edge : CL.lime, opacity: b * 0.8 }} />;
      })}
      <div style={{ position: "absolute", top: v ? 260 : 120, left: v ? 60 : 0, width: v ? 960 : 1920, textAlign: "center", ...T, fontSize: v ? 70 : 64 }}>
        <Letters text="…where tokenized collateral settles" at={0.1} step={0.02} />
      </div>
      <div style={{ position: "absolute", left: v ? 60 : 360, top: lerp(card, v ? 1950 : 1100, v ? 1180 : 560), width: v ? 960 : 1200, boxSizing: "border-box", padding: "34px 40px", background: "#0B2A1D", border: `2px solid ${CL.lime}`, borderRadius: 18, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", display: "flex", gap: 30, alignItems: "center" }}>
        <Tile size={96} active>
          <Glyph kind="chain" size={46} />
        </Tile>
        <div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: K.text }}>Robinhood Chain</div>
          <div style={{ fontFamily: MONO, fontSize: 22, color: K.dim, marginTop: 6 }}>Settlement layer · chain ID 4663</div>
          <div style={{ fontFamily: MONO, fontSize: 20, color: K.text, marginTop: 12, opacity: 0.85 }}>Arbitrum-based Ethereum L2 built for tokenized stocks.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Grid: React.FC = () => {
  const t = useT();
  const v = useV();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: v ? 200 : 120, left: v ? 60 : 0, width: v ? 960 : 1920, textAlign: "center", ...T, fontSize: v ? 70 : 64 }}>
        <Letters text="Collateral risk across the stack" at={0.05} step={0.02} />
      </div>
      <div style={{ position: "absolute", left: v ? 70 : 200, top: v ? 460 : 280, display: "grid", gridTemplateColumns: v ? "940px" : "repeat(2, 740px)", gap: 24 }}>
        {VENUES.map(([n, r, d], i) => {
          const q = ez(t, 0.25 + i * 0.1, 0.6 + i * 0.1);
          const at = 1.2 + i * 0.7;
          const lit = ez(t, at, at + 0.25) * (1 - ez(t, at + 0.7, at + 0.95));
          return (
            <div key={n} style={{ height: v ? 290 : 300, padding: "34px 36px", boxSizing: "border-box", borderRadius: 16, background: K.panel, border: `1.5px solid ${lit > 0.3 ? CL.lime : K.edge}`, boxShadow: lit > 0.3 ? "0 0 0 1px rgba(117,255,0,0.2), 0 0 40px rgba(117,255,0,0.12)" : undefined, opacity: q, filter: q < 1 ? `blur(${(1 - q) * 8}px)` : undefined, transform: `translateY(${(1 - q) * 18}px)` }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: lit > 0.3 ? CL.lime : K.text }}>{n}</span>
                <span style={{ fontFamily: MONO, fontSize: 20, color: K.dim }}>{r}</span>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 25, lineHeight: 1.5, color: K.text, opacity: 0.85, marginTop: 22 }}>{d}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Note: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 34 }}>
    <div style={{ ...T, fontSize: 80, maxWidth: 960, textAlign: "center", lineHeight: 1.12 }}>
      <Letters text="Coverage targets, not partners." at={0.05} step={0.025} />
    </div>
    <div style={{ fontFamily: MONO, fontSize: 26, color: K.dim, textAlign: "center", lineHeight: 1.6, maxWidth: 1300, padding: "0 60px" }}>
      <Letters text="Shown with public data. Collatera is not affiliated with" at={0.9} step={0.008} />
      <br />
      <Letters text="or endorsed by these projects." at={1.35} step={0.008} />
    </div>
  </AbsoluteFill>
);

const Logo: React.FC = () => <LogoEnd at={0} line="collatera.buzz" />;

export const CollateraV6: React.FC = () => <Film scenes={TL.scenes} map={{ title: Title, swap: SwapScene, settle: Settle, grid: Grid, note: Note, logo: Logo }} audio="collatera-campaign/v6/mix.wav" />;
