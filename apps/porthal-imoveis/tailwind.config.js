/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#c4342a',
          deep: '#8f241c',
          soft: '#e45a4f',
        },
        ink: '#0c0b0a',
        mute: '#6b6560',
        line: '#ddd6ce',
        paper: '#f7f5f2',
        mist: '#ebe6e0',
        sale: '#0d7c79',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Sora"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 50px rgba(12, 11, 10, 0.08)',
        lift: '0 28px 70px rgba(12, 11, 10, 0.14)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
