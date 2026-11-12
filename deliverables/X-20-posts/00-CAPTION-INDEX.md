# Caption index: 20 posts x 10 accounts (drafts, not published)

Files: `<Account>/<Account>-NN.jpg` (2160x2700, 4:5). Captions are standalone, all under 280 characters. Threads: none proposed.


## ORYN (@oryn_io)

_Cream stock, cyan halftone, navy/yellow/red flat colour, Anton + Space Grotesk. Facts from the Oryn board (simulated issuer data)._

- **01** `ORYN/ORYN-01.jpg` [Education] Closed and stale can look identical on a chart: a flat price. Closed means the exchange is shut and a frozen oracle price is expected. Stale means the feed stopped advancing when it should not have. Oryn gives each its own verdict. Board data is simulated.
- **02** `ORYN/ORYN-02.jpg` [Education] Not every tokenized asset follows its underlying the same way. Oryn's issuer models: rebasing (Backed xStocks), total-return (Ondo Global Markets), stablecoin (Dinari dShares) and NAV (Securitize BUIDL, Superstate USTB). Worth knowing before you act on one.
- **03** `ORYN/ORYN-03.jpg` [Education] Corporate actions 101: when a stock splits, its tokenized versions have to catch up on every chain. Board example (simulated data): oNFLX, 10:1 split not applied on Ethereum or Base. Oryn marks that as Divergent.
- **04** `ORYN/ORYN-04.jpg` [Education] Redemption windows matter for anything held as collateral. Board example (simulated): BUIDL, redemption window shut, collateral cannot be redeemed at published NAV, window opens in 6h. Oryn calls that Redemption closed.
- **05** `ORYN/ORYN-05.jpg` [Education] NAV funds don't tick like stocks. They publish a net asset value at set times, called a NAV strike. Board example (simulated): USTB on Ethereum, redemptions open, NAV fresh, NAV strike in 13h. Verdict: Open.
- **06** `ORYN/ORYN-06.jpg` [Product] The Time Machine lets you replay any moment. Verdicts, calendar and alerts all follow. Jump between -1D, NOW, NEXT OPEN and +1D and see the board as it stood. Simulated issuer data. Not investment advice.
- **07** `ORYN/ORYN-07.jpg` [Product] Oryn has seven sections: Board, Asset, Lookahead, Divergence, Wallet, Guard and API. All built around one question: is it safe to act on this token right now?
- **08** `ORYN/ORYN-08.jpg` [Product] Board snapshot, simulated issuer data: 15 deployments, 1 actionable now. Open 1, Market closed 5, Action pending 2, Redemption closed 2, Stale 1, Divergent 4. A price alone wouldn't tell you that.
- **09** `ORYN/ORYN-09.jpg` [Product] Lookahead: every verdict comes with what happens next. Board examples (simulated): market opens in 6h, event effective in 38h, redemption window opens in 6h, NAV strike in 13h.
- **10** `ORYN/ORYN-10.jpg` [Community question] Community question: before you act on a tokenized asset, which check do you run first? A) Market session B) Corporate action C) Redemption window D) Data freshness. Tell us why in the replies.
- **11** `ORYN/ORYN-11.jpg` [Community question] Examples from the simulated board: a stock split not applied on one chain, a DEX price drifting above reference, a dividend multiplier not yet applied. Which would you most want flagged before you act? A, B, C or D?
- **12** `ORYN/ORYN-12.jpg` [Community question] Question for builders: when the underlying market is closed, should an app block the action, or show the verdict and let the user decide? A) Block B) Flag C) Depends on the asset D) Depends on the action.
- **13** `ORYN/ORYN-13.jpg` [Opinion] Our take: a price is a number. A verdict is something you can branch on. One value, a reason and the evidence is easier to get right than a pile of fields.
- **14** `ORYN/ORYN-14.jpg` [Opinion] A rule worth keeping: when the state is unknown, the answer is not 'probably fine'. Unknown means not actionable. Systems that touch tokenized assets should fail closed.
- **15** `ORYN/ORYN-15.jpg` [Opinion] Easy to mix up: a bond shows the issuer has something at stake. It does not prove the offchain asset behind a token exists. Keep the two ideas separate when you assess collateral.
- **16** `ORYN/ORYN-16.jpg` [Use case] Use case (hypothetical): a lender is about to accept a tokenized stock as collateral. The question is not only 'what is the price?' but 'is it safe to act right now?' Open, Market closed and Divergent each change the answer.
- **17** `ORYN/ORYN-17.jpg` [Use case] Use case (hypothetical): a wallet reads the verdict before an action. Stale feed? Show a warning. Market closed? Say when it opens. Open? Stay out of the way. Illustration only, not a statement about any specific wallet.
- **18** `ORYN/ORYN-18.jpg` [Use case] Use case (hypothetical): a venue lists tokenized stocks. After the closing bell, frozen quotes are expected. A feed that stops advancing while the market is open is not. Telling the two apart is the job.
- **19** `ORYN/ORYN-19.jpg` [Brand story] Most tools start from price. Oryn starts from the question that comes after it: is it safe to act on this token right now? Verdicts, reasons, evidence and the Time Machine all follow from that.
- **20** `ORYN/ORYN-20.jpg` [Brand story] Real-time intelligence for tokenized assets. Oryn tracks corporate actions, market sessions, redemption windows and data freshness across issuers and chains, as one live status per asset. MVP, simulated issuer data. oryn.solrun.fun

