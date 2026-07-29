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
        ink: '#120e0c',
        mute: '#6a5f58',
        line: '#ddd4cb',
        paper: '#faf7f4',
        mist: '#efe8e1',
        sale: '#0f8f8c',
        rent: '#c4342a',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 60px rgba(18, 14, 12, 0.1)',
        lift: '0 30px 80px rgba(18, 14, 12, 0.16)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
