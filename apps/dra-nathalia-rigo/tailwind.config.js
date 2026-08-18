/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        fog: '#E4EEEC',
        ice: '#F3F8F6',
        ink: '#0C1916',
        cryo: '#3D6E68',
        mauve: '#6F4552',
        sage: '#9BB5AC',
        mute: '#5A6C67',
        beam: '#C9A36A',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        mark: '0.32em',
      },
      maxWidth: {
        measure: '38rem',
      },
    },
  },
  plugins: [],
}
