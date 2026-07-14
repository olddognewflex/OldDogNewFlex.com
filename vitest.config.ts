/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// Use Astro's Vite config so tests can resolve virtual modules like
// `astro:content` that `src/lib/blog.ts` imports.
export default getViteConfig({
  test: {
    // add test-specific options here
  },
});
