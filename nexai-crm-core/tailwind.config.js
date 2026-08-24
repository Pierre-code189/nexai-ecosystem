/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-primary, #3b82f6)',
          secondary: 'var(--color-secondary, #1e40af)',
        }
      }
    }
  },
  plugins: [],
};