## Allocra (@allocraa)

_Vermilion/dark/cream, Instrument Serif + DM Sans, old-master paintings and real Preview UI screenshots._

- **01** `Allocra/Allocra-01.jpg` [Brand story] Old masters. New allocation. Every great portfolio, like every great painting, is a series of deliberate choices. Allocra borrows the patience of the old masters for the way you invest.
- **02** `Allocra/Allocra-02.jpg` [Education] Two things that get mixed up. Concentration: how much of a basket sits in one position or issuer. Overlap: the same holdings appearing in more than one fund. Allocra shows both before you confirm.
- **03** `Allocra/Allocra-03.jpg` [Education] A quote is the price you are shown. Trading costs are what it takes to act on it. Allocra puts both next to your plan, so you see concentration, overlap, quotes and trading costs before you confirm.
- **04** `Allocra/Allocra-04.jpg` [Education] Allocation is how your money is split. Selection is which things you pick inside each slice. Allocra starts with the first: plan a tokenized ETF basket around the positions you actually want to own.
- **05** `Allocra/Allocra-05.jpg` [Product] Plan first. The allocation slate in the TestNet demo shows a sample Core allocation across 3 ETFs: US equity 55%, International equity 25%, US bonds 20%. Preview data. Assets remain individually held until you approve a trade.
- **06** `Allocra/Allocra-06.jpg` [Product] Build a basket that feels like yours. In the TestNet demo, adjust target weights and watch the basket diagnostics respond. Preview data, not investment advice.
- **07** `Allocra/Allocra-07.jpg` [Product] Look beneath the percentages. Portfolio diagnostics in the Preview cover largest issuer, holding overlap and estimated trading cost. Sample values from the TestNet demo.
- **08** `Allocra/Allocra-08.jpg` [Product] Your portfolio, in perspective. The overview page brings together your allocation, the portfolio path and the checks to run before you trade. Preview / TestNet demo.
- **09** `Allocra/Allocra-09.jpg` [Product] Plan first. Assets remain individually held until you approve a trade. Allocra is a planning desk: nothing moves until you say so. TestNet demo.
- **10** `Allocra/Allocra-10.jpg` [Community question] Community question: before you confirm a trade, what do you check first? A) Concentration B) Overlap C) Quotes D) Trading costs. Tell us what you look at and why.
- **11** `Allocra/Allocra-11.jpg` [Community question] The allocation slate has three tabs: Income, Core and Growth. Which one do you plan first? A) Income B) Core C) Growth D) All three together.
- **12** `Allocra/Allocra-12.jpg` [Opinion] A default is just a decision someone else made for you. Allocation is better made on purpose. Plan clearly. Act deliberately.
- **13** `Allocra/Allocra-13.jpg` [Opinion] Volatility is part of the story. A portfolio looked at only when it is calm hides the chapters that test it. Hold steady, and plan for the whole book.
- **14** `Allocra/Allocra-14.jpg` [Opinion] Past performance tells you what happened, not what will. Know the risk before you act. Strategy over reaction.
- **15** `Allocra/Allocra-15.jpg` [Use case] Use case (hypothetical): you plan a monthly purchase of $1,200 and split it across the weights you chose. The demo slate shows the monthly purchase and an estimated annual cost before you confirm. Preview data.
- **16** `Allocra/Allocra-16.jpg` [Use case] Use case (hypothetical): you are about to add another fund to a basket. Check overlap first: does it share holdings with what you already own? Concentration and overlap are on the page before you confirm.
- **17** `Allocra/Allocra-17.jpg` [Brand story] Every move is a decision. Strategy over reaction. Plan the position, check the numbers, then act on purpose.
- **18** `Allocra/Allocra-18.jpg` [Brand story] Private allocation desk / 01. Your assets. Your allocation. Plan a tokenized ETF basket around the positions you actually want to own.
- **19** `Allocra/Allocra-19.jpg` [Education] Allocra tracks the protocols that bring real-world assets onchain, with links so you can check each profile yourself. Names belong to their owners. Not affiliated with, sponsored or endorsed by these protocols.
- **20** `Allocra/Allocra-20.jpg` [Brand story] Allocra: a tokenized ETF basket planned around the positions you actually want to own. See concentration, overlap, quotes and trading costs before you confirm. Preview / TestNet demo. allocra.buzz

## Collatera (@collatera_io)

_Night-green pixel world, lime Silkscreen type, mascot, offset-shadow panels. All gauges illustrative._

