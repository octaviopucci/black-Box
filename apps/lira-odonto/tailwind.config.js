/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A1018',
          soft: '#1A2433',
          mute: '#4A5568',
        },
        paper: {
          DEFAULT: '#F6F3EE',
          soft: '#FDFCFA',
          dim: '#E8E4DC',
        },
        crystal: {
          DEFAULT: '#9CC4D4',
          soft: '#C5DDE8',
          deep: '#6A9FB3',
        },
        pearl: {
          DEFAULT: '#E8EDF2',
          glow: 'rgba(232, 237, 242, 0.12)',
        },
        line: 'rgba(10, 16, 24, 0.08)',
      },
      fontFamily: {
        display: ['"Libre Caslon Display"', 'Georgia', 'serif'],
        sans: ['"Albert Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
        heroVeil:
          'linear-gradient(165deg, rgba(10,16,24,0.35) 0%, rgba(10,16,24,0.55) 45%, rgba(10,16,24,0.88) 100%)',
        sectionFade:
          'linear-gradient(180deg, rgba(246,243,238,0) 0%, rgba(246,243,238,1) 18%)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        editorial: '0 32px 80px rgba(10, 16, 24, 0.14)',
      },
    },
  },
  plugins: [],
}
