/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: '#78243C',
          deep: '#5C1A2C',
          soft: '#8F3A52',
          mist: 'rgba(120, 36, 60, 0.12)',
          glow: '#A34D66',
        },
        rose: {
          DEFAULT: '#C48A94',
          soft: '#D4A8B0',
          deep: '#9E6570',
          mist: 'rgba(196, 138, 148, 0.16)',
        },
        cream: {
          DEFAULT: '#F9F4F1',
          soft: '#F3EBE6',
          deep: '#E8DDD4',
        },
        ink: {
          DEFAULT: '#1A1214',
          soft: '#2A1E22',
          lift: '#3D2C32',
        },
        sand: '#D8C8BC',
        brass: {
          DEFAULT: '#C4A06A',
          soft: '#D4B888',
          deep: '#9A7A48',
        },
        mute: '#7A6B6E',
        snow: '#FFFFFF',
        line: '#E2D4CE',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
        script: ['"Italianno"', 'cursive'],
      },
      boxShadow: {
        soft: '0 18px 48px rgba(26, 18, 20, 0.08)',
        lift: '0 28px 70px rgba(26, 18, 20, 0.16)',
        glow: '0 0 42px rgba(196, 138, 148, 0.35)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        velvet:
          'radial-gradient(ellipse 70% 50% at 20% 0%, rgba(196,138,148,0.14), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 20%, rgba(120,36,60,0.08), transparent 50%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
        },
        draw: {
          '0%': { strokeDashoffset: '1' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        'pulse-ring': 'pulseRing 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
