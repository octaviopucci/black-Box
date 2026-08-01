/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#071428',
          lift: '#0C1F3D',
          soft: '#143056',
          mist: 'rgba(7, 20, 40, 0.72)',
        },
        sun: {
          DEFAULT: '#F5C518',
          soft: '#FFE06A',
          deep: '#D4A60A',
          mist: 'rgba(245, 197, 24, 0.16)',
        },
        gold: {
          DEFAULT: '#C9A227',
          soft: '#E0BC4A',
        },
        sky: {
          DEFAULT: '#3D9BE0',
          soft: '#6BB6EF',
        },
        paper: {
          DEFAULT: '#F7F4EC',
          soft: '#FFFDF8',
          mute: '#B8B3A6',
        },
        ink: {
          DEFAULT: '#0E1726',
          soft: '#2A3548',
        },
        line: 'rgba(247, 244, 236, 0.14)',
      },
      fontFamily: {
        brand: ['"Fraunces"', 'Georgia', 'serif'],
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        sans: ['"Sora"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        fest: '0 28px 70px rgba(7, 20, 40, 0.35)',
        sun: '0 0 40px rgba(245, 197, 24, 0.28)',
      },
      transitionTimingFunction: {
        fest: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        heroFade:
          'linear-gradient(180deg, rgba(7,20,40,0.25) 0%, rgba(7,20,40,0.45) 40%, rgba(7,20,40,0.92) 100%)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.06)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        floaty: 'floaty 5.5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3.8s ease-in-out infinite',
        marquee: 'marquee 36s linear infinite',
      },
    },
  },
  plugins: [],
}
