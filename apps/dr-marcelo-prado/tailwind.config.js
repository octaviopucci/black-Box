/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#030707',
        deep: '#0A1415',
        signal: '#6FB8B9',
        mist: '#A9D7D8',
        champagne: '#C9B8A4',
        paper: '#F0F3F2',
        ink: '#0B1212',
        mute: '#6E7F7F',
        line: '#C2D1D1',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'Georgia', 'serif'],
        sans: ['"Urbanist"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 30px 80px rgba(3, 7, 7, 0.35)',
        glow: '0 0 90px rgba(111, 184, 185, 0.28)',
        lift: '0 18px 50px rgba(3, 7, 7, 0.45)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        aura: 'radial-gradient(ellipse at 20% 10%, rgba(111,184,185,0.14), transparent 45%), radial-gradient(ellipse at 85% 70%, rgba(201,184,164,0.08), transparent 40%)',
      },
      letterSpacing: {
        brand: '0.32em',
        section: '0.36em',
      },
    },
  },
  plugins: [],
}
