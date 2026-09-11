/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0c0d0d',
          surface: '#1a1528',
          elevated: '#221c35',
          border: '#2d2640',
          muted: '#8b92a5',
          gray: '#b8bcc8',
          blue: '#385189',
          purple: '#520462',
          'purple-hover': '#6b0a84',
          glow: '#bc00ff',
          neon: '#bc00ff',
          'neon-cyan': '#00d4ff',
          accent: '#f0e6ff',
        },
      },
    },
  },
  plugins: [],
}
