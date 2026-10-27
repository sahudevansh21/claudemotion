import { useCurrentFrame } from "remotion";
import { AbsoluteFill } from "remotion";
import { BRAND, Burst, FanMark, StatusLine } from "../ui";
import { CW, CX0, Caption, Cur, IcoEye, IcoFile2, IcoGrid, Illus, Img, L, MONO, NAVX, NAVY, Nav, Pg, SANS, Typing, camStyle, ez, interpolate, pathOf, pulse, staticFile, type CamKey, CL, IO } from "./parts";
import { TemplateCard, cardPos } from "./cards";

const cam = (f: number, k: CamKey[]) => camStyle(f, k);
const Btn: React.FC<{ x: number; y: number; w: number; h: number; on?: boolean; label: string; sub?: boolean; icon?: boolean; dim?: boolean }> = ({ x, y, w, h, on, label, dim }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 12, border: `2px solid ${on ? L.green : L.line}`, background: on ? L.greenSoft : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 21, color: on ? L.greenDeep : L.ink, opacity: dim ? 0.6 : 1 }}>{label}</div>
);

/* ===================== INTRO (156) ===================== */
export const WIntro: React.FC = () => {
  const f = useCurrentFrame();
  const morph = ez(f, 40, 24, IO);
  const sub = ez(f, 74, 24);
  const out = ez(f, 138, 16, IO);
  const loader = (
    <div style={{ position: "relative", width: 100, height: 100 }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - morph, transform: `scale(${(1 - 0.3 * morph) * (0.4 + 0.6 * ez(f, 0, 14))})` }}><Burst size={100} t={f} /></div>
      <div style={{ position: "absolute", left: 8, top: -30, opacity: morph, transform: `scale(${0.7 + 0.3 * morph})` }}><FanMark size={160} grow={morph} /></div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: L.paper, opacity: 1 - out }}>
      <StatusLine size={120} y={520} loader={loader} items={[{ text: "Lampzi", at: 46, font: BRAND, weight: 700 }]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: MONO, fontSize: 24, letterSpacing: 10, textTransform: "uppercase", color: L.muted, opacity: sub, transform: `translateY(${(1 - sub) * 16}px)` }}>Website walkover</div>
    </AbsoluteFill>
  );
};

/* ===================== HOME (264) ===================== */
export const WHome: React.FC = () => {
  const f = useCurrentFrame();
  const k: CamKey[] = [[0, 1.0, 960, 540], [50, 1.5, 700, 470], [175, 1.5, 700, 470], [250, 1.2, 760, 520]];
  const c = pathOf(f, [[0, 1500, 820], [74, 540, 598], [174, 540, 598], [264, 700, 640]]);
  return (
    <Pg>
      <div style={cam(f, k)}>
        <Img src={staticFile("lampzi/site/home.jpg")} style={{ position: "absolute", left: 0, top: 77, width: 1920 }} />
        <Nav active="home" />
        <div style={{ position: "absolute", left: 307, top: 560, width: 460, height: 76, borderRadius: 99, border: `4px solid rgba(103,162,133,${0.55 * ez(f, 120, 16)})`, opacity: 1 - ez(f, 190, 12) }} />
        <Cur x={c.x} y={c.y} click={pulse(f, 150)} />
      </div>
      <Caption n="01" text="Build Your Resume That Actually Works" len={264} />
    </Pg>
  );
};

