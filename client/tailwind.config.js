/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EF4852",
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
