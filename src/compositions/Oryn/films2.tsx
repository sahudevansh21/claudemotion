import { Video } from "@remotion/media";
import { staticFile } from "remotion";
import { C, DEPLOYMENTS, DISPLAY, ez, IO, MONO, SANS, VERDICTS, type Status } from "./brand";
import { Chip, VerdictCard } from "./parts";
import { bgFrom, Cursor, Drift, EndCard, Film, Illustrative, lenOf, path, pulse, Reveal, Swap, Typed, cueOf, Plane, type Tl } from "./motion";
import { interpolate, useCurrentFrame } from "remotion";
import v3 from "./v3.json";
import v7 from "./v7.json";
import v8 from "./v8.json";

const DARK = "#0b0b0d";
const INKCARD = "#16161b";
const EDGE = "#2a2a33";
const light: React.CSSProperties = { fontFamily: SANS, fontWeight: 500, color: C.cream, letterSpacing: -2, textAlign: "center" };
const CL2 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ===================================================== V3 Time machine ================== */
const T3 = v3 as unknown as Tl;
const GRID = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => DEPLOYMENTS[i]);

const V3Plane: React.FC<{ t: number; rx: number; ry: number; z: number; open?: number; blurFar?: number; y?: number }> = ({ t, rx, ry, z, open = 0, blurFar = 0, y = -30 }) => (
  <Plane rx={rx} ry={ry} z={z} y={y}>
    <div style={{ position: "absolute", left: 100, top: 140, width: 1720, display: "grid", gridTemplateColumns: "repeat(4, 400px)", gap: 40 }}>
      {GRID.map((d, i) => {
        const col = i % 4;
        const reopened = d.status === "closed" && open > 0.5;
        const shown = reopened ? { ...d, status: "open" as Status, reason: "Redemptions open, NAV fresh, onchain state matches issuer.", next: "NAV strike in 13h" } : d;
        return (
          <div key={i} style={{ filter: `blur(${blurFar * col * 1.6}px)`, opacity: 1 - 0.12 * col * blurFar }}>
            <VerdictCard d={shown} w={400} h={340} />
          </div>
        );
      })}
    </div>
    <div style={{ opacity: t }} />
  </Plane>
);
const V3Tilt: React.FC = () => {
  const f = useCurrentFrame();
  const n = lenOf(T3, "tilt");
  const rx = interpolate(f, [0, n], [18, 10], { ...CL2, easing: IO });
  const ry = interpolate(f, [0, n], [-22, -12], { ...CL2, easing: IO });
  const p = ez(f, 0, 50);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p, transform: `translateY(${(1 - p) * 120}px)` }}>
      <V3Plane t={1} rx={rx} ry={ry} z={0.9} blurFar={1} y={150} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, fontSize: 130, ...light }}>
        <Swap at={cueOf(T3, "tilt", "title") - 20} each={70} items={[<span key="a">Replay</span>, <span key="b">any <span style={{ fontFamily: DISPLAY, letterSpacing: 2, color: C.yellow }}>MOMENT.</span></span>]} />
      </div>
    </div>
  );
};
const STOPS = [["−1D", 0], ["NOW", 0.33], ["NEXT OPEN", 0.66], ["+1D", 1]] as const;
const V3Scrub: React.FC = () => {
  const f = useCurrentFrame();
  const drag = cueOf(T3, "scrub", "drag");
  const t = interpolate(f, [drag + 20, drag + 400], [0, 1], { ...CL2, easing: IO });
  const open = ez(f, drag + 240, 30);
  const barX = 210, barW = 1500, y = 900;
  const hx = barX + barW * t;
  const hours = Math.min(41.25, (Math.max(0, t - 0.33) / 0.33) * 41.25);
  const cur = path(f, [[0, 1500, 600], [drag - 6, barX, y + 8], [drag + 20, barX, y + 8], [drag + 420, barX + barW, y + 8], [drag + 470, 1500, 650]]);
  return (
    <Drift n={lenOf(T3, "scrub")} from={1} to={1.02}>
      <V3Plane t={1} rx={10} ry={-12 + 8 * t} z={0.9} open={open} blurFar={Math.max(0, 1 - t * 2)} y={-90} />
      <div style={{ position: "absolute", left: barX - 40, top: y - 70, width: barW + 80, height: 150, borderRadius: 30, background: C.yellow, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: barX, top: y - 46, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.ink }}>TIME MACHINE</div>
      <div style={{ position: "absolute", right: barX, top: y - 52, fontFamily: MONO, fontWeight: 700, fontSize: 24, background: C.ink, color: C.yellow, padding: "2px 18px", borderRadius: 99 }}>{hours > 0 ? `+${hours.toFixed(2)}h` : "26/10/26 07:59"}</div>
      <div style={{ position: "absolute", left: barX, top: y + 4, width: barW, height: 12, borderRadius: 9, background: C.ink }} />
      <div style={{ position: "absolute", left: barX, top: y + 4, width: barW * t, height: 12, borderRadius: 9, background: C.red }} />
      <div style={{ position: "absolute", left: hx - 24, top: y - 14, width: 48, height: 48, borderRadius: 99, background: C.red, border: `7px solid ${C.ink}` }} />
      {STOPS.map(([label, pos]) => (
        <div key={label} style={{ position: "absolute", left: barX + barW * pos - 60, width: 120, textAlign: "center", top: y + 44, fontFamily: MONO, fontWeight: 700, fontSize: 20, color: C.ink, opacity: t >= pos - 0.02 ? 1 : 0.45 }}>{label}</div>
      ))}
      <Illustrative dark at={drag + 30} style={{ right: 100, top: 70 }} />
      <Cursor {...cur} click={pulse(f, drag + 16)} dark />
    </Drift>
  );
};
const V3End: React.FC = () => <EndCard dark n={lenOf(T3, "end")} line={<span>Verdicts, calendar and alerts <span style={{ color: C.yellow }}>all follow.</span></span>} />;
export const OrynV3: React.FC = () => (
  <Film tl={T3} audio="oryn/audio/v3.wav" bg={bgFrom([[0, DARK]])} scenes={{ tilt: V3Tilt, scrub: V3Scrub, end: V3End }} />
);

