import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: ({ req: { user } }) => {
      if (!user) return false
      return (user as any).role === 'master'
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return (user as any).role === 'master'
    },
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
      access: {
        // Only master can change roles
        update: ({ req: { user } }) => {
          if (!user) return false
          return (user as any).role === 'master'
        },
      },
    },
  ],
  timestamps: true,
}
