import { AbsoluteFill } from "remotion";
import { CL } from "../Collatera/brand";
import { Mascot } from "../Collatera/components/Mascot";
import { Corners, ez, Film, Halftone, IO, K, lerp, Letters, MONO, Notifs, PIX, PixelDissolve, SANS, Swap, useT } from "./kit";
import TL from "./v4.json";

/**
 * V4 · "Your oracle is… stale" (content plan Day 11).
 * 25 s · 1080p60 · recreates the locked Conqueror reference (ANALYSIS.md §3):
 * "Introducing ___ for ___" name cycler in crop marks over a soft blob, pixel
 * dissolve into a halftone plate with a giant wordmark, extreme zoom into an
 * input, phrase swap "Your oracle is…", monitor mockup, notification stack,
 * end type-on. Notifications and values are ILLUSTRATIVE mock-ups.
 */
const Blob: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: "#0C3324", overflow: "hidden" }}>
      {[
        ["#75FF00", 700, 380, 520],
        ["#004B35", 1250, 620, 600],
        ["#1E9B4F", 900, 760, 420],
        ["#A4FF2B", 1350, 300, 380],
      ].map(([c, x, y, r], i) => (
        <div key={i} style={{ position: "absolute", left: (x as number) + Math.sin(t * 0.9 + i) * 80 - (r as number) / 2, top: (y as number) + Math.cos(t * 0.7 + i * 2) * 60 - (r as number) / 2, width: r as number, height: r as number, borderRadius: "50%", background: c as string, filter: "blur(110px)", opacity: 0.85 }} />
      ))}
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Halftone drift={t * 20} />
      <div style={{ position: "absolute", left: 0, top: 380, width: 1920, textAlign: "center", fontFamily: PIX, fontWeight: 700, fontSize: 196, color: "rgba(216,255,224,0.9)", letterSpacing: 6 }}>COLLATERA</div>
      <AbsoluteFill style={{ opacity: t < 3.3 ? 1 : 0 }}>
        <AbsoluteFill style={{ clipPath: "inset(0)" }}>
          <Blob />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: SANS, fontWeight: 500, fontSize: 46, color: "#FFFFFF", textShadow: "0 2px 18px rgba(0,30,15,0.6)" }}>
              Introducing
              <span style={{ background: K.bg, borderRadius: 8, padding: 6, display: "inline-flex" }}>
                <Mascot cell={3} shadow={false} />
              </span>
              Collatera for
              <Swap items={["Aave", "Morpho", "Euler", "tokenized stocks"]} times={[0, 0.8, 1.5, 2.2]} color="#FFFFFF" minWidth={320} />
            </div>
          </AbsoluteFill>
          <Corners x={500} y={495} w={920} h={90} color="#FFFFFF" />
        </AbsoluteFill>
      </AbsoluteFill>
      {t >= 3.3 && t < 4.0 ? <BlobDissolve /> : null}
    </AbsoluteFill>
  );
};
/** Pixel dissolve: blob cells vanish to reveal the halftone plate. */
const BlobDissolve: React.FC = () => (
  <AbsoluteFill>
    <PixelDissolve at={3.3} dur={0.6} cols={30} color="#2C6B3F" />
  </AbsoluteFill>
);

