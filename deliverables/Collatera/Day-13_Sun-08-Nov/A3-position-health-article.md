# Reading your position health: buffer, oracle age, LTV

*Collatera · Article 03 · Day 13*

Collatera's terminal ends in one small panel: **Position health**. Three numbers, each answering a different question.

**Buffer: how far are you from liquidation?** It's the distance between where your collateral is valued now and the threshold where the protocol can liquidate. Bigger is calmer. In our simulated demo it reads 14.7%.

**Oracle age: how old is the price that number is based on?** A buffer is only as good as the price under it. If the oracle last updated 89 minutes ago (again, simulated), the buffer is describing the past.

**LTV: how much have you borrowed against what you've posted?** Loan-to-value rises when collateral falls or debt grows. Each market sets its own maximum.

Read them together. A healthy buffer with a fresh oracle is one situation. The same buffer with an old oracle and a closed underlying market is a very different one. That's why Collatera shows price, oracle age and the liquidation line side by side.

Try the read-only demo at **collatera.buzz/app**: paste any Algorand address or use a sample. No keys, no signatures.

*Values shown are simulated demo data. Not financial advice.*
