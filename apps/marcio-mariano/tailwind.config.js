/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#004395',
          deep: '#002B5C',
          mid: '#0A5AB8',
          soft: '#3D7BC4',
          mist: '#E8F0FA',
          wash: '#F3F7FC',
        },
        gold: {
          DEFAULT: '#F9C322',
          soft: '#FFD95A',
          deep: '#C9960A',
        },
        mark: '#E30613',
        ink: '#0A1628',
        mute: '#4A5A6E',
        line: '#CDD7E5',
        paper: '#F7F9FC',
        snow: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 16px 40px rgba(0, 43, 92, 0.08)',
        lift: '0 28px 60px rgba(0, 43, 92, 0.14)',
        glow: '0 0 0 1px rgba(249, 195, 34, 0.35)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
        'hero-veil':
          'linear-gradient(115deg, rgba(0,43,92,0.92) 0%, rgba(0,67,149,0.55) 48%, rgba(0,67,149,0.28) 100%)',
      },
      maxWidth: {
        shell: '76rem',
      },
    },
  },
  plugins: [],
}
