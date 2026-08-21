/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lp: {
          ink: 'var(--lp-ink)',
          slate: 'var(--lp-slate)',
          steel: 'var(--lp-steel)',
          mist: 'var(--lp-mist)',
          paper: 'var(--lp-paper)',
          surface: 'var(--lp-surface)',
          line: 'var(--lp-line)',
          accent: 'var(--lp-accent)',
          'accent-dim': 'var(--lp-accent-dim)',
          'accent-soft': 'var(--lp-accent-soft)',
          copper: 'var(--lp-copper)',
          glow: 'var(--lp-glow)',
          warn: '#D97706',
          danger: '#B91C1C',
          ok: '#15803D',
        },
        status: {
          negociacao: '#6366F1',
          comprado: '#0EA5E9',
          documentacao: '#06B6D4',
          preparacao: '#8B5CF6',
          pronto: '#14B8A6',
          anunciado: '#0F766E',
          reservado: '#D97706',
          vendido: '#B91C1C',
          entregue: '#64748B',
          cancelado: '#94A3B8',
          disponivel: '#0F766E',
          consignado: '#3B82F6',
          oficina: '#EAB308',
          financiado: '#EC4899',
        },
      },
      fontFamily: {
        display: ['"Syne"', 'system-ui', 'sans-serif'],
        body: ['"Manrope"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        cinema: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      borderRadius: {
        lp: 'var(--lp-radius)',
        'lp-lg': 'var(--lp-radius-lg)',
      },
      boxShadow: {
        panel: '0 1px 2px rgba(0,0,0,0.08), 0 18px 40px rgba(0,0,0,0.18)',
        lift: '0 20px 48px rgba(0,0,0,0.28)',
        glow: '0 0 40px var(--lp-glow)',
      },
      backgroundImage: {
        'lp-grid':
          'linear-gradient(color-mix(in srgb, var(--lp-steel) 14%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--lp-steel) 14%, transparent) 1px, transparent 1px)',
        'lp-hero': 'var(--lp-wash)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
