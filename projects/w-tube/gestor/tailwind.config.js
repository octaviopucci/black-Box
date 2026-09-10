/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#050505',
          surface: '#12101a',
          elevated: '#1a1525',
          border: '#2d2640',
          muted: '#6b7280',
          gray: '#9ca3af',
          purple: '#9333ea',
          'purple-hover': '#a855f7',
          glow: '#c084fc',
          accent: '#e9d5ff',
        },
      },
    },
  },
  plugins: [],
}
