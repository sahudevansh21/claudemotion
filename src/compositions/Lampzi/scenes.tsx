import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BRAND, Burst, CL, CheckDot, FanMark, IcoAlert, IcoChev, IcoFile, IcoPen, IcoPlus, IcoSearch, IcoSliders, IcoTerm, IllustrativeTag, IO, L, MONO, OUT, SANS, Spin, StatusLine, Tag, camStyle, ez, type CamKey } from "./ui";
import { interpolate } from "remotion";

/** One scene = its own flat background, fading in over the previous scene. */
export const Scene: React.FC<{ bg: string; children: React.ReactNode }> = ({ bg, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: bg, opacity: ez(f, 0, 9, IO), overflow: "hidden" }}>{children}</AbsoluteFill>;
};
const cam = (f: number, k: CamKey[]) => camStyle(f, k);
const Mono: React.FC<{ children: React.ReactNode; dark?: boolean; fs?: number }> = ({ children, dark, fs }) => <span style={{ fontFamily: MONO, fontSize: fs ?? "0.88em", color: dark ? "rgba(255,255,255,0.8)" : L.ink }}>{children}</span>;

/* ---------- generic log row ---------- */
const Row: React.FC<{ x: number; y: number; at: number; icon: React.ReactNode; children: React.ReactNode; fs: number; dark?: boolean; last?: boolean; shift?: number }> = ({ x, y, at, icon, children, fs, dark, shift = 0 }) => {
  const f = useCurrentFrame();
  const p = ez(f, at, 16);
  return (
    <div style={{ position: "absolute", left: x, top: y + shift, height: fs * 1.8, display: "flex", alignItems: "center", gap: fs * 0.75, opacity: p, transform: `translateY(${(1 - p) * 18}px)`, fontFamily: SANS, fontSize: fs, color: dark ? "rgba(255,255,255,0.92)" : L.ink, whiteSpace: "nowrap" }}>
      <div style={{ width: fs * 1.2, display: "flex", justifyContent: "center" }}>{icon}</div>
      {children}
    </div>
  );
};
const Diff: React.FC<{ a: string; b: string }> = ({ a, b }) => <span style={{ fontFamily: MONO, fontSize: "0.88em", marginLeft: 12 }}><span style={{ color: "#22a35a" }}>{a}</span> <span style={{ color: L.red }}>{b}</span></span>;

/* ================= A: status ================= */
export const SceneA: React.FC = () => {
  const f = useCurrentFrame();
  const pop = ez(f, 0, 16);
  return (
    <Scene bg={L.paper}>
      <StatusLine size={96} loader={<div style={{ transform: `scale(${0.4 + 0.6 * pop})`, opacity: pop }}><Burst size={88} t={f} /></div>} items={[{ text: "Importing…", at: 26 }, { text: "Choosing a template", at: 84 }]} />
    </Scene>
  );
};

/* ================= B: light log ================= */
export const SceneB: React.FC = () => {
  const f = useCurrentFrame();
  const k: CamKey[] = [[0, 1.05, 990, 500], [34, 1.7, 1010, 560], [60, 2.1, 1010, 600]];
  const second = f >= 30;
  return (
    <Scene bg={L.paper}>
      <div style={cam(f, k)}>
        <div style={{ position: "absolute", left: 690, top: 0, width: 2, height: 1080, background: L.line }} />
        <div style={{ position: "absolute", left: 760, top: 230, padding: "20px 28px", borderRadius: 26, background: "#f1f2f3", fontFamily: SANS, fontSize: 30, color: L.ink, opacity: ez(f, 0, 10) }}>Make it ATS friendly.</div>
        <Row x={752} y={400} at={0} fs={28} icon={<Spin s={30} />}>
          <span>{second ? "Checking ATS format" : "Compiling LaTeX"}</span><span style={{ color: L.muted }}>{second ? "2s" : "1s"}</span><IcoChev up s={22} />
        </Row>
        <Row x={752} y={470} at={6} fs={28} icon={<IcoSearch s={28} />}>Imported <Mono>Resume_2026-08-29_17-49-02.pdf</Mono><Tag fs={20}>1 file</Tag></Row>
        <Row x={752} y={530} at={18} fs={28} icon={<IcoFile s={28} />}>Read 5 sections</Row>
        <Row x={752} y={590} at={30} fs={28} icon={<IcoPen s={28} />}>{second ? <>Edited <Mono>experience.tex</Mono><Diff a="+18" b="−4" /></> : <>Editing <Mono>experience.tex</Mono></>}</Row>
        <Row x={752} y={650} at={40} fs={28} icon={<IcoTerm s={28} />}>Compiling <Mono>resume.tex</Mono></Row>
      </div>
      <IllustrativeTag at={10} />
    </Scene>
  );
};

