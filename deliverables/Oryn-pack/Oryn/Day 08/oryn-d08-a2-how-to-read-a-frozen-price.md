# How to read a frozen price

Two things look identical on a chart: a flat line because the market is closed, and a flat line because the chain stopped. They call for opposite responses.

**Market closed.** When the underlying exchange is closed, the oracle price is frozen at the last close, as expected. Nothing is wrong. oNVDA on Ethereum and Base and oQQQ on Ethereum show this today, with the market opening in 6h. dMSFT on Base is the same: Market closed.

**Stale.** When a chain's head stops advancing, the price stops moving for a very different reason. dMSFT on Arbitrum is Stale: Arbitrum head is not advancing. Not a market closure; do not treat it as a weekend freeze.

Same token, same flat line, two different verdicts. One is a normal pause that ends when the market opens. The other is a chain problem that you should not wait out on the assumption that it is a weekend.

A chart alone cannot separate them. Oryn does: one verdict per token, per chain, with the reason alongside, so a frozen price is never mistaken for a broken one, or the other way round.

*Simulated issuer data · Not investment advice*