- **01** `Collatera/Collatera-01.jpg` [Education] A stale oracle is a price feed that stopped updating. The market keeps moving; the number on your screen doesn't. That gap is where collateral risk can hide. Collatera watches price freshness. Illustrative graphic.
- **02** `Collatera/Collatera-02.jpg` [Education] A collateral buffer is the room a position has before it needs attention. It is one of three things Collatera watches, with price freshness and closed-market liquidity risk. Gauges shown are illustrative.
- **03** `Collatera/Collatera-03.jpg` [Education] Tokenized stocks follow markets that close. Prices can gap between market close and the next open, and onchain collateral doesn't pause. Closed-market liquidity risk is one of the three things Collatera monitors. Illustrative.
- **04** `Collatera/Collatera-04.jpg` [Education] A stress test asks 'what if?' without predicting. Drag the price down 20% and see what it does to the position. A user-chosen scenario, not a forecast. Illustrative.
- **05** `Collatera/Collatera-05.jpg` [Education] Three checks for a loan backed by tokenized stocks or ETFs: 1) the buffer 2) price freshness 3) closed-market liquidity risk. Collatera monitors all three, read-only.
- **06** `Collatera/Collatera-06.jpg` [Education] Fresh: the feed is updating on schedule. Stale: the feed stopped, and the numbers still look calm. They may be old. Telling them apart is the point of price-freshness monitoring.
- **07** `Collatera/Collatera-07.jpg` [Product] Collatera's workflow: Monitor the position. Stress test the price. Get alerts. Preview repayment. See it, understand it, then decide.
- **08** `Collatera/Collatera-08.jpg` [Product] Collatera is read-only risk monitoring. Preview only: no transaction is sent, and you decide. It watches; it doesn't move funds.
- **09** `Collatera/Collatera-09.jpg` [Product] Before you repay, preview it. Collatera's last workflow step shows what a repayment would do to the position. Preview only: no transaction is sent. Illustrative gauges.
- **10** `Collatera/Collatera-10.jpg` [Product] Demo v1 is a demo vault modelled on Algorand lending markets, built to show how collateral monitoring works. Demo data only, starting on Algorand.
- **11** `Collatera/Collatera-11.jpg` [Community question] Community question: you open a loan backed by tokenized assets. What do you check first? A) Buffer B) Price freshness C) Market hours D) Repayment path. Tell us why in the replies.
- **12** `Collatera/Collatera-12.jpg` [Community question] If you could only get one alert, which would it be? A) Stale price B) Low buffer C) Market about to close D) Market about to open. Collatera is about getting the right signal early.
- **13** `Collatera/Collatera-13.jpg` [Community question] Prices can gap between market close and the next open. Do you price that in when you borrow against tokenized stocks? A) Always B) Sometimes C) Never thought about it D) What gap?
- **14** `Collatera/Collatera-14.jpg` [Opinion] Our take: a risk dashboard that only alarms makes you anxious, not informed. See it. Understand it. Then decide. That is the order we prefer.
- **15** `Collatera/Collatera-15.jpg` [Opinion] Our take: collateral risk isn't only about what the price is. It's about how fresh the price is, and whether the market behind it is even open.
- **16** `Collatera/Collatera-16.jpg` [Use case] Use case (hypothetical): a borrower with a loan backed by tokenized stocks checks the buffer and closed-market risk before the market closes for the weekend. Illustrative graphic.
- **17** `Collatera/Collatera-17.jpg` [Use case] Use case (hypothetical): an analyst compares two price feeds. Which is fresh, and which only looks calm? Price-freshness monitoring answers that at a glance. Illustrative.
- **18** `Collatera/Collatera-18.jpg` [Brand story] We start with seeing. A read-only monitor puts understanding before any action: monitoring first, automation later.
- **19** `Collatera/Collatera-19.jpg` [Brand story] Built in pixels, watching in real time. Collatera monitors collateral risk across DeFi and tokenized assets, with real-time signals for smarter risk decisions.
- **20** `Collatera/Collatera-20.jpg` [Brand story] Collatera: monitoring collateral risk across DeFi and tokenized assets. Real-time signals. Smarter risk decisions. Read-only, starting on Algorand with Demo v1. collatera.buzz

## Quantora (@Quantora_Labs)

_Warm paper, Newsreader + Jost, mono labels, fine charts. Every chart is synthetic and labelled._

