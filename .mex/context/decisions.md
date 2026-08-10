---
name: decisions
description: Key architectural and technical decisions with reasoning. Load when making design choices or understanding why something is built a certain way.
triggers:
  - "why do we"
  - "why is it"
  - "decision"
  - "alternative"
  - "we chose"
edges:
  - target: context/architecture.md
    condition: when a decision relates to system structure
  - target: context/stack.md
    condition: when a decision relates to technology choice
  - target: context/theming.md
    condition: when the decision is about the palette, Tailwind v4, or theme switching
  - target: context/setup.md
    condition: when the decision changes how the project is built or deployed
  - target: patterns/deploy-site.md
    condition: when acting on the rsync-over-SSH deployment decision rather than reading it
  - target: patterns/giscus-comments.md
    condition: when acting on the giscus decision rather than reading it
grounds_to:
  - node: "function:e4b52ddeda60b29f9fc19bbb5520847c"
    fingerprint: "mh:64:7b226d696e68617368223a5b3231373836303036362c3130353931373734352c3333323834383336312c3133373137323931372c34373830363431312c33303133353032342c3130303137383737392c35303232353939342c3132343734393131312c32333232373733322c31373931303839362c3138323838363835372c36303336323334302c373735353530302c3331303338333730392c323038323932322c3231343535353238372c3135383430353935342c36363939323630362c3138303335343938322c39353435343335342c3136333739353239322c3133373832313233342c363736383239302c3135333330393631332c3135303135313137312c34313937323036332c3439393732353331362c3333333535363632302c3130313933303030352c33363737343630322c3331343438373436392c32393338393836312c3130383633383538372c3236303137313032382c313934333631382c3230333234303239382c34373936323638392c36393830333139372c35303036303435312c3138383234373531312c3237373537373335362c36303030303437352c39343334303633382c39373531363434342c39383639303032362c32333535343436372c36333334393834332c37383937323536352c3135353032363532342c3132383134363431332c35333536323533322c3535383838392c38323434343230362c38363439353230312c33353733343434372c36353435333637382c3339393634333130332c3135393739323234342c3130383433353031322c3130343031363033332c393134333130362c3330353737383239372c39383130393938375d2c226e65696768626f7273223a5b2266756e6374696f6e3a6162353961656433393836636137363661336264323636313066626663613335225d2c22746f6b656e436f756e74223a34307d"
last_updated: 2026-08-10
---

# Decisions

## Decision Log

### Upgrade to Astro 7 and switch the lockfile to pnpm
**Date:** 2026-07-14
**Status:** Active
**Decision:** Move from Astro 5 to Astro 7 (`^7.0.9`), pin Node 24 via `mise.toml`, add
`pnpm-lock.yaml`, and add `vitest.config.ts` built from `getViteConfig()`.
**Reasoning:** Vitest could not resolve the `astro:content` virtual module that
`src/lib/blog.ts` imports; routing tests through Astro's own Vite config fixed it. The
Node pin makes the toolchain reproducible across machines.
**Alternatives considered:** Mocking `astro:content` in tests (rejected — the mock would
have to model the glob loader's `id`/`filePath` semantics, which is exactly the part most
likely to be wrong).
**Consequences:** Astro 5 documentation and the repo's own root `AGENTS.md` are now
wrong about the version. `package-lock.json` was left in the tree while `.deploy.sh`
still runs `npm ci`, so the deploy path installs from the *older* lockfile. Reconcile
this before trusting a production build.

### Configure Tailwind in CSS, delete the JS config
**Date:** 2026-03-23
**Status:** Active
**Decision:** Delete `tailwind.config.mjs`; define every design token in the `@theme`
block of `src/styles/global.css`, with per-flavour overrides in
`:root[data-theme="..."]` blocks.
**Reasoning:** Tailwind v4's CSS-first configuration keeps the palette in one file
alongside the theme overrides that consume it, instead of splitting it across a JS config
and a stylesheet.
**Alternatives considered:** Keeping the v3-style JS config (rejected — v4 makes it
optional and it duplicated the CSS variables).
**Consequences:** There is no JS config to edit. `.prettierrc` still declares
`"tailwindConfig": "tailwind.config.js"` and a misspelled
`"tailwindStylesheet": "src/styles/glolbal.css"` — both are stale and mean the Prettier
Tailwind plugin cannot see the real token set when sorting classes.

