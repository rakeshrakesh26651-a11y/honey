/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Global OLIO-inspired neutral warm palette
        'primary-bg': '#F4F1EA',
        'light-bg': '#FAF9F5',
        'soft-surface': '#ECEAE3',
        'primary-text': '#242424',
        'secondary-text': '#686863',
        'site-border': '#D9D7D0',
        'honey-accent': '#C9892E',
        'soft-honey': '#DDAA55',
        'site-dark': '#242424',

        // System aliases ensuring 100% theme consistency
        'cream': '#F4F1EA',
        'light-cream': '#FAF9F5',
        'espresso': '#242424',
        'dark-brown': '#242424',
        'muted-brown': '#686863',
        'light-border': '#D9D7D0',
        'honey-gold': '#C9892E',
        'warm-honey': '#DDAA55',
        'dark': '#242424',
        'butter': '#C9892E',
        'terracotta': '#DDAA55',
        'forest': '#242424',
        'forest-green': '#242424',
        'dark-forest': '#242424',
        'deep-green': '#242424',
        'muted-green': '#686863',
      },
      fontFamily: {
        serif: ["var(--font-display)", "Recia", "Recia Placeholder", "serif"],
        sans: ["var(--font-body)", "General Sans", "General Sans Placeholder", "sans-serif"],
        mono: ["var(--font-mono)", "Space Mono", "monospace"],
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