- **01** `Quantora/Quantora-01.jpg` [Education] Drawdown: the fall from a peak to the next low. It tells you how much you could have lost along the way, not where you ended up. Chart: synthetic demo data.
- **02** `Quantora/Quantora-02.jpg` [Education] Two paths can end at the same number and feel nothing alike on the way. That is why drawdown and path matter, not only the final return. Chart: synthetic demo data.
- **03** `Quantora/Quantora-03.jpg` [Education] A market simulation runs many possible paths from the same assumptions. The useful output is the range, not any single line. Chart: synthetic demo data.
- **04** `Quantora/Quantora-04.jpg` [Education] Tokenized stocks are onchain tokens designed to track a listed share. How they track it varies by issuer, which research on onchain finance has to account for.
- **05** `Quantora/Quantora-05.jpg` [Education] An ETF is a fund that holds a basket of assets, so a single position gives you exposure to the basket. Look inside the basket before you look at the label. Illustration: synthetic.
- **06** `Quantora/Quantora-06.jpg` [Education] Every simulation inherits its assumptions: the time window, the return distribution, the rebalancing rule, the cost model. Change one and the answer moves. Read them first.
- **07** `Quantora/Quantora-07.jpg` [Education] Volatility: how much returns swing around their average. Drawdown: how far the path fell from its peak. Related, not the same. A calm-looking series can still have a deep drawdown.
- **08** `Quantora/Quantora-08.jpg` [Education] The arithmetic of drawdowns: a 50% fall needs a 100% gain to get back to even. Depth matters, and so does the climb back. Illustration: synthetic demo data.
- **09** `Quantora/Quantora-09.jpg` [Opinion] Our view: one number hides the path. Return is a destination; drawdown is the journey. Ask for both.
- **10** `Quantora/Quantora-10.jpg` [Opinion] Our view: a backtest is a story told with the benefit of hindsight. Read the assumptions behind it before you trust the ending.
- **11** `Quantora/Quantora-11.jpg` [Opinion] Our view: synthetic data is a fine way to explain a method, as long as it says so. Every chart in this series is labelled.
- **12** `Quantora/Quantora-12.jpg` [Community question] Community question: you are comparing two strategies. Which number do you check first? A) Max drawdown B) Recovery time C) Volatility D) Final return.
- **13** `Quantora/Quantora-13.jpg` [Community question] How long could you sit through a drawdown before you act? A) Days B) Weeks C) Months D) Years. The answer says more about a strategy than its average return.
- **14** `Quantora/Quantora-14.jpg` [Community question] Tail risk: which do you trust more? A) Historical data B) Simulated paths C) Both D) Neither. Tell us what would change your mind.
- **15** `Quantora/Quantora-15.jpg` [Use case] Use case (hypothetical): stress-testing a basket of tokenized ETFs. Run many paths, then read the worst of them before the average. Chart: synthetic demo data.
- **16** `Quantora/Quantora-16.jpg` [Use case] Use case (hypothetical): two strategies end with the same return. Compare the path, the drawdown and the assumptions, not just the final number. Chart: synthetic demo data.
- **17** `Quantora/Quantora-17.jpg` [Product] Quantora Labs does quantitative research for onchain finance through three lenses: tokenized stocks, ETFs and market simulations. Charts in this series use synthetic demo data.
- **18** `Quantora/Quantora-18.jpg` [Brand story] What a chart owes you: a clear statement of what it shows and what it assumes. That is the standard we hold our own research preview to. Charts here are synthetic demo data.
- **19** `Quantora/Quantora-19.jpg` [Brand story] Quantora is a research preview. Everything shown in this series uses synthetic demo data, labelled as such, to explain how we think about risk.
- **20** `Quantora/Quantora-20.jpg` [Brand story] Quantora Labs: quantitative research for onchain finance. Tokenized stocks, ETFs, market simulations. The market, read clearly. quantora.buzz

## AegisNet (@AegisNets)

_Black stage, silver dotted wave, Inter + italic serif accent, real site screenshots. Building on Sepolia testnet._

- **01** `AegisNet/AegisNet-01.jpg` [Education] An AI agent with a wallet is software that can sign transactions on your behalf. Useful, and risky without limits. AegisNet gives it a name (ENS), clean routes (1inch, Uniswap v4) and a human veto (World ID).
- **02** `AegisNet/AegisNet-02.jpg` [Education] Why give an agent a name? A readable identity beats a raw address, and it makes an agent easier to recognise and track. AegisNet binds every agent to an ENS identity, like agent1.aegisnet.eth.
- **03** `AegisNet/AegisNet-03.jpg` [Education] Proof of human: a way to show that a real person stands behind an approval. AegisNet pauses high-value moves for World ID proof of human, so agents act and humans keep the veto.
- **04** `AegisNet/AegisNet-04.jpg` [Education] A swap route is the path a trade takes to find its price. AegisNet routes an agent's trades through 1inch SwapVM and Uniswap v4: clean routes instead of ad hoc ones.
- **05** `AegisNet/AegisNet-05.jpg` [Product] Every trade, three outcomes. Small ones run. Big ones wait for a human. Rogue ones stop. That's the design: routine to auto, big calls to you.
- **06** `AegisNet/AegisNet-06.jpg` [Product] Three situations, walked through on the AegisNet site. See how an agent's trades are handled, and where a human steps in. Building on Sepolia testnet. aegisnet.solrun.fun
- **07** `AegisNet/AegisNet-07.jpg` [Product] Four phases, one request. The AegisNet site traces how a request moves from an agent to a trade, so you can see where each check sits. Testnet only.
- **08** `AegisNet/AegisNet-08.jpg` [Product] Your AI agent's control room: the AegisNet dashboard, where an owner sets the guardrails and watches what the agent does. Building on Sepolia testnet.
- **09** `AegisNet/AegisNet-09.jpg` [Product] Five steps, in order: the walkthrough on the AegisNet site takes you from connecting a wallet to guarded trades. Testnet. aegisnet.solrun.fun
- **10** `AegisNet/AegisNet-10.jpg` [Product] Big calls go to a human. On the AegisNet site, a move of $1,000 or more passes the Midnight ZK gate and waits for World ID proof of human before it clears. Testnet.
- **11** `AegisNet/AegisNet-11.jpg` [Product] AegisNet is building on Sepolia testnet. The site lists five contracts live there: a place to see how the pieces fit before anything touches mainnet. Testnet only.
- **12** `AegisNet/AegisNet-12.jpg` [Community question] Community question: how much would you let an AI agent move without asking you? A) Nothing B) Up to $100 C) Up to $1,000 D) More, with clear limits. Tell us your reasoning.
- **13** `AegisNet/AegisNet-13.jpg` [Community question] What should an AI agent never do alone? A) Move large sums B) Approve new contracts C) Change its own limits D) Buy a brand new token. Your answers shape how we think about guardrails.
- **14** `AegisNet/AegisNet-14.jpg` [Community question] Every agent on AegisNet gets an ENS identity, like agent1.aegisnet.eth. What would you name yours? Reply with your best ENS-style name.
- **15** `AegisNet/AegisNet-15.jpg` [Opinion] Our view: autonomy needs a brake pedal. An AI agent with your wallet and no brakes is a liability. Give it limits, and a human who can say no.
- **16** `AegisNet/AegisNet-16.jpg` [Opinion] Our view: the best approval is the one you only see when it matters. Routine should run on its own; the big calls should come to you.
- **17** `AegisNet/AegisNet-17.jpg` [Use case] Use case (hypothetical): a treasury agent rebalances a portfolio. The routine trades run on their own; a large one waits for a human to clear it. Illustration only, on testnet.
- **18** `AegisNet/AegisNet-18.jpg` [Use case] Use case (hypothetical): try an agent on Sepolia testnet first. Watch the routes, the identity and the veto work with testnet funds before real money is anywhere near.
- **19** `AegisNet/AegisNet-19.jpg` [Brand story] We're early. AegisNet is building on Sepolia testnet, so everything you see is testnet. Agents act, humans keep the veto, and we're building it in the open.
- **20** `AegisNet/AegisNet-20.jpg` [Brand story] AegisNet: let AI agents trade onchain, with a human on the big calls. Every agent gets an ENS identity, clean routes through 1inch and Uniswap v4, and a World ID human veto. Building on Sepolia testnet. aegisnet.solrun.fun

