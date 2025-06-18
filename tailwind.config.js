/** @type {import('tailwindcss').Config} */
export default {
  content: [  "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: { dropShadow: {
        glow: "0 0 10px #00ffe7, 0 0 25px #00ffe7",
      },
      fontFamily: {
        orbitron: ['"Orbitron"', "sans-serif"],
      },},
  },
  plugins: [],
}

