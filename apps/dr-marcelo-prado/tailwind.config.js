/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#0A1612',
          deep: '#06100D',
          soft: '#14241E',
          lift: '#1C3229',
        },
        celadon: {
          DEFAULT: '#9BB8A8',
          soft: '#C5D6CC',
          mist: '#DDE8E2',
          deep: '#6A8F7C',
        },
        signal: {
          DEFAULT: '#C5E063',
          soft: '#DCEF9A',
          deep: '#9BB83A',
          glow: 'rgba(197, 224, 99, 0.28)',
        },
        mist: '#EEF2EF',
        bone: '#F7F9F7',
        snow: '#FFFFFF',
        ink: '#12201A',
        mute: '#5C7268',
        line: '#D5E0DA',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Figtree"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 60px rgba(10, 22, 18, 0.08)',
        lift: '0 36px 90px rgba(10, 22, 18, 0.16)',
        pulse: '0 0 48px rgba(197, 224, 99, 0.35)',
      },
      transitionTimingFunction: {
        cascade: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        mesh: 'radial-gradient(ellipse 80% 50% at 20% 10%, rgba(197,224,99,0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 20%, rgba(155,184,168,0.18), transparent 50%), radial-gradient(ellipse 50% 45% at 50% 100%, rgba(106,143,124,0.12), transparent 55%)',
      },
      keyframes: {
        pulseNode: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.15)', opacity: '1' },
        },
        cascadeDrift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        signalFlow: {
          from: { strokeDashoffset: '120' },
          to: { strokeDashoffset: '0' },
        },
      },
      animation: {
        'pulse-node': 'pulseNode 3.2s ease-in-out infinite',
        'cascade-drift': 'cascadeDrift 8s ease-in-out infinite',
        'signal-flow': 'signalFlow 2.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
