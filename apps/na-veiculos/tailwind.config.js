/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        asphalt: {
          DEFAULT: '#07080A',
          lift: '#0E1014',
          soft: '#161A22',
          mist: '#1E2430',
        },
        chrome: {
          DEFAULT: '#E8EAED',
          soft: '#F4F5F7',
          mute: '#9AA0A8',
          deep: '#6B7280',
        },
        signal: {
          DEFAULT: '#C8102E',
          soft: '#E83A52',
          deep: '#8E0B20',
          mist: 'rgba(200, 16, 46, 0.14)',
        },
        line: 'rgba(232, 234, 237, 0.12)',
      },
      fontFamily: {
        brand: ['"Oswald"', 'Impact', 'sans-serif'],
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        asphalt: '0 28px 80px rgba(0, 0, 0, 0.55)',
        signal: '0 0 48px rgba(200, 16, 46, 0.28)',
      },
      transitionTimingFunction: {
        drive: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        road:
          'linear-gradient(90deg, transparent 0%, rgba(232,234,237,0.06) 48%, rgba(232,234,237,0.14) 50%, rgba(232,234,237,0.06) 52%, transparent 100%)',
        vignette:
          'radial-gradient(ellipse 70% 55% at 50% 40%, transparent 0%, rgba(7,8,10,0.78) 100%)',
      },
      keyframes: {
        headlight: {
          '0%, 100%': { opacity: '0.35', transform: 'translateX(-4%)' },
          '50%': { opacity: '0.7', transform: 'translateX(4%)' },
        },
        laneDash: {
          to: { strokeDashoffset: '-240' },
        },
        speedPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        headlight: 'headlight 7s ease-in-out infinite',
        'lane-dash': 'laneDash 12s linear infinite',
        'speed-pulse': 'speedPulse 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
