import type { Block } from 'payload'

export const MarketDataTable: Block = {
  slug: 'marketDataTable',
  interfaceName: 'MarketDataTableBlock',
  labels: {
    singular: 'Market Data Table',
    plural: 'Market Data Tables',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Weekly Performance',
    },
    {
      name: 'rows',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'symbol',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'text',
          required: true,
        },
        {
          name: 'change',
          type: 'text',
        },
        {
          name: 'changePercent',
          type: 'text',
        },
      ],
    },
    {
      name: 'disclaimer',
      type: 'text',
      defaultValue: 'Data as of publication time. Not financial advice.',
    },
  ],
}
