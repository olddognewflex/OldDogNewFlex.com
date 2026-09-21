---
name: setup
description: Dev environment setup and commands. Load when setting up the project for the first time or when environment issues arise.
triggers:
  - "setup"
  - "install"
  - "environment"
  - "getting started"
  - "how do I run"
  - "local development"
edges:
  - target: context/stack.md
    condition: when specific technology versions or library details are needed
  - target: context/architecture.md
    condition: when understanding how components connect during setup
  - target: patterns/deploy-site.md
    condition: when the goal is to publish, not to run locally
  - target: patterns/debug-build-routing.md
    condition: when the build or dev server fails rather than the install
last_updated: 2026-09-21
grounds_to: []
---

# Setup

## Prerequisites

- **Node 24** — pinned in `mise.toml`. With `mise` installed, `mise install` in the repo
  root gets you the right version. `package.json` `engines` accepts `>=22.12.0`.
- **pnpm** — `pnpm-lock.yaml` is the maintained lockfile.
- **An SSH key at `~/.ssh/miab_deploy_key`** — required only to deploy, not to develop.

## First-time Setup

1. `mise install` (or ensure Node 24 is active some other way)
2. Install dependencies: run pnpm install
3. `pnpm dev` — Astro dev server
4. `pnpm test` — confirms `astro:content` resolves under Vitest; if this fails, the Astro
   install is broken, not the test

There is no `.env` step, no database, and no seed data. Clone to running dev server is
three commands.

## Environment Variables

**None.** The project requires zero environment variables to build or run. `.gitignore`
reserves `.env` and `.env.production`, but nothing in `src/` reads `import.meta.env`
except `HeaderLink.astro`, which uses Astro's built-in `BASE_URL`.

Deploy-time overrides in `.deploy.sh` (shell variables, not app config):

- `DRY_RUN` (optional) — set `DRY_RUN=true` to add `--dry-run` to the rsync. Always use
  this first.
- `NODE_VERSION` (optional) — falls back to reading `.nvmrc`, which does not exist in
  this repo, then to `node -v`. Logged only; nothing enforces it.

## Common Commands

- `pnpm dev` — Astro dev server with hot reload. Note: `README.md` says port 3000, but
  nothing in `astro.config.mjs` sets a port, so Astro's default (4321) is what you get.
- `pnpm build` — static build into `dist/`. **This is the real quality gate**: Zod schema
  violations, `getStaticPaths()` errors, and broken imports fail here and nowhere else.
- `pnpm preview` — serves the built `dist/` so you can check the production output.
- `pnpm test` — Vitest. Currently one file, `tests/blog.test.ts`.
- `npx astro check` — Astro-aware TypeScript check (`@astrojs/check`). Not wired to an
  npm script; run it explicitly.
- `npx prettier --write .` — the only formatter. There is no linter.
- `DRY_RUN=true ./.deploy.sh` — validate a deploy without touching production. See
  `patterns/deploy-site.md` before ever running it without `DRY_RUN`.

## Common Issues

**`pnpm test` cannot resolve `astro:content`:** `vitest.config.ts` must keep using
`getViteConfig()` from `astro/config`. A plain `defineConfig` from `vitest/config` will
break every test that touches `src/lib/blog.ts`.

**A post exists but 404s:** almost always `draft: true` — a draft gets no page at all —
or a filename/slug mismatch. See `patterns/debug-build-routing.md`.

**Installing fails with `ERR_PNPM_IGNORED_BUILDS`:** a dependency wants to run an
install script that has not been approved. Add it under `allowBuilds` in
`pnpm-workspace.yaml` (esbuild is already there). This also breaks `pnpm build` and
`pnpm test`, because pnpm runs a dependency check before any script.

**Prettier reformats Tailwind classes oddly:** `.prettierrc` points at
`src/styles/glolbal.css` (typo) and a `tailwind.config.js` that no longer exists, so the
plugin cannot read the real token set. Fix the paths rather than fighting the output.