/* ===================== CREATE (216) ===================== */
export const WCreate: React.FC = () => {
  const f = useCurrentFrame();
  const imp = ez(f, 56, 14);
  const role = f >= 128;
  const shift = 135 * imp;
  const k: CamKey[] = [[0, 1.3, 760, 620], [60, 1.35, 800, 700], [140, 1.35, 800, 760], [216, 1.3, 800, 740]];
  const c = pathOf(f, [[0, 540, 598], [48, 792, 520], [60, 792, 520], [122, 792, 772 + 4], [150, 654, 852], [216, 654, 852]]);
  return (
    <Pg>
      <div style={cam(f, k)}>
        <Nav active="home" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 108, textAlign: "center", fontFamily: SANS, fontSize: 54, fontWeight: 700, color: L.greenDeep }}>Create Your Resume</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 184, textAlign: "center", fontFamily: SANS, fontSize: 24, color: L.muted }}>Choose how you'd like to start building your professional resume.</div>
        <div style={{ position: "absolute", left: 349, top: 267, width: 1223, height: 510 + shift, borderRadius: 20, border: `2px solid ${L.line}`, background: "#fff", boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }} />
        <div style={{ position: "absolute", left: 960, top: 267, width: 2, height: 510 + shift, background: L.line }} />
        <div style={{ position: "absolute", left: 590, top: 303, width: 74, height: 74, borderRadius: 99, background: L.greenSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><IcoFile2 c={L.greenDeep} s={34} /></div>
        <div style={{ position: "absolute", left: 349, width: 611, top: 396, textAlign: "center", fontFamily: SANS, fontSize: 24, fontWeight: 700, color: L.ink }}>Create New Resume</div>
        <div style={{ position: "absolute", left: 349, width: 611, top: 436, textAlign: "center", fontFamily: SANS, fontSize: 17, color: L.muted }}>Create your resume from scratch or upload your existing resume.</div>
        <Btn x={386} y={489} w={259} h={62} on={imp < 0.5} label="Start blank" />
        <Btn x={663} y={489} w={259} h={62} on={imp >= 0.5} label="Import from file" />
        <div style={{ position: "absolute", left: 386, top: 568, width: 536, height: 120 * imp, opacity: imp, borderRadius: 14, border: `2.5px dashed ${L.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, overflow: "hidden" }}>
          <div style={{ fontFamily: SANS, fontSize: 20, color: L.ink }}>Click to browse or drag &amp; drop</div>
          <div style={{ fontFamily: SANS, fontSize: 14, color: L.muted }}>Supported files: .json, .pdf, .txt, .doc, .docx</div>
        </div>
        <div style={{ position: "absolute", left: 349, width: 611, top: 588 + shift, textAlign: "center", fontFamily: SANS, fontSize: 17, color: L.ink }}>I am a</div>
        <Btn x={386} y={606 + shift} w={259} h={62} on={!role} label="Student" />
        <Btn x={663} y={606 + shift} w={259} h={62} on={role} label="Working Professional" />
        <div style={{ position: "absolute", left: 386, top: 695 + shift, width: 536, height: 44, borderRadius: 99, background: L.green, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 19, fontWeight: 500, opacity: role ? 1 : 0.62 }}>{imp > 0.5 ? "Start Building" : "Start Blank"}</div>
        <div style={{ position: "absolute", left: 1010, top: 303, width: 74, height: 74, borderRadius: 99, background: L.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", left2: 0 } as React.CSSProperties}><svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={L.greenDeep} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.6L3 8M3 3v5h5M12 7v5l3 2" /></svg></div>
        <div style={{ position: "absolute", left: 960, width: 612, top: 396, textAlign: "center", fontFamily: SANS, fontSize: 24, fontWeight: 700, color: L.ink }}>My Resumes</div>
        <div style={{ position: "absolute", left: 960, width: 612, top: 436, textAlign: "center", fontFamily: SANS, fontSize: 17, color: L.muted }}>Pick up where you left off or start from your saved resumes.</div>
        <div style={{ position: "absolute", left: 1000, top: 500, display: "flex", gap: 14, alignItems: "center" }}><IcoFile2 s={26} /><div><div style={{ fontFamily: SANS, fontSize: 21, color: L.ink }}>Resume_2026-08-29_17-49-02.pdf</div><div style={{ fontFamily: SANS, fontSize: 14, color: L.muted }}>Last Modified: Aug 29 2026 at 11:19 PM</div></div></div>
        <div style={{ position: "absolute", left: 1000, top: 695 + shift, width: 532, height: 44, borderRadius: 99, border: `2px solid ${L.green}`, color: L.greenDeep, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 19 }}>View All Resume</div>
        <Cur x={c.x} y={c.y} click={Math.max(pulse(f, 52), pulse(f, 126))} />
      </div>
      <Caption n="02" text="Start blank or import from file" len={216} />
    </Pg>
  );
};

/* ===================== EDITOR (348) ===================== */
const SECTIONS = ["Personal Information", "Education", "Work Experience", "Projects", "Skills", "Awards & Achievements"];
const FIELDS: { label: string; ph: string; val: string; x: number; y: number; w: number; h?: number; at: number; cps: number }[] = [
  { label: "Full Name", ph: "John Doe", val: "John Doe", x: 700, y: 262, w: 430, at: 40, cps: 20 },
  { label: "Job title", ph: "Senior Software Engineer", val: "Senior Software Engineer", x: 1160, y: 262, w: 453, at: 78, cps: 26 },
  { label: "Email", ph: "johndoe@example.com", val: "johndoe@example.com", x: 700, y: 362, w: 430, at: 118, cps: 26 },
  { label: "Phone", ph: "+1 (555) 123-4567", val: "+1 (555) 123-4567", x: 1160, y: 362, w: 453, at: 158, cps: 24 },
  { label: "Location", ph: "eg: New York, Mumbai", val: "New York", x: 700, y: 462, w: 430, at: 198, cps: 20 },
];
const SUMMARY = "Experienced software developer with 5 years in web development.";
export const WEditor: React.FC = () => {
  const f = useCurrentFrame();
  const done = f >= 318;
  const k: CamKey[] = [[0, 1.2, 900, 460], [100, 1.45, 1000, 430], [200, 1.45, 1000, 520], [290, 1.35, 1000, 620], [348, 1.1, 960, 560]];
  const c = pathOf(f, [[0, 654, 852], [30, 915, 290], [74, 1380, 290], [112, 915, 390], [152, 1380, 390], [190, 915, 490], [226, 1150, 640], [316, 1150, 640], [346, 700, 44]]);
  const progress = done ? 1 / 6 : 0;
  return (
    <Pg>
      <div style={cam(f, k)}>
        <Nav active="home" />
        <div style={{ position: "absolute", left: CX0, top: 132, width: 330, height: 10, borderRadius: 99, background: "#e7ece9" }}><div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 99, background: L.green }} /></div>
        <div style={{ position: "absolute", left: 660, top: 118, fontFamily: SANS, fontSize: 18, color: L.muted }}>{done ? 1 : 0} / 6</div>
        <div style={{ position: "absolute", left: CX0, top: 176, fontFamily: SANS, fontSize: 21, fontWeight: 500, color: L.ink }}>Resume Sections</div>
        <div style={{ position: "absolute", left: 560, top: 178, fontFamily: SANS, fontSize: 17, color: L.muted }}>Edit ⌄</div>
        {SECTIONS.map((s, i) => (
          <div key={s} style={{ position: "absolute", left: CX0, top: 226 + i * 64, width: 330, height: 52, borderRadius: 12, background: i === 0 ? L.green : "transparent", color: i === 0 ? "#fff" : L.ink, fontFamily: SANS, fontSize: 19, display: "flex", alignItems: "center", gap: 14, paddingLeft: 16, boxSizing: "border-box" }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${i === 0 ? "#fff" : L.muted}`, opacity: 0.8 }} />{s}
          </div>
        ))}
        <div style={{ position: "absolute", left: CX0, top: 640, fontFamily: SANS, fontSize: 17, color: L.muted }}>Resume Actions</div>
        <div style={{ position: "absolute", left: 700, top: 112, fontFamily: SANS, fontSize: 34, fontWeight: 700, color: L.greenDeep }}>Personal Information</div>
        <div style={{ position: "absolute", left: 700, top: 166, fontFamily: SANS, fontSize: 18, color: L.muted }}>Provide your basic personal details such as name, contact information, and summary</div>
        {FIELDS.map((fl) => (
          <div key={fl.label}>
            <div style={{ position: "absolute", left: fl.x, top: fl.y - 30, fontFamily: SANS, fontSize: 16, fontWeight: 500, color: L.ink }}>{fl.label}</div>
            <div style={{ position: "absolute", left: fl.x, top: fl.y, width: fl.w, height: 54, borderRadius: 10, border: `2px solid ${f >= fl.at - 6 && f < fl.at + 50 ? L.green : "#d9ddd9"}`, background: "#fff", display: "flex", alignItems: "center", paddingLeft: 16, fontFamily: SANS, fontSize: 19, boxSizing: "border-box" }}>
              {f < fl.at ? <span style={{ color: "#a9afb4" }}>{fl.ph}</span> : <Typing text={fl.val} at={fl.at} cps={fl.cps} />}
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 700, top: 538, fontFamily: SANS, fontSize: 16, fontWeight: 500, color: L.ink }}>Professional Summary</div>
        <div style={{ position: "absolute", left: 700, top: 566, width: 913, height: 150, borderRadius: 10, border: `2px solid ${f >= 222 && f < 316 ? L.green : "#d9ddd9"}`, background: "#fff", boxSizing: "border-box", padding: "14px 16px", fontFamily: SANS, fontSize: 19, lineHeight: 1.4 }}>
          {f < 232 ? <span style={{ color: "#a9afb4" }}>Experienced software developer with 5 years in web development, specializing in React and Node.js</span> : <Typing text={SUMMARY} at={232} cps={52} />}
          <div style={{ position: "absolute", right: 14, bottom: 10, display: "flex", gap: 14, color: L.muted, fontWeight: 700, fontSize: 16 }}>B<span>🔗</span></div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 728, fontFamily: SANS, fontSize: 14, color: L.muted }}>Select text, then click B to bold, or click the link icon to add a hyperlink.</div>
        <Cur x={c.x} y={c.y} click={Math.max(pulse(f, 34), pulse(f, 72), pulse(f, 112), pulse(f, 152), pulse(f, 192), pulse(f, 228))} />
      </div>
      <Illus at={10} />
      <Caption n="03" text="Highly customizable sections: Tailor Your Story" len={348} />
    </Pg>
  );
};

