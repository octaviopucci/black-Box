/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: '#78243C',
          deep: '#4A1524',
          soft: '#8F3A52',
          mist: 'rgba(120, 36, 60, 0.1)',
        },
        rose: {
          DEFAULT: '#C48A94',
          soft: '#D9AAB2',
          deep: '#9E6570',
          mist: 'rgba(196, 138, 148, 0.14)',
        },
        signal: {
          DEFAULT: '#C2185B',
          soft: '#E85A8A',
          mist: 'rgba(194, 24, 91, 0.12)',
        },
        cream: {
          DEFAULT: '#F7F1EC',
          soft: '#EFE6DF',
          deep: '#E2D5CC',
        },
        ink: {
          DEFAULT: '#1A1214',
          soft: '#2C1F24',
          lift: '#3F2D34',
        },
        sand: '#D4C4B6',
        brass: {
          DEFAULT: '#B8955C',
          soft: '#D0B078',
        },
        mute: '#7A6B6E',
        snow: '#FFFFFF',
        line: '#E0D2CB',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Sora"', 'system-ui', 'sans-serif'],
        script: ['"Petit Formal Script"', 'cursive'],
      },
      boxShadow: {
        soft: '0 16px 40px rgba(26, 18, 20, 0.07)',
        lift: '0 28px 64px rgba(26, 18, 20, 0.14)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.45' },
          '50%': { transform: 'scale(1.12)', opacity: '1' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'pulse-ring': 'pulseRing 3.2s ease-in-out infinite',
        drift: 'drift 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
