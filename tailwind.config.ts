import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          DEFAULT: "#2B1810",
          light: "#3D2419",
          dark: "#1A0E0A",
        },
        mocha: {
          DEFAULT: "#4A2C20",
          light: "#6A4232",
        },
        caramel: {
          DEFAULT: "#C88242",
          light: "#E09A5A",
          dark: "#A6652B",
        },
        cream: {
          DEFAULT: "#FCF8F2",
          dark: "#F4ECE1",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
