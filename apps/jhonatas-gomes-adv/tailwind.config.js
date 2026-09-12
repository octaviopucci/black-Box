/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B1018',
          soft: '#141C28',
          lift: '#1E2A3D',
        },
        paper: {
          DEFAULT: '#F4F0E8',
          soft: '#EAE4D9',
          deep: '#D8D0C2',
        },
        navy: {
          DEFAULT: '#1A2744',
          soft: '#243556',
          deep: '#101A2E',
        },
        gold: {
          DEFAULT: '#C9A84C',
          soft: '#E0C878',
          deep: '#9A7B2E',
          mist: 'rgba(201, 168, 76, 0.14)',
        },
        mute: '#7A8494',
        line: '#D4CEC2',
        snow: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 60px rgba(11, 16, 24, 0.08)',
        lift: '0 40px 100px rgba(11, 16, 24, 0.22)',
        gold: '0 0 40px rgba(201, 168, 76, 0.25)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.65' },
          '50%': { transform: 'scale(1.3)', opacity: '1' },
        },
      },
      animation: {
        'pulse-dot': 'pulseDot 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
