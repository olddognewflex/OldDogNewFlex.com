// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://olddognewflex.com",
  output: "static",

  // /blog was the writing hub before the site stopped being a blog. Keep the
  // URL alive rather than breaking anyone's bookmark.
  redirects: {
    "/blog": "/writing",
  },

  image: {
    service: passthroughImageService(),
  },

  integrations: [
    mdx(),
    react(), // Only for interactive components
    sitemap(),
  ],

  markdown: {
    shikiConfig: {
      // The site ships four Catppuccin flavours, three dark and one light, so a
      // single baked-in theme is always wrong somewhere. Emitting both as CSS
      // variables lets `data-theme` pick at runtime — see global.css.
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-macchiato",
      },
      defaultColor: false,
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
