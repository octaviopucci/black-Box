/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#12110F',
          soft: '#1C1A17',
          lift: '#2A2723',
        },
        porcelain: {
          DEFAULT: '#F7F4EF',
          soft: '#EFEAE2',
          deep: '#E2DBD0',
        },
        gold: {
          DEFAULT: '#C4A574',
          soft: '#D4BC94',
          deep: '#9A7D4F',
          mist: 'rgba(196, 165, 116, 0.14)',
        },
        fern: {
          DEFAULT: '#2F4A3A',
          soft: '#4A6B56',
          mist: '#D7E4DB',
          glow: '#6F9A7E',
        },
        oak: '#B89B78',
        snow: '#FFFFFF',
        mute: '#6E6860',
        line: '#D9D2C6',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Sora"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 48px rgba(18, 17, 15, 0.08)',
        lift: '0 32px 80px rgba(18, 17, 15, 0.16)',
        glow: '0 0 42px rgba(196, 165, 116, 0.35)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        wave: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(196,165,116,0.12), transparent 60%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
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
