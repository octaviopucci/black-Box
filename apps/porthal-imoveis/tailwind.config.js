/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#c4342a',
          deep: '#8f241c',
          soft: '#d95a50',
        },
        ink: '#121110',
        mute: '#5e5954',
        line: '#d9d5cf',
        paper: '#f5f4f1',
        mist: '#ebe9e4',
        stone: '#e4e1db',
        forest: '#1f3a30',
        sage: '#3d5c4e',
        sale: '#0f6e6b',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 40px rgba(18, 17, 16, 0.07)',
        lift: '0 30px 60px rgba(18, 17, 16, 0.12)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      letterSpacing: {
        brand: '0.28em',
      },
    },
  },
  plugins: [],
}
