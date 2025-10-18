/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // YEH LINE SABSE ZAROORI HAI
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Hamari color palette waisi hi rahegi
      colors: {
        brand: { light: '#38bdf8', DEFAULT: '#0ea5e9', dark: '#0284c7' },
        accent: { light: '#fb923c', DEFAULT: '#f97316', dark: '#ea580c' },
        dark: { 900: '#121212', 800: '#1E1E1E', 700: '#2A2A2A', 600: '#3A3A3A' }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