/* ===================================================== V7 Four chains =================== */
const T7 = v7 as unknown as Tl;
const CHAINS = [
  { key: "ETH", name: "Ethereum", sym: "xTSLA", status: "closed" as Status },
  { key: "SOL", name: "Solana", sym: "xTSLA", status: "divergent" as Status },
  { key: "BASE", name: "Base", sym: "oQQQ", status: "divergent" as Status },
  { key: "ARB", name: "Arbitrum", sym: "dMSFT", status: "stale" as Status },
];
const V7Intro: React.FC = () => (
  <Drift n={lenOf(T7, "intro")}>
    <Reveal at={cueOf(T7, "intro", "title")} style={{ position: "absolute", left: 0, right: 0, top: 380, fontSize: 56, ...light, color: "rgba(244,240,225,0.6)" }}>Introducing</Reveal>
    <Reveal at={cueOf(T7, "intro", "title") + 26} style={{ position: "absolute", left: 0, right: 0, top: 470, fontSize: 130, ...light }}>per-chain <span style={{ fontFamily: DISPLAY, letterSpacing: 2, color: "#7ad58a" }}>VERDICTS.</span></Reveal>
  </Drift>
);
const Tile: React.FC<{ k: string; active: number; x: number; y: number; s?: number }> = ({ k, active, x, y, s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 150 * s, height: 150 * s, borderRadius: 38 * s, background: active > 0.5 ? C.cream : INKCARD, border: `3px solid ${active > 0.5 ? C.cream : EDGE}`, boxShadow: active > 0.5 ? "0 30px 70px rgba(244,240,225,0.18)" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontSize: 52 * s, color: active > 0.5 ? C.ink : "rgba(244,240,225,0.55)", letterSpacing: 2 }}>{k}</div>
);
const V7Carousel: React.FC = () => {
  const f = useCurrentFrame();
  const start = cueOf(T7, "carousel", "start"), each = cueOf(T7, "carousel", "each");
  const idx = Math.min(3, Math.max(0, Math.floor((f - start + 20) / each)));
  const pos = interpolate(f, [start, start + each * 3], [0, 3], { ...CL2, easing: IO });
  const rowP = (i: number) => ez(f, start + i * each - 14, 24);
  return (
    <Drift n={lenOf(T7, "carousel")} from={1} to={1.03}>
      <div style={{ position: "absolute", left: 150, top: 300, fontSize: 96, ...light, textAlign: "left" }}>
        <Reveal at={6}>Check it on</Reveal>
        <div style={{ marginTop: 10 }}>
          <Swap at={start - 10} each={each} items={CHAINS.map((c) => <span key={c.key} style={{ fontFamily: DISPLAY, letterSpacing: 2, color: "#7ad58a" }}>{c.name.toUpperCase()}</span>)} />
        </div>
        <div style={{ marginTop: 70, display: "flex", alignItems: "center", gap: 26 }}>
          {CHAINS.map((c, i) => (
            <div key={c.key} style={{ position: i === idx ? "relative" : "absolute", opacity: rowP(i) * (i === idx ? 1 : 0), display: "flex", alignItems: "center", gap: 26 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 90, color: C.cream, textTransform: "none" }}>{c.sym}</div>
              <Chip status={c.status} size={26} />
            </div>
          ))}
        </div>
      </div>
      {CHAINS.map((c, i) => (
        <Tile key={c.key} k={c.key} active={Math.abs(i - pos) < 0.5 ? 1 : 0} x={1260} y={540 - 90 + (i - pos) * 210} s={1} />
      ))}
      <div style={{ position: "absolute", left: 1260 - 40, top: 0, width: 230, height: 1080, background: `linear-gradient(${DARK} 0%, transparent 22%, transparent 78%, ${DARK} 100%)` }} />
    </Drift>
  );
};
const V7Cluster: React.FC = () => {
  const f = useCurrentFrame();
  const cl = cueOf(T7, "cluster", "cluster"), text = cueOf(T7, "cluster", "text");
  const p = ez(f, cl, 60, IO);
  const targets = [[780, 330], [1000, 330], [780, 550], [1000, 550]];
  return (
    <Drift n={lenOf(T7, "cluster")} from={1} to={1.04}>
      {CHAINS.map((c, i) => (
        <Tile key={c.key} k={c.key} active={1} x={1260 + (targets[i][0] - 1260) * p} y={(540 - 90 + (i - 3) * 210) * (1 - p) + targets[i][1] * p} s={1} />
      ))}
      <Reveal at={text} style={{ position: "absolute", left: 0, right: 0, top: 800, fontSize: 110, ...light }}>All of <span style={{ fontFamily: DISPLAY, letterSpacing: 2, color: "#7ad58a" }}>THEM.</span></Reveal>
    </Drift>
  );
};
const V7End: React.FC = () => <EndCard dark n={lenOf(T7, "end")} line={<span>One verdict per token, <span style={{ color: "#7ad58a" }}>per chain.</span></span>} />;
export const OrynV7: React.FC = () => (
  <Film tl={T7} audio="oryn/audio/v7.wav" bg={bgFrom([[0, DARK]])} scenes={{ intro: V7Intro, carousel: V7Carousel, cluster: V7Cluster, end: V7End }} />
);

