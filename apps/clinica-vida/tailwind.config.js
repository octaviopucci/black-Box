/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0F1A14',
          soft: '#162820',
          lift: '#1E3528',
        },
        paper: {
          DEFAULT: '#F6FAF7',
          soft: '#ECF4EE',
          deep: '#DDE8E0',
        },
        vida: {
          DEFAULT: '#3D9B6A',
          soft: '#7ECBA8',
          deep: '#2A7350',
          mist: 'rgba(61, 155, 106, 0.14)',
        },
        canopy: {
          DEFAULT: '#1A3D2E',
          soft: '#2F5C48',
          glow: '#4A8F6E',
        },
        snow: '#FFFFFF',
        mute: '#5A6B62',
        line: '#C8D9CE',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 48px rgba(15, 26, 20, 0.08)',
        lift: '0 32px 80px rgba(15, 26, 20, 0.14)',
        glow: '0 0 42px rgba(61, 155, 106, 0.28)',
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
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
      },
      animation: {
        'pulse-ring': 'pulseRing 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
