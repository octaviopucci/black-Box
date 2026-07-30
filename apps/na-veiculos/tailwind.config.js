/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#08090B',
          lift: '#101218',
          soft: '#171A22',
          mist: '#222733',
        },
        paper: {
          DEFAULT: '#ECEEF2',
          soft: '#F7F8FA',
          mute: '#9BA1AD',
          deep: '#6E7583',
        },
        lamp: {
          DEFAULT: '#C8102E',
          soft: '#E83A52',
          deep: '#8E0B20',
          mist: 'rgba(200, 16, 46, 0.16)',
        },
        line: 'rgba(236, 238, 242, 0.12)',
      },
      fontFamily: {
        display: ['"Syne"', 'system-ui', 'sans-serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        stage: '0 40px 100px rgba(0, 0, 0, 0.55)',
        lamp: '0 0 60px rgba(200, 16, 46, 0.28)',
      },
      transitionTimingFunction: {
        cinema: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        vignette:
          'radial-gradient(ellipse 75% 60% at 50% 40%, transparent 0%, rgba(8,9,11,0.82) 100%)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.45' },
          '40%': { opacity: '0.85' },
          '60%': { opacity: '0.55' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(2%, -1%, 0)' },
        },
      },
      animation: {
        flicker: 'flicker 5.5s ease-in-out infinite',
        drift: 'drift 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
