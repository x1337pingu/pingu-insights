import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'role',
      type: 'text',
      admin: {
        description: 'e.g. "Head of Research", "Content Lead"',
      },
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        {
          name: 'twitter',
          type: 'text',
          admin: {
            description: 'X/Twitter handle (e.g. @PinguExchange)',
          },
        },
        {
          name: 'website',
          type: 'text',
        },
      ],
    },
    slugField(),
  ],
}
