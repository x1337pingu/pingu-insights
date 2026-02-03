/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        pingu: {
          purple: {
            DEFAULT: '#9051F4',
            light: '#C5A1FF',
            lighter: '#E8D9FF',
            dark: '#571F83',
            darker: '#28012E',
          },
          green: {
            DEFAULT: '#72FFA6',
            light: '#C0FFD0',
            dark: '#4AC477',
            darker: '#15542C',
          },
          pink: {
            DEFAULT: '#FF99D2',
            light: '#FFC3EE',
            dark: '#A13E73',
            darker: '#540639',
          },
          grey: {
            DEFAULT: '#8D8DC0',
            light: '#E9E9EE',
            medium: '#D5D5DA',
            dark: '#9999A6',
          },
        },
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': '#E9E9EE',
              '--tw-prose-headings': '#FFFFFF',
              '--tw-prose-links': '#9051F4',
              h1: {
                fontWeight: '700',
                marginBottom: '0.25em',
              },
              h2: {
                color: '#9051F4',
              },
              a: {
                color: '#9051F4',
                textDecoration: 'none',
                '&:hover': {
                  color: '#C5A1FF',
                },
              },
              code: {
                color: '#FF99D2',
                fontFamily: 'var(--font-geist-mono)',
              },
              'pre code': {
                color: '#E9E9EE',
              },
              blockquote: {
                borderLeftColor: '#9051F4',
                color: '#8D8DC0',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      }),
    },
  },
}

export default config
