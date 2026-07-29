/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0C0C',
          soft: '#151818',
          lift: '#242828',
        },
        fog: {
          DEFAULT: '#F4F5F3',
          soft: '#E9EBE8',
          deep: '#D2D6D3',
        },
        aqua: {
          DEFAULT: '#1A5F62',
          soft: '#267A7E',
          deep: '#134A4D',
          mist: 'rgba(26, 95, 98, 0.12)',
          light: '#5AADB0',
        },
        leaf: {
          DEFAULT: '#4F6B58',
          soft: '#7A9A84',
          mist: '#D9E5DD',
        },
        champagne: '#C4B5A0',
        volt: {
          DEFAULT: '#E8C547',
          soft: '#F3DA7A',
        },
        snow: '#FFFFFF',
        mute: '#646864',
        line: '#D8DCD8',
      },
      fontFamily: {
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 50px rgba(10, 12, 12, 0.07)',
        lift: '0 36px 90px rgba(10, 12, 12, 0.18)',
        glow: '0 0 48px rgba(26, 95, 98, 0.35)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.35)', opacity: '1' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        'pulse-dot': 'pulseDot 2.8s ease-in-out infinite',
        drift: 'drift 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