/* ================= C: dark log ================= */
export const SceneC: React.FC = () => {
  const f = useCurrentFrame();
  const k: CamKey[] = [[0, 2.0, 1010, 560], [60, 1.85, 1010, 600]];
  const scroll = -150 * ez(f, 34, 18, IO);
  const second = f >= 34;
  const x = 690, pitch = 76, y0 = 400;
  return (
    <Scene bg={L.dark}>
      <div style={cam(f, k)}>
        <div style={{ position: "absolute", left: 660, top: 0, width: 2, height: 1080, background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${scroll}px)` }}>
          <div style={{ position: "absolute", left: x + 21, top: y0 + 40, width: 2, height: pitch * 5, background: "rgba(255,255,255,0.12)" }} />
          <Row dark x={x} y={y0} at={0} fs={32} icon={<IcoFile s={32} c="#fff" />}>Read 5 sections</Row>
          <Row dark x={x} y={y0 + pitch} at={0} fs={32} icon={<IcoPen s={32} c="#fff" />}>Edited <Mono dark>experience.tex</Mono><Diff a="+18" b="−4" /></Row>
          <Row dark x={x} y={y0 + pitch * 2} at={0} fs={32} icon={<IcoAlert s={32} />}>Checked ATS format <Tag dark fs={24}>1 issue</Tag><IcoChev s={26} c="rgba(255,255,255,0.7)" /></Row>
          <Row dark x={x} y={y0 + pitch * 3} at={0} fs={32} icon={<IcoPen s={32} c="#fff" />}>{second ? <>Edited <Mono dark>summary.tex</Mono><Diff a="+3" b="−1" /></> : <>Editing <Mono dark>summary.tex</Mono></>}</Row>
          <Row dark x={x} y={y0 + pitch * 4} at={34} fs={32} icon={<IcoTerm s={32} c="#fff" />}>Checked ATS format <Tag dark fs={24}>passed</Tag><IcoChev s={26} c="rgba(255,255,255,0.7)" /></Row>
          <Row dark x={x} y={y0 + pitch * 5} at={40} fs={32} icon={<IcoPen s={32} c="#fff" />}>Editing <Mono dark>resume.tex</Mono></Row>
        </div>
      </div>
      <IllustrativeTag dark at={6} />
    </Scene>
  );
};

/* ================= D: plan ================= */
const PLAN = ["Add your details", "Choose a template", "Pick a colour and layout", "Check ATS format", "Compile with LaTeX", "Download your PDF", "Track your applications"];
export const SceneD: React.FC = () => {
  const f = useCurrentFrame();
  const k: CamKey[] = [[0, 9, 712, 566], [20, 9, 712, 566], [44, 1.25, 960, 560], [60, 2.8, 800, 566]];
  const done = f >= 40;
  const count = done ? 4 : 3;
  return (
    <Scene bg={L.paper}>
      <div style={cam(f, k)}>
        <div style={{ position: "absolute", left: 560, top: 190, width: 800, height: 700, borderRadius: 34, background: L.white, border: `2px solid ${L.line}`, boxShadow: "0 40px 100px rgba(0,0,0,0.08)" }} />
        <div style={{ position: "absolute", left: 610, top: 238, fontFamily: SANS, fontSize: 26, fontWeight: 500, color: L.ink }}>Resume plan</div>
        <div style={{ position: "absolute", right: 600, top: 240, fontFamily: SANS, fontSize: 22, color: L.muted }}>{count} of 7</div>
        <div style={{ position: "absolute", left: 610, right: 610, top: 292, height: 2, background: L.ink }} />
        {PLAN.map((t, i) => {
          const y = 330 + i * 78;
          const isDone = i < 3 || (i === 3 && done);
          const cur = i === 3 && !done;
          return (
            <div key={t} style={{ position: "absolute", left: 610, top: y, height: 60, display: "flex", alignItems: "center", gap: 22, fontFamily: SANS, fontSize: 32, color: i > 3 ? "#9aa1a9" : L.ink }}>
              {cur ? (
                <svg width={40} height={40} viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={L.ink} /><circle cx="20" cy="20" r="3.6" fill="#fff" /></svg>
              ) : (
                <CheckDot s={40} on={isDone ? 1 : 0} color={i > 3 ? "#b9bfc6" : L.ink} />
              )}
              <span style={{ opacity: i < 4 ? 1 : 0.85 }}>{t}</span>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* ================= E: waiting ================= */
export const SceneE: React.FC = () => {
  const f = useCurrentFrame();
  const pop = ez(f, 0, 10);
  return (
    <Scene bg={L.paper}>
      <StatusLine size={96} loader={<div style={{ opacity: pop }}><Burst size={88} t={f + 40} /></div>} items={[{ text: "Waiting for your pick", at: 8 }]} />
    </Scene>
  );
};

/* ================= F: dialog ================= */
export const SceneF: React.FC = () => {
  const f = useCurrentFrame();
  const k: CamKey[] = [[0, 1.15, 960, 500], [22, 1.3, 960, 540], [40, 3.1, 1130, 662], [60, 3.3, 1130, 662]];
  const press = ez(f, 42, 5) * (1 - ez(f, 47, 9));
  const ring = ez(f, 42, 16);
  return (
    <Scene bg={L.paper}>
      <div style={cam(f, k)}>
        <div style={{ position: "absolute", left: 500, top: 330, width: 920, height: 450, borderRadius: 34, background: L.white, border: `2px solid ${L.line}`, boxShadow: "0 40px 100px rgba(0,0,0,0.09)", opacity: ez(f, 0, 12), transform: `translateY(${(1 - ez(f, 0, 18)) * 60}px)` }} />
        <div style={{ position: "absolute", left: 550, top: 368, fontFamily: SANS, fontSize: 28, fontWeight: 500, color: L.ink }}>Choose a template</div>
        <div style={{ position: "absolute", left: 540, top: 424, width: 840, height: 76, borderRadius: 14, background: "#f1f2f3", display: "flex", alignItems: "center", paddingLeft: 24, fontFamily: SANS, fontSize: 28, fontWeight: 600, color: L.ink }}>T2 : Neat and Professional</div>
        <div style={{ position: "absolute", left: 550, top: 518, fontFamily: SANS, fontSize: 24, color: L.muted }}>Great for tech roles and startups.</div>
        <div style={{ position: "absolute", left: 550, top: 562, display: "flex", gap: 14 }}>{["Standard", "Compact"].map((t, i) => <Tag key={t} fs={20} green={i === 0}>{t}</Tag>)}</div>
        <div style={{ position: "absolute", left: 780, top: 640, fontFamily: SANS, fontSize: 26, color: L.muted }}>Skip</div>
        <div style={{ position: "absolute", left: 850, top: 636, padding: "6px 14px", borderRadius: 10, background: "#eef0f2", fontFamily: SANS, fontSize: 20, color: L.muted }}>Esc</div>
        <div style={{ position: "absolute", left: 950, top: 626, width: 350, height: 72, borderRadius: 99, background: L.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: SANS, fontSize: 27, fontWeight: 500, transform: `scale(${1 - 0.05 * press})`, boxShadow: `0 0 0 ${ring * 28}px rgba(53,62,73,${0.22 * (1 - ring)})` }}>
          Use This Template<span style={{ padding: "4px 12px", borderRadius: 9, background: "rgba(255,255,255,0.18)", fontSize: 22 }}>↵</span>
        </div>
        <div style={{ position: "absolute", left: 1320, top: 626, width: 72, height: 72, borderRadius: 99, background: "#f1f2f3", display: "flex", alignItems: "center", justifyContent: "center" }}><IcoChev s={26} c={L.ink} /></div>
      </div>
    </Scene>
  );
};

/* ================= G: composer ================= */
export const SceneG: React.FC = () => {
  const f = useCurrentFrame();
  const k: CamKey[] = [[0, 1.9, 640, 570], [30, 1.9, 1280, 590]];
  const text = "Send it once the ATS check passes";
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - 2) * 55) / 60)));
  const stop = f >= 22;
  return (
    <Scene bg={L.paper}>
      <div style={cam(f, k)}>
        <div style={{ position: "absolute", left: 340, top: 440, width: 1240, height: 190, borderRadius: 44, background: L.white, border: `2px solid ${L.line}`, boxShadow: "0 24px 70px rgba(0,0,0,0.07)", opacity: ez(f, 0, 8) }} />
        <div style={{ position: "absolute", left: 400, top: 478, fontFamily: SANS, fontSize: 32, color: L.ink }}>{text.slice(0, n)}<span style={{ display: "inline-block", width: 3, height: 34, background: L.ink, marginLeft: 3, verticalAlign: -6, opacity: Math.floor(f / 9) % 2 === 0 || n < text.length ? 1 : 0 }} /></div>
        <div style={{ position: "absolute", left: 398, top: 566, display: "flex", alignItems: "center", gap: 36, fontFamily: SANS, fontSize: 24, color: L.muted }}>
          <IcoPlus s={28} c={L.muted} />
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}><IcoSliders s={26} c={L.muted} />Templates</span>
        </div>
        <div style={{ position: "absolute", left: 1226, top: 568, display: "flex", alignItems: "center", gap: 6, fontFamily: SANS, fontSize: 24, color: L.muted }}>Standard<IcoChev s={22} c={L.muted} /></div>
        <div style={{ position: "absolute", left: 1456, top: 552, width: 64, height: 64, borderRadius: 99, background: L.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {stop ? <div style={{ width: 22, height: 22, borderRadius: 4, background: "#fff" }} /> : <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>}
        </div>
      </div>
      <IllustrativeTag at={4} />
    </Scene>
  );
};

/* ================= H: tracker list ================= */
const JOBS: { group: string; n: number; items: { t: string; tag: string; sub: string; r: string }[] }[] = [
  { group: "Wishlist", n: 2, items: [{ t: "Frontend Developer", tag: "remote", sub: "Tailor your summary before applying", r: "now" }, { t: "Product Designer", tag: "full-time", sub: "Pick a template for the portfolio", r: "now" }] },
  { group: "Applied", n: 2, items: [{ t: "Data Analyst", tag: "hybrid", sub: "Resume sent, waiting to hear back", r: "1m" }, { t: "Support Engineer", tag: "remote", sub: "Follow up on Friday", r: "now" }] },
  { group: "Interview", n: 1, items: [{ t: "Marketing Associate", tag: "on-site", sub: "Prepare answers about recent projects", r: "now" }] },
];
export const SceneH: React.FC = () => {
  const f = useCurrentFrame();
  const k: CamKey[] = [[0, 0.5, 960, 560], [20, 0.5, 960, 560], [42, 1.9, 1110, 330], [60, 2.0, 1110, 400]];
  let y = 200;
  return (
    <Scene bg={L.paper}>
      <div style={cam(f, k)}>
        <div style={{ position: "absolute", left: 640, top: 150, width: 840, height: 900, borderRadius: 30, border: `2px solid ${L.line}`, background: L.white, opacity: ez(f, 0, 10) }} />
        {JOBS.map((g, gi) => {
          const top = y; y += 70 + g.items.length * 132 + 24;
          return (
            <div key={g.group}>
              <div style={{ position: "absolute", left: 690, top, fontFamily: SANS, fontSize: 24, color: L.muted, display: "flex", alignItems: "center", gap: 8, opacity: ez(f, gi * 3, 12) }}>{g.group} {g.n}<IcoChev s={22} c={L.muted} /></div>
              {g.items.map((it, i) => {
                const p = ez(f, gi * 4 + i * 4 + 3, 14);
                const yy = top + 62 + i * 132;
                return (
                  <div key={it.t} style={{ position: "absolute", left: 690, top: yy, width: 740, opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>
                    <div style={{ position: "absolute", left: 0, top: 6, width: 26, height: 26, borderRadius: 99, border: `2.4px solid ${L.ink}` }} />
                    <div style={{ position: "absolute", left: 50, top: 0, display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontSize: 28, fontWeight: 500, color: L.ink }}>{it.t}<Tag fs={20} mono>{it.tag}</Tag></div>
                    <div style={{ position: "absolute", left: 50, top: 48, fontFamily: SANS, fontSize: 24, color: L.muted }}>{it.sub}</div>
                    <div style={{ position: "absolute", right: 0, top: 4, fontFamily: SANS, fontSize: 22, color: L.muted }}>{it.r}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <IllustrativeTag at={6} />
    </Scene>
  );
};

/* ================= I: wall of templates ================= */
const ACC = ["#111111", "#3b82f6", "#c0392b", "#16866a", "#3a3f9a", "#1d4ed8", "#e11d48"];
const Page: React.FC<{ i: number; w: number; h: number }> = ({ i, w, h }) => {
  const c = ACC[i % ACC.length];
  const centered = i % 3 === 0;
  const bar = (wd: number, o = 0.18, hh = 5) => <div style={{ height: hh, width: `${wd}%`, borderRadius: 3, background: `rgba(53,62,73,${o})`, marginTop: 7 }} />;
  return (
    <div style={{ width: w, height: h, background: "#fff", borderRadius: 8, padding: "26px 28px", boxSizing: "border-box", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
      <div style={{ textAlign: centered ? "center" : "left", fontFamily: i % 2 ? SANS : "Georgia, serif", fontWeight: 700, fontSize: 26, color: "#1f242b", letterSpacing: i % 2 ? -0.5 : 0 }}>{i % 4 === 1 ? "JOHN DOE" : "John Doe"}</div>
      <div style={{ textAlign: centered ? "center" : "left", fontFamily: SANS, fontSize: 10, color: "#6b7280", marginTop: 2 }}>Senior Software Engineer · San Francisco, CA</div>
      {[0, 1, 2, 3].map((s) => (
        <div key={s} style={{ marginTop: 14 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 11, color: c, letterSpacing: 1.2, textTransform: "uppercase", borderBottom: `1.5px solid ${c}`, paddingBottom: 2 }}>{["Summary", "Experience", "Education", "Skills"][s]}</div>
          {bar(96)}{bar(88)}{s === 1 && bar(92)}{s === 1 && bar(70)}{bar(60, 0.14)}
        </div>
      ))}
    </div>
  );
};
export const SceneI: React.FC = () => {
  const f = useCurrentFrame();
  const k: CamKey[] = [[0, 0.78, 960, 540], [60, 0.9, 1010, 560]];
  return (
    <Scene bg={L.dark}>
      <div style={cam(f, k)}>
        <div style={{ position: "absolute", left: 960 - 654, top: 540 - 621, width: 1308, display: "grid", gridTemplateColumns: "repeat(4, 300px)", gap: 36 }}>
          {Array.from({ length: 12 }, (_, i) => {
            const p = ez(f, i * 2, 20);
            return <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}><Page i={i} w={300} h={390} /></div>;
          })}
        </div>
      </div>
    </Scene>
  );
};

/* ================= J: zoom into the log, collapse to loader ================= */
export const SceneJ: React.FC = () => {
  const f = useCurrentFrame();
  const k: CamKey[] = [[0, 0.42, 990, 540], [24, 2.5, 1000, 560], [40, 3.0, 870, 470], [66, 2.9, 770, 420]];
  const collapse = ez(f, 42, 22, IO);
  const ghost = ez(f, 30, 14);
  return (
    <Scene bg={L.paper}>
      <div style={cam(f, k)}>
        <div style={{ position: "absolute", left: 690, top: 0, width: 2, height: 1080, background: L.line }} />
        <div style={{ position: "absolute", left: 752, top: 400, height: 60, display: "flex", alignItems: "center", fontFamily: SANS, fontSize: 28, color: L.ink }}>
          <div style={{ width: 36, display: "flex", justifyContent: "center" }}><Spin s={30} /></div>
          <div style={{ marginLeft: 24 * (1 - collapse), width: 330 * (1 - collapse), overflow: "hidden", whiteSpace: "nowrap", opacity: 1 - collapse }}>Compiling LaTeX <span style={{ color: L.muted, marginLeft: 8 }}>8s</span></div>
        </div>
        <div style={{ position: "absolute", left: 752, top: 470, opacity: (1 - ghost) * 0.9, filter: `blur(${ghost * 5}px)`, transform: `translateY(${-ghost * 20}px)`, display: "flex", alignItems: "center", gap: 22, fontFamily: SANS, fontSize: 28, color: L.ink }}><IcoSearch s={28} />Imported <Mono>Resume_2026-08-29_17-49-02.pdf</Mono></div>
        <div style={{ position: "absolute", left: 752, top: 530, opacity: 1 - ez(f, 34, 12), display: "flex", alignItems: "center", gap: 22, fontFamily: SANS, fontSize: 28, color: L.ink }}><IcoFile s={28} />Read 5 sections</div>
        <div style={{ position: "absolute", left: 752, top: 590, opacity: 1 - ez(f, 36, 12), display: "flex", alignItems: "center", gap: 22, fontFamily: SANS, fontSize: 28, color: L.ink }}><IcoPen s={28} />Edited <Mono>experience.tex</Mono><Diff a="+18" b="−4" /></div>
      </div>
    </Scene>
  );
};

/* ================= K: brand ================= */
export const SceneK: React.FC = () => {
  const f = useCurrentFrame();
  const morph = ez(f, 76, 24, IO);
  const lift = ez(f, 130, 30, IO) * 46;
  const sub = ez(f, 150, 26);
  const url = ez(f, 210, 24);
  const loader = (
    <div style={{ position: "relative", width: 88, height: 88 }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - morph, transform: `scale(${1 - 0.3 * morph})` }}><Burst size={88} t={f + 60} /></div>
      <div style={{ position: "absolute", left: 6, top: -26, opacity: morph, transform: `scale(${0.7 + 0.3 * morph}) translateX(${(1 - morph) * 20}px)` }}><FanMark size={140} grow={morph} /></div>
    </div>
  );
  return (
    <Scene bg={L.paper}>
      <StatusLine size={104} y={540 - lift} loader={loader} items={[{ text: "Almost ready", at: 26 }, { text: "Lampzi", at: 80, font: BRAND, weight: 700 }]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 618, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 38, color: L.ink, opacity: sub, transform: `translateY(${(1 - sub) * 24}px)`, filter: `blur(${(1 - sub) * 6}px)` }}>Build Your Resume That Actually Works</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: SANS, fontSize: 24, color: L.muted, opacity: url, transform: `translateY(${(1 - url) * 18}px)` }}>lampzi.com  ·  Free  ·  Limited offer  ·  No credit card required</div>
    </Scene>
  );
};
export { interpolate, CL, IO, OUT };
