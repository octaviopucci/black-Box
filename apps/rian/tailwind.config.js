/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        panel: '#0C0C0C',
        steel: '#161616',
        line: '#242424',
        ash: '#8A8A8A',
        mist: '#C9C9C9',
        paper: '#F3F3F3',
        signal: '#E10600',
        signalHot: '#FF2A1F',
        will: '#2EE59D',
        willDim: '#0F3D2C',
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
        sans: ['"Sora"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        arena:
          'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(225,6,0,0.18), transparent 60%), radial-gradient(ellipse 70% 50% at 70% 80%, rgba(46,229,157,0.08), transparent 55%), linear-gradient(180deg, #050505 0%, #0a0a0a 45%, #050505 100%)',
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
        floatY: 'floatY 3.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
