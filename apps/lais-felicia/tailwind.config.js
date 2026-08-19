/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /** Superfícies claras (ex-night no layout) */
        night: {
          DEFAULT: '#FBF6F7',
          soft: '#F3E8EB',
          lift: '#FFFFFF',
        },
        /** Acento rose oficial */
        gold: {
          DEFAULT: '#C9899A',
          deep: '#B56B7E',
          soft: '#E2B8C2',
          mist: 'rgba(201, 137, 154, 0.18)',
        },
        rose: {
          DEFAULT: '#C9899A',
          deep: '#B56B7E',
          soft: '#E2B8C2',
          mist: 'rgba(201, 137, 154, 0.18)',
        },
        /** Texto cinza oficial */
        ink: {
          DEFAULT: '#2A2426',
          soft: '#4A4244',
          mute: '#8A7F82',
        },
        paper: {
          DEFAULT: '#FBF6F7',
          mute: '#CFC4C7',
        },
      },
      fontFamily: {
        display: ['"Syne"', 'system-ui', 'sans-serif'],
        sans: ['"Didact Gothic"', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        preloaderSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        bounceLine: {
          '0%, 100%': { transform: 'scaleX(0.55)', opacity: '0.45' },
          '50%': { transform: 'scaleX(1)', opacity: '1' },
        },
      },
      animation: {
        'preloader-spin': 'preloaderSpin 1.7s cubic-bezier(0.65, 0.05, 0.35, 0.95) infinite',
        'bounce-line': 'bounceLine 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
