import type { Block } from 'payload'

export const ChartEmbed: Block = {
  slug: 'chartEmbed',
  interfaceName: 'ChartEmbedBlock',
  labels: {
    singular: 'Chart Embed',
    plural: 'Chart Embeds',
  },
  fields: [
    {
      name: 'ticker',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. BTCUSD, ETHUSD, SPY',
      },
    },
    {
      name: 'chartImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'TradingView',
    },
  ],
}
