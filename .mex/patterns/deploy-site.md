---
name: deploy-site
description: Publish the site with .deploy.sh — a manual, irreversible rsync --delete over SSH with no CI, no releases, and no rollback. Read before running it, not after.
triggers:
  - "deploy"
  - "publish the site"
  - "ship it"
  - "release"
  - "rollback"
  - "production"
edges:
  - target: context/setup.md
    condition: when you need the build commands and the lockfile caveat first
  - target: context/decisions.md
    condition: when you need why rsync-over-SSH instead of a hosting platform
  - target: patterns/debug-build-routing.md
    condition: when the build is failing rather than the transfer
grounds_to: []
last_updated: 2026-08-10
---

# Deploy the Site

## Context

There is no CI. `.github/` is empty, nothing runs on push, and nothing runs on merge.
`.deploy.sh` executed from a developer's laptop **is** the deployment pipeline.

What it does, in order:
1. Checks `ssh`, `rsync`, `npm`, `node` are on PATH
2. Logs a `NODE_VERSION` read from `.nvmrc` — **which does not exist in this repo** — and
   silently falls back to `node -v`. It is logged only; nothing enforces it.
3. `npm ci` — note: **npm and `package-lock.json`**, while local development uses pnpm and
   `pnpm-lock.yaml`. The deploy can install a different dependency set than you tested.
4. `npm run build` (the script's own npm invocation) producing `dist/`
5. `rsync -az --delete dist/ box.thedanielfactor.com:/home/user-data/www/olddognewflex.com/`

The `--delete` is the dangerous part: anything on the server not present in `dist/` is
removed. There are no timestamped releases and no previous version kept on the box.
**The only rollback is to check out an older commit, rebuild, and deploy again.**

## Steps

1. Confirm the working tree is clean and you are on the commit you intend to publish.
2. Run the local gate that CI would have run, because nothing else will:
   run pnpm install, then `pnpm test`, `npx astro check`, and `pnpm build`
3. `pnpm preview` and click through the real output — home, a post, a category listing,
   `/rss.xml`, `/404`.
4. **Always dry-run first:** `DRY_RUN=true ./.deploy.sh`. Read the rsync output and
   check the deletion list specifically. Unexpected deletions mean the build is
   incomplete, not that the server is wrong.
5. Deploy: `./.deploy.sh`
6. Verify against the live site: load a post, confirm the newest content is present, load
   `/rss.xml`, and confirm comments render (giscus failures never appear in the build).

## Gotchas

- **`--delete` with an incomplete `dist/` wipes production.** If step 4 of the script
  (`npm run build`) partially fails but the script continues, rsync happily mirrors the
  gap. This is why the dry run is not optional.
- **`npm ci` needs `package-lock.json` to be current.** It is the older of the two
  lockfiles in the repo. If `npm ci` fails or installs unexpected versions, that is the
  cause — refresh the npm lockfile or convert the script to
  pnpm with a frozen lockfile, and record the change in `context/decisions.md`.
- **Host, user, path and key are hardcoded** in `.deploy.sh`. It needs
  `~/.ssh/miab_deploy_key` with correct permissions. The script sets `SSH_PORT` and
  `SSH_USER` variables but the actual `rsync -e "ssh "` invocation uses neither — it
  relies on your SSH config.
- **No staging environment exists.** `pnpm preview` against local `dist/` is the closest
  thing to a pre-production check.
- **Deploying does not tag or record anything.** Correlate a deploy to a commit yourself.
- **Never run this from a dirty tree or a feature branch by accident** — the script builds
  whatever is checked out, with no branch guard.

## Verify

- [ ] `pnpm test` and `npx astro check` pass locally before deploying
- [ ] `pnpm build` is green and `dist/` contains the pages you expect
- [ ] `DRY_RUN=true ./.deploy.sh` shows no surprising deletions
- [ ] After deploy: home page, one post, one category listing, `/rss.xml` and `/404` all
      load on the live domain
- [ ] Comments render on a live post
- [ ] The theme dropdown still switches flavours on the live site

## Debug

**`Missing tool: X`** — `ssh`/`rsync`/`npm`/`node` not on PATH for this shell.
**`npm ci` fails** — lockfile drift between npm and pnpm; see the gotcha above.
**Build fails during deploy** — stop; fix locally with `patterns/debug-build-routing.md`
and start over. Do not rsync a partial `dist/`.
**rsync permission denied** — the deploy key's permissions or the server-side path
ownership, not the script.
**Site is live but stale** — check the build actually produced new files (`ls -la dist/`)
before suspecting caching.

## Update Scaffold
- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
- [ ] Update any `.mex/context/` files that are now out of date
- [ ] If this is a new task type without a pattern, create one in `.mex/patterns/` and add to `INDEX.md`
