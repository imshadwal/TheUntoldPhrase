import { createTheme, rem } from '@mantine/core'

/** Deep wine — literary accent with strong contrast on light paper */
const wine = [
  '#faf6f7',
  '#f0e6e8',
  '#e0c9ce',
  '#c99aa4',
  '#a86b78',
  '#8a4554',
  '#6e2f3c',
  '#5a2631',
  '#481e27',
  '#34161c',
]

export const theme = createTheme({
  primaryColor: 'wine',
  colors: {
    wine,
  },
  white: '#ffffff',
  black: '#1a1816',
  fontFamily: '"DM Sans", system-ui, sans-serif',
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  headings: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: '500',
    sizes: {
      h1: { fontSize: rem(48), lineHeight: '1.15' },
      h2: { fontSize: rem(36), lineHeight: '1.2' },
      h3: { fontSize: rem(24), lineHeight: '1.3' },
    },
  },
  defaultRadius: 'md',
  primaryShade: 6,
  defaultGradient: { from: 'wine.6', to: 'wine.4', deg: 135 },
  other: {
    paper: '#f7f5f2',
    ink: '#1a1816',
    line: '#e5e1db',
    muted: '#6b6560',
    accent: '#6e2f3c',
    reading: '"Source Serif 4", Georgia, serif',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'xl',
      },
      styles: {
        root: {
          fontSize: rem(11.5),
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          fontWeight: 600,
          height: 'auto',
          paddingInline: rem(22),
          paddingBlock: rem(14),
        },
      },
    },
    TextInput: {
      defaultProps: { radius: 'md', size: 'md' },
      styles: {
        label: {
          fontSize: rem(12),
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#6b6560',
          fontWeight: 500,
          marginBottom: rem(6),
        },
        input: {
          backgroundColor: '#fff',
          borderColor: '#e5e1db',
          color: '#1a1816',
        },
      },
    },
    Textarea: {
      defaultProps: { radius: 'md', size: 'md', autosize: true, minRows: 5 },
      styles: {
        label: {
          fontSize: rem(12),
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#6b6560',
          fontWeight: 500,
          marginBottom: rem(6),
        },
        input: {
          backgroundColor: '#fff',
          borderColor: '#e5e1db',
          color: '#1a1816',
          fontFamily: '"Source Serif 4", Georgia, serif',
        },
      },
    },
    Select: {
      defaultProps: { radius: 'md', size: 'md' },
      styles: {
        label: {
          fontSize: rem(12),
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#6b6560',
          fontWeight: 500,
          marginBottom: rem(6),
        },
        input: {
          backgroundColor: '#fff',
          borderColor: '#e5e1db',
          color: '#1a1816',
        },
      },
    },
    Alert: {
      defaultProps: { radius: 'md', color: 'wine', variant: 'light' },
    },
    Badge: { defaultProps: { radius: 'xl' } },
    Paper: { defaultProps: { radius: 0, shadow: 'none' } },
  },
})