/* ===================== MY RESUMES (156) ===================== */
export const WResumes: React.FC = () => {
  const f = useCurrentFrame();
  const k: CamKey[] = [[0, 1.3, 960, 290], [70, 1.35, 960, 300], [156, 1.35, 960, 300]];
  const c = pathOf(f, [[0, 700, NAVY + 4], [34, 800, 280], [90, 1510, 296], [130, 1510, 296], [156, 860, 44]]);
  return (
    <Pg>
      <div style={cam(f, k)}>
        <Nav active="resumes" hover="resumes" />
        <div style={{ position: "absolute", left: CX0, top: 150, fontFamily: SANS, fontSize: 36, fontWeight: 600, color: L.ink }}>My Resumes</div>
        <div style={{ position: "absolute", left: CX0, top: 228, width: CW, height: 104, borderRadius: 14, border: `2px solid ${L.line}`, background: "#fff", boxShadow: "0 6px 20px rgba(0,0,0,0.04)", opacity: ez(f, 10, 16), transform: `translateY(${(1 - ez(f, 10, 18)) * 24}px)` }}>
          <div style={{ position: "absolute", left: 28, top: 30 }}><IcoFile2 s={36} c={L.muted} /></div>
          <div style={{ position: "absolute", left: 88, top: 20, display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontSize: 26, fontWeight: 500, color: L.ink }}>Resume_2026-08-29_17-49-02<span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: L.greenDeep, background: L.greenSoft, borderRadius: 99, padding: "3px 12px" }}>PAID</span></div>
          <div style={{ position: "absolute", left: 88, top: 62, fontFamily: SANS, fontSize: 17, color: L.muted }}>Modified: Aug 29 2026 &nbsp;&nbsp; Created: Aug 29 2026</div>
          <div style={{ position: "absolute", right: 34, top: 36, display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, fontSize: 20, color: f > 96 ? L.greenDeep : L.muted }}><IcoEye s={26} c={f > 96 ? L.greenDeep : L.muted} />Preview</div>
        </div>
        <Cur x={c.x} y={c.y} click={pulse(f, 4)} />
      </div>
      <Caption n="04" text="Unlimited Revisions: Edit and update your resume anytime" len={156} />
    </Pg>
  );
};

