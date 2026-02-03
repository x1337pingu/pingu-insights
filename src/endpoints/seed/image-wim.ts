import type { Media } from '@/payload-types'

export const imageWim: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Financial markets trading screens showing red indicators during a market selloff',
}
