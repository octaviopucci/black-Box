/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FBF6F7',
          soft: '#FFFCFC',
          blush: '#F4E6EA',
        },
        rose: {
          DEFAULT: '#C9899A',
          deep: '#B56B7E',
          soft: '#E2B8C2',
          mist: 'rgba(201, 137, 154, 0.16)',
        },
        ink: {
          DEFAULT: '#2A2426',
          soft: '#4A4245',
        },
        ash: {
          DEFAULT: '#8A7F82',
          line: 'rgba(42, 36, 38, 0.12)',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        heroFade:
          'linear-gradient(180deg, rgba(42,36,38,0.18) 0%, rgba(42,36,38,0.28) 38%, rgba(42,36,38,0.78) 100%)',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.08)' },
        },
      },
      animation: {
        'glow-pulse': 'glowPulse 3.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
