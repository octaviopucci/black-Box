/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#c4342a',
          deep: '#9a2921',
          soft: '#e85a4f',
        },
        ink: '#171311',
        mute: '#5c534e',
        line: '#e4ddd6',
        paper: '#fbf8f5',
        mist: '#f0ebe4',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(23, 19, 17, 0.08)',
      },
    },
  },
  plugins: [],
}
