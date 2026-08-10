---
name: stack
description: Technology stack, library choices, and the reasoning behind them. Load when working with specific technologies or making decisions about libraries and tools.
triggers:
  - "library"
  - "package"
  - "dependency"
  - "which tool"
  - "technology"
edges:
  - target: context/decisions.md
    condition: when the reasoning behind a tech choice is needed
  - target: context/conventions.md
    condition: when understanding how to use a technology in this codebase
  - target: context/setup.md
    condition: when you need the install/run commands for these tools
  - target: context/theming.md
    condition: when the technology in question is Tailwind v4 or the Catppuccin palette
  - target: context/content-pipeline.md
    condition: when the technology in question is astro:content, the glob loader, or Zod
  - target: patterns/INDEX.md
    condition: when the library question is really "how do I do X here" — a pattern may answer it
grounds_to: []
last_updated: 2026-08-10
---

# Stack

## Core Technologies

- **Astro 7** (`^7.0.9`) — static site generator, `output: "static"` in
  `astro.config.mjs`. Integrations: `@astrojs/mdx`, `@astrojs/react`, `@astrojs/sitemap`.
- **typescript** 5.9 in strict mode — `tsconfig.json` extends `astro/tsconfigs/strict`
  and adds `strictNullChecks: true`. `@astrojs/check` provides the Astro-aware typecheck.
- **Node 24** — pinned by `mise.toml`. `package.json` `engines` says `>=22.12.0`; mise
  wins locally.
- **Tailwind CSS v4** (`^4.3.2`) — wired through `@tailwindcss/vite` in
  `astro.config.mjs`, plus `@tailwindcss/postcss` in `postcss.config.mjs`. Configured in
  CSS, not in JS.
- **React 19** (`^19.2.7`) — islands only. Exactly two components use it.
- Package manager: pnpm. `pnpm-lock.yaml` is the current lockfile, added with the
  Astro 7 upgrade.

## Key Libraries

- **astro** content collections via the `glob()` loader, not the legacy
  `src/content/config.ts` collections API — `src/content.config.ts` uses
  `defineCollection({ loader: glob({...}) })`. Under this loader `post.id` is the
  extensionless slug and `post.filePath` is the project-relative path; code in this repo
  relies on both, differently.
- **`zod`** (via `astro:content`) — the single `blogSchema` validates all three
  collections. A schema violation fails `astro build`, not runtime.
- **`reading-time`** — wrapped once by
  [`getReadingTime()`](mex://function:ffb69a1dbea30f552f66a2f0dff73302). Call the wrapper,
  never the package directly.
- **`@astrojs/rss`** — feed generation in `src/pages/rss.xml.js`.
- **`@giscus/react`** (not a raw giscus `<script>` tag) — needed so the theme can be
  changed reactively; see `context/theming.md`.
- **`@lucide/astro`** for icons in `.astro` files, **`lucide-react`** for icons inside the
  React islands. Both are installed; pick the one matching the file type.
- **`vitest`** (not Jest, not `node:test`) — configured via `getViteConfig()` from
  `astro/config` in `vitest.config.ts` so tests can resolve the `astro:content` virtual
  module.
- **prettier**, with the `prettier-plugin-tailwindcss` plugin — the only formatter in the
  project. There is no linter.

## What We Deliberately Do NOT Use

- **No `tailwind.config.mjs`.** It was deleted on 2026-03-23. All design tokens live in
  the `@theme` block of `src/styles/global.css`. Do not recreate a JS config —
  `.prettierrc` still points at one, and that reference is stale, not a requirement.
- **No ESLint.** Strict TypeScript plus Prettier is the whole quality gate. Do not add a
  linter without an explicit decision entry.
- **No React for static markup.** `astro.config.mjs` carries the inline comment
  `react(), // Only for interactive components`. `.astro` is the default; a new `.tsx`
  component needs a justification (client-side state, effects, or browser APIs).
- **No CSS-in-JS and no component-scoped design tokens.** Colours come from the
  `--color-*` variables; hardcoded hex in a component is a bug.
- **No `gray-matter` in new code.** It is still in `dependencies` but nothing in `src/`
  imports it — frontmatter parsing is Astro's job now. Treat it as dead weight.

## Version Constraints

- **Astro 7, not 5.** The repo's own root `AGENTS.md` still says "Astro 5.x" — it is out
  of date. Check `package.json` before trusting any Astro version claim in prose, and
  consult Astro 7 docs, since content-collection APIs moved between majors.
- **Tailwind v4, not v3.** No `@tailwind base/components/utilities` directives, no
  `theme.extend`. It is `@import "tailwindcss"`, `@plugin "..."`, and `@theme { }`.
- **Two lockfiles are checked in** (`pnpm-lock.yaml` and `package-lock.json`). `pnpm` is
  the live one; `.deploy.sh` still runs `npm ci` against the npm lockfile. Do not
  regenerate either casually — they can drift apart and the deploy uses the stale one.
- **`@astrojs/markdown-satteri` is installed but unreferenced.** `astro.config.mjs`
  configures Shiki via `markdown.shikiConfig`. Do not assume it is active.
