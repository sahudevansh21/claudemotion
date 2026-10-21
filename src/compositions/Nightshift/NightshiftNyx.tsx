import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { seconds } from "../../lib/timing";
import { NS, NS_EASE, NS_FONTS } from "./brand";

/**
 * NIGHTSHIFT × Nyx — 10 s text interstitial (1920x1080 @ 30 fps, silent) to
 * cut between screen-recording segments. Styled after the Nyx panel: near-
 * black canvas, copper orb with a sage ring, amber mono status line, light
 * sans body copy.
 */
const NYX = {
  bg: "#0B0D0C",
  copper: "#E59A62",
  copperHi: "#F6C59A",
  copperLo: "#9A4E22",
  amber: "#F0B07A",
  sage: "#9FC2AE",
  sageLo: "#3D5247",
  bubble: "#1C2120",
} as const;

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = (f: number, a: number, d: number, e = NS_EASE.out) => interpolate(f, [a, a + d], [0, 1], { ...CL, easing: e });

/** Rise + de-blur entrance, with an optional matching exit. */
const In: React.FC<{ at: number; out?: number; children: React.ReactNode; dy?: number; style?: React.CSSProperties }> = ({ at, out, children, dy = 40, style }) => {
  const f = useCurrentFrame();
  const t = ez(f, at, 14);
  const o = out === undefined ? 0 : ez(f, out, 10, NS_EASE.inOut);
  return <div style={{ opacity: t * (1 - o), transform: `translateY(${(1 - t) * dy - o * 24}px)`, filter: `blur(${(1 - t) * 10 + o * 8}px)`, ...style }}>{children}</div>;
};

/** Typed mono line with a blinking block caret (the panel's status voice). */
const Typed: React.FC<{ text: string; at: number; cps?: number; size?: number; color?: string }> = ({ text, at, cps = 40, size = 34, color = NYX.amber }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - at) / fps) * cps)));
  const caret = f >= at && (n < text.length || Math.floor(f / 8) % 2 === 0);
  return (
    <div style={{ fontFamily: NS_FONTS.mono, fontSize: size, color, letterSpacing: 1, whiteSpace: "pre" }}>
      {text.slice(0, n)}
      <span style={{ opacity: caret ? 1 : 0 }}>▍</span>
    </div>
  );
};

