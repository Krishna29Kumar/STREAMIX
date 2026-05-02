/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fff1f0",
          100: "#ffccc7",
          400: "#ff4d3d",
          500: "#e63527",
          600: "#c41f11",
          900: "#4a0800",
        },
        dark: {
          900: "#080c10",
          800: "#0d1117",
          700: "#161b22",
          600: "#21262d",
          500: "#30363d",
          400: "#484f58",
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease forwards",
        slideUp: "slideUp 0.5s ease forwards",
        shimmer: "shimmer 1.5s infinite linear",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(24px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-700px 0" }, "100%": { backgroundPosition: "700px 0" } },
      },
    },
  },
  plugins: [],
};

