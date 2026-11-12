import { makeFilm, type Film } from "./engine";
import * as T from "./themes";
import oryn from "./data/oryn.json";
import allocra from "./data/allocra.json";
import collatera from "./data/collatera.json";
import quantora from "./data/quantora.json";
import aegis from "./data/aegis.json";
import safefi from "./data/safefi.json";
import argus from "./data/argus.json";
import terranode from "./data/terranode.json";
import desci from "./data/desci.json";
import polymate from "./data/polymate.json";
import vybe from "./data/vybe.json";

const mk = (id: string, th: Parameters<typeof makeFilm>[0], d: unknown) => makeFilm(th, d as Film, `xfilms/${id}.wav`);
export const FILMS: { id: string; name: string; frames: number; C: React.FC }[] = [
  { id: "oryn", name: "ORYN", frames: oryn.durationInFrames, C: mk("oryn", T.oryn, oryn) },
  { id: "allocra", name: "Allocra", frames: allocra.durationInFrames, C: mk("allocra", T.allocra, allocra) },
  { id: "collatera", name: "Collatera", frames: collatera.durationInFrames, C: mk("collatera", T.collatera, collatera) },
  { id: "quantora", name: "Quantora", frames: quantora.durationInFrames, C: mk("quantora", T.quantora, quantora) },
  { id: "aegis", name: "AegisNet", frames: aegis.durationInFrames, C: mk("aegis", T.aegis, aegis) },
  { id: "safefi", name: "SafeFi", frames: safefi.durationInFrames, C: mk("safefi", T.safefi, safefi) },
  { id: "argus", name: "Argus", frames: argus.durationInFrames, C: mk("argus", T.argus, argus) },
  { id: "terranode", name: "TerraNode", frames: terranode.durationInFrames, C: mk("terranode", T.terranode, terranode) },
  { id: "desci", name: "DeSci", frames: desci.durationInFrames, C: mk("desci", T.desci, desci) },
  { id: "polymate", name: "PolyMate", frames: polymate.durationInFrames, C: mk("polymate", T.polymate, polymate) },
  { id: "vybe", name: "VYBE", frames: vybe.durationInFrames, C: mk("vybe", T.vybe, vybe) },
];
