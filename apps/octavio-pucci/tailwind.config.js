/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#070707',
          lift: '#101010',
        },
        ink: {
          DEFAULT: '#0E0E0E',
          soft: '#161616',
          lift: '#222222',
        },
        bone: {
          DEFAULT: '#E8E2D6',
          soft: '#F2EDE3',
          mute: '#B8B0A2',
        },
        gold: {
          DEFAULT: '#B8956A',
          soft: '#D0B089',
          deep: '#8F7048',
          mist: 'rgba(184, 149, 106, 0.14)',
        },
        ash: {
          DEFAULT: '#8A8680',
          soft: '#A8A39B',
          deep: '#5C5954',
        },
        line: 'rgba(232, 226, 214, 0.12)',
      },
      fontFamily: {
        brand: ['"Big Shoulders Display"', 'Impact', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Figtree"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        ink: '0 28px 80px rgba(0, 0, 0, 0.55)',
        gold: '0 0 48px rgba(184, 149, 106, 0.22)',
      },
      transitionTimingFunction: {
        ink: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        vignette:
          'radial-gradient(ellipse 70% 55% at 50% 40%, transparent 0%, rgba(7,7,7,0.72) 100%)',
      },
      keyframes: {
        inkPulse: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.04)' },
        },
        needleDrift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        'ink-pulse': 'inkPulse 4.5s ease-in-out infinite',
        'needle-drift': 'needleDrift 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