## SafeFi (@safefi_io)

_White grid stage, heavy grotesk, arrow wordmark, shield and coin tiles._

- **01** `SafeFi/SafeFi-01.jpg` [Education] Smart contract risk: the chance that a bug or exploit in a contract's code costs users their funds. It's one reason 'hoping nothing breaks' isn't a security strategy. #SafeFi #SmartContractRisk
- **02** `SafeFi/SafeFi-02.jpg` [Education] An audit is a careful review, not a guarantee. It can reduce risk; it can't remove it. That gap is what onchain security has to plan for.
- **03** `SafeFi/SafeFi-03.jpg` [Education] Hope: nothing breaks, and you never have to think about it. A plan: you decide in advance what happens if something does. Security is the second one.
- **04** `SafeFi/SafeFi-04.jpg` [Education] In general terms, decentralized insurance means cover whose rules live in code and community rather than in a single company. Details vary by protocol, so always read the terms. #CryptoInsurance
- **05** `SafeFi/SafeFi-05.jpg` [Education] Where onchain risk can come from: a bug in contract code, a failing price oracle, a governance attack, a compromised key. Different risks, one goal: know them before you deposit. #DeFi
- **06** `SafeFi/SafeFi-06.jpg` [Education] Self-custody gives you control, and with it the responsibility. Mistakes onchain are hard to reverse, so plan before you sign.
- **07** `SafeFi/SafeFi-07.jpg` [Education] A stablecoin depeg is when a stablecoin trades away from the price it is meant to hold. It's one of the onchain risks worth knowing before you deposit. #DeFi
- **08** `SafeFi/SafeFi-08.jpg` [Product] SafeFi is building cover for your digital assets: decentralized insurance, on-chain. Details will matter, and we'll keep it plain. #SafeFi #CryptoInsurance
- **09** `SafeFi/SafeFi-09.jpg` [Product] Three lines, one idea. Decentralized protection for your digital assets. On-chain security. Web3 insurance. Building a safer decentralized future. #SafeFi
- **10** `SafeFi/SafeFi-10.jpg` [Product] On-chain security. Web3 insurance. Digital assets live onchain, so the protection around them should too. That's the idea behind SafeFi.
- **11** `SafeFi/SafeFi-11.jpg` [Community question] Community question: what worries you most onchain? A) Contract bugs B) Oracle failures C) Stablecoin depegs D) Phishing. Tell us what you do about it. #DeFi
- **12** `SafeFi/SafeFi-12.jpg` [Community question] Do you read the audit before you deposit? A) Always B) I skim it C) Rarely D) What audit? No judgement. Knowing what an audit does and doesn't cover is a good habit.
- **13** `SafeFi/SafeFi-13.jpg` [Community question] Would a small premium be worth the peace of mind? A) Yes B) Maybe C) Depends on the cover D) No. We're curious how you think about onchain risk. #CryptoInsurance
- **14** `SafeFi/SafeFi-14.jpg` [Opinion] Our view: security is a habit, not a launch checklist. It's what you do every day, long after the audit is published.
- **15** `SafeFi/SafeFi-15.jpg` [Opinion] Our view: 'it's audited' is where the questions start, not where they end. Audited by whom, what scope, and what happens if it still fails?
- **16** `SafeFi/SafeFi-16.jpg` [Opinion] Our view: insurance isn't for the days that go to plan. It's for the day the plan fails. That's why it belongs in a security strategy.
- **17** `SafeFi/SafeFi-17.jpg` [Use case] Use case (hypothetical): you've deposited into a liquidity pool and a question crosses your mind: what happens if the contract fails? That 'what if' is where decentralized insurance starts.
- **18** `SafeFi/SafeFi-18.jpg` [Use case] Use case (hypothetical): a long-term holder of ETH and BTC wants a plan for the rare, bad day, not just the good ones. Protection is part of the plan.
- **19** `SafeFi/SafeFi-19.jpg` [Brand story] Most of us have asked 'what if this breaks?' at some point onchain. That question is why we're building SafeFi: a safer decentralized future.
- **20** `SafeFi/SafeFi-20.jpg` [Brand story] SafeFi: decentralized protection for your digital assets. On-chain security. Web3 insurance. Building a safer decentralized future. safefisolana.vercel.app #SafeFi

