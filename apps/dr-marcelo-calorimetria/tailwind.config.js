/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A1211',
          soft: '#101B19',
          lift: '#182524',
        },
        paper: {
          DEFAULT: '#F1F4F2',
          soft: '#E7ECE8',
          deep: '#D6DEDA',
        },
        teal: {
          DEFAULT: '#0B4B4A',
          soft: '#146664',
          bright: '#2FA6A0',
          mist: 'rgba(47, 166, 160, 0.14)',
          deep: '#062F2E',
        },
        ember: {
          DEFAULT: '#C6642E',
          soft: '#D9814F',
          mist: 'rgba(198, 100, 46, 0.14)',
        },
        mute: '#6B7370',
        line: '#D7DEDA',
        snow: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 50px rgba(6, 15, 14, 0.08)',
        lift: '0 36px 90px rgba(6, 15, 14, 0.22)',
        glow: '0 0 60px rgba(47, 166, 160, 0.35)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scaleY(0.85)', opacity: '0.75' },
          '50%': { transform: 'scaleY(1.15)', opacity: '1' },
        },
        driftSlow: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-14px) translateX(6px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '80%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        breathe: 'breathe 4.2s ease-in-out infinite',
        'drift-slow': 'driftSlow 11s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2.6s ease-out infinite',
      },
    },
  },
  plugins: [],
}
