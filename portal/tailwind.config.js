/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        panel: 'var(--panel)',
        line: 'var(--line)',
        paper: 'var(--paper)',
        mute: 'var(--mute)',
        silver: 'var(--silver)',
        metal: 'var(--metal)',
        status: 'var(--status)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        section: '0.22em',
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
}
