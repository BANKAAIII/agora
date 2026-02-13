import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
       
      fontFamily: {
        poppins: ["var(--font-poppins)"],
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
};

export default config;