/* ===================== TEMPLATES (396) ===================== */
export const WTemplates: React.FC = () => {
  const f = useCurrentFrame();
  const k: CamKey[] = [[0, 1.0, 960, 540], [50, 1.0, 960, 540], [86, 2.1, 960, 800], [188, 2.1, 960, 800], [236, 0.62, 960, 760], [330, 0.62, 960, 1330], [396, 0.62, 960, 1420]];
  const p2 = cardPos(1);
  const dotSel = f >= 98 ? 3 : 5;
  const compact = f >= 138;
  const press = ez(f, 176, 6) * (1 - ez(f, 182, 10));
  const c = pathOf(f, [[0, 860, NAVY + 4], [40, 1010, 300], [86, 1010, 640], [100, p2.x + 20 + 3 * 36 + 14, p2.y + 517], [132, p2.x + 20 + 193 + 93, p2.y + 595], [172, p2.x + 207, p2.y + 651], [240, 1000, 760], [330, 1050, 1200], [396, 1020, 44]]);
  const rowOffs = [0, 1, 2];
  return (
    <Pg>
      <div style={cam(f, k)}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 112, textAlign: "center", fontFamily: SANS, fontSize: 56, fontWeight: 700, color: L.ink }}>Explore Resume Templates</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 196, textAlign: "center", fontFamily: SANS, fontSize: 27, color: "#555d66" }}>Find the perfect template for your next career move</div>
        {rowOffs.flatMap((r) => [0, 1, 2].map((cc) => {
          const i = r * 3 + cc;
          const p = ez(f, i * 2, 16);
          return (
            <div key={i} style={{ opacity: r === 0 ? 1 : p, filter: r === 0 ? undefined : undefined }}>
              <TemplateCard i={i} sel={i === 1 ? dotSel : undefined} compact={i === 1 ? compact : false} press={i === 1 ? press : 0} hl={i === 1 && f >= 176 ? 1 : 0} />
            </div>
          );
        }))}
        <Nav active="templates" hover="templates" />
        <Cur x={c.x} y={c.y} click={Math.max(pulse(f, 4), pulse(f, 100), pulse(f, 136), pulse(f, 176))} />
      </div>
      <Caption n="05" text="ATS-friendly, professionally designed templates" len={396} />
    </Pg>
  );
};

