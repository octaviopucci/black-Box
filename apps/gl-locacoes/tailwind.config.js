/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: '#07131C',
          lift: '#0E2230',
          soft: '#163246',
        },
        paper: {
          DEFAULT: '#F6EFE3',
          soft: '#FFF8EE',
          mute: '#C9BFAE',
        },
        sun: {
          DEFAULT: '#F5C15A',
          soft: '#FFD784',
          deep: '#D49A2E',
          mist: 'rgba(245, 193, 90, 0.16)',
        },
        coral: {
          DEFAULT: '#FF6B5B',
          soft: '#FF8A7D',
          deep: '#E04E3F',
        },
        mint: {
          DEFAULT: '#6EC9A8',
          soft: '#8FDBC0',
        },
        line: 'rgba(246, 239, 227, 0.14)',
      },
      fontFamily: {
        brand: ['"Bricolage Grotesque"', 'Georgia', 'serif'],
        display: ['"Bricolage Grotesque"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        fest: '0 28px 80px rgba(7, 19, 28, 0.45)',
        sun: '0 0 48px rgba(245, 193, 90, 0.28)',
      },
      transitionTimingFunction: {
        fest: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        heroFade:
          'linear-gradient(180deg, rgba(7,19,28,0.35) 0%, rgba(7,19,28,0.55) 45%, rgba(7,19,28,0.92) 100%)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.05)' },
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        floaty: 'floaty 5.5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        drift: 'drift 42s linear infinite',
      },
    },
  },
  plugins: [],
}
