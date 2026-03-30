/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6fc',
          100: '#daecf8',
          200: '#bbdcf0',
          300: '#8cc4e5',
          400: '#58a7d5',
          500: '#358dc1',
          600: '#2571a3', // Main LinkedIn-like "Gates Enterprises" blue
          700: '#1f5b85',
          800: '#1c4e70',
          900: '#1b415e',
          950: '#122a3f',
        },
        surface: '#f3f2ef', // typical LinkedIn background
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
