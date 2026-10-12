import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NS, NS_EASE, NS_FONTS } from "../brand";
import { City } from "../components/City";
import { Chip, Mark, typed } from "../components/Ui";
import { cue, ez, lerp } from "../timeline";

const Stack: React.FC<{ words: string[]; at: number[]; align: "left" | "right"; size?: number }> = ({
  words,
  at,
  align,
  size = 200,
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        [align]: 120,
        textAlign: align,
        fontFamily: NS_FONTS.display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.98,
        letterSpacing: -4,
        color: "#FFFFFF",
        textShadow: "0 10px 40px rgba(0,0,0,0.5)",
      }}
    >
      {words.map((w, i) => (
        <div key={w} style={{ opacity: f >= at[i] ? 1 : 0 }}>
          {w}
        </div>
      ))}
    </div>
  );
};

/** 11. Night-city inserts with giant stacked type, then mint chip tags. Hard cuts between three camera set-ups. */
export const CityShot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const swap = cue("city", "swap");
  const chips = cue("city", "chips");
  const setup = f < swap ? 0 : f < chips ? 1 : 2;
  const local = f - [0, swap, chips][setup];
  const cams = [
    { scale: lerp(local / swap, 1.05, 1.15), x: 0, y: 0 },
    { scale: lerp(local / (chips - swap), 2.0, 2.15), x: -180, y: 520 },
    { scale: lerp(local / 45, 1.5, 1.6), x: 300, y: -260 },
  ];
  const chip = (i: number) =>
    spring({ frame: f - chips - i * 5, fps, config: { damping: 10, stiffness: 240 } });
  const out = ez(f, 108, 12, NS_EASE.inOut);
  return (
    <AbsoluteFill style={{ background: NS.bg }}>
      <AbsoluteFill style={{ opacity: 1 - out }}>
        <City cam={cams[setup]} speed={setup === 2 ? 2.4 : 1} />
        {setup === 0 ? (
          <Stack words={["PRICE", "LEND", "GUARD"]} at={[cue("city", "word1"), cue("city", "word2"), cue("city", "word3")]} align="left" />
        ) : null}
        {setup === 1 ? <Stack words={["EVERY", "MINUTE"]} at={[0, 0].map((x) => x + swap)} align="right" size={210} /> : null}
        {setup === 2 ? (
          <div style={{ position: "absolute", right: 260, top: 300, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 18 }}>
            {["NIGHTS", "AND", "WEEKENDS"].map((w, i) => (
              <div key={w} style={{ transform: `scale(${chip(i)}) rotate(${(i - 1) * -3}deg)`, marginRight: [60, 0, 90][i] }}>
                <Chip size={92}>{w}</Chip>
              </div>
            ))}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 12. End card: LIVE ORACLE pill, mark snaps together, wordmark types on, site line + disclaimer. */
export const EndShot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pill = spring({ frame: f - cue("end", "pill"), fps, config: { damping: 11, stiffness: 220 } });
  const mark = spring({ frame: f - cue("end", "mark"), fps, config: { damping: 14, stiffness: 150 } });
  const word = typed("NIGHTSHIFT", f, cue("end", "word"), 2);
  const foot = ez(f, cue("end", "foot"), 16);
  const glow = interpolate(f, [0, 75], [0.6, 1.1]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(20,70,55,${0.55 * glow}) 0%, ${NS.bg} 55%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "absolute", top: 300, transform: `scale(${pill})` }}>
        <Chip size={34}>LIVE ORACLE</Chip>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ transform: `scale(${lerp(mark, 0.5, 1)})` }}>
          <Mark size={170} t={mark} glow={glow} id="end-mark" />
        </div>
        <div
          style={{
            fontFamily: NS_FONTS.word,
            fontSize: 112,
            letterSpacing: 12,
            color: NS.text,
            textShadow: "0 0 34px rgba(111,240,194,0.4)",
            width: 1000,
          }}
        >
          {word}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 700,
          opacity: foot,
          transform: `translateY(${lerp(foot, 16, 0)}px)`,
          fontFamily: NS_FONTS.sans,
          fontSize: 48,
          color: NS.dim,
        }}
      >
        Real prices, every minute.
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 110,
          opacity: foot * 0.8,
          fontFamily: NS_FONTS.mono,
          fontSize: 20,
          letterSpacing: 3,
          color: NS.faint,
        }}
      >
        LIVE PRICES + PAPER-TRADING DEMO · NIGHTSHIFT DOESN'T SELL TOKENS. BUY THEM FROM A REGULATED PROVIDER.
      </div>
    </AbsoluteFill>
  );
};
