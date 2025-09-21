/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#1D3557',
        'red': '#A81D33',
        'light-gray': '#F1F5F9',
      },
    },
  },
  plugins: [],
}