/* ===================== TIPS (288) ===================== */
const TIPCARD = { x: 480, w: 960, h: 130, pitch: 170, y0: 340 };
const Tip: React.FC<{ n: number; title?: string; body?: string; blur?: boolean }> = ({ n, title, body }) => {
  const y = TIPCARD.y0 + (n - 1) * TIPCARD.pitch;
  return (
    <div style={{ position: "absolute", left: TIPCARD.x, top: y, width: TIPCARD.w, height: TIPCARD.h, borderRadius: 14, border: `2px solid ${L.line}`, background: "#fff", boxShadow: "0 6px 18px rgba(0,0,0,0.04)" }}>
      <div style={{ position: "absolute", left: 28, top: 38, width: 56, height: 56, borderRadius: 99, background: L.greenSoft, color: L.greenDeep, fontFamily: SANS, fontSize: 24, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
      {title ? (
        <>
          <div style={{ position: "absolute", left: 112, top: 24, fontFamily: SANS, fontSize: 23, fontWeight: 600, color: L.greenDeep, whiteSpace: "nowrap" }}>{title}</div>
          {body && <div style={{ position: "absolute", left: 112, top: 62, width: 800, fontFamily: SANS, fontSize: 19, color: L.ink, lineHeight: 1.45 }}>{body}</div>}
        </>
      ) : (
        <>
          <div style={{ position: "absolute", left: 112, top: 30, width: 320, height: 18, borderRadius: 6, background: "#dfe8e3" }} />
          <div style={{ position: "absolute", left: 112, top: 70, width: 760, height: 12, borderRadius: 6, background: "#eceeee" }} />
          <div style={{ position: "absolute", left: 112, top: 94, width: 560, height: 12, borderRadius: 6, background: "#eceeee" }} />
        </>
      )}
    </div>
  );
};
export const TipsPage: React.FC<{ scroll: number }> = ({ scroll }) => (
  <div style={{ position: "absolute", left: 0, top: -scroll, width: 1920, height: 2800 }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontFamily: SANS, fontSize: 56, fontWeight: 700, color: L.greenDeep }}>The 10 Golden Rules</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 214, textAlign: "center", fontFamily: SANS, fontSize: 28, fontWeight: 600, color: L.ink }}>Read once, win always</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", fontFamily: SANS, fontSize: 22, color: L.muted }}>Craft a winning resume with these expert tips and best practices.</div>
    <Tip n={1} title="Keep it simple" body="Use a clean and professional layout. Avoid clutter and unnecessary graphics." />
    {[2, 3, 4, 5, 6, 7].map((n) => <Tip key={n} n={n} />)}
    <Tip n={8} title="Include a professional summary" body="Start your resume with a brief 2–3 sentence summary that highlights your career focus, key strengths, and what you bring to the role. It helps recruiters quickly understand your value." />
    <Tip n={9} title="Showcase relevant awards, achievements, certifications and training" body="Include certifications, training, or courses that are relevant to the job. This demonstrates your commitment to continuous learning and staying updated with industry trends." />
    <Tip n={10} title="Proofread carefully" body="Check for spelling and grammar errors. A polished resume makes a great impression." />
    <div style={{ position: "absolute", left: 0, right: 0, top: 2090, textAlign: "center", fontFamily: SANS, fontSize: 34, fontWeight: 700, color: L.ink }}>Ready to build your winning resume?</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 2144, textAlign: "center", fontFamily: SANS, fontSize: 22, color: L.muted }}>Use our ATS-friendly LaTeX templates to create a professional resume in minutes.</div>
    <div style={{ position: "absolute", left: 800, top: 2204, width: 320, height: 62, borderRadius: 99, background: L.green, color: "#fff", fontFamily: SANS, fontSize: 24, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>View Templates</div>
    <div style={{ position: "absolute", left: 0, top: 2380, width: 1920, height: 420, background: L.green }}>
      <div style={{ position: "absolute", left: CX0, top: 60, fontFamily: "Fredoka, sans-serif", fontSize: 44, fontWeight: 700, color: "#fff" }}>Lampzi</div>
      {["RESUME", "JOB SEARCH", "OUR COMPANY", "SUPPORT"].map((h, i) => (<div key={h} style={{ position: "absolute", left: 620 + i * 260, top: 62, fontFamily: SANS, fontSize: 17, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.78)" }}>{h}</div>))}
      {[["Create Your Resume"], ["Job Tracker"], ["Home"], ["FAQ"]].map(([t], i) => (<div key={t} style={{ position: "absolute", left: 620 + i * 260, top: 108, fontFamily: SANS, fontSize: 19, color: "#fff" }}>{t}</div>))}
    </div>
  </div>
);
export const WTips: React.FC = () => {
  const f = useCurrentFrame();
  const fast = interpolate(f, [70, 120], [0, 1], { ...CL, easing: IO });
  const second = interpolate(f, [150, 222], [0, 1], { ...CL, easing: IO });
  const scroll = 1200 * fast + 640 * second;
  const blur = 7 * Math.sin(Math.PI * Math.min(1, fast)) * (f < 150 ? 1 : 0) + (f >= 150 && f < 222 ? 2 : 0);
  const k: CamKey[] = [[0, 1.12, 960, 520], [70, 1.12, 960, 540], [150, 1.0, 960, 540], [288, 1.0, 960, 540]];
  const c = pathOf(f, [[0, 1020, NAVY + 4], [50, 1000, 500], [200, 1000, 560], [225, 1010, 760], [256, 1010, 760], [288, 1210, 44]]);
  return (
    <Pg>
      <div style={cam(f, k)}>
        <div style={{ position: "absolute", inset: 0, filter: `blur(${blur}px)` }}><TipsPage scroll={scroll} /></div>
        <Nav active="tips" hover="tips" />
        <Cur x={c.x} y={c.y} click={pulse(f, 4)} />
      </div>
      <Caption n="06" text="The 10 Golden Rules: Read once, win always" len={288} />
    </Pg>
  );
};

/* ===================== TRACKER (168) ===================== */
export const WTracker: React.FC = () => {
  const f = useCurrentFrame();
  const k: CamKey[] = [[0, 1.0, 960, 540], [50, 1.6, 1180, 340], [168, 1.5, 1220, 360]];
  const c = pathOf(f, [[0, 1210, NAVY + 4], [30, 1500, 300], [86, 1749, 62], [168, 1749, 62]]);
  return (
    <Pg>
      <div style={cam(f, k)}>
        <Img src={staticFile("lampzi/site/tracker.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 1920 }} />
        <div style={{ position: "absolute", left: 1840, top: 10, width: 54, height: 54, borderRadius: 99, background: "#cfe3d9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={30} height={30} viewBox="0 0 24 24" fill={L.greenDeep}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" /></svg>
        </div>
        <Cur x={c.x} y={c.y} click={pulse(f, 92)} />
      </div>
      <Caption n="07" text="Job Tracker: Wishlist, Applied, Interview, Offer, Rejected" len={168} />
    </Pg>
  );
};

/* ===================== MORE (168) ===================== */
const BLOG = ["How to Write a Student Resume With No Experience (That Still Gets Interviews)", "How to Organize Your Job Search: A System That Actually Holds Up", "Resumake Has Closed: The Best Alternatives for a Free LaTeX Resume in 2026"];
export const WMore: React.FC = () => {
  const f = useCurrentFrame();
  const open = ez(f, 8, 14);
  const k: CamKey[] = [[0, 1.0, 960, 540], [40, 1.65, 1340, 330], [168, 1.55, 1330, 340]];
  const c = pathOf(f, [[0, 1405, NAVY + 4], [50, 1405, 60], [96, 1230, 300], [136, 1560, 150], [168, 1560, 150]]);
  const hoverCommunity = f >= 120;
  return (
    <Pg>
      <div style={cam(f, k)}>
        <div style={{ position: "absolute", inset: 0, filter: "blur(5px)", opacity: 0.85 }}><TipsPage scroll={1840} /></div>
        <Nav moreOpen hover="more" />
        <div style={{ position: "absolute", left: 1070, top: 88, width: 560, height: 430, borderRadius: 18, background: "#fff", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", border: `1.5px solid ${L.line}`, opacity: open, transform: `translateY(${(1 - open) * -18}px) scale(${0.97 + 0.03 * open})`, transformOrigin: "top right" }}>
          <div style={{ position: "absolute", left: 28, top: 26, fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: L.muted }}>BLOG</div>
          {BLOG.map((t, i) => (<div key={i} style={{ position: "absolute", left: 28, top: 62 + i * 92, width: 290, fontFamily: SANS, fontSize: 16.5, fontWeight: 500, lineHeight: 1.35, color: f > 60 + i * 10 && f < 100 + i * 10 && i === 1 ? L.greenDeep : L.ink, opacity: ez(f, 16 + i * 6, 14) }}>{t}</div>))}
          <div style={{ position: "absolute", left: 28, top: 346, fontFamily: SANS, fontSize: 16.5, fontWeight: 500, color: L.greenDeep }}>View all posts →</div>
          <div style={{ position: "absolute", left: 350, top: 26, fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: L.muted }}>COMMUNITY</div>
          <div style={{ position: "absolute", left: 350, top: 62, fontFamily: SANS, fontSize: 16.5, fontWeight: 500, color: hoverCommunity ? L.greenDeep : L.ink, opacity: ez(f, 16, 14) }}>Interview Experiences</div>
        </div>
        <Cur x={c.x} y={c.y} click={pulse(f, 6)} />
      </div>
      <Caption n="08" text="More: Blog and Community" len={168} />
    </Pg>
  );
};

/* ===================== END (240) ===================== */
export const WEnd: React.FC = () => {
  const f = useCurrentFrame();
  const cta = (1 - ez(f, 70, 16, IO));
  const brand = ez(f, 74, 20, IO);
  const morph = ez(f, 92, 24, IO);
  const sub = ez(f, 142, 24);
  const url = ez(f, 184, 22);
  const c = pathOf(f, [[0, 1560, 150], [40, 960, 668], [90, 960, 668]]);
  const loader = (
    <div style={{ position: "relative", width: 100, height: 100 }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - morph, transform: `scale(${1 - 0.3 * morph})` }}><Burst size={100} t={f + 60} /></div>
      <div style={{ position: "absolute", left: 8, top: -30, opacity: morph, transform: `scale(${0.7 + 0.3 * morph})` }}><FanMark size={160} grow={morph} /></div>
    </div>
  );
  return (
    <Pg bg={L.paper}>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: cta }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: SANS, fontSize: 66, fontWeight: 700, color: L.ink, transform: `scale(${1 + 0.04 * ez(f, 0, 80)})` }}>Ready to build your winning resume?</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontFamily: SANS, fontSize: 29, color: L.muted }}>Use our ATS-friendly LaTeX templates to create a professional resume in minutes.</div>
        <div style={{ position: "absolute", left: 720, top: 636, width: 480, height: 86, borderRadius: 99, background: f > 54 ? L.greenDeep : L.green, color: "#fff", fontFamily: SANS, fontSize: 32, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.04 * ez(f, 56, 5) * (1 - ez(f, 62, 8))})` }}>View Templates</div>
        <Cur x={c.x} y={c.y} click={pulse(f, 58)} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: brand }}>
        <StatusLine size={120} y={520 - 46 * ez(f, 120, 26, IO)} loader={loader} items={[{ text: "Lampzi", at: 100, font: BRAND, weight: 700 }]} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 612, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 40, color: L.ink, opacity: sub, transform: `translateY(${(1 - sub) * 24}px)`, filter: `blur(${(1 - sub) * 6}px)` }}>Build Your Resume That Actually Works</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: SANS, fontSize: 25, color: L.muted, opacity: url, transform: `translateY(${(1 - url) * 18}px)` }}>lampzi.com  ·  Free  ·  Limited offer  ·  No credit card required</div>
      </div>
    </Pg>
  );
};
export { IcoGrid, CX0, NAVX };
