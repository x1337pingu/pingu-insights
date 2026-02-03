import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  access: {
    create: () => true,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'subscribedAt'],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
      required: true,
    },
    {
      name: 'subscribedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (!value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'blog',
      admin: {
        description: 'Where the subscriber signed up from (blog, telegram, etc.)',
      },
    },
  ],
}
