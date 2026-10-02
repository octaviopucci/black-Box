/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a1520',
          lift: '#122030',
          soft: '#1a2d42',
        },
        paper: {
          DEFAULT: '#f3f6f9',
          soft: '#fafbfd',
          mute: '#8b9aab',
        },
        enamel: {
          DEFAULT: '#6b9eb8',
          soft: '#9ec4d8',
          deep: '#3d7288',
        },
        pearl: {
          DEFAULT: '#dce8ef',
          warm: '#e8e2d8',
        },
        line: 'rgba(243, 246, 249, 0.1)',
      },
      fontFamily: {
        brand: ['"Fraunces"', 'Georgia', 'serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        clinic: '0 40px 100px rgba(10, 21, 32, 0.55)',
      },
      transitionTimingFunction: {
        clinic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        heroVeil:
          'linear-gradient(115deg, rgba(10,21,32,0.92) 0%, rgba(10,21,32,0.62) 42%, rgba(10,21,32,0.18) 100%)',
      },
    },
  },
  plugins: [],
}
