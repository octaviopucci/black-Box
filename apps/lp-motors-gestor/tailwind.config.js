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
          line: 'var(--lp-line)',
          accent: 'var(--lp-accent)',
          'accent-dim': 'var(--lp-accent-dim)',
          'accent-soft': 'var(--lp-accent-soft)',
          copper: 'var(--lp-copper)',
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
          // legacy aliases
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
      },
      borderRadius: {
        lp: 'var(--lp-radius)',
        'lp-lg': 'var(--lp-radius-lg)',
      },
      boxShadow: {
        panel: '0 1px 2px rgba(12, 18, 34, 0.04), 0 8px 24px rgba(12, 18, 34, 0.06)',
        lift: '0 12px 32px rgba(12, 18, 34, 0.1)',
      },
      backgroundImage: {
        'lp-grid':
          'linear-gradient(color-mix(in srgb, var(--lp-steel) 12%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--lp-steel) 12%, transparent) 1px, transparent 1px)',
        'lp-hero':
          'radial-gradient(ellipse at 0% 0%, color-mix(in srgb, var(--lp-accent) 18%, transparent), transparent 50%), radial-gradient(ellipse at 100% 100%, color-mix(in srgb, var(--lp-copper) 12%, transparent), transparent 45%)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
    },
  },
  plugins: [],
}
