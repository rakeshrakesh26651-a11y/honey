/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': '#123C2D',
        'dark-forest': '#08291F',
        'deep-green': '#0B3327',
        'cream': '#F5F1E6',
        'light-cream': '#FAF8F0',
        'honey-gold': '#D6A83A',
        'warm-honey': '#C99528',
        'dark-brown': '#2A2118',
        'muted-green': '#607568',
        'light-border': '#D9D5C8',
        // Compatibility mappings
        espresso: '#123C2D',
        forest: '#123C2D',
        olive: '#0B3327',
        honey: '#D6A83A',
        butter: '#D6A83A',
        terracotta: '#C99528',
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