const Input: React.FC = () => {
  const t = useT();
  const s = "DEMO 1";
  const n = Math.max(0, Math.min(s.length, Math.floor((t - 0.6) * 10)));
  const zIn = ez(t, 1.3, 2.0, IO);
  const zOut = ez(t, 2.3, 2.9, IO);
  const z = 1 + zIn * 5.5 - zOut * 5.5;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Halftone drift={t * 20 + 80} />
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "770px 682px" }}>
        <div style={{ position: "absolute", left: 0, top: 380, width: 1920, textAlign: "center", fontFamily: PIX, fontWeight: 700, fontSize: 196, color: "rgba(216,255,224,0.9)", letterSpacing: 6 }}>COLLATERA</div>
        <div style={{ position: "absolute", top: 250, width: 1920, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 48, color: "#FFFFFF" }}>
          <Letters text="Just paste an address" at={0.05} step={0.02} />
        </div>
        <div style={{ position: "absolute", left: 610, top: 640, width: 700, height: 84, borderRadius: 18, background: "rgba(255,255,255,0.78)", backdropFilter: "blur(10px)", boxShadow: "0 20px 50px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", padding: "0 26px", fontFamily: SANS, fontSize: 34, color: K.ink }}>
          {n === 0 ? <span style={{ color: "#7D9488" }}>Paste an Algorand address…</span> : s.slice(0, n)}
          <span style={{ width: 3, height: 40, background: K.ink, marginLeft: 4, opacity: Math.floor(t * 2.4) % 2 ? 1 : 0.2 }} />
          <span style={{ marginLeft: "auto", padding: "10px 18px", borderRadius: 12, background: K.ink, color: "#FFFFFF", fontSize: 22, fontWeight: 700 }}>WATCH</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Ring: React.FC<{ p: number; label: string; v: string; color: string }> = ({ p, label, v, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
    <svg width={70} height={70} viewBox="0 0 40 40">
      <circle cx={20} cy={20} r={16} fill="none" stroke="#E4ECE6" strokeWidth={5} />
      <circle cx={20} cy={20} r={16} fill="none" stroke={color} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform="rotate(-90 20 20)" />
    </svg>
    <div>
      <div style={{ fontFamily: SANS, fontSize: 24, color: "#5D6F64" }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 36, color: K.ink }}>{v}</div>
    </div>
  </div>
);

const Phrase: React.FC = () => {
  const t = useT();
  const times = [0.6, 1.6, 3.0, 4.4];
  const stage = times.filter((x) => t >= x).length - 1;
  const ages = [0, 9, 89, 89];
  const age = stage < 0 ? 0 : Math.round(lerp(ez(t, times[stage], times[stage] + 0.6), stage > 0 ? ages[stage - 1] : 0, ages[stage]));
  const brace = 1 - ez(t, 0.45, 0.65);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      {brace > 0.01 ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: brace }}>
          <div style={{ display: "flex", gap: 40, alignItems: "center", fontFamily: SANS, fontSize: 40, color: "#C26F33" }}>
            <span style={{ color: "#D7C3B4" }}>←</span>
            {"{ Your oracle }"}
            <span style={{ color: "#D7C3B4" }}>→</span>
          </div>
        </AbsoluteFill>
      ) : null}
      <div style={{ position: "absolute", top: 300, width: 1920, display: "flex", justifyContent: "center", opacity: ez(t, 0.6, 0.9), transform: "scale(1.5)" }}>
        {stage >= 3 ? (
          <div style={{ padding: "16px 28px", borderRadius: 14, background: K.ink, color: CL.lime, fontFamily: PIX, fontSize: 30 }}>● ORACLE STALE</div>
        ) : (
          <Ring p={Math.min(1, age / 90)} label="Oracle age (simulated)" v={`${age} min`} color={age > 60 ? "#E2A23B" : "#1E9B4F"} />
        )}
      </div>
      <div style={{ position: "absolute", top: 490, width: 1920, display: "flex", justifyContent: "center", gap: 18, fontFamily: SANS, fontWeight: 500, fontSize: 76, letterSpacing: -1.5, color: K.ink, opacity: ez(t, 0.6, 0.9) }}>
        Your oracle is…
        <Swap items={["fresh", "9 min old", "89 min old", "stale."]} times={times} color={K.ink} minWidth={360} />
      </div>
    </AbsoluteFill>
  );
};

