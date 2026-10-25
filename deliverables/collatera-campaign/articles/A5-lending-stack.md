# Where tokenized collateral lives: the lending stack, mapped

*Collatera · Article 05 · Day 10*

Tokenized stocks don't sit still. Once they're on-chain, they flow into a stack of lending venues, and each layer adds its own risk to watch.

**Lending markets** like Aave and Euler let you borrow against collateral. Aave is the largest on-chain money market; Euler uses modular credit vaults, each with its own LTVs and the oracles each vault depends on.

**Lending networks** like Morpho run isolated, fixed-parameter markets. What matters there is the distance to each market's LLTV and the freshness of its price feed.

**Curators** like Sentora choose and manage markets on top of Aave and Morpho, so following the curator's markets matters as much as the base protocol.

**Settlement layers** matter too. Robinhood Chain, an Arbitrum-based Ethereum L2 built for tokenized stocks, is where tokenized equity collateral trades and settles, and where Morpho-powered lending is live.

Collatera tracks collateral risk across this stack.

*These venues are coverage targets shown with public data. Collatera is not affiliated with or endorsed by these projects. Which protocols are live on Robinhood Chain varies, so check each venue before relying on it. Not financial advice.*

→ collatera.buzz
