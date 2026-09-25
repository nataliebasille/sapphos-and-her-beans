import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pumpkin: {
          50: "#fff5e9",
          100: "#ffe3c4",
          200: "#f9c489",
          300: "#f2a04a",
          400: "#eb7d1e",
          500: "#dd5f10",
          600: "#c24a0e",
          700: "#a23a12",
          800: "#7f2f14",
          900: "#b0480f",
          950: "#5a230a",
        },
        navy: {
          50: "#eaeef7",
          100: "#c9d3ec",
          200: "#94a5d6",
          300: "#6079c0",
          400: "#3a54a3",
          500: "#2c4180",
          600: "#243669",
          700: "#1d2c55",
          800: "#172342",
          900: "#111b33",
          950: "#0a101f",
        },
      },
    },
  },
  plugins: [],
};
export default config;