/* ===================================================== V8 Tour (one take) =============== */
const T8 = v8 as unknown as Tl;
const PW = 1500, PH = 860, STEP = 1700;
const Panel: React.FC<{ i: number; label: string; children: React.ReactNode }> = ({ i, label, children }) => (
  <div style={{ position: "absolute", left: 210 + i * STEP, top: 110, width: PW, height: PH, borderRadius: 34, background: INKCARD, border: `3px solid ${EDGE}`, boxShadow: "0 60px 140px rgba(0,0,0,0.6)", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 44, top: 30, fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: 6, color: "rgba(244,240,225,0.55)", textTransform: "uppercase" }}>{`0${i + 1} · ${label}`}</div>
    {children}
  </div>
);
const dim = (f: number, i: number) => Math.min(1, Math.abs(f - (i * 360 + 180)) / 420);
const V8Tour: React.FC = () => {
  const f = useCurrentFrame();
  const keys: [number, number][] = [0, 1, 2, 3, 4, 5, 6].flatMap((i) => [[i * 360 + 50, i * STEP] as [number, number], [i * 360 + 330, i * STEP] as [number, number]]);
  const camX = interpolate(f, keys.map((k) => k[0]), keys.map((k) => k[1]), { ...CL2, easing: IO });
  const calOff = 3;
  const hoverY = interpolate(f, [0, 2520], [10, -10]);
  const spot = interpolate(f, [2400, 2520], [0, 1], CL2);
  const fade = interpolate(f, [2440, 2520], [1, 0], CL2);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade }}>
      <Plane rx={9} ry={-11} z={0.95} y={hoverY} x={-camX * 0.0}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${-camX}px)` }}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ filter: `blur(${dim(f, i) * 6}px)`, opacity: 1 - 0.55 * dim(f, i) }}>
              {i === 0 && (
                <Panel i={0} label="Board">
                  <div style={{ position: "absolute", left: 40, top: 84, width: PW - 80, height: PH - 130, borderRadius: 20, overflow: "hidden" }}>
                    <Video src={staticFile("oryn/clips/site.mp4")} muted trimBefore={Math.round(34.5 * 60)} style={{ width: PW - 80, height: ((PW - 80) * 1050) / 1920, display: "block" }} />
                  </div>
                </Panel>
              )}
              {i === 1 && (
                <Panel i={1} label="Asset">
                  <div style={{ position: "absolute", left: 70, top: 110 }}>
                    <Chip status="divergent" size={30} />
                    <div style={{ fontFamily: DISPLAY, fontSize: 280, lineHeight: 1.05, color: C.red, marginTop: 16, textTransform: "none" }}>xTSLA</div>
                    <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 6, color: "rgba(244,240,225,0.55)", textTransform: "uppercase" }}>Tesla xStock · Chain SOL</div>
                    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 56, color: C.cream, marginTop: 44, lineHeight: 1.15 }}>Stock split 3:1 not applied on Solana.</div>
                    <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 5, color: "rgba(244,240,225,0.55)", marginTop: 34, textTransform: "uppercase" }}>Next change · unknown</div>
                  </div>
                </Panel>
              )}
              {i === 2 && (
                <Panel i={2} label="Lookahead">
                  <div style={{ position: "absolute", left: 70, top: 110, width: 620 }}>
                    <div style={{ fontFamily: DISPLAY, fontSize: 64, color: C.cream }}>OCTOBER 2026</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 24, fontFamily: MONO, fontWeight: 700, fontSize: 24, textAlign: "center", color: C.cream }}>
                      {Array.from({ length: calOff }).map((_, k) => (<div key={`o${k}`} />))}
                      {Array.from({ length: 31 }, (_, k) => k + 1).map((d) => (
                        <div key={d} style={{ height: 66, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", background: d === 27 ? C.blue : "transparent", opacity: d === 27 ? 1 : 0.55 }}>{d}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ position: "absolute", left: 790, top: 220, width: 640 }}>
                    <Chip status="pending" size={28} />
                    <div style={{ fontFamily: DISPLAY, fontSize: 130, color: C.yellow, marginTop: 14, textTransform: "none" }}>xAAPL</div>
                    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: C.cream, lineHeight: 1.25, marginTop: 20 }}>Dividend $0.27 / share · effective 2026-10-27 22:00 UTC</div>
                    <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 5, color: "rgba(244,240,225,0.6)", marginTop: 24, textTransform: "uppercase" }}>Event effective in 38h</div>
                  </div>
                </Panel>
              )}
              {i === 3 && (
                <Panel i={3} label="Divergence">
                  <div style={{ position: "absolute", left: 60, top: 100, width: PW - 120 }}>
                    {[...DEPLOYMENTS.filter((d) => d.status === "divergent"), { sym: "oNFLX", chain: "BASE", reason: "Stock split 10:1 not applied on Base" }].map((d, k) => (
                      <div key={k} style={{ display: "flex", alignItems: "center", gap: 28, height: 150, borderBottom: `2px solid ${EDGE}` }}>
                        <div style={{ fontFamily: DISPLAY, fontSize: 90, color: C.red, width: 260, textTransform: "none" }}>{d.sym}</div>
                        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: "rgba(244,240,225,0.6)", width: 110 }}>{d.chain}</div>
                        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 32, color: C.cream, flex: 1 }}>{d.reason}</div>
                      </div>
                    ))}
                  </div>
                </Panel>
              )}
              {i === 4 && (
                <Panel i={4} label="Wallet">
                  <div style={{ position: "absolute", left: 70, top: 110, width: 1000 }}>
                    <div style={{ fontFamily: DISPLAY, fontSize: 110, color: C.cream }}>WALLET EXPLAINER</div>
                    <div style={{ display: "flex", gap: 24, marginTop: 36 }}>
                      {[["Token", "xTSLA"], ["Chain", "SOL"], ["Amount", "100"]].map(([k, v]) => (
                        <div key={k} style={{ flex: 1 }}>
                          <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: "rgba(244,240,225,0.5)", textTransform: "uppercase" }}>{k}</div>
                          <div style={{ marginTop: 8, border: `3px solid ${EDGE}`, borderRadius: 14, height: 88, display: "flex", alignItems: "center", padding: "0 24px", fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.cream }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 52, color: C.cream, marginTop: 56 }}>One event, three mechanisms.</div>
                  </div>
                  <Illustrative dark at={0} style={{ right: 60, top: 36 }} />
                </Panel>
              )}
              {i === 5 && (
                <Panel i={5} label="Guard">
                  <div style={{ position: "absolute", left: 70, top: 110 }}>
                    <Chip status="divergent" size={30} />
                    <div style={{ fontFamily: DISPLAY, fontSize: 330, lineHeight: 1.02, color: C.red, marginTop: 16 }}>BLOCKED</div>
                    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: C.cream, textTransform: "uppercase" }}>xTSLA · SOL</div>
                    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, color: C.cream, marginTop: 30 }}>Stock split 3:1 not applied on Solana.</div>
                  </div>
                </Panel>
              )}
              {i === 6 && (
                <Panel i={6} label="API">
                  <div style={{ position: "absolute", left: 70, top: 130 }}>
                    <div style={{ fontFamily: DISPLAY, fontSize: 120, color: C.cream }}>ONE VALUE.</div>
                    <div style={{ marginTop: 30 }}><Chip status="divergent" size={48} /></div>
                    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 40, color: "rgba(244,240,225,0.8)", marginTop: 40, maxWidth: 1000, lineHeight: 1.3 }}>Branch on a single value instead of a pile of fields.</div>
                  </div>
                  <Illustrative dark at={0} style={{ right: 60, top: 36 }} />
                </Panel>
              )}
            </div>
          ))}
        </div>
      </Plane>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 60% at 50% 50%, transparent 35%, ${DARK} 100%)`, opacity: 0.55 + 0.3 * spot }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: MONO, fontSize: 18, letterSpacing: 6, textTransform: "uppercase", color: "rgba(244,240,225,0.55)" }}>
        {["Board", "Asset", "Lookahead", "Divergence", "Wallet", "Guard", "API"][Math.min(6, Math.floor(f / 360))]}
      </div>
    </div>
  );
};
const V8End: React.FC = () => <EndCard dark n={lenOf(T8, "end")} line={<span>State of assets <span style={{ color: C.yellow }}>activated.</span></span>} />;
export const OrynV8: React.FC = () => (
  <Film tl={T8} audio="oryn/audio/v8.wav" bg={bgFrom([[0, DARK]])} scenes={{ tour: V8Tour, end: V8End }} />
);
export { VERDICTS, Typed };
