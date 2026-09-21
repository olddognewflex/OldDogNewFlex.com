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
  - target: context/personal-site-transition.md
    condition: when the task touches navigation, the homepage, /now, /projects, /writing, /notes, or the personal-site IA
  - target: patterns/INDEX.md
    condition: when starting a task — check the pattern index for a matching pattern file
last_updated: 2026-09-21
---

# Session Bootstrap

If you haven't already read `AGENTS.md`, read it now — it contains the project identity, non-negotiables, and commands.

Then read this file fully before doing anything else in this session.

## Current Project State

**Working:**
- Astro 7 static build of the whole site; `pnpm build` is green and `dist/` deploys.
- Five content collections: `learn`, `share`, `journey` (one shared Zod schema),
  plus `notes` (short-form, no required summary) and `projects`. 8 published posts
  (6 in `learn`, 2 in `journey`), 1 note, 5 projects.
- Routing: home, `/now`, `/projects` + `/projects/[slug]`, `/writing`,
  `/notes` + `/notes/[slug]`, `/about`, `/contact`, `/start-here`, `/404`,
  `/products`, `/products/responsible-ai-adult`, plus `/[category]` listings and
  `/[category]/[slug]` post pages. `/blog` is a static redirect to `/writing`.
- Primary nav is five items: HOME · NOW · PROJECTS · WRITING · ABOUT. Start Here,
  Products, Contact and RSS live in the footer. See
  `context/personal-site-transition.md`.
- RSS at `/rss.xml` and an automatic sitemap via `@astrojs/sitemap`.
- Four-flavour Catppuccin theming with `localStorage` persistence and a working
  anti-FOUC inline script.
- giscus comments on post pages, theme-synced to the site.
- Manual deploy via `.deploy.sh`: a frozen-lockfile pnpm install, `pnpm build`, then
  rsync over SSH. See `patterns/deploy-site.md`.

**Not yet built:**
- Any CI/CD. `.github/` is empty — nothing builds, tests, or typechecks on push or PR.
- Test coverage beyond `tests/blog.test.ts`, which covers the pure slug/URL helpers
  (`getPostSlug`, `getPostUrl`, `getNoteUrl`). `getStaticPaths()`, the schemas, and every
  component are untested.
- The `share` collection still has no posts. `/share` remains a valid URL but the
  lens is hidden from the `/writing` filter bar until something is published there.
- MDX content. `@astrojs/mdx` is installed and the loaders accept `.mdx`, but no
  `.mdx` file exists yet. The slug bug that would have 404'd them is fixed.
- Pagination. `POSTS_PER_PAGE` exists as a constant but nothing reads it.

**Known issues:**
- ~~`.mdx` posts will 404.~~ **Fixed.** `getPostSlug()` in `src/lib/blog.ts` is now
  the single source of truth; `getStaticPaths()` and every link builder go through it.
- ~~Drafts leak into RSS.~~ **Fixed.** `rss.xml.js` goes through `getAllPosts()` /
  `getAllNotes()`, and `[slug].astro` filters drafts out of `getStaticPaths()`.
- **`CodeBlock.tsx` is dead code** — no file imports it, so the copy-to-clipboard button
  has never shipped. The only hydrated island on the site is `<Comments client:load />`.
  Left in place deliberately; deleting it is a call for the owner, not a cleanup.
- ~~Syntax highlighting is a light theme on a dark site.~~ **Fixed.** Shiki now emits
  both Catppuccin themes as CSS variables and `global.css` selects on `data-theme`.
- **Empty-collection build noise.** Astro logs "The collection \"share\" does not
  exist or is empty" on every page that calls `getAllPosts()`. Harmless, non-fatal,
  and it goes away as soon as a `share` post exists.
- **`featured: true` on a post currently does nothing.** The personal-site transition
  removed the Featured sections from `/`, `/blog` and `/about`, and nothing else calls
  `getFeaturedPosts()`. Five posts carry the flag. Either give featured posts a surface
  again or stop setting it — see `context/content-pipeline.md`.
- **Most of `src/constants/index.ts` is unread.** `POSTS_PER_PAGE`, `COLLECTIONS`,
  `THEME_COLORS`, `BREAKPOINTS` and `SOCIAL_LINKS` have no consumers.
  `FEATURED_POSTS_LIMIT` is read by `getFeaturedPosts()`, which itself has no callers.
- ~~Two lockfiles.~~ **Fixed.** The npm lockfile is gone; `pnpm-lock.yaml` is the only
  lockfile and `.deploy.sh` installs from it with `--frozen-lockfile`.
- **The deploy host throttles rapid SSH connections** and resets them mid-handshake
  (`kex_exchange_identification: read: Connection reset by peer`). Retrying succeeds.
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
| Navigation, homepage, `/now`, `/projects`, `/writing`, `/notes`, site IA | `context/personal-site-transition.md` |
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
