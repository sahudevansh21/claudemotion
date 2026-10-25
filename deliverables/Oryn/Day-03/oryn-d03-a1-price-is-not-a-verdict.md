# Price is not a verdict

A price feed answers one question: what is this token worth? Whether it is safe to act on is a different question, and a price alone can't answer it.

A tokenised stock can show a perfectly normal price while the exchange is closed, while a split has not been applied on one chain, or while a fund's redemption window is shut. To a price-only integration, every one of those looks fine.

Three examples from the Oryn board:

**xTSLA on Solana is Divergent.** Stock split 3:1 not applied on Solana. The token's onchain state no longer matches the issuer's.

**BUIDL on Ethereum and Arbitrum is Redemption closed.** The fund redemption window is shut; collateral cannot be redeemed at published NAV. The window opens in 6h.

**dMSFT on Arbitrum is Stale.** Arbitrum head is not advancing. This is not a market closure, so it should not be treated as a weekend freeze.

None of these is a pricing problem, and none of them shows up in a price. Each one is a question about whether it is safe to act right now.

Oryn collapses that question into one value per token, per chain, with the reason and the evidence beside it, so you can branch on a single value instead of a pile of fields. And when Oryn can't tell, the rule is simple: unknown means not actionable.

*Simulated issuer data · Not investment advice*
