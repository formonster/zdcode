/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,tsx}'],
  theme: {
    extend: {
      colors: {
        'page': '#f0f4fa',
        'page-dark': '#1f2224',
        'panel': '#ffffff',
        'panel-dark': '#181a1b',
      },
    },
  },
  plugins: [],
}
