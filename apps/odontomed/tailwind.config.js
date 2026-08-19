/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#241c20',
          soft: '#3f3338',
          mute: '#7a6668',
        },
        paper: {
          DEFAULT: '#f8f2ef',
          lift: '#fdfaf8',
          deep: '#ead8d4',
        },
        copper: {
          DEFAULT: '#b07d70',
          light: '#d4a596',
          deep: '#8f5f54',
        },
        mauve: {
          DEFAULT: '#5a3f48',
          deep: '#3d2a31',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        tactile: 'cubic-bezier(0.33, 1, 0.38, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
