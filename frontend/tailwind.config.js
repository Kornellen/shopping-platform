/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          100: "#49494d",
          200: "#44464a",
          500: "#2e3033",
          700: "#1e1f21",
        },
        light: {
          100: "#e4e7ed",
          200: "#ebedf0",
          500: "#d0d4d9",
          700: "#c7c7c7",
        },
      },
    },
  },
  plugins: [],
};
