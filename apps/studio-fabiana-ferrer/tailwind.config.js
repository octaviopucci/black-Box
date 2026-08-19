/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mist: '#F4F7F4',
        paper: '#FCFDFC',
        forest: '#1B4332',
        pine: '#2D6A4F',
        sage: '#40916C',
        leaf: '#74C69D',
        mint: '#D8F3DC',
        ink: '#121714',
        smoke: '#5C6B62',
        veil: 'rgba(27, 67, 50, 0.08)',
      },
      fontFamily: {
        display: ['Literata', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        mark: '0.22em',
      },
      maxWidth: {
        measure: '38rem',
        prose: '52rem',
      },
      boxShadow: {
        tactile: '0 1px 0 rgba(255,255,255,0.7) inset, 0 18px 40px -24px rgba(27,67,50,0.28)',
        lift: '0 24px 60px -28px rgba(27,67,50,0.35)',
        glow: '0 0 0 1px rgba(116,198,157,0.35), 0 12px 32px -16px rgba(27,67,50,0.25)',
      },
      backgroundImage: {
        grain:
          'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
      },
      animation: {
        breathe: 'breathe 6s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
      },
    },
  },
  plugins: [],
}
