/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#faf6f0',
        paper: '#fffdf9',
        ink: '#2a2218',
        gold: '#b8955a',
        'gold-light': '#d4b87a',
        rose: '#c9a0a8',
        mute: '#7a6f63',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        mark: '0.28em',
      },
      maxWidth: {
        measure: '36rem',
      },
      boxShadow: {
        soft: '0 18px 50px -24px rgba(42, 34, 24, 0.35)',
      },
    },
  },
  plugins: [],
}