## Argus (@argus_io)

_Black stage, UV-green glow and specks, mint key phrases, gold swirl logo. 15 ms / 99.4% quoted from the profile._

- **01** `Argus/Argus-01.jpg` [Education] Why can't we see contamination? Microbes are far too small for the eye, so a surface can look spotless and still carry them. Argus detects microbial contamination invisible to the human eye.
- **02** `Argus/Argus-02.jpg` [Education] UV fluorescence: some materials absorb ultraviolet light and re-emit it as visible light. That glow can reveal what white light misses. It's the first layer in Argus.
- **03** `Argus/Argus-03.jpg` [Education] Optical computer vision is software that reads images and turns what it sees into measurements. In Argus it works on what UV fluorescence reveals.
- **04** `Argus/Argus-04.jpg` [Education] Inference time is how long a model takes to produce a result from one input. Argus states 15 ms inference on its profile. Fast results are what make checking practical.
- **05** `Argus/Argus-05.jpg` [Education] Precision: of everything a model flags, the share that is correct. Argus states 99.4% precision on its profile. In plain terms, about 994 of every 1,000 flags would be right.
- **06** `Argus/Argus-06.jpg` [Education] Looks clean is what the eye can confirm. Is clean is what a measurement can confirm. They're not the same thing, and the gap is invisible by definition.
- **07** `Argus/Argus-07.jpg` [Product] Three layers, one pipeline: UV fluorescence, optical computer vision and biomedical AI, working together to detect microbial contamination invisible to the human eye.
- **08** `Argus/Argus-08.jpg` [Product] The foundation is Virtu. Argus is built on Virtu, as stated on its profile, with UV fluorescence, optical CV and biomedical AI on top.
- **09** `Argus/Argus-09.jpg` [Product] 15 ms inference. 99.4% precision. Both figures are as stated on the Argus profile. Speed and accuracy are what make an invisible problem practical to check.
- **10** `Argus/Argus-10.jpg` [Use case] Use case (hypothetical): a corridor that looks clean. Looking clean is the starting point, not the answer. Argus is about checking what the eye can't.
- **11** `Argus/Argus-11.jpg` [Use case] Use case (hypothetical): a food prep surface between shifts. A quick UV-based check on what white light can't show. Illustration only.
- **12** `Argus/Argus-12.jpg` [Use case] Use case (hypothetical): a lab bench before the next sample. Confirm the surface is clean before it matters, not after. Illustration only.
- **13** `Argus/Argus-13.jpg` [Community question] Where would invisible contamination worry you most? A) Kitchens B) Hospitals C) Labs D) Public transport. Tell us why in the replies.
- **14** `Argus/Argus-14.jpg` [Community question] It looks clean. Would you trust that? A) Always B) In some places C) Rarely D) Never. What would you want to see before you did?
- **15** `Argus/Argus-15.jpg` [Community question] Which matters more when you're checking for contamination: speed or precision? A) Speed B) Precision C) Both equally D) Depends on the place. Argus states 15 ms and 99.4%.
- **16** `Argus/Argus-16.jpg` [Opinion] Our view: visible is a low bar. If the only test for clean is what the eye can see, we're missing the part that matters.
- **17** `Argus/Argus-17.jpg` [Opinion] Our view: clean should be measured, not assumed. Assumptions are comfortable. Measurements are useful.
- **18** `Argus/Argus-18.jpg` [Opinion] Our view: you can't manage what you can't see. Making the invisible visible is the first step. Everything else follows.
- **19** `Argus/Argus-19.jpg` [Brand story] Light the eye can't see can reveal what it can't. UV fluorescence, optical computer vision and biomedical AI, working together to make the invisible visible.
- **20** `Argus/Argus-20.jpg` [Brand story] Argus: detecting microbial contamination invisible to the human eye. UV fluorescence, optical computer vision and biomedical AI, built on Virtu. 15 ms inference, 99.4% precision, as stated on the profile. argus-iota.vercel.app

## TerraNode (@terranode_ai)

