/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: {
          DEFAULT: '#07111F',
          deep: '#040A14',
          soft: '#0E1C30',
        },
        navy: {
          DEFAULT: '#0B1A33',
          mid: '#143055',
          soft: '#1E4570',
        },
        aqua: {
          DEFAULT: '#7EB6D4',
          soft: '#B7D7E8',
          deep: '#3D7FA3',
          mist: '#E8F2F7',
        },
        life: {
          DEFAULT: '#E8A07A',
          soft: '#F3CDB8',
          deep: '#C4785A',
        },
        paper: '#F7FAFC',
        snow: '#FFFFFF',
        mist: '#E6EEF4',
        ink: '#0C1524',
        mute: '#5A6B7D',
        line: '#D0DCE6',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Sora"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 50px rgba(7, 17, 31, 0.08)',
        lift: '0 32px 80px rgba(7, 17, 31, 0.18)',
        glow: '0 0 60px rgba(126, 182, 212, 0.25)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
        helix:
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 Q15 10 30 30 T60 30' fill='none' stroke='%237EB6D4' stroke-opacity='0.12' stroke-width='1'/%3E%3Cpath d='M0 30 Q15 50 30 30 T60 30' fill='none' stroke='%237EB6D4' stroke-opacity='0.08' stroke-width='1'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.85' },
        },
        orbit: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
        orbit: 'orbit 28s linear infinite',
      },
    },
  },
  plugins: [],
}
