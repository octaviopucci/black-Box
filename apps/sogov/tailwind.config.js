/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gov: {
          DEFAULT: '#1351B4',
          light: '#2670E8',
          soft: '#D4E5FF',
          mist: '#EDF5FF',
          deep: '#0C326F',
          darker: '#071D41',
        },
        flag: {
          green: '#009C3B',
          yellow: '#FFDF00',
          blue: '#002776',
        },
        success: '#268744',
        ink: '#333333',
        mute: '#555555',
        line: '#CCCCCC',
        paper: '#FFFFFF',
        mist: '#F8F8F8',
        wash: '#EDEDED',
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'Verdana', 'system-ui', 'sans-serif'],
        display: ['"Noto Sans"', 'Verdana', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 28px rgba(7, 29, 65, 0.08)',
        gov: '0 4px 16px rgba(19, 81, 180, 0.18)',
      },
    },
  },
  plugins: [],
}
