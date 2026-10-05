/**
 * ILLUSTRATIVE UI DATA — not live markets, not real odds.
 *
 * Polymate has published no market, volume or user statistics, so the video
 * shows example markets only and labels them "Illustrative" on screen.
 * The UI vocabulary (Trade / Markets / Positions / Strategy / Balance,
 * "Live Markets", "Executing Trade…", "Position Opened · YES · $50") is taken
 * from Polymate's own X banner (x.com/Polymatedotfun).
 *
 * Verified facts used in the video (see docs/polymate/SOURCES.md):
 *  - Tagline: "The trading layer for prediction markets."
 *  - "Building tools to trade the future, fast."
 *  - Telegram bot: TryOdds Trading Bot, @Tryoddsbot (t.me/Tryoddsbot)
 */
export const NAV = ["Trade", "Markets", "Positions", "Strategy", "Balance"];

export const MARKETS = [
  {
    category: "Economy",
    question: "Rate cut at the next Fed meeting?",
    yes: 62,
  },
  {
    category: "Crypto",
    question: "Bitcoin at a new all-time high this month?",
    yes: 41,
  },
  {
    category: "Weather",
    question: "Snow in New York on Christmas Day?",
    yes: 27,
  },
] as const;

export const TICKET = {
  question: MARKETS[0].question,
  side: "YES",
  amount: "$50",
};

export const SOURCES = "Sources: x.com/Polymatedotfun · t.me/Tryoddsbot";
