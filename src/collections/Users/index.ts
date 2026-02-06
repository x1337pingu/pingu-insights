import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated, // temporarily open - will restrict to master after setup
    delete: authenticated, // temporarily open - will restrict to master after setup
    read: authenticated,
    update: ({ req: { user }, id }) => {
      if (!user) return false
      // Masters can update anyone
      if ((user as any).role === 'master') return true
      // Users can only update themselves
      return user.id === id
    },
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Master', value: 'master' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      required: true,
      // access restriction will be added after master account is set up
    },
  ],
  timestamps: true,
}
