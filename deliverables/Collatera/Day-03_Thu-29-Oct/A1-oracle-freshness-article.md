# Why tokenized-stock collateral needs oracle freshness checks

*Collatera · Article 01 · Day 3*

A DeFi loan doesn't see the market. It sees the oracle: the feed that tells the protocol what your collateral is worth. Most of the time the two agree. When they don't, your position can look healthier than it is.

Tokenized stocks and ETFs make this harder. The underlying exchanges close at night and on weekends, issuers have corporate events, and liquidity can thin out fast. An oracle can keep reporting a price that's minutes or hours old while the real-world asset is already moving.

That's what "stale" means: not wrong on purpose, just late. A late price changes your buffer (the distance to your liquidation threshold) without anything on your screen telling you so.

A freshness check is simple in principle: show the price, show how old the oracle's last update is, and show your liquidation line next to both. If the oracle age is climbing while the market moves, you know to look closer before you act.

Collatera puts those three things side by side for supported DeFi loans backed by tokenized stocks and ETFs, starting with a read-only demo vault modeled on Algorand lending markets. No keys, no signatures, no automatic execution. It improves awareness; it doesn't promise protection.

**Catch stale oracles before they catch you.**

→ collatera.buzz

*Not financial advice.*
