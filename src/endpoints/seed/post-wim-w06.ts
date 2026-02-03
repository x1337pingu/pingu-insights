import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'
import { t, p, h2, h3, hr, marketTable, banner, root } from './lexical-helpers'

export type PostArgs = { heroImage: Media; author: User }

export const postWimW06: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  author,
}) => ({
  slug: 'week-in-markets-w06-2026',
  _status: 'published',
  authors: [author],
  publishedAt: '2026-02-03T09:00:00.000Z',
  title: 'Week in Markets: The Week That Humbled Everything',
  excerpt:
    'Gold crashed from record highs. Silver saw its worst day since 1980. Bitcoin plunged below $75K. And at the center of it all: a Fed Chair nomination that flipped the script.',
  tags: [
    { tag: 'macro' },
    { tag: 'fed' },
    { tag: 'gold' },
    { tag: 'bitcoin' },
    { tag: 'week-in-markets' },
  ],
  heroImage: heroImage.id,
  meta: {
    title: 'Week in Markets W06 2026 | Pingu Blog',
    description:
      'Gold crashed from record highs. Silver worst day since 1980. Bitcoin below $75K. The Warsh nomination changed everything.',
    image: heroImage.id,
  },
  relatedPosts: [],
  content: root([
    // Intro
    p(
      t(
        'The week that humbled everything. Gold crashed from record highs. Silver saw its worst day since 1980. Bitcoin plunged below $75K. Asia got hammered. And at the center of it all: a Fed Chair nomination that flipped the script on 2025\'s biggest trade.',
      ),
    ),
    p(t('After months of rally, markets got a brutal reminder that parabolic moves end.')),
    hr(),

    // MACRO PULSE
    h2('Macro Pulse'),
    h3('The FOMC: Hold and Wait'),
    p(
      t('The Federal Reserve held rates at '),
      t('3.5% to 3.75%', true),
      t(' on Wednesday, January 28. The vote was '),
      t('10 to 2', true),
      t(
        '. Governors Stephen Miran and Christopher Waller dissented, preferring a 25bps cut. Both were appointed by President Trump. The split signals internal tension about the pace of normalization.',
      ),
    ),
    p(
      t(
        'Powell\'s message: "The economy has once again surprised us with its strength." Inflation "remains somewhat elevated," still running closer to 3% than the 2% target. No urgency to move in either direction.',
      ),
    ),
    h3('The Warsh Nomination'),
    p(
      t('On Thursday afternoon, January 30, reports emerged that Trump would nominate '),
      t('Kevin Warsh', true),
      t(
        ' as the next Fed Chair. By Friday morning, it was official. Former Fed Governor (2006 to 2011), served during the 2008 crisis. Historically viewed as hawkish on monetary policy.',
      ),
    ),
    p(
      t(
        'The reaction was immediate and violent. Within hours: Gold fell 8 to 11% (worst day since April 2013). Silver crashed 30% (worst since 1980). Bitcoin dropped to ',
      ),
      t('$74,541', true),
      t('. DXY reversed from 4-year lows.'),
    ),
    p(
      t(
        'Warsh faces Senate confirmation. Senator Thom Tillis (R-NC) has threatened to vote against any Fed nominee until the Justice Department resolves its investigation of the central bank. Powell has just two more meetings before his term ends in May.',
      ),
    ),
    hr(),

    // PRECIOUS METALS
    h2('Precious Metals: The Meltdown'),
    h3('Gold'),
    p(
      t('From a record '),
      t('$5,608', true),
      t(' per ounce on Thursday, gold crashed to below '),
      t('$4,700', true),
      t(
        " by Monday. A 17% collapse in three trading days. Friday's single-day drop of 8 to 11% was the worst since April 15, 2013.",
      ),
    ),
    p(
      t(
        'The trigger: Warsh\'s nomination killed the "debasement trade." Investors had been buying gold as a hedge against a politicized, dovish Fed. Warsh\'s hawkish reputation reversed that thesis instantly. Gold\'s RSI had touched 90. The metal was up 30% since January. A correction was inevitable. Warsh was the catalyst.',
      ),
    ),
    h3('Silver: Worst Day Since 1980'),
    p(
      t('From '),
      t('$112+', true),
      t(' per ounce, silver plunged '),
      t('30 to 31%', true),
      t(
        ' to around $78 to $84. Its biggest daily decline since the Hunt Brothers collapse in March 1980. The CME accelerated the rout with margin hikes: Gold futures ',
      ),
      t('+33%', true),
      t(', Silver futures '),
      t('+36%', true),
      t('. Over $1 billion in leveraged positions liquidated in hours.'),
    ),
    marketTable('Precious Metals Snapshot', [
      { symbol: 'Gold (XAU)', price: '$4,811', change: '-$797', changePercent: '-14.2%' },
      { symbol: 'Silver (XAG)', price: '$84', change: '-$28', changePercent: '-25.0%' },
    ]),
    hr(),

    // GLOBAL MARKETS
    h2('Global Markets: Risk Off Everywhere'),
    p(
      t("The risk-off wave was global. Korea's "),
      t('KOSPI fell 5.26%', true),
      t(", its worst session since November 2025. Hong Kong's "),
      t('Hang Seng dropped 1.64%', true),
      t(". China's manufacturing PMI fell to "),
      t('49.3', true),
      t(', slipping back below the 50 line that separates expansion from contraction.'),
    ),
    p(
      t('Oil fell 3-5% on the week. WTI crude settled around '),
      t('$63', true),
      t(', Brent around '),
      t('$67', true),
      t(
        '. Trump signaled potential de-escalation with Iran: "Iran is seriously talking" with Washington. The VIX climbed to the 15-17 range.',
      ),
    ),
    marketTable('Global Markets Snapshot', [
      { symbol: 'KOSPI', price: '2,380', change: '-274', changePercent: '-5.26%' },
      { symbol: 'Hang Seng', price: '19,500', change: '-325', changePercent: '-1.64%' },
      { symbol: 'WTI Crude', price: '$63', change: '-$3.20', changePercent: '-4.8%' },
      { symbol: 'Brent Crude', price: '$67', change: '-$2.80', changePercent: '-4.0%' },
      { symbol: 'VIX', price: '16.2', change: '+2.1', changePercent: '+14.9%' },
    ]),
    hr(),

    // CRYPTO LANDSCAPE
    h2('Crypto Landscape'),
    p(
      t('Bitcoin closed the week at approximately '),
      t('$77,850', true),
      t(', having touched a low of '),
      t('$74,541', true),
      t(
        ' during the Thursday sell-off. That is an 11% decline on the week. Ethereum fared worse, falling to around ',
      ),
      t('$2,299', true),
      t(' with its RSI hitting 22.47, deep into oversold territory.'),
    ),
    p(
      t('ETF flows told the story of capitulation.', true),
      t(' January 29 saw '),
      t('$817M in outflows', true),
      t(
        ", the largest single-day outflow since November 20. BlackRock's IBIT bled $317.8M, Fidelity's FBTC lost $168M. The average ETF holder cost basis sits at ",
      ),
      t('$84,099', true),
      t(', meaning the average holder is now underwater.'),
    ),
    p(
      t('The Fear and Greed Index plunged to '),
      t('20 (Extreme Fear)', true),
      t(', the lowest reading of 2026. Liquidations totaled over '),
      t('$1.7 billion', true),
      t(
        ' between January 29 and 31, with approximately 90% of those being long positions.',
      ),
    ),
    marketTable('Crypto Snapshot', [
      { symbol: 'BTC', price: '$77,850', change: '-$9,600', changePercent: '-11.0%' },
      { symbol: 'ETH', price: '$2,299', change: '-$540', changePercent: '-19.0%' },
      { symbol: 'Fear & Greed', price: '20', change: '', changePercent: 'Extreme Fear' },
    ]),
    hr(),

    // EARNINGS
    h2('Earnings: The Microsoft Question'),
    p(
      t('Microsoft delivered a beat on both lines. '),
      t('EPS came in at $4.14', true),
      t(' versus the $3.97 consensus. '),
      t('Revenue hit $81.27 billion', true),
      t(' against expectations of $80.27 billion. By every traditional metric, it was a strong quarter.'),
    ),
    p(
      t(
        'The stock fell 10% on Thursday anyway, its worst session since March 2020. The culprit: Azure growth decelerated from 40% to 39%. A single percentage point. That was enough to wipe ',
      ),
      t('$357 billion in market cap', true),
      t(
        ' in a single day. The bar for mega-cap tech is no longer about beating estimates. It is about beating the narrative.',
      ),
    ),
    hr(),

    // WEEK AHEAD
    h2('Week Ahead'),
    p(
      t('The '),
      t('RBA decision', true),
      t(' lands February 3-4, with roughly a 75% chance of a hike priced in. The '),
      t('ECB and Bank of England', true),
      t(' both meet on February 6, with holds expected from both. The '),
      t('NFP Jobs Report', true),
      t(' drops on February 7. On the earnings front, '),
      t('Alphabet and Amazon', true),
      t(
        ' report on February 4. After the Microsoft reaction, expectations are high and patience is thin.',
      ),
    ),
    hr(),

    // KEY TAKEAWAYS
    h2('Key Takeaways'),
    p(
      t('The Warsh nomination is the single most impactful macro event of 2026 so far.', true),
      t(
        ' A hawkish Fed Chair changes the calculus for every rate-sensitive asset. The market priced it in within hours.',
      ),
    ),
    p(
      t('Precious metals were the epicenter.', true),
      t(
        " Gold and silver had been on a parabolic run fueled by dovish expectations. The reversal was historic. Silver's single-day drop had not been seen since 1980.",
      ),
    ),
    p(
      t('Crypto is caught in the crossfire.', true),
      t(
        " Bitcoin's correlation with macro liquidity expectations remains high. The ETF outflows and $1.7B in liquidations reflect a market that was over-leveraged.",
      ),
    ),
    p(
      t('Beating estimates is no longer enough for mega-cap tech.', true),
      t(
        ' Microsoft beat on every metric and lost $357B in a day. The market is pricing perfection and punishing anything less.',
      ),
    ),
    p(
      t('Confirmation is not guaranteed.', true),
      t(
        ' The Warsh nomination could still fail in the Senate. If it does, expect a violent reversal. Until then, the market trades the signal, not the outcome.',
      ),
    ),
    hr(),

    // DISCLAIMER
    banner(
      'This content is for informational purposes only and does not constitute financial advice. Past performance is not indicative of future results. Always conduct your own research before making investment decisions.',
    ),
  ]),
})