const Monitor: React.FC = () => {
  const t = useT();
  const cam = ez(t, 0.2, 4.0, IO);
  return (
    <AbsoluteFill style={{ background: "#F2F4F3", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%, -50%) scale(${lerp(cam, 0.82, 1.35)}) translateY(${lerp(cam, 0, -120)}px)` }}>
        <div style={{ width: 1280, height: 760, background: "#111", borderRadius: 26, padding: 18, boxShadow: "0 40px 90px rgba(0,0,0,0.3)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 12, background: CL.night, padding: 40, boxSizing: "border-box", fontFamily: MONO, color: K.text }}>
            <div style={{ display: "flex", fontFamily: PIX, fontSize: 22, color: CL.lime }}>
              COLLATERA://TERMINAL<span style={{ marginLeft: "auto" }}>● ORACLE STALE</span>
            </div>
            <div style={{ display: "flex", marginTop: 30, alignItems: "baseline" }}>
              <span style={{ fontFamily: PIX, fontSize: 32, color: CL.lime }}>tQQQ / USDCa</span>
              <span style={{ marginLeft: "auto", fontFamily: PIX, fontSize: 48 }}>483.79</span>
            </div>
            <svg width={1180} height={260} style={{ marginTop: 20, background: "#001C14" }}>
              {Array.from({ length: 30 }, (_, i) => (
                <rect key={i} x={20 + i * 38} y={150 - i * 3 - Math.sin(i) * 10} width={14} height={20 + (i % 3) * 8} fill={i % 4 ? CL.lime : CL.sage} opacity={ez(t, i * 0.03, i * 0.03 + 0.2)} />
              ))}
              <line x1={0} x2={1180} y1={235} y2={235} stroke="#FF6B5A" strokeDasharray="8 6" strokeWidth={2} />
            </svg>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 30, fontSize: 26 }}>
              {[
                ["Buffer", "14.7%"],
                ["Oracle age", "89 min"],
                ["LTV", "39.8%"],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: 18, border: `1.5px solid ${k === "Oracle age" ? CL.lime : "#1E3D30"}` }}>
                  <div style={{ color: K.dim, fontSize: 20 }}>{k}</div>
                  <div style={{ fontSize: 34, marginTop: 6, color: k === "Oracle age" ? CL.lime : K.text }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 16, color: K.dim, marginTop: 18 }}>Simulated data for illustration. Not a live market feed.</div>
          </div>
        </div>
        <div style={{ width: 180, height: 120, background: "linear-gradient(#D9DCDB, #BFC3C1)", margin: "0 auto" }} />
      </div>
    </AbsoluteFill>
  );
};

const NotifScene: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #0B2B22 0%, #04150F 55%, #0F3A28 100%)" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: 0.18 }}>
        <Mascot cell={34} shadow={false} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 36, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 24px", fontFamily: SANS, fontSize: 17, color: "#E8EEEA", gap: 20 }}>
        <span>Mon 27 Oct</span>
        <span>21:42</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 60 }}>
        <Notifs
          items={[
            { title: "Collatera · tQQQ", body: "Oracle age 89 min. Price moved since last update.", at: 0.6 },
            { title: "Collatera · market hours", body: "Underlying market closed: overnight gap risk.", at: 1.7 },
            { title: "Collatera · DEMO 1", body: "Buffer 14.7%. Review position.", at: 2.8 },
          ]}
        />
      </div>
      <div style={{ position: "absolute", left: 40, bottom: 40, fontFamily: MONO, fontSize: 18, color: "#9DB3A6", opacity: ez(t, 0.8, 1.1) }}>ILLUSTRATIVE ALERTS · MOCK-UP</div>
    </AbsoluteFill>
  );
};

const Close: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 10 }}>
    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 96, letterSpacing: -2.5, color: K.text }}>
      <Letters text="Markets close." at={0.05} step={0.03} />
    </div>
    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 96, letterSpacing: -2.5, color: CL.lime }}>
      <Letters text="Loans don't." at={0.55} step={0.03} />
    </div>
  </AbsoluteFill>
);

const End: React.FC = () => {
  const t = useT();
  const url = "collatera.buzz";
  const n = Math.max(0, Math.min(url.length, Math.floor((t - 0.35) * 16)));
  const fade = ez(t, 1.6, 2.0);
  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 26, opacity: 1 - fade }}>
      <div style={{ width: 120, height: 120, borderRadius: 99, background: "radial-gradient(circle at 35% 30%, #12503A, #032016)", border: "2px solid #2F6A4E", display: "flex", alignItems: "center", justifyContent: "center", opacity: ez(t, 0, 0.3) }}>
        <Mascot cell={6} shadow={false} />
      </div>
      <div style={{ fontFamily: SANS, fontSize: 30, color: "#FFFFFF" }}>
        {url.slice(0, n)}
        <span style={{ opacity: Math.floor(t * 2.4) % 2 ? 1 : 0 }}>|</span>
      </div>
    </AbsoluteFill>
  );
};

export const CollateraV4: React.FC = () => (
  <Film scenes={TL.scenes} map={{ intro: Intro, input: Input, phrase: Phrase, monitor: Monitor, notifs: NotifScene, close: Close, end: End }} audio="collatera-campaign/v4/mix.wav" />
);
