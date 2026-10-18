/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/animation-engine/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF8A00",
          orangeHover: "#EA580C",
          orangeLight: "#FFF2DF",
          dark: "#151515",
          charcoal: "#1F1F1F",
          surfaceLight: "#F8F9FA",
          surfaceDark: "#111827",
          borderLight: "#E5E7EB",
          borderDark: "#374151",
          primary: "#FF8A00",
          accent: "#10B981",
        },
      },
      fontFamily: {
        sans: ["Outfit", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(0, 0, 0, 0.04)",
        cardHover: "0 12px 30px rgba(0, 0, 0, 0.08)",
        cardDark: "0 4px 20px rgba(0, 0, 0, 0.4)",
        orangeGlow: "0 0 20px rgba(255, 138, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