### Persist the theme in `localStorage` with an inline anti-FOUC script
**Date:** 2026-03-24
**Status:** Active
**Decision:** `BaseLayout.astro` renders `<html data-theme="macchiato">` and runs a
blocking inline script in `<head>` that reads `localStorage.theme` and rewrites the
attribute before first paint. `ThemePills.astro` writes both on click.
**Reasoning:** A static site has no server-side notion of the reader's preference, so the
default flavour is baked into the HTML and corrected client-side. Doing it inline and
blocking is what prevents the flash of the wrong palette.
**Alternatives considered:** A cookie read at build time (impossible — `output: "static"`),
and `prefers-color-scheme` (rejected — four flavours, not two, and three of them are dark).
**Consequences:** The theme list is now duplicated in `src/utils/themes.ts` and inline in
`ThemePills.astro`, in different orders. Any script added to `<head>` before the theme
script risks reintroducing the flash.

### Use giscus for comments and bridge it to the site theme
**Date:** 2026-03-25
**Status:** Active
**Decision:** Comments are GitHub Discussions via `@giscus/react`, hydrated with
`client:load` on the post route only. `resolveGiscusTheme()` maps the site's `data-theme`
onto the matching `catppuccin_*` giscus theme, and a `MutationObserver` on
`documentElement` re-maps it whenever the reader switches flavour.
**Reasoning:** No backend exists to host comments, and moderation via GitHub Discussions
is free. The React wrapper (rather than the plain giscus `<script>`) is what makes the
theme reactive — see [`resolveGiscusTheme()`](mex://function:e4b52ddeda60b29f9fc19bbb5520847c).
**Alternatives considered:** A hosted comment SaaS (rejected — cost and a third-party
data dependency), and the raw giscus script tag (rejected — no clean way to re-theme it
on toggle).
**Consequences:** `repo`, `repoId`, `category` and `categoryId` are hardcoded literals in
`Comments.tsx`. Forking the repo, renaming it, or deleting the "Blog Comments" discussion
category silently produces an empty comment box with no build error.

### Deploy by rsync over SSH rather than a hosting platform
**Date:** 2026-03-22
**Status:** Active
**Decision:** `.deploy.sh` runs `npm ci && npm run build` then
`rsync -az --delete dist/ box.thedanielfactor.com:/home/user-data/www/olddognewflex.com/`,
authenticating with `~/.ssh/miab_deploy_key`.
**Reasoning:** The site already shares a self-hosted mail-in-a-box server; static files
cost nothing extra there.
**Alternatives considered:** Netlify — it was set up first and its badge is still in
`README.md`, but there is no `netlify.toml` in the repo, so the platform config is not
version-controlled here.
**Consequences:** Deployment is manual and irreversible: `--delete` removes anything on
the server that is not in `dist/`, and there are no releases to roll back to. Host and
user are hardcoded in the script. `NODE_VERSION` reads a `.nvmrc` that does not exist and
silently falls back to `node -v`.

### Ship without CI
**Date:** 2026-03-23
**Status:** Active
**Decision:** Leave `.github/` empty. No build, test, or typecheck runs on push or PR.
**Reasoning:** Single-maintainer blog; the deploy script builds anyway, so a broken build
cannot reach production even without a pipeline.
**Alternatives considered:** A GitHub Actions build+test workflow (not rejected on merit —
simply never added).
**Consequences:** `pnpm test` and `npx astro check` are only ever run when a human
remembers. This is the single largest quality gap in the project and the reason
`context/conventions.md` carries an explicit verify checklist.
