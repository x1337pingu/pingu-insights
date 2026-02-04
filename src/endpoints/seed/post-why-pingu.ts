import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'
import { t, p, h2, h3, hr, banner, root } from './lexical-helpers'

export type PostArgs = { heroImage: Media; author: User }

export const postWhyPingu: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  author,
}) => ({
  slug: 'pingu-on-monad-but-why',
  _status: 'published',
  authors: [author],
  publishedAt: '2026-01-28T10:00:00.000Z',
  title: 'Pingu on Monad: But Why?',
  excerpt:
    "Built on Monad, a truly decentralized high-performance L1. Oracle-based execution, fully on-chain, and auditable end to end.",
  tags: [
    { tag: 'pingu' },
    { tag: 'defi' },
    { tag: 'monad' },
    { tag: 'perpetuals' },
    { tag: 'knowledge' },
  ],
  heroImage: heroImage.id,
  meta: {
    title: 'Pingu on Monad: But Why? | Pingu Insights',
    description:
      'Fully on-chain, oracle-based, and auditable. Why Pingu chose Monad for zero-spread perpetuals with 800ms finality.',
    image: heroImage.id,
  },
  relatedPosts: [],
  content: root([
    // SECTION 1: Pricing Model
    h2('The Pricing Model Question'),
    p(t('Every perp DEX makes a fundamental choice: how to determine execution price.')),
    p(
      t('Orderbook-based pricing', true),
      t(
        ' matches bids and asks. Spread exists. Price impact scales with order size. Your fill depends on liquidity depth. Some implementations are fully transparent. Others run matching off-chain. The tradeoff varies, but the core model is the same.',
      ),
    ),
    p(
      t('Oracle-based pricing', true),
      t(
        ' sources price externally. Pingu uses Pyth, aggregated first-party data from Binance, OKX, Bybit, and other major venues. The result: zero spread (execute at oracle price), zero price impact (same price for $1K or $1M), execution quality independent of on-platform liquidity.',
      ),
    ),
    p(
      t(
        "Different model. Different tradeoffs. Pingu chose oracle-based because execution quality shouldn't depend on who's making markets on the platform.",
      ),
    ),
    hr(),

    // SECTION 2: Vault Model
    h2('The Vault Model'),
    p(t('Pingu has no orderbook. The vault is your counterparty.')),
    p(
      t(
        'LPs deposit into the vault. When you open a long, the vault takes the short side. P/L settles against the vault.',
      ),
    ),
    h3('The Stability Fund'),
    p(
      t(
        'Between traders and LPs sits the Stability Fund. A buffer. Trader losses and 45% of protocol fees flow into the Stability Fund first. The fund then distributes to LPs over a rolling period. When the fund is sufficiently capitalized, LPs are protected from sudden swings in trader performance.',
      ),
    ),
    p(
      t(
        "For LPs, this changes the risk profile. You're not directly exposed to every winning trade. The Stability Fund absorbs volatility. Only when the fund depletes do LP deposits take the hit.",
      ),
    ),
    h3('Risk Parameters'),
    p(
      t(
        'The protocol enforces risk limits: maximum open interest per market, maximum position sizes, leverage caps based on asset volatility, dynamic funding rates to balance long/short exposure. These parameters are calibrated to protect LP capital while maintaining deep liquidity for traders.',
      ),
    ),
    hr(),

    // SECTION 3: Oracle-Based Execution
    h2('Oracle-Based Execution'),
    h3("Why Your Orders Don't Move The Price"),
    p(
      t(
        'On an orderbook, large orders move the market. Your order is visible. Sophisticated actors can front-run. They push price against you, then profit from your fill.',
      ),
    ),
    p(
      t(
        "On Pingu, the execution price comes from Pyth's aggregated market data, not from activity on Pingu itself. Your order doesn't affect the price feed. A $10M position executes at the same price as a $10K position.",
      ),
    ),
    h3('Pyth: The Price Source'),
    p(
      t(
        "Pyth isn't a single feed. It's a network of first-party data providers. Major exchanges and market makers publish directly. Multiple independent sources, confidence intervals per price, on-chain verification, sub-second updates.",
      ),
    ),
    p(t('Every price is verifiable on-chain. You can audit the exact price used for any trade.')),
    hr(),

    // SECTION 4: On-Chain Execution
    h2('On-Chain Execution'),
    h3("What's Actually On-Chain"),
    p(
      t(
        'Many DEXs claim decentralization while running critical components off-chain: off-chain orderbooks, backend matching engines, private mempools. These are black boxes.',
      ),
    ),
    p(
      t(
        "Pingu's critical path is on-chain: order submission, price source (Pyth), execution logic (smart contracts), settlement, position tracking. Keepers facilitate execution. They relay transactions and fetch Pyth prices. But they can't manipulate outcomes.",
      ),
    ),
    p(
      t(
        'The contracts are audited (2 independent audits by Shellboxes, plus Octane vulnerability scan). Any trade can be fully reconstructed from on-chain data.',
      ),
    ),
    h3('Non-Custodial'),
    p(
      t(
        'Connect wallet. Trade. Disconnect. Margin is held in smart contracts. Liquidation logic is on-chain. P/L settlement is on-chain. Your funds never transfer to an opaque entity.',
      ),
    ),
    hr(),

    // SECTION 5: Why Monad
    h2('Why Monad'),
    h3('The Infrastructure Problem'),
    p(
      t(
        'Building a performant perp DEX on-chain requires specific chain properties: speed, finality, cost, and mature tooling. Monad delivers all four.',
      ),
    ),
    h3('The Numbers'),
    p(
      t('Block time:', true),
      t(' 400ms. '),
      t('Finality:', true),
      t(' 800ms (2 blocks). '),
      t('Throughput:', true),
      t(' 10,000+ TPS. '),
      t('Compatibility:', true),
      t(' Native EVM bytecode.'),
    ),
    h3('The Decentralization Question'),
    p(
      t(
        'Hyperliquid is fast. 0.2s median latency. But validators are concentrated in Tokyo. Node software is closed-source. Foundation validators controlled approximately 80% of delegated stake.',
      ),
    ),
    p(
      t(
        "Monad takes a different approach. Validators can be geographically distributed. The codebase is open-source. 10,000+ TPS is more than enough for perp trading. You don't need 200,000 orders/second. You need sufficient speed with actual decentralization.",
      ),
    ),
    h3('Why Finality Matters'),
    p(
      t(
        "800ms finality means your trade is settled in under a second. Final. Not 'soft confirmed pending fraud proof.' Not 'probably won't reorg.' Done.",
      ),
    ),
    hr(),

    // SECTION 6: The Combination
    h2('The Combination'),
    h3('Oracle + Monad'),
    p(
      t(
        "Pyth updates need to land quickly. On slower chains, price can move between the oracle update and your execution. Monad's 400ms blocks minimize this gap. The price you see is the price you get. Oracle-based execution becomes practical at scale.",
      ),
    ),
    h3('On-Chain + Monad'),
    p(
      t(
        "Full on-chain execution is expensive on congested chains. Monad's throughput removes this constraint. Complex logic executes without gas optimization hacks. Transparency becomes practical, not just theoretical.",
      ),
    ),
    hr(),

    // SECTION 7: What This Means
    h2('What This Means For Traders'),
    p(
      t('Execution Quality', true),
      t(
        ': Zero spread on all markets. No price impact regardless of size. Front-running architecturally prevented.',
      ),
    ),
    p(
      t('Transparency', true),
      t(
        ': Every trade verifiable on-chain. Audited contracts (2 independent audits by Shellboxes). Non-custodial.',
      ),
    ),
    p(
      t('Speed', true),
      t(': 400ms blocks. 800ms true finality. No soft/hard finality distinction.'),
    ),
    p(
      t('Markets', true),
      t(
        ': Beyond crypto. Forex pairs, commodities (gold, silver, oil), indices, stocks. Same execution model. Same transparency. Same speed. Pyth provides the feeds.',
      ),
    ),
    hr(),

    // Closing
    p(
      t(
        'Pingu is a different architecture. Oracle-based execution delivers zero spread and no price impact. On-chain transparency makes every trade verifiable. Monad provides the speed and finality to make this practical. The combination: execution quality and transparency that scales.',
      ),
    ),
    hr(),
    banner(
      'This content is for informational purposes only and does not constitute financial advice. Always conduct your own research.',
    ),
  ]),
})
