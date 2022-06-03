const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
      },
      fontFamily: {
        serif: ["Space Grotesk", fontFamily.serif],
      },
    },
  },
  variants: {
    extend: {
      borderRadius: ["hover", "group-hover"],
    },
  },
  plugins: [],
};
