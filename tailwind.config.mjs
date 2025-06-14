import { typography } from "@tailwindcss/typography";

export default {
  content: [
    {
      files: "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
      relative: true,
    },
  ],
  theme: {
    typography: {
      DEFAULT: {
        css: {
          maxWidth: "none",
          color: "var(--catppuccin-text)",
          a: {
            color: "var(--catppuccin-blue)",
            "&:hover": {
              color: "var(--catppuccin-mauve)",
            },
          },
          h1: {
            color: "var(--catppuccin-mauve)",
            fontWeight: "700",
          },
          code: {
            color: "var(--catppuccin-red)",
            backgroundColor: "var(--catppuccin-surface1)",
            padding: "0.2em 0.4em",
            borderRadius: "0.25rem",
            fontWeight: "400",
          },
          "code::before": {
            content: '""',
          },
          "code::after": {
            content: '""',
          },
          blockquote: {
            color: "var(--catppuccin-subtext0)",
            borderLeftColor: "var(--catppuccin-blue)",
            paddingLeft: "1rem",
            fontStyle: "italic",
          },
        },
      },
      invert: {
        css: {
          maxWidth: "none",
          color: "var(--catppuccin-subtext1)",
          a: {
            color: "var(--catppuccin-yellow)",
            "&:hover": {
              color: "var(--catppuccin-peach)",
            },
          },
          h1: {
            color: "var(--catppuccin-rosewater)",
            fontWeight: "700",
          },
          code: {
            color: "var(--catppuccin-green)",
            backgroundColor: "var(--catppuccin-surface2)",
            padding: "0.2em 0.4em",
            borderRadius: "0.25rem",
            fontWeight: "400",
          },
          blockquote: {
            color: "var(--catppuccin-subtext0)",
            borderLeftColor: "var(--catppuccin-yellow)",
            paddingLeft: "1rem",
            fontStyle: "italic",
          },
        },
      },
    },
  },
  plugins: [typography],
};