_PROVISIONAL: derived from the earlier TerraNode film (golden hour, violet dots #701CD0, Quicksand). No banner/profile screenshot has been supplied for this account._

- **01** `TerraNode/TerraNode-01.jpg` [Education] What is edge AI? AI that runs on the device itself, in the field, so it keeps working without a connection. TerraNode is offline edge-AI for smarter farms.
- **02** `TerraNode/TerraNode-02.jpg` [Education] LoRa is a long-range, low-power radio technology. Small messages can travel far without mobile coverage, which suits sensors spread across a farm. TerraNode uses LoRa.
- **03** `TerraNode/TerraNode-03.jpg` [Education] Fields are often beyond good coverage. A tool that needs the internet stops where the signal does. That's why TerraNode is AI-powered farming without the internet.
- **04** `TerraNode/TerraNode-04.jpg` [Education] Soil moisture tells you how much water is in the soil. It's one input to deciding when to irrigate. Values shown are from the illustrative example dashboard.
- **05** `TerraNode/TerraNode-05.jpg` [Education] Five readings in the TerraNode example dashboard: soil moisture, temperature, humidity, light and air quality. Illustrative values, not live data.
- **06** `TerraNode/TerraNode-06.jpg` [Product] Crop disease and pest detection: TerraNode's leaf analysis runs at the edge, so it works in the field without internet. Example result shown is illustrative.
- **07** `TerraNode/TerraNode-07.jpg` [Product] Smart irrigation with LoRa and solar. TerraNode suggests; the farmer approves. The prompt shown is an illustrative example.
- **08** `TerraNode/TerraNode-08.jpg` [Product] Powered by the sun. The TerraNode field unit pairs a tilted solar panel with an antenna and an enclosure on a pole, with edge AI and LoRa inside. Illustration of the unit.
- **09** `TerraNode/TerraNode-09.jpg` [Product] Farmer-approved actions: TerraNode suggests, the farmer decides. Automation that keeps the person who knows the land in charge. Example prompt is illustrative.
- **10** `TerraNode/TerraNode-10.jpg` [Product] AI-powered farming, without the internet. Crop disease and pest detection, smart irrigation, LoRa and solar: offline edge-AI for smarter farms.
- **11** `TerraNode/TerraNode-11.jpg` [Community question] Farmers: what would you automate first? A) Irrigation B) Disease alerts C) Pest alerts D) Field readings. Tell us what takes most of your time.
- **12** `TerraNode/TerraNode-12.jpg` [Community question] What is connectivity like in your fields? A) Good B) Patchy C) Almost none D) Varies by field. It decides which tools can actually work where you farm.
- **13** `TerraNode/TerraNode-13.jpg` [Community question] Which reading do you check most? A) Soil moisture B) Temperature C) Humidity D) Light. Tell us what you do with it.
- **14** `TerraNode/TerraNode-14.jpg` [Opinion] Our view: the farmer decides. Tools should bring the right information to the person who knows the land, and leave the call with them.
- **15** `TerraNode/TerraNode-15.jpg` [Opinion] Our view: smart farming shouldn't need a signal. If a tool stops working when the connection does, it isn't built for the field.
- **16** `TerraNode/TerraNode-16.jpg` [Opinion] Our view: simple beats clever when you're standing in a field. A clear reading and a clear prompt are worth more than a clever dashboard.
- **17** `TerraNode/TerraNode-17.jpg` [Use case] Use case (hypothetical): a leaf scan flags a problem for a closer look early, rather than after it spreads. Detection at the edge, right in the field. Illustrative.
- **18** `TerraNode/TerraNode-18.jpg` [Use case] Use case (hypothetical): readings show one zone is dry. The system suggests watering that zone, and the farmer approves it. Illustrative example.
- **19** `TerraNode/TerraNode-19.jpg` [Brand story] Where the signal ends, the work doesn't. TerraNode is AI-powered farming, without the internet: offline edge-AI for smarter farms.
- **20** `TerraNode/TerraNode-20.jpg` [Brand story] TerraNode: offline edge-AI for smarter farms. AI-powered farming, without the internet. Crop disease and pest detection, smart irrigation, LoRa, solar, farmer-approved actions.

## DeSci (desciBnb) (@desci_bnb)

_Black stage, gold light, tracked caps, molecules, planet arc, hex logo._

- **01** `DeSci/DeSci-01.jpg` [Education] What is DeSci? Decentralized science: using open, onchain tools to fund, share and verify research. Maybe that's where the future of science is heading.
- **02** `DeSci/DeSci-02.jpg` [Education] Funding scientific research can be painfully complicated: grants, paperwork, gatekeepers. Maybe blockchain can help fix that. That's the question behind DeSci.
- **03** `DeSci/DeSci-03.jpg` [Education] A blockchain can record who contributed what, and when, in a way that is hard to quietly change. For research, a clear record of contribution is a useful thing.
- **04** `DeSci/DeSci-04.jpg` [Education] Four ingredients in decentralized science: Research, Funding, Collaboration and AI. desciBnb brings them together with blockchain, built on BNB Chain.
- **05** `DeSci/DeSci-05.jpg` [Education] BNB Chain is a blockchain that works with Ethereum-style tooling. desciBnb is built on BNB Chain: Research × AI × Blockchain.
- **06** `DeSci/DeSci-06.jpg` [Education] Closed data: findings sit behind barriers, and few can check or build on them. Open data: others can check, reuse and build on what was found. DeSci leans open.
- **07** `DeSci/DeSci-07.jpg` [Product] Three disciplines, one stack: research, AI and blockchain, built on BNB Chain. That is where desciBnb sits.
- **08** `DeSci/DeSci-08.jpg` [Education] Peer review is experts checking research before it's published. It's valuable, and hard to scale. A clear, open record of who reviewed what is one idea DeSci explores.
- **09** `DeSci/DeSci-09.jpg` [Education] A smart contract is code on a blockchain that runs agreed rules automatically, so no middleman has to. For research funding, the rules can be visible to everyone.
- **10** `DeSci/DeSci-10.jpg` [Community question] Community question: what slows research down the most? A) Funding B) Access to data C) Collaboration D) Peer review. Researchers especially: tell us what you've run into.
- **11** `DeSci/DeSci-11.jpg` [Community question] Would you fund a scientific study onchain? A) Yes B) Maybe C) I'd need to learn more D) No. Tell us what would make you comfortable.
- **12** `DeSci/DeSci-12.jpg` [Community question] Which field needs DeSci first? A) Biology B) Climate C) Materials D) Space. If it's another one, say so in the replies.
- **13** `DeSci/DeSci-13.jpg` [Opinion] Our view: funding a discovery shouldn't be harder than making a trade. We can move assets in a few clicks. Moving support to research should be simpler too.
- **14** `DeSci/DeSci-14.jpg` [Opinion] Our view: discovery compounds when it's shared. Each result that others can check and build on is worth more than one that stays in a drawer.
- **15** `DeSci/DeSci-15.jpg` [Opinion] Our view: AI can speed up research, but trust still has to be built, with clear records of who did what and how. That's where blockchain can help.
- **16** `DeSci/DeSci-16.jpg` [Use case] Use case (hypothetical): a small lab shares a research proposal in the open and invites support, with a clear, public record of what was asked and what came in.
- **17** `DeSci/DeSci-17.jpg` [Use case] Use case (hypothetical): two labs working on one question keep a shared record of who contributed what. Collaboration is easier when credit is clear.
- **18** `DeSci/DeSci-18.jpg` [Use case] Use case (hypothetical): an AI assistant helps review the literature. AI helps read; people still decide what it means. Research × AI, with humans in charge.
- **19** `DeSci/DeSci-19.jpg` [Brand story] The future of science is decentralized. It's a belief, and desciBnb is early in building toward it, on BNB Chain.
- **20** `DeSci/DeSci-20.jpg` [Brand story] desciBnb: the future of science is decentralized. Research × AI × Blockchain, built on BNB Chain. Decentralizing scientific discovery. desciai.vercel.app

