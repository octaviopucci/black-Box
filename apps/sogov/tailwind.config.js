/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0d4f3c',
          deep: '#083629',
          soft: '#1a7a5c',
          mist: '#d8efe6',
        },
        brass: {
          DEFAULT: '#b8954a',
          soft: '#e8d7a8',
        },
        ink: '#102019',
        mute: '#5a6b63',
        line: '#d5e0db',
        paper: '#f3f7f5',
        mist: '#e6eeea',
      },
      fontFamily: {
        display: ['"Syne"', 'system-ui', 'sans-serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 50px rgba(16, 32, 25, 0.08)',
      },
    },
  },
  plugins: [],
}
