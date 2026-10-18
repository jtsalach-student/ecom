/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        platform: {
          dark: "#080C14",
          card: "#0F172A",
          accent: "#6366F1",
        },
      },
    },
  },
  plugins: [],
};
