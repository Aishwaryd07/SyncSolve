const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#141414",
        blue: {
          ...colors.blue,    // include Tailwind’s default blue shades
          DEFAULT: "#3575E2" // your custom blue when using just 'bg-blue'
        }
      }
    },
  },
  plugins: [],
}
