/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Our color palette
        brand: {
          light: '#38bdf8', // sky-400
          DEFAULT: '#0ea5e9', // sky-500
          dark: '#0284c7',  // sky-600
        },
        accent: {
          light: '#fb923c', // orange-400
          DEFAULT: '#f97316', // orange-500
          dark: '#ea580c',  // orange-600
        },
        dark: {
          900: '#121212', // Main background
          800: '#1E1E1E', // Card/component background
          700: '#2A2A2A', // Borders and hover states
          600: '#3A3A3A', // Subtle borders
        }
      },
      fontFamily: {
        // Adding a professional sans-serif font
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
