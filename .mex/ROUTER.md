---
name: router
description: Session bootstrap and navigation hub. Read at the start of every session before any task. Contains project state, routing table, and behavioural contract.
edges:
  - target: context/architecture.md
    condition: when working on system design, integrations, or understanding how components connect
  - target: context/stack.md
    condition: when working with specific technologies, libraries, or making tech decisions
  - target: context/conventions.md
    condition: when writing new code, reviewing code, or unsure about project patterns
  - target: context/decisions.md
    condition: when making architectural choices or understanding why something is built a certain way
  - target: context/setup.md
    condition: when setting up the dev environment or running the project for the first time
  - target: context/content-pipeline.md
    condition: when the task touches posts, collections, slugs, RSS, or src/lib/blog.ts
  - target: context/theming.md
    condition: when the task touches colours, Tailwind tokens, or theme switching
  - target: patterns/INDEX.md
    condition: when starting a task — check the pattern index for a matching pattern file
last_updated: 2026-08-10
---

# Session Bootstrap

If you haven't already read `AGENTS.md`, read it now — it contains the project identity, non-negotiables, and commands.

Then read this file fully before doing anything else in this session.

## Current Project State

**Working:**
- Astro 7 static build of the whole site; `pnpm build` is green and `dist/` deploys.
- Three content collections (`learn`, `share`, `journey`) with one shared Zod schema;
  8 published posts (6 in `learn`, 2 in `journey`).
- Routing: home, `/blog`, `/about`, `/contact`, `/start-here`, `/404`, `/products`,
  `/products/responsible-ai-adult`, plus `/[category]` listings and `/[category]/[slug]`
  post pages.
- RSS at `/rss.xml` and an automatic sitemap via `@astrojs/sitemap`.
- Four-flavour Catppuccin theming with `localStorage` persistence and a working
  anti-FOUC inline script.
- giscus comments on post pages, theme-synced to the site.
- Manual deploy via `.deploy.sh` (rsync over SSH).

**Not yet built:**
- Any CI/CD. `.github/` is empty — nothing builds, tests, or typechecks on push or PR.
- Test coverage beyond `tests/blog.test.ts`, which asserts on `getPostUrl` only.
  `getStaticPaths()`, the schema, and every component are untested.
- The `share` collection has no posts, so the `/share` route has never rendered content.
- MDX content. `@astrojs/mdx` is installed and the loaders accept `.mdx`, but no `.mdx`
  file exists — and the post route cannot slug one correctly (see Known issues).
- Pagination. `POSTS_PER_PAGE` exists as a constant but nothing reads it.

**Known issues:**
- **`.mdx` posts will 404.** `[slug].astro`'s `getStaticPaths()` uses a literal
  `.replace('.md','')` while `getPostUrl()` uses `/\.(md|mdx)$/`, so `x.mdx` builds at
  `/c/xx` but links to `/c/x`. Details in `context/content-pipeline.md`.
- **Drafts leak into RSS.** `src/pages/rss.xml.js` calls `getCollection()` directly and
  never filters `draft: true`; `[slug].astro` also builds a live page for every draft.
- **`CodeBlock.tsx` is dead code** — no file imports it, so the copy-to-clipboard button
  has never shipped. The only hydrated island on the site is `<Comments client:load />`.
- **Syntax highlighting is a light theme on a dark site.** `astro.config.mjs` pins
  Shiki to `github-light`, baked in at build time.
- **Most of `src/constants/index.ts` is unread.** `POSTS_PER_PAGE`, `FEATURED_POSTS_LIMIT`,
  `COLLECTIONS`, `THEME_COLORS`, `BREAKPOINTS` and `SOCIAL_LINKS` have no consumers;
  `getFeaturedPosts()` hardcodes its own limit of 3.
- **Two lockfiles.** Development uses pnpm; `.deploy.sh` runs `npm ci` against the older
  `package-lock.json`.
- **Stale docs in the repo.** Root `README.md` describes a Tailwind JS config, a functions
  directory, a scripts directory, port 3000 and Netlify deployment — none of which exist.
  Root `AGENTS.md` says Astro 5.x. `.prettierrc` points at a misspelled stylesheet
  (glolbal.css) and a deleted Tailwind JS config. Trust `.mex/context/` over both.

## Routing Table

Load the relevant file based on the current task. Always load `context/architecture.md` first if not already in context this session.

| Task type | Load |
|-----------|------|
| Understanding how the system works | `context/architecture.md` |
| Working with a specific technology | `context/stack.md` |
| Writing or reviewing code | `context/conventions.md` |
| Making a design decision | `context/decisions.md` |
| Setting up or running the project | `context/setup.md` |
| Posts, collections, slugs, RSS, `src/lib/blog.ts` | `context/content-pipeline.md` |
| Colours, Tailwind tokens, `data-theme`, dark mode | `context/theming.md` |
| Any specific task | Check `patterns/INDEX.md` for a matching pattern |

## Code Graph Caveat

`.mex/graph.db` indexes **only** TypeScript and JavaScript sources (ts, tsx, js, mjs) —
13 files. No Astro component is parsed, and Astro components are where most of this
codebase lives. Consequences:

- `mex impact` and `who-calls` under-report. `getPostUrl` shows `callerCount: 0` while six
  `.astro` files import from `src/lib/blog.ts`.
- To find real usages, pair the graph with
  `grep -rn <symbol> src --include='*.astro'`.

## Behavioural Contract

For every task, follow this loop:

1. **CONTEXT** — Load the relevant context file(s) from the routing table above. Check `patterns/INDEX.md` for a matching pattern. If one exists, follow it. Narrate what you load: "Loading architecture context..."
2. **BUILD** — Do the work. If a pattern exists, follow its Steps. If you are about to deviate from an established pattern, say so before writing any code — state the deviation and why.
3. **VERIFY** — Load `context/conventions.md` and run the Verify Checklist item by item. State each item and whether the output passes. Do not summarise — enumerate explicitly.
4. **DEBUG** — If verification fails or something breaks, check `patterns/INDEX.md` for a debug pattern. Follow it. Fix the issue and re-run VERIFY.
5. **GROW** — After meaningful work, run this binary checklist:
   - **Ground:** What changed in reality? Name the changed behavior, system, command, dependency, or workflow.
   - **Record:** If project state changed, update the "Current Project State" section above. If documented facts changed, update the relevant `context/` file surgically.
   - **Orient:** If this task can recur and no pattern exists, create one in `patterns/` using `patterns/README.md`, then add it to `patterns/INDEX.md`.
   - **Write:** Bump `last_updated` in every scaffold file you changed. If the why matters, run `mex log --type decision "<what changed and why>"` or `mex log "<note>"`.
