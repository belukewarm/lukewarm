import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neutralgrid: {
          fg: "rgb(64 64 64 / 0.5)"
        }
      },
      boxShadow: {
        soft: "0 10px 40px rgba(6,8,20,.08), 0 2px 10px rgba(6,8,20,.05)"
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.5rem"
      }
    }
  },
  plugins: []
};
export default config;
