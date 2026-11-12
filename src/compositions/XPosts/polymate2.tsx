import { PM } from "../Polymate/brand";
import { Banner, Card, D, Emblem, Foot, H, Ill, Lapis, Marble, Photo, S, Ser, Tag, U, cin } from "./polymate";
import { makeStill } from "./still";

/** PolyMate X-profile posts, set B (15): same banner system as set A (Roman golden hour, marble, lapis + gold, red banners) with different layouts: red banner-wall backgrounds, robot hero, UI-vocabulary cards. All UI is illustrative. */
const Red: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(90% 60% at 30% 10%, #b12a2a, #8E1F1F 50%, #5e1111)" }} />
    <div style={{ position: "absolute", inset: 18, border: `2px solid ${PM.goldLight}`, opacity: 0.7 }} />
    <div style={{ position: "absolute", inset: 30, border: `1px solid ${PM.goldLight}`, opacity: 0.4 }} />
  </>
);
const Robot: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => <Photo x={x} y={y} w={w} h={h} src="polymate/img/robot.jpg" pos="50% 30%" />;

const P1: React.FC = () => (
  <>
    <Marble /><Robot x={290} y={110} w={500} h={560} />
    <H fs={140} top={760} center w={1000}>PolyMate</H>
    <div style={{ fontFamily: S, fontStyle: "italic", fontSize: 54, color: PM.inkSoft, position: "absolute", left: 60, right: 60, top: 940, textAlign: "center", lineHeight: 1.1 }}>The trading layer for prediction markets.</div>
    <Foot total={20} n={1} />
  </>
);
const P2: React.FC = () => (
  <>
    <Red /><Emblem s={700} style={{ position: "absolute", left: 190, top: 160 }} />
    <H fs={150} top={780} center w={1000} c="#fff">PolyMate</H>
    <div style={{ ...cin(22, PM.goldLight), position: "absolute", left: 0, right: 0, textAlign: "center", top: 980 }}>@Polymatedotfun</div>
    <Foot total={20} n={2} c="rgba(255,255,255,0.75)" />
  </>
);
const P3: React.FC = () => (
  <>
    <Photo x={0} y={0} w={1080} h={1350} pos="40% 60%" style={{ border: "none", boxShadow: "none" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,12,4,0.05) 15%, rgba(20,12,4,0.85) 100%)" }} />
    <H fs={140} top={560} c="#fff">Building tools to <span style={{ color: PM.goldLight }}>trade the future,</span> fast.</H>
    <Foot total={20} n={3} c="rgba(255,255,255,0.8)" />
  </>
);
const P4: React.FC = () => (
  <>
    <Lapis /><Tag c={PM.goldLight}>Prediction markets</Tag>
    <H fs={200} top={190} c="#fff">Trade <span style={{ color: PM.goldLight }}>what’s next.</span></H>
    <Emblem s={300} style={{ position: "absolute", right: 60, bottom: 130 }} />
    <Foot total={20} n={4} c="rgba(255,255,255,0.7)" />
  </>
);
const P5: React.FC = () => (
  <>
    <Marble /><Tag>The flow</Tag>
    <H fs={120} top={140}>From market to <Ser>position.</Ser></H>
    {[["01", "Markets"], ["02", "Trade"], ["03", "Positions"]].map(([n, t], i) => (
      <Card key={t} x={70} y={480 + i * 230} w={940} h={190} style={{ display: "flex", alignItems: "center", gap: 40, padding: "0 44px" }}>
        <span style={{ fontFamily: D, fontWeight: 800, fontStyle: "italic", fontSize: 80, color: PM.gold }}>{n}</span><span style={{ fontFamily: U, fontWeight: 700, fontSize: 64, color: PM.ink }}>{t}</span>
      </Card>
    ))}
    <Ill x={70} y={1180} /><Foot total={20} n={5} />
  </>
);
const P6: React.FC = () => (
  <>
    <Marble /><Tag>Strategy</Tag>
    <H fs={190} top={140}><Ser>Strategy.</Ser></H>
    <Card x={70} y={470} w={940} h={600} style={{ padding: 40 }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ height: 150, borderBottom: i < 2 ? `2px solid ${PM.marbleShade}` : "none", display: "flex", alignItems: "center", gap: 30 }}><div style={{ width: 76, height: 76, borderRadius: 20, background: i === 0 ? PM.lapis : "#e4dccd" }} /><div><div style={{ height: 22, width: 400 - i * 60, background: "#d9d1c0", borderRadius: 11 }} /><div style={{ height: 16, width: 240, background: "#e8e1d2", borderRadius: 8, marginTop: 16 }} /></div></div>)}
    </Card>
    <Ill x={70} y={1100} /><Foot total={20} n={6} />
  </>
);
const P7: React.FC = () => (
  <>
    <Marble /><Tag>Balance</Tag>
    <H fs={190} top={140}><Ser>Balance.</Ser></H>
    <Card x={70} y={470} w={940} h={420} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ fontFamily: U, fontSize: 30, color: PM.inkSoft }}>Balance</div>
      <div style={{ height: 70, width: 420, background: "#d9d1c0", borderRadius: 18, marginTop: 26 }} />
      <div style={{ height: 18, width: 260, background: "#e8e1d2", borderRadius: 9, marginTop: 28 }} />
    </Card>
    <Ill x={70} y={920} /><Foot total={20} n={7} />
  </>
);
const P8: React.FC = () => (
  <>
    <Red /><div style={{ ...cin(20, PM.goldLight), position: "absolute", left: 70, top: 90 }}>Live Markets</div>
    <H fs={170} top={170} c="#fff">Live <span style={{ color: PM.goldLight }}>Markets.</span></H>
    <Card x={90} y={560} w={900} h={460} style={{ padding: 34 }}>
      {[0, 1].map((i) => <div key={i} style={{ height: 190, borderBottom: i < 1 ? `2px solid ${PM.marbleShade}` : "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}><div><div style={{ height: 22, width: 380 - i * 70, background: "#d9d1c0", borderRadius: 11 }} /><div style={{ height: 16, width: 220, background: "#e8e1d2", borderRadius: 8, marginTop: 18 }} /></div><div style={{ display: "flex", gap: 12 }}>{["YES", "NO"].map((k, j) => <div key={k} style={{ fontFamily: U, fontWeight: 700, fontSize: 28, padding: "14px 26px", borderRadius: 14, background: j ? "#f3dcdc" : "#dbe6ff", color: j ? "#8E1F1F" : PM.lapis }}>{k}</div>)}</div></div>)}
    </Card>
    <div style={{ ...cin(14, "rgba(255,255,255,0.75)", { fontWeight: 500 }), position: "absolute", left: 90, top: 1050 }}>Illustrative · not live data</div>
    <Foot total={20} n={8} c="rgba(255,255,255,0.75)" />
  </>
);
const P9: React.FC = () => (
  <>
    <Marble /><Robot x={70} y={110} w={520} h={560} />
    <Card x={520} y={400} w={490} h={230} style={{ display: "flex", alignItems: "center", gap: 26, padding: "0 30px" }}>
      <div style={{ width: 90, height: 90, borderRadius: 22, background: "#1f9d55", flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width={48} height={48} viewBox="0 0 64 64" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"><path d="M16 48 L48 16 M24 16 H48 V40" /></svg></div>
      <div><div style={{ fontFamily: U, fontWeight: 700, fontSize: 32, color: PM.ink }}>Position Opened</div><div style={{ fontFamily: U, fontSize: 28, color: PM.inkSoft, marginTop: 6 }}>YES · $50</div></div>
    </Card>
    <H fs={130} top={800}>Position <Ser>Opened.</Ser></H>
    <Ill x={70} y={1100} /><Foot total={20} n={9} />
  </>
);
const P10: React.FC = () => (
  <>
    <Lapis /><Robot x={560} y={110} w={450} h={500} />
    <H fs={130} top={680} c="#fff">Executing <span style={{ color: PM.goldLight }}>Trade…</span></H>
    <Card x={70} y={960} w={940} h={190} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ fontFamily: U, fontWeight: 700, fontSize: 36, color: PM.ink }}>⚡ Executing Trade…</div>
      <div style={{ height: 20, borderRadius: 10, background: "#e4dccd", marginTop: 24, overflow: "hidden" }}><div style={{ width: "64%", height: "100%", background: `linear-gradient(90deg, ${PM.gold}, ${PM.goldLight})` }} /></div>
    </Card>
    <div style={{ ...cin(14, "rgba(255,255,255,0.75)", { fontWeight: 500 }), position: "absolute", left: 70, top: 1180 }}>Illustrative · not live data</div>
    <Foot total={20} n={10} c="rgba(255,255,255,0.7)" />
  </>
);
const P11: React.FC = () => (
  <>
    <Red /><Emblem s={300} style={{ position: "absolute", left: 390, top: 130 }} />
    <H fs={130} top={520} center w={1000} c="#fff">↓ Start trading</H>
    <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 760 }}><span style={{ display: "inline-block", background: "#fff", color: PM.lapis, fontFamily: U, fontWeight: 700, fontSize: 48, padding: "28px 60px", borderRadius: 99 }}>t.me/Tryoddsbot</span></div>
    <Foot total={20} n={11} c="rgba(255,255,255,0.75)" />
  </>
);
const P12: React.FC = () => (
  <>
    <Marble /><div style={{ ...cin(26, PM.gold), position: "absolute", left: 70, top: 100 }}>PolyMate Weekly</div>
    <H fs={120} top={260}>Another week.</H>
    <H fs={120} top={420}><Ser>More progress.</Ser></H>
    <Emblem s={240} style={{ position: "absolute", left: 70, bottom: 130 }} />
    <Foot total={20} n={12} />
  </>
);
const P13: React.FC = () => (
  <>
    <Lapis /><div style={{ ...cin(22, PM.goldLight), position: "absolute", left: 70, top: 100 }}>PolyMate Weekly</div>
    <H fs={170} top={300} c="#fff">A major <span style={{ color: PM.goldLight }}>milestone</span> ahead.</H>
    <Foot total={20} n={13} c="rgba(255,255,255,0.7)" />
  </>
);
const P14: React.FC = () => (
  <>
    <Marble /><Tag>Everything in one place</Tag>
    <H fs={120} top={140}>One layer. <Ser>Five tools.</Ser></H>
    <div style={{ position: "absolute", left: 70, right: 70, top: 480, display: "flex", gap: 14, justifyContent: "space-between" }}>
      {["Trade", "Markets", "Positions", "Strategy", "Balance"].map((t) => (
        <div key={t} style={{ width: 172, height: 500, background: "linear-gradient(180deg,#a82727,#6f1414)", border: `3px solid ${PM.goldLight}`, clipPath: "polygon(0 0,100% 0,100% 92%,50% 100%,0 92%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ ...cin(24, "#fff", { writingMode: "vertical-rl", letterSpacing: 8 }) }}>{t}</span>
        </div>
      ))}
    </div>
    <Foot total={20} n={14} />
  </>
);
const P15: React.FC = () => (
  <>
    <Marble /><Robot x={290} y={90} w={500} h={520} />
    <Emblem s={200} style={{ position: "absolute", left: 440, top: 560 }} />
    <H fs={130} top={800} center w={1000}>PolyMate</H>
    <div style={{ fontFamily: S, fontStyle: "italic", fontSize: 48, color: PM.inkSoft, position: "absolute", left: 60, right: 60, top: 960, textAlign: "center" }}>Building tools to trade the future, fast.</div>
    <div style={{ ...cin(20, PM.gold), position: "absolute", left: 0, right: 0, textAlign: "center", top: 1070 }}>t.me/Tryoddsbot · @Polymatedotfun</div>
    <Foot total={20} n={20} />
  </>
);
const P16: React.FC = () => (
  <>
    <Marble /><Photo x={70} y={110} w={940} h={620} pos="50% 62%" />
    <H fs={120} top={790}>The trading <Ser>layer.</Ser></H>
    <div style={{ fontFamily: S, fontStyle: "italic", fontSize: 46, color: PM.inkSoft, position: "absolute", left: 70, right: 70, top: 1090 }}>For prediction markets.</div>
    <Foot total={20} n={15} />
  </>
);
const P17: React.FC = () => (
  <>
    <Lapis /><Emblem s={560} style={{ position: "absolute", left: 260, top: 150 }} />
    <H fs={170} top={800} center w={1000} c="#fff">Trade the <span style={{ color: PM.goldLight }}>future.</span></H>
    <Foot total={20} n={16} c="rgba(255,255,255,0.7)" />
  </>
);
const P18: React.FC = () => (
  <>
    <Red /><div style={{ ...cin(20, PM.goldLight), position: "absolute", left: 70, top: 90 }}>Position</div>
    <H fs={170} top={170} c="#fff">Position <span style={{ color: PM.goldLight }}>Opened.</span></H>
    <Card x={100} y={640} w={880} h={300} style={{ display: "flex", alignItems: "center", gap: 36 }}>
      <div style={{ width: 130, height: 130, borderRadius: 30, background: "#1f9d55", flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width={70} height={70} viewBox="0 0 64 64" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"><path d="M16 48 L48 16 M24 16 H48 V40" /></svg></div>
      <div><div style={{ fontFamily: U, fontWeight: 700, fontSize: 48, color: PM.ink }}>YES · $50</div><div style={{ fontFamily: U, fontSize: 30, color: PM.inkSoft, marginTop: 10 }}>Position Opened</div></div>
    </Card>
    <div style={{ ...cin(14, "rgba(255,255,255,0.75)", { fontWeight: 500 }), position: "absolute", left: 100, top: 980 }}>Illustrative · not live data</div>
    <Foot total={20} n={17} c="rgba(255,255,255,0.75)" />
  </>
);
const P19: React.FC = () => (
  <>
    <Marble /><Banner x={60} y={0} h={300} /><Banner x={910} y={0} h={300} />
    <div style={{ ...cin(22, PM.gold), position: "absolute", left: 0, right: 0, textAlign: "center", top: 380 }}>Prediction markets</div>
    <div style={{ fontFamily: S, fontSize: 170, lineHeight: 0.98, letterSpacing: -6, color: PM.ink, position: "absolute", left: 80, right: 80, top: 450, textAlign: "center" }}>Trade the <span style={{ fontStyle: "italic", color: PM.lapis }}>future,</span> fast.</div>
    <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 1000 }}><span style={{ display: "inline-block", background: PM.lapis, color: "#fff", fontFamily: U, fontWeight: 600, fontSize: 40, padding: "24px 52px", borderRadius: 99 }}>t.me/Tryoddsbot</span></div>
    <Foot total={20} n={18} />
  </>
);
const P20: React.FC = () => (
  <>
    <Marble /><Tag>Weekly</Tag>
    <H fs={130} top={140}>PolyMate <Ser>Weekly.</Ser></H>
    {["Another week.", "More progress.", "A major milestone ahead."].map((t, i) => (
      <div key={t} style={{ position: "absolute", left: 70, right: 70, top: 470 + i * 220, borderTop: `2px solid ${PM.goldLight}`, paddingTop: 34, fontFamily: D, fontWeight: 800, fontStyle: "italic", fontSize: i === 2 ? 76 : 96, letterSpacing: -3, color: i === 2 ? PM.lapis : PM.ink }}>{t}</div>
    ))}
    <Foot total={20} n={19} />
  </>
);
export const PolymateX2 = makeStill([P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P16, P17, P18, P19, P20, P15], PM.cream);
