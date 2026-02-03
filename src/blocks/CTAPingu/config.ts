import type { Block } from 'payload'

export const CTAPingu: Block = {
  slug: 'ctaPingu',
  interfaceName: 'CTAPinguBlock',
  labels: {
    singular: 'CTA Pingu',
    plural: 'CTA Pingu Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Trade on Pingu',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Decentralized perpetuals on Monad. Zero spread, oracle-based execution.',
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Trade on Pingu',
    },
    {
      name: 'buttonUrl',
      type: 'text',
      defaultValue: 'https://pingu.exchange',
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
      ],
    },
  ],
}
