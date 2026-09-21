---
name: agents
description: Always-loaded project anchor. Read this first. Contains project identity, non-negotiables, commands, and pointer to ROUTER.md for full context.
last_updated: 2026-09-21
---

# Old Dog New Flex

## What This Is

A statically built Astro 7 personal site (`olddognewflex.com`) — projects, a `/now`
page, and writing — rendered from five markdown content collections into HTML, with a
four-flavour Catppuccin theme and GitHub Discussions comments.

## Non-Negotiables

- **Never derive a slug or URL by hand** — use `getPostSlug()` / `getPostUrl()` /
  `getNoteUrl()` from `src/lib/blog.ts`, or `getProjectSlug()` / `getProjectUrl()` from
  `src/lib/projects.ts`. Hand-rolled derivations are how `.mdx` posts used to build at one
  path and get linked at another.
- **Never add a React component for static markup.** `.astro` is the default; `.tsx` needs
  browser state or a browser API, and every usage needs a `client:*` directive.
- **Never hardcode a colour.** All colours come from the `--color-*` tokens in the
  `@theme` block of `src/styles/global.css`.
- **Never create `tailwind.config.*`.** Tailwind v4 is configured in CSS; the JS config
  was deliberately deleted.
- **Never run `./.deploy.sh` without `DRY_RUN=true` first.** It is `rsync --delete` to
  production with no releases and no rollback.

## Commands

- Dev: `pnpm dev`
- Build: `pnpm build` (the real gate — Zod and routing errors only surface here)
- Preview: `pnpm preview`
- Test: `pnpm test`
- Typecheck: `npx astro check`
- Format: `npx prettier --write .` (no linter exists)
- Deploy: `DRY_RUN=true ./.deploy.sh`, then `./.deploy.sh`

There is no CI. These commands run only when a human runs them.

## Code Graph
The repo is indexed into `.mex/graph.db`. Use it to avoid re-reading code you already have — it is one tool alongside Grep/Glob, not a replacement for them.
- **Caveat for this repo: the graph indexes only `.ts`/`.tsx`/`.js`/`.mjs` (13 files). No `.astro` file is parsed**, so `mex impact` and `who-calls` under-report badly — pair them with `grep -rn <symbol> src --include='*.astro'`.
- If you know the symbol name, go straight to it: `mex graph query <who-calls|what-calls|where-defined> <symbol>` and `mex graph get <id>` are exact and cheap. This is the strongest part of the graph. Give it exact names — an approximate name can return a confident wrong match.
- Exploring an unfamiliar task? `mex graph scope "<task>"` returns a compact JSONL manifest (`meta`, `fact`s, `summary`). Scope matches on words, not meaning: if your phrasing does not share vocabulary with the code, results will be weak. Treat it as a starting point, never as a complete answer.
- If the manifest does not clearly contain what you need, use Grep/Glob instead. Do not expand node ids that look irrelevant, and do not re-run `scope` with reworded phrasing more than once — that costs more than searching directly.
- Treat any source the graph DOES return as ALREADY READ; do not re-open those files.
- Pick 1-3 relevant node ids from the manifest and expand only those with `mex graph get <id> --detail source`.
- Before editing a symbol, run `mex impact <symbol|file>` to see affected callers and scaffold memory.
- If a result is `truncated`, do NOT repeat the broad query — narrow the task or use the summary's `suggestedNextCommands`. Scale through a few focused calls, never one giant response.
- During `mex sync`, adjudicate any AMBIGUOUS grounding; after repairs, ensure the refreshed grounding is re-emitted.

## Scaffold Growth
After meaningful work, run GROW:
- Ground: what changed in reality?
- Record: update `ROUTER.md` and relevant `context/` files
- Orient: create or update a `patterns/` runbook if this can recur
- Write: bump `last_updated` on changed scaffold files and run `mex log` when rationale matters

The scaffold grows from real work, not just setup. See the GROW step in `ROUTER.md` for details.

## Navigation
At the start of every session, read `ROUTER.md` before doing anything else.
For full project context, patterns, and task guidance — everything is there.
