/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#071018',
        abyss: '#0B1520',
        slateDeep: '#12202E',
        line: '#1E3244',
        mist: '#8BA3B5',
        paper: '#F4F7FA',
        flame: '#FF5A2D',
        flameHot: '#FF7A4A',
        ember: '#FFB347',
        signal: '#2DD4A8',
        sky: '#3BA3FF',
      },
      fontFamily: {
        display: ['"Syne"', 'system-ui', 'sans-serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(255, 90, 45, 0.28)',
        soft: '0 18px 50px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        hero:
          'radial-gradient(ellipse 90% 70% at 15% 10%, rgba(255,90,45,0.28), transparent 55%), radial-gradient(ellipse 70% 55% at 85% 20%, rgba(59,163,255,0.16), transparent 50%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(45,212,168,0.1), transparent 55%), linear-gradient(165deg, #071018 0%, #0B1520 45%, #0A121C 100%)',
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.25)', opacity: '0' },
          '100%': { transform: 'scale(1.25)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        floatY: 'floatY 4s ease-in-out infinite',
        pulseRing: 'pulseRing 2.2s ease-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}
