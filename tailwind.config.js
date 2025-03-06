/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#15803D', // forest green
          light: '#22C55E',
          dark: '#166534',
        },
        secondary: {
          DEFAULT: '#164E63', // deep blue
          light: '#0891B2',
          dark: '#0C4A6E',
        },
        background: {
          DEFAULT: '#052E16', // dark forest green
          light: '#ECFDF5',
        },
        accent: {
          DEFAULT: '#854D0E', // earthy brown
          light: '#CA8A04',
        },
        text: {
          DEFAULT: '#F4F4F5', // off-white
          dark: '#27272A',
        }
      },
    },
  },
  plugins: [],
}
