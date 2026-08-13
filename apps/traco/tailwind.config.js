/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0C1016',
        slate: '#151B24',
        panel: '#1A222E',
        line: '#2A3545',
        mist: '#8B97A8',
        bone: '#F2EEE6',
        ember: '#FF6B3D',
        emberSoft: '#FF8F66',
        jade: '#3DDC97',
        sky: '#5BA8FF',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Sora"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 20px 60px rgba(0, 0, 0, 0.45)',
        glow: '0 0 36px rgba(255, 107, 61, 0.28)',
      },
      backgroundImage: {
        atmosphere:
          'radial-gradient(ellipse 80% 60% at 12% 18%, rgba(255,107,61,0.22), transparent 55%), radial-gradient(ellipse 70% 50% at 88% 12%, rgba(91,168,255,0.14), transparent 50%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(61,220,151,0.08), transparent 55%), linear-gradient(168deg, #0C1016 0%, #121821 48%, #0E141C 100%)',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        floatY: 'floatY 5s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
