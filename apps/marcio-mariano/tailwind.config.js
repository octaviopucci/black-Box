/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F3A',
          deep: '#061426',
          mid: '#14325A',
          soft: '#1E4A7A',
        },
        brand: {
          DEFAULT: '#0C4A8C',
          deep: '#083466',
          soft: '#3B7CC4',
        },
        gold: {
          DEFAULT: '#C4A35A',
          soft: '#E0C98A',
          deep: '#8F7340',
        },
        chalk: '#F4F1EA',
        mist: '#E7E2D7',
        ink: '#12151C',
        mute: '#5C6470',
        line: '#D5CFC3',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(11, 31, 58, 0.08)',
        lift: '0 28px 70px rgba(11, 31, 58, 0.16)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
