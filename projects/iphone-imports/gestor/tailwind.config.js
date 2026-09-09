/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFD400',
          black: '#0a0a0a',
          surface: '#141414',
          border: '#2a2a2a',
          gray: '#a0a0a0',
        },
      },
    },
  },
  plugins: [],
}
