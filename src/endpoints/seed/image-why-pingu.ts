import type { Media } from '@/payload-types'

export const imageWhyPingu: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Abstract blockchain network visualization with connected nodes',
}
