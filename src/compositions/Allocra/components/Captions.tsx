import { useCurrentFrame } from "remotion";
import { AL_FONTS, TIMELINE, VO, ez } from "../brand";
import { LETTERBOX } from "./Cinema";

/**
 * Voiceover subtitles, styled like the reference: act 1 in serif italic
 * (narration), acts 2–3 in a light sans. Timed from timeline.json + vo.json,
 * so they always match the generated voice. Uses the composition-level frame.
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = TIMELINE.fps;
  const active = TIMELINE.vo.find((v) => {
    const end = v.at + Math.round(VO[v.id].seconds * fps) + 10;
    return frame >= v.at - 2 && frame < end;
  });
  // Act 3 (end card) carries its own type — no subtitle over the lock-up.
  if (!active || active.act === 3) return null;
  const end = active.at + Math.round(VO[active.id].seconds * fps) + 10;
  const o = ez(frame, active.at - 2, 8) * (1 - ez(frame, end - 8, 8));
  const act1 = active.act === 1;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: LETTERBOX + 46,
        textAlign: "center",
        opacity: o,
        fontFamily: act1 ? AL_FONTS.serif : AL_FONTS.sans,
        fontStyle: act1 ? "italic" : "normal",
        fontWeight: act1 ? 400 : 300,
        fontSize: act1 ? 50 : 44,
        letterSpacing: act1 ? 0 : 0.3,
        color: "rgba(255,248,240,0.95)",
        textShadow: "0 2px 18px rgba(0,0,0,0.7)",
      }}
    >
      {VO[active.id].text}
    </div>
  );
};
