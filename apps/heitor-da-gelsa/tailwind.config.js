/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#00A859',
          dark: '#006B3C',
          deep: '#004D2A',
        },
        yellow: {
          DEFAULT: '#FFD500',
          gold: '#E5B800',
        },
        blue: {
          support: '#0057B8',
        },
        graphite: '#101418',
        paper: {
          DEFAULT: '#f2f6f3',
          warm: '#e8f0eb',
        },
        mute: '#5c6560',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        header: '0 4px 24px rgba(0, 77, 42, 0.12)',
        card: '0 12px 40px rgba(16, 20, 24, 0.08)',
        'card-hover': '0 20px 48px rgba(0, 77, 42, 0.14)',
        editorial: '0 24px 64px rgba(0, 77, 42, 0.1)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
        heroMesh:
          'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(0,168,89,0.35) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(255,213,0,0.12) 0%, transparent 50%)',
        sectionMesh:
          'radial-gradient(ellipse 70% 50% at 100% 0%, rgba(0,168,89,0.06) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(255,213,0,0.05) 0%, transparent 50%)',
        contactMesh:
          'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,213,0,0.12) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(0,168,89,0.2) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}
