/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12110f',
        paper: '#f6f2eb',
        sheet: '#fffdf8',
        accent: '#7a3040',
        'accent-deep': '#5a2230',
        slate: '#2a3340',
        mute: '#6e6760',
        line: 'rgba(18, 17, 15, 0.1)',
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        mark: '0.22em',
      },
      maxWidth: {
        measure: '38rem',
      },
    },
  },
  plugins: [],
}
