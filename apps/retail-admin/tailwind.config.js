/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          dark: "#0B0F19",
          card: "#111827",
          border: "#1F2937",
        },
      },
    },
  },
  plugins: [],
};
