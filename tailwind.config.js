/** @type {import('tailwindcss').Config} */
export default {
  content: [  "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        primary: "#7b3aed", // purple
        "primary-foreground": "#fff",
        background: "#fff",
        card: "#fff",
        "card-foreground": "#2d1a4a",
        accent: "#ede9fe", // light purple
        "accent-foreground": "#7b3aed",
        destructive: "#ef4444",
        "destructive-foreground": "#fff",
        secondary: "#ede9fe",
        "secondary-foreground": "#7b3aed",
        muted: "#f3f4f6",
        "muted-foreground": "#6b7280",
        ring: "#a78bfa",
        input: "#d1d5db",
        popover: "#fff",
        "popover-foreground": "#2d1a4a",
        foreground: "#2d1a4a",
      },
      dropShadow: {
        glow: "0 0 10px #a78bfa, 0 0 25px #a78bfa",
      },
      fontFamily: {
        orbitron: ['"Orbitron"', "sans-serif"],
      },},
  },
  plugins: [],
}


