/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        br: ["var(--font-br)", "sans-serif"],
        noto: ["var(--font-noto)", "sans-serif"],
      },
      colors: {
        black: "var(--color-black)",
        white: "var(--color-white)",
        gray: {
          100: "var(--color-gray-100)",
          200: "var(--color-gray-200)",
          300: "var(--color-gray-300)",
          400: "var(--color-gray-400)",
          500: "var(--color-gray-500)",
        },
        red: "var(--color-red)",
        blue: "var(--color-blue)",
        purple: "var(--color-purple)",
        pink: "var(--color-pink)",
        main: "var(--color-main)",
        "gray-gray300": "var(--gray-gray300, #A4A4A4)",
        "white-white": "var(--white-white, #FFF)",
        "main-main": "var(--main-main, #EFFF04)",
        "black-black": "var(--black-black, #0F0F0F)",
      },
    },
  },
  plugins: [],
};
