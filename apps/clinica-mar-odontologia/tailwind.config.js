/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mar: {
          rose: '#B8928F',
          'rose-deep': '#9A7572',
          'rose-mist': 'rgba(184, 146, 143, 0.18)',
          peach: '#E8A58C',
          'peach-deep': '#D4846A',
          'peach-mist': 'rgba(232, 165, 140, 0.22)',
          ink: '#2A2420',
          'ink-soft': '#4A403C',
          paper: '#FBF8F6',
          mist: '#F0E8E4',
          wave: '#C9ADA7',
          line: '#E4D8D2',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Figtree"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 50px rgba(42, 36, 32, 0.08)',
        lift: '0 32px 80px rgba(42, 36, 32, 0.14)',
      },
      transitionTimingFunction: {
        tide: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
        tide:
          'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(232,165,140,0.2), transparent 55%), radial-gradient(ellipse 60% 50% at 90% 30%, rgba(184,146,143,0.16), transparent 50%)',
      },
    },
  },
  plugins: [],
}
