/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#f7f2e7",
        espresso: "#1e1a16",
        forest: "#657044",
        honey: "#c88a2b",
        butter: "#f2c94c",
        olive: "#657044",
        terracotta: "#c88a2b",
      },
      fontFamily: {
        serif: ["Recia", "Recia Placeholder", "serif"],
        sans: ["General Sans", "General Sans Placeholder", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      borderRadius: {
        '16': '16px',
        'full': '9999px',
      },
      maxWidth: {
        'site': '1200px',
        'content': '1120px',
      }
    },
  },
  plugins: [],
}
