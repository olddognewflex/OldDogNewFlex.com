---
name: architecture
description: How the major pieces of this project connect and flow. Load when working on system design, integrations, or understanding how components interact.
triggers:
  - "architecture"
  - "system design"
  - "how does X connect to Y"
  - "integration"
  - "flow"
edges:
  - target: context/stack.md
    condition: when specific technology details are needed
  - target: context/decisions.md
    condition: when understanding why the architecture is structured this way
  - target: context/content-pipeline.md
    condition: when working on posts, collections, slugs, RSS, or anything that reads src/content
  - target: context/theming.md
    condition: when working on colours, the data-theme attribute, or anything visual
  - target: context/setup.md
    condition: when you need the commands that build or deploy the flow described here
  - target: patterns/INDEX.md
    condition: when the task is a concrete change rather than an understanding question
grounds_to:
  - node: "function:c4240932d9e3eb02294699461d780cb6"
    fingerprint: "mh:64:7b226d696e68617368223a5b34383132393839322c35313932353935382c32393535353836342c3130383538333939332c34373830363431312c32383836323132392c34343535333035312c31363137323133332c32313731343337332c31313130393635372c31373931303839362c363734383038362c35303439373036322c32343837333139332c37343036323738392c3136383635372c39353235363831352c31323332383133372c34393131313036332c33353335323837352c3135333932323934372c3231303339343835302c313830393030342c33333034393536352c3234323134352c3135303135313137312c37323536323139362c3133363637383235332c3135363031343738382c313431343134372c3133333735313135382c37323632343133322c32373733383333372c33333135313633322c31343134333938332c313934333631382c31383433383939352c36353430383938362c34383932333430322c37303536373236302c3133373832333535342c35383538323031332c34383834343735332c313236363537352c373435383831382c32383934373634372c32363234373734362c333235323338352c3139333739393034362c35393233333236332c31353130383138322c35333536323533322c37393238343239302c3135303932333430382c32373139323736362c31353033333735322c3130373532333635382c32363531373633392c31373434373134362c3130383433353031322c3130343031363033332c393134333130362c373435303735342c31313732363932355d2c226e65696768626f7273223a5b2266756e6374696f6e3a6331376665666539663963626565666230366132613263336132376365623865225d2c22746f6b656e436f756e74223a3132397d"
last_updated: 2026-08-10
---

# Architecture

## System Overview

This is a **build-time-only** site. There is no server and no runtime request cycle —
`astro build` walks the content and emits static HTML into `dist/`.

```
src/content/{learn,share,journey}/*.md(x)
  → glob loader + Zod blogSchema (src/content.config.ts)
  → getCollection() via src/lib/blog.ts
  → .astro page frontmatter calls getAllPosts() / getFeaturedPosts()
  → BlogPost.astro → BaseLayout.astro (global.css + layout.css, <html data-theme>)
  → static HTML in dist/
  → .deploy.sh: rsync -az --delete over SSH to the production box
```

Two things run in the browser after that: the inline FOUC script in
`BaseLayout.astro` (reads `localStorage.theme`, sets `data-theme` on `<html>`) and
the two React islands (`CodeBlock.tsx`, `Comments.tsx`). Everything else is inert HTML.

[`getAllPosts()`](mex://function:c4240932d9e3eb02294699461d780cb6) is the single
choke point for post listings: it fans out over all three collections, drops
`draft: true` entries, and sorts by `publishedDate` descending. Pages must not call
`getCollection()` directly if they want that behaviour.

## Key Components

- **`src/content.config.ts`** — defines the three collections (`learn`, `share`,
  `journey`), each a `glob()` loader over `src/content/<name>/**/*.{md,mdx}` sharing one
  `blogSchema`. Adding a collection means editing this file *and* every hardcoded
  three-way fan-out listed below.
- **`src/lib/blog.ts`** — the only query layer. Exports `getAllPosts`,
  `getFeaturedPosts`, [`getReadingTime()`](mex://function:ffb69a1dbea30f552f66a2f0dff73302)
  and [`getPostUrl()`](mex://function:455f6c97bf78e06c647c83f80b2d6235). Depends on
  `astro:content` and `reading-time`. Six `.astro` files import from it.
- **`src/pages/[category]/[slug].astro`** — the only route that renders a post. Its own
  `getStaticPaths()` re-implements the collection fan-out and derives the slug
  independently of `getPostUrl()`. See `context/content-pipeline.md` — this divergence
  is the sharpest edge in the codebase.
- **`src/pages/rss.xml.js`** — a third independent fan-out and a third slug derivation,
  feeding `@astrojs/rss`.
- **`src/layouts/BaseLayout.astro`** — the only place the stylesheets are imported and
  the only place `data-theme` is initialised. Every page goes through it.
- **`src/constants/index.ts`** — `SITE_CONFIG`, `THEME_COLORS`, `BREAKPOINTS`,
  `COLLECTIONS`, `POSTS_PER_PAGE`, `FEATURED_POSTS_LIMIT`, `SOCIAL_LINKS`.
  `src/consts.ts` re-exports all of it plus legacy `SITE_TITLE` / `SITE_DESCRIPTION`.

## External Dependencies

- **@giscus/react** — comments, backed by GitHub Discussions, in
  `src/components/blog/Comments.tsx`. The `repo`, `repoId`, `category` and `categoryId`
  are hardcoded literals in the component, not config or env. Discussions must stay
  enabled on `olddognewflex/OldDogNewFlex.com` or comments silently render empty.
- **@astrojs/sitemap** — generates `sitemap-index.xml` at build from the `site` value
  in `astro.config.mjs` (`https://olddognewflex.com`). Nothing else configures it.
- Production web host `box.thedanielfactor.com` — plain SSH and rsync, no platform API.
  `.deploy.sh` syncs `dist/` to `/home/user-data/www/olddognewflex.com` with `--delete`.
  Requires `~/.ssh/miab_deploy_key`.
- Google Fonts and static assets — pulled in by `BaseHead.astro`; images are served raw
  from `public/images/` because `astro.config.mjs` selects `passthroughImageService()`
  (no optimisation pipeline at all).

## What Does NOT Exist Here

- **No server, no API routes, no database.** `output: "static"`. There is nothing to
  authenticate, no session, no request handler. Do not add server-rendered logic without
  first changing `output` in `astro.config.mjs`.
- **No CI/CD.** `.github/` contains zero files. Tests and builds never run automatically
  on push or PR — the only gate is a human running `pnpm test` and `.deploy.sh`.
- **No environment variables.** Nothing in `src/` reads `import.meta.env` except
  `HeaderLink.astro` (`BASE_URL`). There is no `.env`, no `.env.example`, and no secret
  the build needs.
- **No image optimisation and no CDN layer.** `passthroughImageService()` means whatever
  you put in `public/images/` is what ships, at full weight.
- **No `functions/`, `scripts/`, or `tailwind.config.mjs`.** `README.md` still lists all
  three; they do not exist in the repo. Trust this file over `README.md`.
