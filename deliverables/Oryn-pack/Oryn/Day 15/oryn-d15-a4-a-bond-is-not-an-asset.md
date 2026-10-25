# A bond is not an asset

A bond proves skin in the game, not that an offchain asset exists.

Tokenised assets promise exposure to something offchain: a share, a fund unit, a treasury. An issuer can post collateral or a bond to show commitment, and that is useful. It is not proof that the underlying asset exists, or that what is onchain matches what the issuer holds.

Those are two separate questions, and only the second can be checked continuously: does the onchain state match the issuer's state, right now?

That is the question Oryn is built around. For each token on each chain it compares the two and returns a single verdict. **Open** means the onchain state matches the issuer: redemptions open, NAV fresh. **Divergent** means it doesn't, for example a 3:1 stock split that has not been applied on Solana. And where Oryn can't tell, it doesn't guess: unknown means not actionable.

A bond can show that an issuer has something to lose. A verdict shows whether it is safe to act on the token in front of you.

*Simulated issuer data · Not investment advice*
