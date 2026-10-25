# Monitoring first, automation later: how we're building Collatera

*Collatera · Article 04 · Day 15*

There's a version of Collatera that would be easy to announce: connect your wallet, and we'll manage your collateral for you. We're not building that first, on purpose.

**V1 is read-only.** One demo vault modeled on Algorand lending markets. You paste an address or connect a wallet, and Collatera reads public data. We never ask for keys or signatures, never move funds, and never execute anything automatically.

**Why start there?** Because the first problem is awareness: knowing when an oracle is stale, when the underlying market is closed, and how much buffer a gap would eat. That's useful on day one, and it doesn't require anyone to trust us with their money.

**Automation may come later, and conditionally.** One idea is independent operators bonding to execute jobs users explicitly authorize, earning service fees. That needs funding, legal review and independent security checks before it's real.

**The same goes for a token.** Paid usage comes first: subscriptions and B2B accounts fund monitoring. Any token role stays a proposal until usage proves a real network need. Tokens don't guarantee returns or value.

Monitoring first. Automation later. **Catch stale oracles before they catch you.**

→ collatera.buzz

*Not financial advice.*
