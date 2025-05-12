/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {},
    theme: {
      extend: {
        fontFamily: {
          sans: ["Poppins", "sans-serif"],
        },
      },
    },
    theme: {
      extend: {
        fontSize: {
          custom: [
            "15.82px",
            {
              lineHeight: "24.6px",
            },
          ],
        },
      },
    },
  },
  plugins: [],
};
