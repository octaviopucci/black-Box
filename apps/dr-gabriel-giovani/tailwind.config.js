/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0C0F14',
          soft: '#161B24',
          lift: '#222833',
        },
        paper: {
          DEFAULT: '#FAFAF8',
          soft: '#F0EFEB',
          deep: '#E4E2DC',
        },
        teal: {
          DEFAULT: '#2F7A7D',
          soft: '#4A9699',
          deep: '#1F5558',
          mist: 'rgba(47, 122, 125, 0.10)',
        },
        gold: {
          DEFAULT: '#B8956B',
          soft: '#D4B896',
        },
        mute: '#6E7681',
        line: '#D8D4CC',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 40px 100px rgba(12, 15, 20, 0.16)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
