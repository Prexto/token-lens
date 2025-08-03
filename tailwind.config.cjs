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
        'dark-bg': '#2c3036',
        'light-text': '#5a6472',
        'dark-text': '#c0c5cd',
      },
      boxShadow: {
        // Light mode shadows
        'neumorphic-light-convex': '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff',
        'neumorphic-light-concave': 'inset 7px 7px 15px #a3b1c6, inset -7px -7px 15px #ffffff',
        
        // Dark mode shadows
        'neumorphic-dark-convex': '5px 5px 10px #1e2024, -5px -5px 10px #3a4048',
        'neumorphic-dark-concave': 'inset 5px 5px 10px #1e2024, inset -5px -5px 10px #3a4048',
      }
    },
  },
  plugins: [],
}
