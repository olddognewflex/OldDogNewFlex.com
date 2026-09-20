import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      // See tests/stubs/astro-content.ts — the virtual module has no
      // implementation outside an Astro build.
      "astro:content": fileURLToPath(
        new URL("./tests/stubs/astro-content.ts", import.meta.url),
      ),
    },
  },
});
