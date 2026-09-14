/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#12100e',
          lift: '#1c1814',
          soft: '#2a2420',
        },
        paper: {
          DEFAULT: '#f0ebe3',
          soft: '#faf7f2',
          mute: '#9a9084',
        },
        bronze: {
          DEFAULT: '#b8945f',
          soft: '#d4b483',
          deep: '#8a6d42',
        },
        chamber: {
          DEFAULT: '#3d2f22',
          warm: '#5c4634',
        },
        line: 'rgba(240, 235, 227, 0.1)',
      },
      fontFamily: {
        brand: ['"Fraunces"', 'Georgia', 'serif'],
        script: ['"Pinyon Script"', 'cursive'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        chamber: '0 40px 100px rgba(12, 10, 8, 0.55)',
      },
      transitionTimingFunction: {
        chamber: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
        heroVeil:
          'linear-gradient(115deg, rgba(18,16,14,0.92) 0%, rgba(18,16,14,0.72) 42%, rgba(18,16,14,0.35) 100%)',
        sectionVeil:
          'linear-gradient(180deg, rgba(18,16,14,0) 0%, rgba(18,16,14,0.85) 100%)',
      },
    },
  },
  plugins: [],
}
