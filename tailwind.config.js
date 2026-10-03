/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#17213d', muted: '#68728b', line: '#e4e7ef', brand: '#4546d8', 'brand-dark': '#3233b7' },
    },
  },
  plugins: [],
}