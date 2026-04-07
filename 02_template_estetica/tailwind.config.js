/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        'luxury': {
          'nude': '#F9F6F1', // Fondo crema suave
          'carbon': '#1A1A1A', // Textos oscuros elegantes
          'gold': '#C5A089', // Rose gold / Cobre suave
          'gold-light': '#D4BBAA',
          'gold-dark': '#A67C65',
        }
      },
      fontFamily: {
        'serif': ['"Playfair Display"', 'serif'], // Para títulos elegantes
        'sans': ['"Inter"', 'sans-serif'], // Para cuerpo de texto limpio
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
}
