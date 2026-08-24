import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0A1128",
        ink: "#05070F",
        parchment: "#F4EFE1",
        gold: "#C9A24B",
        goldDeep: "#8C6D31",
        goldSoft: "#D9BC7C",
        taupe: "#6B6355",
      },
      fontFamily: {
        display: ["var(--font-playfair-display)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#0A1128",
            "--tw-prose-headings": "#0A1128",
            "--tw-prose-lead": "#6B6355",
            "--tw-prose-links": "#8C6D31",
            "--tw-prose-bold": "#0A1128",
            "--tw-prose-counters": "#8C6D31",
            "--tw-prose-bullets": "#C9A24B",
            "--tw-prose-hr": "rgba(10,17,40,0.15)",
            "--tw-prose-quotes": "#0A1128",
            "--tw-prose-quote-borders": "#C9A24B",
            "--tw-prose-captions": "#6B6355",
            "--tw-prose-code": "#0A1128",
            "--tw-prose-pre-code": "#F4EFE1",
            "--tw-prose-pre-bg": "#0A1128",
            "--tw-prose-th-borders": "rgba(10,17,40,0.25)",
            "--tw-prose-td-borders": "rgba(10,17,40,0.12)",
            fontFamily: "var(--font-dm-sans), sans-serif",
            h1: { fontFamily: "var(--font-playfair-display), serif", fontWeight: 500 },
            h2: { fontFamily: "var(--font-playfair-display), serif", fontWeight: 500 },
            h3: { fontFamily: "var(--font-playfair-display), serif", fontWeight: 500 },
            h4: { fontFamily: "var(--font-playfair-display), serif", fontWeight: 500 },
            a: { textDecoration: "underline", textUnderlineOffset: "2px" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
