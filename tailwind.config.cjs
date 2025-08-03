/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-bg': '#e0e5ec',
        'dark-bg': '#242830',
        'light-text': '#5a6472',
        'dark-text': '#c0c5cd',
        'brand-color': '#6d5edc'
      },
      boxShadow: {
        // Light mode shadows
        'neumorphic-light-convex': '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff',
        'neumorphic-light-concave': 'inset 7px 7px 15px #a3b1c6, inset -7px -7px 15px #ffffff',
        
        // Dark mode shadows (Improved contrast)
        'neumorphic-dark-convex': '6px 6px 12px #1c1f25, -6px -6px 12px #2c313b',
        'neumorphic-dark-concave': 'inset 6px 6px 12px #1c1f25, inset -6px -6px 12px #2c313b',
      }
    },
  },
  plugins: [],
}
