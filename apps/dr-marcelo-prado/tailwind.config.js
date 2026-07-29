/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0B0B',
          soft: '#1A1A1A',
          lift: '#2A2A2A',
        },
        fog: {
          DEFAULT: '#F3F3F1',
          soft: '#E8E8E5',
          deep: '#D4D4D0',
        },
        wine: {
          DEFAULT: '#7A2E3D',
          soft: '#A34B5C',
          deep: '#5A1F2C',
          mist: 'rgba(122, 46, 61, 0.12)',
        },
        leaf: {
          DEFAULT: '#4F6B58',
          soft: '#7A9A84',
          mist: '#D9E5DD',
        },
        volt: {
          DEFAULT: '#E8C547',
          soft: '#F3DA7A',
        },
        snow: '#FFFFFF',
        mute: '#6B6B66',
        line: '#DCDCD7',
      },
      fontFamily: {
        display: ['"Syne"', 'system-ui', 'sans-serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 60px rgba(11, 11, 11, 0.08)',
        lift: '0 40px 100px rgba(11, 11, 11, 0.22)',
        glow: '0 0 40px rgba(122, 46, 61, 0.35)',
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
          '50%': { transform: 'translateY(-14px)' },
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
