import { interpolate, useCurrentFrame } from "remotion";
import { C, CL, DEPLOYMENTS, DISPLAY, ez, IO, MONO, OUT, pop, SANS, VERDICTS, type Status } from "./brand";
import { cue, scene } from "./timeline";
import { Badge, Barcode, Block, Chip, Drift, Mono, Paper, SiteClip, VerdictCard, Word } from "./parts";

const len = (id: string) => scene(id).end - scene(id).start;

/* 01 — HOOK ------------------------------------------------------------- */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const c = (n: string) => cue("hook", n);
  const logo = pop(f, c("logo"), 40);
  const logoMove = ez(f, 130, 60, IO);
  const card = ez(f, c("card"), 50);
  return (
    <>
      <Paper />
      <Drift len={len("hook")} from={1} to={1.05} dx={-20}>
        {/* badge: slams in centre, then settles top-left */}
        <div style={{ position: "absolute", left: 770 - 788 * logoMove, top: 340 - 398 * logoMove, transform: `scale(${logo * (1 - 0.62 * logoMove)})`, transformOrigin: "50% 50%" }}>
          <Badge size={380} />
        </div>
        <div style={{ position: "absolute", left: 100, top: 60 }}>
          <Mono at={c("is")} size={20} color={C.blue} style={{ marginLeft: 190, marginTop: 56 }}>State-of-the-asset layer</Mono>
        </div>
        <div style={{ position: "absolute", left: 100, top: 235, display: "flex", flexDirection: "column", gap: 4 }}>
          <Word at={c("is")} size={225}>Is it</Word>
          <Word at={c("safe")} size={225} outline>Safe</Word>
          <Word at={c("act")} size={225}>To act?</Word>
        </div>
        {/* right: the 1/15 tile from the site */}
        <Block bg={C.blue} borderColor={C.ink} shadow={16} style={{ position: "absolute", left: 1190, top: 230, width: 560, height: 560, padding: 40, boxSizing: "border-box", opacity: card, transform: `translateY(${(1 - card) * 120}px) rotate(${(1 - card) * 6 - 1.2}deg)` }}>
          <div style={{ position: "absolute", right: 36, top: 36, width: 150, height: 150, borderRadius: 99, background: "#f05d8a", display: "grid", placeItems: "center", color: "#fff", fontSize: 80 }}>✦</div>
          <div style={{ position: "absolute", left: 40, bottom: 170, fontFamily: DISPLAY, color: "#fff", fontSize: 190, lineHeight: 1 }}>
            {Math.round(card) >= 1 || f > c("card") + 50 ? "1" : "0"}<span style={{ fontSize: 80, opacity: 0.8 }}>/15</span>
          </div>
          <div style={{ position: "absolute", left: 44, bottom: 120, fontFamily: MONO, fontSize: 18, color: "#fff", letterSpacing: 2, textTransform: "uppercase" }}>deployments actionable now</div>
          <div style={{ position: "absolute", left: 44, bottom: 88, fontFamily: MONO, fontSize: 16, color: "rgba(255,255,255,0.75)", letterSpacing: 2, textTransform: "uppercase" }}>NYSE · Closed · opens in 6h</div>
          <div style={{ position: "absolute", left: 44, right: 44, bottom: 36 }}><Barcode w={470} h={36} color="#fff" seed="hero" progress={card} /></div>
        </Block>
        <Mono at={c("sub")} size={22} style={{ position: "absolute", left: 104, bottom: 70, maxWidth: 1000, lineHeight: 1.5, textTransform: "none", letterSpacing: 1, fontSize: 26 }}>
          One verdict per token, per chain. A reason. The evidence.
        </Mono>
      </Drift>
    </>
  );
};

/* 02 — BOARD ------------------------------------------------------------ */
const FILTERS: [string, Status | "all"][] = [["All 15", "all"], ["● Open 1", "open"], ["◐ Market closed 5", "closed"], ["▲ Action pending 2", "pending"], ["■ Redemption closed 2", "redemption"], ["◌ Stale 1", "stale"], ["✖ Divergent 4", "divergent"]];

