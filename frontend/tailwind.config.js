/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'illini-orange': '#E84A27',
        'illini-blue': '#13294B',
        'illini-orange-light': '#FF6B35',
        'illini-blue-light': '#1B3A5F',
        'illini-cloud': '#F8F8F8',
      },
    },
  },
  plugins: [],
}
