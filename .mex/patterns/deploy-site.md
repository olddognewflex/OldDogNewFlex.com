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
last_updated: 2026-09-21
---

# Deploy the Site

## Context

There is no CI. `.github/` is empty, nothing runs on push, and nothing runs on merge.
`.deploy.sh` executed from a developer's laptop **is** the deployment pipeline.

What it does, in order:
1. Checks `ssh`, `rsync`, `pnpm`, `node` are on PATH
2. Logs a `NODE_VERSION` read from `.nvmrc` — **which does not exist in this repo** — and
   silently falls back to `node -v`. It is logged only; nothing enforces it.
3. A pnpm install with `--frozen-lockfile` (and `CI=true`) — the same lockfile you
   develop against
4. `pnpm build`, producing `dist/`
5. `rsync -az --delete --delete-excluded --exclude='.DS_Store' --exclude='*.afphoto'
   dist/ box.thedanielfactor.com:/home/user-data/www/olddognewflex.com/`

The `--delete` is the dangerous part: anything on the server not present in `dist/` is
removed, and `--delete-excluded` also removes any excluded file already on the server.
There are no timestamped releases and no previous version kept on the box.
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
  (`pnpm build`) partially fails but the script continues, rsync happily mirrors the
  gap. This is why the dry run is not optional.
- **pnpm 11 blocks unapproved install scripts.** Installing fails with
  `ERR_PNPM_IGNORED_BUILDS` if a dependency's install script is not listed under
  `allowBuilds` in `pnpm-workspace.yaml`. esbuild is approved there; a new dependency that
  needs one stops the deploy until it is added.
- **The host throttles rapid SSH connections.** Several connections in quick succession
  get `kex_exchange_identification: read: Connection reset by peer`. Wait and retry — it
  is not an authentication failure.
- **Host and path are hardcoded** in `.deploy.sh`. The script also sets `SSH_USER`,
  `SSH_PORT` and `SSH_KEY=~/.ssh/miab_deploy_key`, but the `rsync -e "ssh "` invocation
  uses none of them — it relies on your ssh config and agent. The key file does not need
  to exist, and currently does not.
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

**`Missing tool: X`** — `ssh`/`rsync`/`pnpm`/`node` not on PATH for this shell.
**`ERR_PNPM_IGNORED_BUILDS`** — approve the dependency under `allowBuilds` in
`pnpm-workspace.yaml`; see the gotcha above.
**`Connection reset by peer` during the sync** — host-side throttling; retry.
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