export const Board: React.FC = () => {
  const f = useCurrentFrame();
  const c = (n: string) => cue("board", n);
  const pan = interpolate(f, [c("pan"), len("board")], [0, -210], { ...CL, easing: IO });
  return (
    <>
      <Paper bloom={0.6} y={25} />
      <Drift len={len("board")} from={1.02} to={1.0} dy={0}>
        <div style={{ position: "absolute", left: 100, top: 90, transform: `translateY(${pan}px)` }}>
          <Mono at={c("head")} size={20} color={C.red}>01 ✦ Live verdicts</Mono>
          <Word at={c("head")} size={150} color={C.ink} style={{ marginTop: 6 }}>The Board</Word>
          <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
            {FILTERS.map(([label, st], i) => {
              const p = ez(f, c("head") + 30 + i * 8, 24);
              const bg = st === "all" ? C.ink : VERDICTS[st as Status].chip;
              const fg = st === "all" ? "#fff" : VERDICTS[st as Status].chipFg;
              return (
                <div key={label} style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)`, background: bg, color: fg, fontFamily: MONO, fontWeight: 700, fontSize: 17, letterSpacing: 1.5, padding: "9px 20px", borderRadius: 99, border: `3px solid ${C.ink}`, textTransform: "uppercase" }}>{label}</div>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 400px)", gap: 40, marginTop: 56 }}>
            {DEPLOYMENTS.map((d, i) => {
              const a = c("cards") + i * 45;
              const p = ez(f, a, 36);
              const rot = (i % 2 ? 1 : -1) * (1 - p) * 10;
              return (
                <div key={i} style={{ opacity: p, transform: `perspective(1400px) translateY(${(1 - p) * 220}px) rotateX(${(1 - p) * 38}deg) rotate(${rot}deg) scale(${0.9 + 0.1 * p})`, transformOrigin: "50% 100%" }}>
                  <VerdictCard d={d} w={400} h={340} />
                </div>
              );
            })}
          </div>
        </div>
      </Drift>
    </>
  );
};

/* 03 — SITE (real screen recording) ------------------------------------- */
export const Site: React.FC = () => {
  const f = useCurrentFrame();
  const c = (n: string) => cue("site", n);
  const fr = ez(f, c("frame"), 70);
  const tiltY = interpolate(f, [0, len("site")], [-14, -4], { ...CL, easing: IO });
  const tiltX = interpolate(f, [0, len("site")], [7, 2], { ...CL, easing: IO });
  const z = interpolate(f, [0, len("site")], [0.92, 1.04], { ...CL, easing: IO });
  return (
    <>
      <Paper bloom={0.9} x={72} y={52} />
      <div style={{ position: "absolute", left: 100, top: 210, width: 600 }}>
        <Mono at={c("words")} size={20} color={C.red}>06 ✦ One value</Mono>
        <Word at={c("words")} size={170} color={C.blue} style={{ marginTop: 10 }}>One</Word>
        <Word at={c("words") + 24} size={170} color={C.ink} outline>Value.</Word>
        <Mono at={c("words") + 90} size={24} style={{ marginTop: 40, textTransform: "none", letterSpacing: 0.5, lineHeight: 1.5, fontFamily: SANS, fontWeight: 500 }}>
          Branch on a single value instead of a pile of fields.
        </Mono>
      </div>
      <div style={{ position: "absolute", left: 640, top: 150, opacity: fr, transform: `perspective(2200px) translateX(${(1 - fr) * 400}px) rotateY(${tiltY}deg) rotateX(${tiltX}deg) scale(${z})`, transformOrigin: "30% 50%" }}>
        <SiteClip fromSec={34.5} w={1180} />
      </div>
    </>
  );
};

/* 04 — VERDICT (dark, xTSLA divergent) ----------------------------------- */
export const Verdict: React.FC = () => {
  const f = useCurrentFrame();
  const c = (n: string) => cue("verdict", n);
  const stamp = pop(f, c("stamp"), 30);
  const shake = f > c("stamp") && f < c("stamp") + 14 ? Math.sin(f * 3) * (14 - (f - c("stamp"))) * 0.7 : 0;
  const gauge = ez(f, c("meta"), 80);
  return (
    <>
      <Paper dark />
      <Drift len={len("verdict")} from={1} to={1.05} dx={-30} dy={-10}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(115deg, rgba(229,50,31,0.06) 0 3px, transparent 3px 14px)" }} />
        <div style={{ position: "absolute", left: 110, top: 130, transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
          <Mono at={c("name")} size={20} color={C.red}>Chain SOL · Rebasing · Backed</Mono>
          <Word at={c("name")} size={380} color={C.red} style={{ marginTop: 6, textTransform: "none" }}>xTSLA</Word>
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 14, opacity: stamp, transform: `scale(${stamp}) rotate(${-3 + (1 - stamp) * -10}deg)`, transformOrigin: "0 50%" }}>
            <Chip status="divergent" size={38} />
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.red, border: `4px solid ${C.red}`, padding: "6px 16px", letterSpacing: 4 }}>1 MISMATCH</div>
          </div>
          <Mono at={c("meta")} size={38} color={C.red} style={{ maxWidth: 900, lineHeight: 1.2, marginTop: 40, fontFamily: SANS, fontWeight: 700, textTransform: "none", letterSpacing: 0 }}>
            DIVERGENT · Stock split 3:1 not applied on Solana
          </Mono>
          <div style={{ display: "flex", gap: 70, marginTop: 36 }}>
            {[["Next change", "unknown"], ["Verdict", "Event not reflected"], ["Evidence", "Issuer vs onchain"]].map(([k, v], i) => (
              <div key={k} style={{ opacity: ez(f, c("meta") + 20 + i * 14, 30) }}>
                <div style={{ fontFamily: MONO, fontSize: 14, color: "rgba(229,50,31,0.6)", letterSpacing: 3, textTransform: "uppercase" }}>{k}</div>
                <div style={{ fontFamily: MONO, fontSize: 22, color: C.red, fontWeight: 700, marginTop: 6, textTransform: "uppercase" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 56, width: 560 }}>
            <div style={{ fontFamily: MONO, fontSize: 14, color: "rgba(229,50,31,0.6)", letterSpacing: 3, textTransform: "uppercase" }}>Can I… safe to act</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 100, color: C.red, lineHeight: 1.05 }}>{Math.round(0 * gauge)}%</div>
            <div style={{ height: 14, borderRadius: 99, border: `3px solid ${C.red}`, marginTop: 6 }}><div style={{ width: `${3 + 0 * gauge}%`, height: "100%", background: C.red, borderRadius: 99 }} /></div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 1150, top: 520, opacity: ez(f, c("frame"), 60), transform: `perspective(2000px) translateX(${(1 - ez(f, c("frame"), 60)) * 360}px) rotateY(-9deg) rotateX(3deg)` }}>
          <SiteClip fromSec={17.5} w={680} />
          <Mono at={c("frame")} size={16} color={C.cream} style={{ marginTop: 24 }}>Rewind the tape · Click a block to ask “what did Oryn say then?”</Mono>
        </div>
      </Drift>
    </>
  );
};

/* 05 — GUARD ------------------------------------------------------------- */
export const Guard: React.FC = () => {
  const f = useCurrentFrame();
  const c = (n: string) => cue("guard", n);
  const blocked = pop(f, c("blocked"), 26);
  const hit = f - c("blocked");
  const shake = hit > 0 && hit < 16 ? Math.sin(f * 3.3) * (16 - hit) * 0.8 : 0;
  const fields: [string, string][] = [["Token", "xTSLA"], ["Chain", "SOL"], ["Action", "Swap"]];
  return (
    <>
      <Paper bloom={0.8} x={30} y={60} />
      <Drift len={len("guard")} from={1.03} to={1} dx={0}>
        <div style={{ position: "absolute", left: 110, top: 120, transform: `translate(${shake}px, 0)` }}>
          <Mono at={c("title")} size={20} color={C.red}>05 ✦ Try the guard</Mono>
          <Word at={c("title")} size={170} color={C.ink}>The Guard</Word>
          <Block shadow={14} style={{ marginTop: 40, width: 700, padding: 34, boxSizing: "border-box" }}>
            {fields.map(([k, v], i) => {
              const p = ez(f, c("form") + i * 40, 30);
              return (
                <div key={k} style={{ opacity: p, transform: `translateX(${(1 - p) * -40}px)`, marginBottom: 22 }}>
                  <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: "rgba(13,13,15,0.6)" }}>{k}</div>
                  <div style={{ marginTop: 6, border: `3px solid ${C.ink}`, borderRadius: 10, background: "#fff", fontFamily: MONO, fontWeight: 700, fontSize: 28, padding: "10px 16px" }}>{v}</div>
                </div>
              );
            })}
          </Block>
          <div style={{ marginTop: 50, display: "flex", alignItems: "center", gap: 30, opacity: blocked, transform: `scale(${blocked}) rotate(${-2 + (1 - blocked) * 8}deg)`, transformOrigin: "0 50%" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 230, lineHeight: 1, color: C.red, letterSpacing: 4, border: `10px solid ${C.red}`, padding: "0 36px", borderRadius: 16, background: "rgba(228,223,202,0.85)" }}>BLOCKED</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 960, top: 120, opacity: ez(f, c("form") - 10, 70), transform: `perspective(2200px) translateX(${(1 - ez(f, c("form") - 10, 70)) * 300}px) rotateY(-10deg) rotateX(4deg)` }}>
          <SiteClip fromSec={10.2} w={880} />
        </div>
        <Mono at={c("blocked") + 40} size={24} style={{ position: "absolute", left: 960, top: 720, width: 840, textTransform: "none", letterSpacing: 0.4, lineHeight: 1.5, fontFamily: SANS, fontWeight: 700, fontSize: 36 }}>
          Stock split 3:1 not applied on Solana. Don’t trade the stale multiplier.
        </Mono>
      </Drift>
    </>
  );
};

/* 06 — TIME MACHINE ------------------------------------------------------ */
export const Time: React.FC = () => {
  const f = useCurrentFrame();
  const c = (n: string) => cue("time", n);
  const t = ez(f, c("slider"), 180, IO);
  const stops = ["−1D", "NOW", "NEXT OPEN", "+1D"];
  const hours = (t * 41.25).toFixed(2);
  const sts: Status[] = ["closed", "pending", "divergent", "open"];
  const idx = Math.min(3, Math.floor(t * 4));
  return (
    <>
      <Paper bloom={0.5} />
      <Drift len={len("time")} from={1} to={1.04}>
        <div style={{ position: "absolute", left: 110, top: 140 }}>
          <Mono at={c("head")} size={20} color={C.red}>Time machine</Mono>
          <Word at={c("head")} size={140} color={C.ink}>Replay any moment.</Word>
          <Mono at={c("head") + 40} size={28} style={{ marginTop: 16, textTransform: "none", fontFamily: SANS, fontWeight: 500, letterSpacing: 0 }}>Verdicts, calendar and alerts all follow.</Mono>
        </div>
        <Block bg={C.yellow} shadow={14} style={{ position: "absolute", left: 110, right: 110, top: 610, height: 210, padding: "34px 50px", boxSizing: "border-box", opacity: ez(f, c("slider") - 20, 40) }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: 2 }}>
            <span>TIME MACHINE · 26/10/26 07:59</span>
            <span style={{ background: C.ink, color: C.yellow, padding: "2px 14px", borderRadius: 99 }}>+{hours}h</span>
          </div>
          <div style={{ position: "relative", marginTop: 44, height: 12, background: C.ink, borderRadius: 99 }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${t * 100}%`, background: C.red, borderRadius: 99 }} />
            <div style={{ position: "absolute", left: `${t * 100}%`, top: -18, width: 44, height: 44, marginLeft: -22, borderRadius: 99, background: C.red, border: `6px solid ${C.ink}` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 18, marginTop: 26 }}>
            {stops.map((s, i) => (<span key={s} style={{ opacity: i <= idx ? 1 : 0.4 }}>{s}</span>))}
          </div>
        </Block>
        <div style={{ position: "absolute", right: 130, top: 170, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 18 }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 130, color: VERDICTS[sts[idx]].chip === C.ink ? C.ink : VERDICTS[sts[idx]].chip }}>{DEPLOYMENTS[[0, 2, 1, 7][idx]].sym}</div>
          <Chip status={sts[idx]} size={26} />
        </div>
      </Drift>
    </>
  );
};

/* 07 — END --------------------------------------------------------------- */
export const End: React.FC = () => {
  const f = useCurrentFrame();
  const c = (n: string) => cue("end", n);
  const logo = pop(f, c("logo"), 40);
  return (
    <>
      <Paper bloom={1.2} y={42} />
      <Drift len={len("end")} from={1} to={1.05}>
        <div style={{ position: "absolute", left: 960 - 230, top: 110, transform: `scale(${logo})` }}><Badge size={460} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center" }}>
          <Word at={c("line")} size={110} color={C.blue} style={{ display: "inline-block" }}>State of assets activated</Word>
        </div>
        <Mono at={c("line") + 40} size={24} color={C.ink} style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", textTransform: "none", fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: 0 }}>
          Unknown means not actionable.
        </Mono>
        <Mono at={c("foot")} size={14} color="rgba(13,13,15,0.55)" style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center" }}>
          Oryn © 2026 · MVP · Simulated issuer data · Not investment advice
        </Mono>
      </Drift>
    </>
  );
};

export const SCENES: Record<string, React.FC> = { hook: Hook, board: Board, site: Site, verdict: Verdict, guard: Guard, time: Time, end: End };
export { OUT };