/** The Nyx orb: copper sphere, mic glyph, sage ring, optional listening pulses. */
const Orb: React.FC<{ size: number; listen?: number }> = ({ size, listen = 0 }) => {
  const f = useCurrentFrame();
  const breathe = 1 + 0.03 * Math.sin(f / 7) * listen;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {[0, 1, 2].map((k) => {
        const p = (((f + k * 14) % 42) / 42) * listen;
        return <div key={k} style={{ position: "absolute", inset: -size * 0.6 * p, borderRadius: "50%", border: `2px solid ${NYX.sage}`, opacity: listen > 0 ? (1 - p / Math.max(listen, 0.001)) * 0.5 : 0 }} />;
      })}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `${size * 0.035}px solid ${NYX.sage}`, boxShadow: `0 0 ${size * 0.35}px color-mix(in srgb, ${NYX.copper} 45%, transparent)` }} />
      <div
        style={{
          position: "absolute",
          inset: size * 0.12,
          borderRadius: "50%",
          transform: `scale(${breathe})`,
          background: `radial-gradient(circle at 38% 32%, ${NYX.copperHi} 0%, ${NYX.copper} 42%, ${NYX.copperLo} 100%)`,
          boxShadow: `inset 0 -${size * 0.05}px ${size * 0.12}px rgba(60,20,0,0.45)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <svg width={size * 0.3} height={size * 0.3} viewBox="0 0 24 24" fill="none" stroke="#1A0E06" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
        </svg>
      </div>
    </div>
  );
};

const Pill: React.FC<{ children: React.ReactNode; on?: boolean }> = ({ children, on }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 28px", borderRadius: 999, border: `2px solid ${on ? NYX.sage : NS.faint}`, background: on ? "color-mix(in srgb, #9FC2AE 14%, transparent)" : "transparent", fontFamily: NS_FONTS.mono, fontSize: 30, color: on ? NS.text : NS.dim }}>
    {children}
  </div>
);

const H: React.CSSProperties = { fontFamily: NS_FONTS.display, fontWeight: 700, fontSize: 120, color: NS.text, letterSpacing: -3, lineHeight: 1.05 };

/* ----------------------------------------------------------------- beats */
const Meet: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const orb = spring({ frame: f - 10, fps, config: { damping: 13, stiffness: 140 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 36 }}>
      <Typed text="NEW IN NIGHTSHIFT" at={0} size={34} />
      <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
        <In at={6} out={d - 10}>
          <div style={{ ...H, fontSize: 168 }}>Meet Nyx.</div>
        </In>
        <div style={{ transform: `scale(${orb})`, opacity: 1 - ez(f, d - 10, 10) }}>
          <Orb size={150} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Talk: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const listen = ez(f, 8, 16);
  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 180px", gap: 140 }}>
      <div style={{ flex: 1 }}>
        <In at={0} out={d - 12}>
          <div style={H}>Tap the orb.</div>
        </In>
        <In at={14} out={d - 12} style={{ marginTop: 34 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: NS_FONTS.sans, fontSize: 56, color: NS.dim }}>
            or hold
            <span style={{ fontFamily: NS_FONTS.mono, fontSize: 40, color: NS.text, padding: "12px 30px", borderRadius: 16, border: `2px solid ${NS.faint}`, borderBottomWidth: f > 30 && f < 40 ? 2 : 7, transform: `translateY(${f > 30 && f < 40 ? 5 : 0}px)` }}>Space</span>
            to talk.
          </div>
        </In>
        <div style={{ marginTop: 44, opacity: 1 - ez(f, d - 12, 10) }}>
          {f >= 26 ? <Typed text="Listening… tap the orb when done" at={26} size={34} /> : null}
        </div>
      </div>
      <In at={4} out={d - 12} dy={0}>
        <Orb size={300} listen={listen} />
      </In>
    </AbsoluteFill>
  );
};

const Ask: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const swap = ez(f, Math.round(d * 0.47), 12, NS_EASE.inOut);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <In at={0} out={d - 10}>
        <div style={{ ...H, textAlign: "center" }}>Ask anything</div>
      </In>
      <In at={8} out={d - 10}>
        <div style={{ position: "relative", height: 150, width: 1500, overflow: "hidden", marginTop: 6 }}>
          {["about Nightshift.", "about the world."].map((w, i) => (
            <div
              key={w}
              style={{
                position: "absolute",
                inset: 0,
                textAlign: "center",
                fontFamily: NS_FONTS.display,
                fontWeight: 700,
                fontSize: 120,
                letterSpacing: -3,
                color: NYX.copper,
                transform: `translateY(${(i - swap) * 150}px)`,
                opacity: i === 0 ? 1 - swap : swap,
              }}
            >
              {w}
            </div>
          ))}
        </div>
      </In>
    </AbsoluteFill>
  );
};

const Voice: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 50 }}>
      <In at={0} out={d - 8}>
        <div style={{ ...H, textAlign: "center" }}>Nyx answers out loud.</div>
      </In>
      <In at={8} out={d - 8}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <Pill on>
            <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={NS.text} strokeWidth={2} strokeLinecap="round">
              <path d="M11 5 6 9H3v6h3l5 4V5z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
            </svg>
            Voice replies on
          </Pill>
          <div style={{ display: "flex", alignItems: "center", gap: 9, height: 90 }}>
            {Array.from({ length: 22 }, (_, i) => {
              const h = 14 + 70 * Math.abs(Math.sin(f / 3.2 + i * 0.7) * Math.sin(f / 7 + i * 0.31));
              return <div key={i} style={{ width: 9, height: h, borderRadius: 5, background: NYX.copper, opacity: 0.55 + 0.45 * (h / 84) }} />;
            })}
          </div>
        </div>
      </In>
    </AbsoluteFill>
  );
};

const Lockup: React.FC<{ d: number }> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const orb = spring({ frame: f, fps, config: { damping: 12, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 50 }}>
        <div style={{ transform: `scale(${orb})` }}>
          <Orb size={210} listen={ez(f, 6, 14) * 0.6} />
        </div>
        <div>
          <In at={4}>
            <div style={{ ...H, fontSize: 190, letterSpacing: -4, lineHeight: 1 }}>Nyx</div>
          </In>
          <In at={10} style={{ marginTop: 14 }}>
            <div style={{ fontFamily: NS_FONTS.sans, fontSize: 48, color: NS.dim }}>Your voice assistant, inside Nightshift.</div>
          </In>
        </div>
      </div>
      <In at={18} style={{ position: "absolute", bottom: 100 }}>
        <div style={{ fontFamily: NS_FONTS.sans, fontSize: 26, color: NS.faint, textAlign: "center" }}>Nyx can&apos;t move money or give personal financial advice.</div>
      </In>
    </AbsoluteFill>
  );
};

/** The panel's chat exchange: user bubble, then Nyx's answer typing in. */
const Chat: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const answer = "Manly is a coastal suburb of Sydney, known for its famous beach, surf culture and the scenic ferry ride from the city centre.";
  const q = spring({ frame: f - 6, fps, config: { damping: 14, stiffness: 160 } });
  const thinking = f >= 22 && f < 34;
  const n = Math.max(0, Math.min(answer.length, Math.floor(((f - 34) / fps) * 70)));
  const panelO = 1 - ez(f, d - 10, 10);
  const bubble: React.CSSProperties = { borderRadius: 28, padding: "26px 34px", fontFamily: NS_FONTS.sans, fontSize: 40, lineHeight: 1.35 };
  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 150px", gap: 100, opacity: panelO }}>
      <div style={{ width: 600 }}>
        <In at={0}>
          <div style={{ ...H, fontSize: 104 }}>Ask it like you&apos;d ask a friend.</div>
        </In>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ alignSelf: "flex-end", ...bubble, background: "color-mix(in srgb, #9FC2AE 12%, #111816)", border: `2px solid ${NYX.sageLo}`, color: NS.text, transform: `scale(${q}) translateY(${(1 - q) * 30}px)`, transformOrigin: "right bottom", opacity: q }}>
          Tell me about Manly.
        </div>
        {f >= 22 ? (
          <div style={{ alignSelf: "flex-start", ...bubble, background: NYX.bubble, color: NS.text, maxWidth: 880, minHeight: 60 }}>
            {thinking ? (
              <span style={{ display: "inline-flex", gap: 12 }}>
                {[0, 1, 2].map((k) => (
                  <span key={k} style={{ width: 14, height: 14, borderRadius: 7, background: NYX.copper, opacity: 0.35 + 0.65 * Math.abs(Math.sin((f + k * 4) / 4)) }} />
                ))}
              </span>
            ) : (
              <>
                {answer.slice(0, n)}
                <span style={{ color: NYX.copper, opacity: n < answer.length || Math.floor(f / 8) % 2 === 0 ? 1 : 0 }}>▍</span>
              </>
            )}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** Voice replies / alerts toggles: "you're in control". */
const Controls: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const alertsOn = f >= 34;
  const press = interpolate(f, [30, 34, 40], [1, 0.92, 1], CL);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 60 }}>
      <In at={0} out={d - 10}>
        <div style={{ ...H, textAlign: "center" }}>You&apos;re in control.</div>
      </In>
      <In at={8} out={d - 10}>
        <div style={{ display: "flex", gap: 30 }}>
          <Pill on>
            <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={NS.text} strokeWidth={2} strokeLinecap="round">
              <path d="M11 5 6 9H3v6h3l5 4V5z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            </svg>
            Voice replies on
          </Pill>
          <div style={{ transform: `scale(${press})` }}>
            <Pill on={alertsOn}>{alertsOn ? "Alerts on" : "Alerts off"}</Pill>
          </div>
        </div>
      </In>
      <In at={16} out={d - 10}>
        <div style={{ fontFamily: NS_FONTS.sans, fontSize: 44, color: NS.dim }}>Voice replies and alerts, one tap each.</div>
      </In>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- timeline */
type BeatList = [string, number, number, React.FC<{ d: number }>][];

/** 10 s cut. */
const BEATS: BeatList = [
  ["Meet", 0, 2.0, Meet],
  ["Talk", 2.0, 2.6, Talk],
  ["Ask", 4.6, 2.4, Ask],
  ["Voice", 7.0, 1.6, Voice],
  ["Lockup", 8.6, 1.4, Lockup],
];

/** 20 s cut: same beats with more air, plus the chat demo and controls. */
const BEATS_20: BeatList = [
  ["Meet", 0, 2.6, Meet],
  ["Talk", 2.6, 3.4, Talk],
  ["Ask", 6.0, 3.0, Ask],
  ["Chat", 9.0, 4.4, Chat],
  ["Voice", 13.4, 2.2, Voice],
  ["Controls", 15.6, 2.2, Controls],
  ["Lockup", 17.8, 2.2, Lockup],
];

const Film: React.FC<{ beats: BeatList }> = ({ beats }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: NYX.bg }}>
      {/* faint grid like the app canvas */}
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${NS.grid} 1px, transparent 1px), linear-gradient(90deg, ${NS.grid} 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.6 }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, color-mix(in srgb, ${NYX.copper} 10%, transparent) 0%, transparent 60%)` }} />
      {beats.map(([name, at, len, Beat]) => (
        <Sequence key={name} name={name} from={seconds(at, fps)} durationInFrames={seconds(len, fps)} premountFor={fps}>
          <Beat d={seconds(len, fps)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const NightshiftNyx: React.FC = () => <Film beats={BEATS} />;
export const NightshiftNyx20: React.FC = () => <Film beats={BEATS_20} />;
