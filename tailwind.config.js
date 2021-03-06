const colors = require("tailwindcss/colors");
const lineClamp = require("@tailwindcss/line-clamp");

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.zinc[900],
        secondary: colors.stone[800],
        tertiary: colors.zinc[400],
      },
      fontFamily: {
        Basic: ["Basic", "sans-serif"],
        Lato: ["Lato", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      display: ["group-hover"],
      boxShadow: {
        inset: "inset 0 -30vh 30vh -15vh white",
      },
    },
  },
  plugins: [lineClamp],
};
