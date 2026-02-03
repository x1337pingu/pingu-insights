import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Pingu Blog',
      required: true,
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      defaultValue: 'Market intelligence, research, and insights from Pingu Exchange.',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        {
          name: 'twitter',
          type: 'text',
          defaultValue: 'https://x.com/PinguExchange',
        },
        {
          name: 'discord',
          type: 'text',
          defaultValue: 'https://discord.gg/pingu',
        },
        {
          name: 'telegram',
          type: 'text',
        },
      ],
    },
    {
      name: 'ctaDefault',
      type: 'group',
      label: 'Default CTA',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Trade on Pingu',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Decentralized perpetuals on Monad. Zero spread, oracle-based execution.',
        },
        {
          name: 'buttonText',
          type: 'text',
          defaultValue: 'Start Trading',
        },
        {
          name: 'buttonUrl',
          type: 'text',
          defaultValue: 'https://pingu.exchange',
        },
      ],
    },
  ],
}
