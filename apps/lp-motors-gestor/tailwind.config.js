/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lp: {
          ink: '#0C1222',
          slate: '#1A2332',
          steel: '#3D4F66',
          mist: '#E8EDF3',
          paper: '#F5F7FA',
          line: '#D5DCE6',
          accent: '#0F766E',
          'accent-dim': '#0D5F59',
          'accent-soft': 'rgba(15, 118, 110, 0.12)',
          copper: '#B45309',
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
      boxShadow: {
        panel: '0 1px 2px rgba(12, 18, 34, 0.04), 0 8px 24px rgba(12, 18, 34, 0.06)',
        lift: '0 12px 32px rgba(12, 18, 34, 0.1)',
      },
      backgroundImage: {
        'lp-grid':
          'linear-gradient(rgba(61,79,102,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(61,79,102,0.07) 1px, transparent 1px)',
        'lp-hero':
          'radial-gradient(ellipse at 0% 0%, rgba(15,118,110,0.14), transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(180,83,9,0.08), transparent 45%)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
    },
  },
  plugins: [],
}