## PolyMate (@Polymatedotfun)

_Golden-hour Rome, marble, lapis + gold, red banner walls, robot centurion. UI illustrative._

- **01** `Polymate/Polymate-01.jpg` [Education] What is a prediction market? A market where people trade on the outcome of future events. Prices reflect what the crowd expects to happen. PolyMate is the trading layer for them.
- **02** `Polymate/Polymate-02.jpg` [Education] How to read a price: if YES trades at 0.60, the market is implying roughly a 60% chance. Illustrative numbers, not a live market.
- **03** `Polymate/Polymate-03.jpg` [Education] YES and NO. In a typical prediction market, YES pays out if the event happens and NO pays out if it doesn't. Always read the specific market's rules.
- **04** `Polymate/Polymate-04.jpg` [Education] Resolution is the moment a market's outcome is decided, according to its rules. Read the rules before you trade: the wording is what counts.
- **05** `Polymate/Polymate-05.jpg` [Education] Before you size a position: What is the question, exactly? What are the resolution rules? How much can I afford to lose? Why do I disagree with the price? Not financial advice.
- **06** `Polymate/Polymate-06.jpg` [Education] A price is not a promise. It's the crowd's current estimate, and it moves as people learn. Treat it as information, not a guarantee. Illustrative.
- **07** `Polymate/Polymate-07.jpg` [Product] Positions, at a glance. PolyMate has Trade, Markets, Positions, Strategy and Balance tabs, and Positions shows what you hold. Illustrative example, not live data.
- **08** `Polymate/Polymate-08.jpg` [Product] Trade, then watch it execute. The PolyMate banner shows a Position Opened card (YES, $50) and an Executing Trade… step. Illustrative examples.
- **09** `Polymate/Polymate-09.jpg` [Product] Start trading. The trading layer for prediction markets. Building tools to trade the future, fast. t.me/Tryoddsbot
- **10** `Polymate/Polymate-10.jpg` [Education] Liquidity is how easily you can buy or sell without moving the price. In a thin market, one trade can move it a lot. Worth checking before you size a position. Not financial advice.
- **11** `Polymate/Polymate-11.jpg` [Community question] Pick a category you'd trade. A) Politics B) Sports C) Crypto D) Culture. Tell us the kind of question you wish was a market.
- **12** `Polymate/Polymate-12.jpg` [Community question] What's your default position size? A) $10 B) $50 C) $100 D) Depends on conviction. Size small enough that being wrong is fine. Not financial advice.
- **13** `Polymate/Polymate-13.jpg` [Community question] Do you trade on conviction or on price? A) Conviction B) Price C) Both D) Just watching. Tell us how you decide.
- **14** `Polymate/Polymate-14.jpg` [Opinion] Our view: fast tools, slow decisions. Speed belongs in the interface. Patience belongs in the thinking.
- **15** `Polymate/Polymate-15.jpg` [Opinion] Our view: in a prediction market, disagreeing with the price is the whole game. Know why you disagree before you act on it.
- **16** `Polymate/Polymate-16.jpg` [Opinion] Our view: read the rules before you read the odds. A market's resolution wording matters more than its current price.
- **17** `Polymate/Polymate-17.jpg` [Use case] Use case (hypothetical): you have a view on an upcoming event and want to back it with a position. A prediction market turns an opinion into a trade. Not financial advice.
- **18** `Polymate/Polymate-18.jpg` [Use case] Use case (hypothetical): checking your positions between meetings. A quick look at what you hold, then back to your day. Illustrative example.
- **19** `Polymate/Polymate-19.jpg` [Brand story] Ancient forums were where people argued about what would happen next. PolyMate is a modern forum for the future: building tools to trade it, fast.
- **20** `Polymate/Polymate-20.jpg` [Brand story] PolyMate: the trading layer for prediction markets. Building tools to trade the future, fast. Start trading at t.me/Tryoddsbot. @Polymatedotfun
