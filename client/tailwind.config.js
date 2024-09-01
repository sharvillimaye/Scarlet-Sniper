/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#161622",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pthin: ["SUSE-Thin", "sans-serif"],
        pextralight: ["SUSE-ExtraLight", "sans-serif"],
        plight: ["SUSE-Light", "sans-serif"],
        pregular: ["SUSE-Regular", "sans-serif"],
        pmedium: ["SUSE-Medium", "sans-serif"],
        psemibold: ["SUSE-SemiBold", "sans-serif"],
        pbold: ["SUSE-Bold", "sans-serif"],
        pextrabold: ["SUSE-ExtraBold", "sans-serif"],
      }
    },
  },
  plugins: [],
}
