import { typography } from "@tailwindcss/typography";

export default {
  content: [
    {
      files: "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
      relative: true,
    },
  ],
  safelist: [
    "text-rosewater",
    "text-flamingo",
    "text-pink",
    "text-mauve",
    "text-red",
    "text-maroon",
    "text-peach",
    "text-yellow",
    "text-green",
    "text-teal",
    "text-sky",
    "text-sapphire",
    "text-blue",
    "text-lavender",
    "text-text",
    "text-subtext0",
    "text-subtext1",
    "bg-surface0",
    "bg-surface1",
    "bg-surface2",
    "bg-overlay0",
    "bg-overlay1",
    "bg-overlay2",
    "bg-base",
    "bg-mantle",
    "bg-crust",
  ],
  theme: {
    extend: {
      colors: {
        rosewater: "oklch(var(--catppuccin-rosewater))",
        flamingo: "oklch(var(--catppuccin-flamingo))",
        pink: "oklch(var(--catppuccin-pink)",
        mauve: "oklch(var(--catppuccin-mauve)",
        red: "oklch(var(--catppuccin-red)",
        maroon: "oklch(var(--catppuccin-maron)",
        peach: "oklch(var(--catppuccin-peach)",
        yellow: "oklch(var(--catppuccin-yellow)",
        green: "oklch(var(--catppuccin-green)",
        teal: "oklch(var(--catppuccin-teal)",
        sky: "oklch(var(--catppuccin-sky)",
        sapphire: "oklch(var(--catppuccin-sapphire)",
        blue: "oklch(var(--catppuccin-blue)",
        lavender: "oklch(var(--catppuccin-lavender)",
        text: "oklch(var(--catppuccin-text)",
        subtext0: "oklch(var(--catppuccin-subtext0)",
        subtext1: "oklch(var(--catppuccin-subtext1)",
        surface0: "oklch(var(--catppuccin-surface0)",
        surface1: "oklch(var(--catppuccin-surface1)",
        surface2: "oklch(var(--catppuccin-surface2)",
        overlay0: "oklch(var(--catppuccin-overlay0)",
        overlay1: "oklch(var(--catppuccin-overlay1)",
        overlay2: "oklch(var(--catppuccin-overlay2)",
        mantle: "oklch(var(--catppuccin-mantle)",
        crust: "oklch(var(--catppuccin-crust)",
        base: "oklch(var(--catppuccin-base)",
      },
    },
    typography: {
      DEFAULT: {
        css: {
          color: "oklch(var(--catppuccin-text)",
          a: {
            color: "oklch(var(--catppuccin-blue)",
            "&:hover": {
              color: "oklch(var(--catppuccin-mauve)",
            },
          },
          h1: {
            color: "oklch(var(--catppuccin-mauve)",
            fontWeight: "700",
          },
          code: {
            color: "oklch(var(--catppuccin-red)",
            backgroundColor: "oklch(var(--catppuccin-surface1)",
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
            color: "oklch(var(--catppuccin-subtext0)",
            borderLeftColor: "oklch(var(--catppuccin-blue)",
            paddingLeft: "1rem",
            fontStyle: "italic",
          },
        },
      },
      invert: {
        css: {
          color: "oklch(var(--catppuccin-subtext1)",
          a: {
            color: "oklch(var(--catppuccin-yellow)",
            "&:hover": {
              color: "oklch(var(--catppuccin-peach)",
            },
          },
          h1: {
            color: "oklch(var(--catppuccin-rosewater)",
            fontWeight: "700",
          },
          code: {
            color: "oklch(var(--catppuccin-green)",
            backgroundColor: "oklch(var(--catppuccin-surface2)",
            padding: "0.2em 0.4em",
            borderRadius: "0.25rem",
            fontWeight: "400",
          },
          blockquote: {
            color: "oklch(var(--catppuccin-subtext0)",
            borderLeftColor: "oklch(var(--catppuccin-yellow)",
            paddingLeft: "1rem",
            fontStyle: "italic",
          },
        },
      },
    },
  },
  plugins: [typography],
};
