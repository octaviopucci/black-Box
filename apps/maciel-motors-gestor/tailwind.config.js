/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0F0F0F',
          graphite: '#1B1B1B',
          gray: '#3A3A3A',
          white: '#FFFFFF',
          red: '#C41E3A',
          'red-dim': '#8B1528',
          'red-soft': 'rgba(196, 30, 58, 0.15)',
        },
        status: {
          disponivel: '#22C55E',
          reservado: '#F97316',
          consignado: '#3B82F6',
          vendido: '#EF4444',
          oficina: '#EAB308',
          preparacao: '#A855F7',
          documentacao: '#06B6D4',
          financiado: '#EC4899',
          entregue: '#64748B',
        },
      },
      fontFamily: {
        display: ['"Rajdhani"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.35)',
        glow: '0 0 20px rgba(196, 30, 58, 0.25)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(58,58,58,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(58,58,58,0.35) 1px, transparent 1px)',
        'hero-radial':
          'radial-gradient(ellipse at top, rgba(196,30,58,0.12), transparent 55%), radial-gradient(ellipse at bottom right, rgba(58,58,58,0.4), transparent 50%)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
    },
  },
  plugins: [],
}
