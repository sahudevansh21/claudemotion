import { random, useCurrentFrame } from "remotion";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/<>[]=+";

/** Decode timing shared with the audio script: one character every STEP frames. */
export const CHAR_STEP = 1.2;
const SETTLE = 5; // frames of random glyphs before a character locks
const OUT_LEN = 18; // frames for the scramble-out

/**
 * Minimal mono caption in the reference's style: characters decode in behind a
 * block cursor, [bracketed] words get a white highlight box, then the line
 * scrambles out right-to-left through grey glitch blocks.
 */
export const DecodeCaption: React.FC<{
  text: string;
  at: number;
  out?: number;
  size?: number;
  seed?: string;
  /** "light" = white type (dark plates); "dark" = ink type (marble). */
  tone?: "light" | "dark";
  style?: React.CSSProperties;
}> = ({ text, at, out = Infinity, size = 30, seed = "c", tone = "light", style }) => {
  const ink = tone === "light" ? "#FFFFFF" : "#1A1612";
  const boxBg = tone === "light" ? "#F4EFE6" : "#1A1612";
  const boxInk = tone === "light" ? "#141414" : "#F4EFE6";
  const f = useCurrentFrame();
  // Parse [highlight] spans.
  const chars: { ch: string; hi: boolean }[] = [];
  let hi = false;
  for (const ch of text) {
    if (ch === "[") hi = true;
    else if (ch === "]") hi = false;
    else chars.push({ ch, hi });
  }
  const n = chars.length;
  const typedEnd = at + n * CHAR_STEP + SETTLE;
  const box = Math.min(1, Math.max(0, (f - typedEnd) / 8));
  const outP = Math.min(1, Math.max(0, (f - out) / OUT_LEN));
  const visible = Math.ceil(n * (1 - outP));
  if (f < at || visible <= 0) return null;
  const firstHi = chars.findIndex((c) => c.hi);
  const lastHi = chars.length - 1 - [...chars].reverse().findIndex((c) => c.hi);
  const cursorAt = Math.floor((f - at) / CHAR_STEP);
  return (
    <div
      style={{
        fontFamily: "Silkscreen, 'JetBrains Mono', monospace",
        fontSize: size,
        letterSpacing: size * 0.32,
        color: ink,
        whiteSpace: "pre",
        display: "flex",
        alignItems: "center",
        textShadow: tone === "light" ? "0 1px 12px rgba(0,0,0,0.35)" : "none",
        ...style,
      }}
    >
      {chars.slice(0, visible).map((c, i) => {
        const appear = at + i * CHAR_STEP;
        if (f < appear) return null;
        const settling = f < appear + SETTLE;
        const glitchOut = outP > 0 && i >= visible - 4;
        const g = GLYPHS[Math.floor(random(`${seed}-${i}-${f}`) * GLYPHS.length)];
        const shown = c.ch === " " ? " " : settling || glitchOut ? g : c.ch;
        const inBox = firstHi >= 0 && i >= firstHi && i <= lastHi && outP === 0;
        // Highlight box wipes in left → right across the bracketed span.
        const boxCovers = inBox && (i - firstHi + 1) / (lastHi - firstHi + 1) <= box + 1e-6;
        return (
          <span
            key={i}
            style={{
              background: glitchOut
                ? "rgba(200,200,200,0.35)"
                : boxCovers
                  ? boxBg
                  : "transparent",
              color: boxCovers ? boxInk : ink,
              opacity: settling && !boxCovers ? 0.7 : 1,
              textShadow: boxCovers ? "none" : undefined,
              padding: "0.08em 0",
            }}
          >
            {shown}
          </span>
        );
      })}
      {cursorAt < n + 2 && outP === 0 ? (
        <span
          style={{
            display: "inline-block",
            width: size * 0.62,
            height: size * 0.95,
            background: ink,
            opacity: Math.floor(f / 8) % 2 === 0 ? 1 : 0.4,
          }}
        />
      ) : null}
    </div>
  );
};

/** Characters in a caption (brackets excluded) — used for tick timing. */
export const captionLength = (text: string) => text.replace(/[[\]]/g, "").length;
