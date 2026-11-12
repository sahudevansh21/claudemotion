import React from "react";
import { makeStill } from "./still";

/** Data-driven X-post engine: each account supplies a Theme (its own fonts, colours, ornaments, visuals) and a 20-item JSON. */
export type Item = { a: string; k: "big" | "qa" | "list" | "vs" | "steps" | "poll" | "quote" | "end"; h: string; hi?: string; s?: string; items?: string[]; v?: string; bg?: string; lab?: string; cap: string; brief?: string };
export type Box = { x: number; y: number; w: number; h: number };
export type Tone = { ink: string; mute: string; accent: string; line: string };
export type Theme = {
  cw: number; lh: number; hMax: number; hMin: number; sCw: number;
  tone: (it: Item) => Tone;
  bg: (n: number, it: Item) => React.ReactNode;
  foot: (n: number, it: Item) => React.ReactNode;
  lab: (t: string, tone: Tone) => React.ReactNode;
  h: (fs: number, tone: Tone) => React.CSSProperties;
  accent: (t: string, tone: Tone) => React.ReactNode;
  s: (fs: number, tone: Tone) => React.CSSProperties;
  num: (i: number, tone: Tone) => React.ReactNode;
  opt: (i: number, t: string, w: number, h: number, tone: Tone) => React.ReactNode;
  card: (children: React.ReactNode, box: Box, tone: Tone, i: number) => React.ReactNode;
  vis: (v: string, box: Box, it: Item, tone: Tone) => React.ReactNode;
  end: (it: Item, n: number) => React.ReactNode;
};

const lines = (text: string, fs: number, cw: number, width: number) => {
  let n = 1, cur = 0;
  for (const part of text.split("\n")) {
    if (part !== text.split("\n")[0]) { n++; cur = 0; }
    for (const w of part.split(" ")) {
      const wl = w.length * cw * fs; const sp = cur ? cw * fs * 0.55 : 0;
      if (cur && cur + sp + wl > width) { n++; cur = wl; } else cur += sp + wl;
    }
  }
  return n;
};
const longest = (t: string) => Math.max(...t.split(/\s+/).map((w) => w.length));
export const fit = (text: string, th: Theme, maxH: number, width = 940) => {
  for (let fs = th.hMax; fs >= th.hMin; fs -= 2) {
    if (longest(text) * th.cw * fs * 1.06 > width) continue;
    const l = lines(text, fs, th.cw * 1.06, width);
    if (l * fs * th.lh <= maxH) return { fs, l, h: l * fs * th.lh };
  }
  return { fs: th.hMin, l: lines(text, th.hMin, th.cw * 1.06, width), h: lines(text, th.hMin, th.cw * 1.06, width) * th.hMin * th.lh };
};
const HM: Record<Item["k"], number> = { big: 460, qa: 340, list: 270, vs: 270, steps: 270, poll: 340, quote: 640, end: 400 };

const Post: React.FC<{ it: Item; n: number; th: Theme }> = ({ it, n, th }) => {
  if (it.k === "end") return <>{th.bg(n, it)}{th.end(it, n)}{th.foot(n, it)}</>;
  const tone = th.tone(it);
  const hf = fit(it.h, th, HM[it.k]);
  const top = it.k === "quote" ? 230 : 150;
  const body = top + hf.h + 56;
  const bottom = 1215;
  const heading = (
    <div style={{ ...th.h(hf.fs, tone), position: "absolute", left: 70, width: 940, top, lineHeight: th.lh, whiteSpace: "pre-line" }}>
      {it.hi && it.h.includes(it.hi) ? <>{it.h.split(it.hi)[0]}{th.accent(it.hi, tone)}{it.h.split(it.hi).slice(1).join(it.hi)}</> : it.h}
    </div>
  );
  const sFs = it.k === "qa" ? 46 : 38;
  const sL = it.s ? lines(it.s, sFs, th.sCw, 940) : 0; const sH = sL * sFs * 1.3 + 10;
  let content: React.ReactNode = null;
  if (it.k === "big" || it.k === "quote") {
    content = (<>
      {it.s && <div style={{ ...th.s(sFs, tone), position: "absolute", left: 70, width: 900, top: it.k === "quote" ? body + 20 : body }}>{it.s}</div>}
      {it.v && body + sH + 40 < bottom - 220 && th.vis(it.v, { x: 70, y: body + sH + 40, w: 940, h: bottom - (body + sH + 40) }, it, tone)}
    </>);
  } else if (it.k === "qa") {
    content = (<>
      <div style={{ position: "absolute", left: 70, right: 70, top: body, borderTop: `2px solid ${tone.line}` }} />
      <div style={{ ...th.s(sFs, tone), position: "absolute", left: 70, width: 940, top: body + 36 }}>{it.s}</div>
      {it.v && body + sH + 90 < bottom - 200 && th.vis(it.v, { x: 70, y: body + sH + 90, w: 940, h: bottom - (body + sH + 90) }, it, tone)}
    </>);
  } else if (it.k === "list" || it.k === "steps") {
    const rows = it.items ?? []; const vh = it.v ? 260 : 0; const rh = Math.min(170, (bottom - body - vh) / rows.length);
    content = (<>
      {rows.map((r, i) => (
        <div key={i} style={{ position: "absolute", left: 70, right: 70, top: body + i * rh, height: rh, borderTop: `2px solid ${tone.line}`, display: "flex", alignItems: "center", gap: 28 }}>
          {th.num(i, tone)}<div style={{ ...th.s(Math.min(46, rh * 0.36), tone), flex: 1, lineHeight: 1.15 }}>{r}</div>
        </div>
      ))}
      {it.v && th.vis(it.v, { x: 70, y: bottom - vh + 10, w: 940, h: vh - 10 }, it, tone)}
    </>);
  } else if (it.k === "vs") {
    const hh = bottom - body - 20;
    content = (<>{(it.items ?? []).slice(0, 2).map((r, i) => {
      const [t, d] = r.split("|");
      return th.card(<><div style={{ ...th.s(34, tone), fontWeight: 700, opacity: 0.8, textTransform: "uppercase", letterSpacing: 3, fontSize: 24 }}>{t}</div><div style={{ ...th.s(40, tone), marginTop: 22, lineHeight: 1.25 }}>{d}</div></>, { x: 70 + i * 480, y: body, w: 460, h: hh }, tone, i);
    })}</>);
  } else if (it.k === "poll") {
    const o = it.items ?? []; const oh = Math.min(150, (bottom - body - 60) / o.length - 18);
    content = (<>
      {o.map((t, i) => <div key={i} style={{ position: "absolute", left: 70, top: body + i * (oh + 18), width: 940, height: oh }}>{th.opt(i, t, 940, oh, tone)}</div>)}
      <div style={{ ...th.s(26, tone), position: "absolute", left: 70, top: body + o.length * (oh + 18) + 14, opacity: 0.7 }}>{it.s ?? "Reply with your pick."}</div>
    </>);
  }
  return <>{th.bg(n, it)}{th.lab(it.lab ?? it.a, tone)}{heading}{content}{th.foot(n, it)}</>;
};
export const makeAccount = (th: Theme, items: Item[], bg: string) => makeStill(items.map((it, i) => () => <Post it={it} n={i + 1} th={th} />), bg);
