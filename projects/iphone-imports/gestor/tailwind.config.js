/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0a0a0a',
          surface: '#121212',
          elevated: '#1a1a1a',
          border: '#2e2e2e',
          muted: '#6b6b6b',
          gray: '#9ca3af',
          silver: '#d1d5db',
          accent: '#e5e7eb',
        },
      },
    },
  },
  plugins: [],
}
