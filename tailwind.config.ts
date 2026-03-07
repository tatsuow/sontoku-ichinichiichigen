import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          text: '#3d3428',
          button: '#6b5344',
        },
        secondary: {
          text: '#8a7d6b',
        },
        bg: {
          default: '#faf8f5',
          card: '#ffffff',
          input: '#f5f1ec',
        },
        border: {
          default: 'rgba(107,83,68,0.15)',
        },
      },
      fontFamily: {
        'noto-serif-jp': ['Noto Serif JP', 'serif'],
        'noto-sans-jp': ['Noto Sans JP', 'sans-serif'],
      },
      borderRadius: {
        input: '10px',
        card: '14px',
      },
      boxShadow: {
        sm: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
export default config
