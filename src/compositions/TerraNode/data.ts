/**
 * ON-SCREEN COPY + ILLUSTRATIVE UI DATA
 *
 * Verified facts (TerraNode X profile, x.com/terraanode — bio + banner):
 *  - "AI-powered farming, without the internet"
 *  - "Crop disease & pest detection"
 *  - "Smart irrigation • LoRa • Solar"
 *  - "Farmer-approved actions"
 *  - Banner tagline: "Offline Edge-AI for Smarter Farms"
 *  - Banner UI: Soil Moisture 68%, Temperature 24°C, Humidity 56%,
 *    Light 820 lux, Air Quality Good, Leaf Analysis: Healthy
 *
 * No product metrics (farms, accuracy, savings) have been published, so the
 * film shows none. Sensor values are the banner's example values and every
 * UI shot is labelled "Illustrative".
 */
export const CAPTIONS = {
  field: "AI-powered farming,",
  rows: "without the internet.",
  node: "Offline Edge-AI for smarter farms",
  tablet: "Live field readings",
  leaf: "Crop disease & pest detection",
  approve: "Smart irrigation. Farmer-approved actions.",
  network: "LoRa · Solar · No internet needed",
};

export const READINGS = [
  { icon: "soil", label: "Soil Moisture", value: 68, unit: "%" },
  { icon: "temp", label: "Temperature", value: 24, unit: "°C" },
  { icon: "drop", label: "Humidity", value: 56, unit: "%" },
  { icon: "sun", label: "Light", value: 820, unit: " lux" },
  { icon: "air", label: "Air Quality", value: null, unit: "Good" },
] as const;

export const TAGLINE = "Offline Edge-AI for Smarter Farms";
export const HANDLE = "@terraanode";
export const FOOTNOTE =
  "Source: x.com/terraanode · UI and readings shown are illustrative";
