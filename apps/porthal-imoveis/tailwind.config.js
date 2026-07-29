/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#c4342a',
          deep: '#8a1f18',
          soft: '#e4574c',
        },
        ink: '#0a0908',
        mute: '#7a736c',
        line: '#d9d1c7',
        paper: '#f3efe9',
        mist: '#e8e1d7',
        sale: '#0f766e',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Syne"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 60px rgba(10, 9, 8, 0.12)',
        lift: '0 40px 90px rgba(10, 9, 8, 0.2)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
