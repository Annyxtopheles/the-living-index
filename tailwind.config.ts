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
        background: "var(--color-bg)",
        surface: "var(--color-surface)",
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        accent: "var(--color-accent)",
        border: "var(--color-border)",
        specimenBg: "var(--color-specimen-bg)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        specimen: "0.22em",
        editorial: "0.08em",
      },
    },
  },
  plugins: [],
};

export default config;
