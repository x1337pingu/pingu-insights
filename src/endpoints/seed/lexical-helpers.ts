// Helper functions to build Lexical JSON nodes compactly

export const t = (text: string, bold = false) => ({
  type: 'text' as const,
  detail: 0,
  format: bold ? 1 : 0,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1,
})

export const p = (...children: ReturnType<typeof t>[]) => ({
  type: 'paragraph' as const,
  children,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

export const h2 = (text: string) => ({
  type: 'heading' as const,
  children: [t(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag: 'h2' as const,
  version: 1,
})

export const h3 = (text: string) => ({
  type: 'heading' as const,
  children: [t(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag: 'h3' as const,
  version: 1,
})

export const hr = () => ({
  type: 'horizontalrule' as const,
  version: 1,
})

export const marketTable = (
  title: string,
  rows: { symbol: string; price: string; change: string; changePercent: string }[],
) => ({
  type: 'block' as const,
  fields: {
    blockName: title,
    blockType: 'marketDataTable',
    title,
    rows,
  },
  format: '' as const,
  version: 2,
})

export const mediaBlock = (mediaId: string | number) => ({
  type: 'block' as const,
  fields: {
    blockName: '',
    blockType: 'mediaBlock',
    media: mediaId,
  },
  format: '' as const,
  version: 2,
})

export const banner = (text: string, style = 'info') => ({
  type: 'block' as const,
  fields: {
    blockName: 'Disclaimer',
    blockType: 'banner',
    content: {
      root: {
        type: 'root' as const,
        children: [p(t('Disclaimer:', true), t(' ' + text))],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    },
    style,
  },
  format: '' as const,
  version: 2,
})

export const root = (children: any[]) => ({
  root: {
    type: 'root' as const,
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})
