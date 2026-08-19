/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1c1917',
          soft: '#3d3834',
          mute: '#6b645c',
        },
        paper: {
          DEFAULT: '#ebe6df',
          lift: '#f6f2ec',
          deep: '#ddd6cc',
        },
        sage: {
          DEFAULT: '#6d7f6e',
          deep: '#556456',
          mist: 'rgba(109, 127, 110, 0.14)',
        },
        clay: {
          DEFAULT: '#b09486',
          soft: '#d4c0b4',
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Albert Sans"', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        tactile: 'cubic-bezier(0.33, 1, 0.38, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
