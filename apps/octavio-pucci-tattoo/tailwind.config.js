/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#070707',
          lift: '#111111',
          veil: '#1a1816',
        },
        parchment: {
          DEFAULT: '#ddd5c8',
          soft: '#b8afa3',
          mute: '#7a7268',
        },
        copper: {
          DEFAULT: '#a8895a',
          bright: '#c4a574',
          dim: '#6e5a3a',
        },
        ember: '#3d2a1f',
      },
      fontFamily: {
        brand: ['"Bebas Neue"', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Karla', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        steel: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
        scanlines:
          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      },
      keyframes: {
        pulseLine: {
          '0%, 100%': { transform: 'scaleX(0.4)', opacity: '0.35' },
          '50%': { transform: 'scaleX(1)', opacity: '1' },
        },
      },
      animation: {
        'pulse-line': 'pulseLine 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
