/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14100c',
          lift: '#1f1812',
          soft: '#2a221a',
        },
        paper: {
          DEFAULT: '#f3ece2',
          soft: '#faf6f0',
          mute: '#a89b8c',
        },
        brass: {
          DEFAULT: '#b8956c',
          soft: '#d4b48a',
          deep: '#8f7048',
        },
        wood: {
          DEFAULT: '#3d2e24',
          warm: '#5c4332',
        },
        line: 'rgba(243, 236, 226, 0.12)',
      },
      fontFamily: {
        brand: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        atelier: '0 32px 80px rgba(20, 16, 12, 0.45)',
      },
      transitionTimingFunction: {
        atelier: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        heroVeil:
          'linear-gradient(105deg, rgba(20,16,12,0.88) 0%, rgba(20,16,12,0.55) 45%, rgba(20,16,12,0.25) 100%)',
      },
    },
  },
  plugins: [],
}
