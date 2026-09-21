---
name: debug-build-routing
description: Diagnose the content-to-route boundary — a post that 404s, a missing listing entry, a Zod build failure, or a link that points somewhere the build never generated.
triggers:
  - "404"
  - "post not showing"
  - "build fails"
  - "broken link"
  - "missing page"
  - "schema error"
  - "debug"
edges:
  - target: context/content-pipeline.md
    condition: always — the three slug derivations and the draft semantics live there
  - target: patterns/add-blog-post.md
    condition: when the fix is in the post's frontmatter or filename
  - target: patterns/add-page-route.md
    condition: when the fix is in the route or getStaticPaths
  - target: context/setup.md
    condition: when the dev server or install is the problem rather than the content
grounds_to:
  - node: "function:455f6c97bf78e06c647c83f80b2d6235"
    fingerprint: "mh:64:7b226d696e68617368223a5b3130383136303430332c3131333233313235342c3139303938333739362c32353136363235312c34373830363431312c32313837393434392c34343535333035312c31343033323935312c36393133393135392c333739393934392c393039393633342c36313432313439312c36363435323635392c33323732323635302c36383634343931332c3138333231343230382c36333435343536342c3133303231353631342c383837383434342c3134393737383637342c39343730333535332c38393934353737312c343332353730332c3133343232353733372c3135333330393631332c36383732393532372c3131323730353930362c32333930353139302c33323538393738392c3130313933303030352c37393238323435382c34373834333231352c3235353736363430362c32343135353630382c38353537353737362c313934333631382c31383433383939352c3131393936353135342c3138323233353635352c3234323035343139312c3135373835393236382c31363938313435312c3138303538393430312c31303137373432342c39373531363434342c39333838383936352c36363634393838362c37373537363934392c31373131383338312c33353233393537342c3134373239353035302c3130383330383539372c3337323430303634342c3230383337353737342c3237353239313339302c31343139343035362c35383232363436322c32373733303637382c31373434373134362c38393032353935302c3130343031363033332c33313832383534362c3236323135303136302c31313732363932355d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a36377d"
  - node: "function:a23737293404e3e9b38254635fb9ad87"
    fingerprint: "mh:64:7b226d696e68617368223a5b32393538343533312c32313036363539332c32393535353836342c333437383039392c34373830363431312c3132383630333531352c32303831383332352c343137323934392c31323732353739302c333739393934392c31373931303839362c35383132383035332c35303439373036322c33323732323635302c3137303237303139372c3132323637383634322c373333373733392c38313637313331362c363337393530382c32333636393532352c35323331333632372c36333339373932372c313830393030342c34383139353833382c34373338303537342c34323533363137332c323034383432372c353934393336342c33323435303830362c313639323235392c33363436383430372c34373834333231352c3131323532393832342c33323433363235352c31343237343234332c313934333631382c31383433383939352c34363339333336342c33343238303331372c383431393834362c39303538363132342c34383535313237302c34383834343735332c313236363537352c353630353534392c393135353936312c32363234373734362c36333334393834332c38393938383733302c32323332343235392c34353934333130312c31353232313031332c37393238343239302c33393531323233342c32313334363639322c3236333734353933312c383238323730312c32363531373633392c393736393036392c34333833313432332c3130323539343134302c393134333130362c32303933393132392c31313732363932355d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a3136387d"
last_updated: 2026-09-21
---

# Debug the Content → Route Boundary

## Context

This is where almost everything breaks. Content is validated by Zod, listed by
`src/lib/blog.ts`, and turned into pages by `getStaticPaths()` in each dynamic route.
Slugs now come from one helper, `getPostSlug()`, but there is still no CI, so the first
signal is usually a human clicking a dead link.

Read `context/content-pipeline.md` before diagnosing — its collection table tells you
which schema and route a file belongs to.

## Steps

Work outward from the file, one layer at a time. Do not skip to the route.

1. **Does the file parse?** Run `pnpm build`. A Zod error names the offending field and
   file. Fix frontmatter first — nothing downstream can work until the build is green.
2. **Is it a draft?** `draft: true` removes it from every listing, from RSS, *and* from
   `getStaticPaths()` — a draft has no page at all. If the URL 404s and the file has
   `draft: true`, this is your answer.
3. **What slug did the build actually generate?** Look in `dist/` after a build — the
   directory names are ground truth. Compare against the URL the site links to.
4. **What slug does the link use?** Links and routes both go through `getPostSlug()`
   (projects: `getProjectSlug()`). If a link and a page disagree, look for code that
   derives a slug *without* the helper — that is exactly how the old `.mdx` 404 happened.
5. **Is the collection actually wired up?** A blog lens must be in `BLOG_CATEGORIES`
   (which drives both `[category]` routes and RSS) *and* in `[category]/index.astro`'s
   `categoryInfo` map — see "Adding a lens" in `context/content-pipeline.md`. `notes`
   and `projects` have their own routes under `src/pages/notes/` and
   `src/pages/projects/`.
6. **Is it an ordering problem, not a missing-page problem?** `getAllPosts()` sorts by
   `publishedDate` descending, and the homepage shows only the five newest pieces of
   writing. An older post is not missing from `/`; it is further down `/writing`. And
   `featured: true` surfaces a post nowhere — nothing calls `getFeaturedPosts()`.
7. **Reproduce against the built output, not the dev server.** `pnpm preview` serves
   `dist/`. The dev server resolves some routes the static build does not.

## Gotchas

- **A green build proves nothing about links.** Astro does not check that a generated
  `<a href>` corresponds to a generated page. Slug drift is invisible to the build.
- **`mex impact` under-reports for this codebase.** The code graph indexes only
  `.ts`/`.tsx`/`.js`/`.mjs` — no `.astro` file is parsed. `getPostUrl` reports
  `callerCount: 0` while six `.astro` files import from `src/lib/blog.ts`. Use
  `grep -rn <symbol> src --include='*.astro'` to find the real callers.
- **RSS mixes posts and notes.** [`GET()`](mex://function:a23737293404e3e9b38254635fb9ad87)
  in `rss.xml.js` builds items from `getAllPosts()` and `getAllNotes()` and sorts them
  together. A note has no required `summary`, so its feed description can be empty.
- **Renaming a content file silently changes its permalink.** No redirect, no warning,
  and existing giscus threads (keyed by `pathname`) are orphaned.
- **`tests/blog.test.ts` only covers the pure helpers** (`getPostSlug`, `getPostUrl`,
  `getNoteUrl`). Passing tests say nothing about `getStaticPaths()`; that path has no
  coverage at all.
- **The dev server port is not 3000.** `README.md` says it is; nothing configures a port,
  so Astro's default applies.

## Verify

- [ ] `pnpm build` is green
- [ ] The expected directory exists under `dist/` with the expected name
- [ ] `pnpm preview` serves the URL, and the link that was broken now resolves
- [ ] The post appears in `/<collection>`, on `/` if featured, and in `/rss.xml`
- [ ] `pnpm test` still passes
- [ ] If you changed a slug rule, you changed all three sites of it and added a test case

## Debug

Escalation order when the above does not explain it: compare `dist/` against
`git ls-files src/content` to find content with no page; then diff the three slug
derivations by hand; then check `astro.config.mjs` for a `site`/`base` change, since
`HeaderLink.astro` strips `import.meta.env.BASE_URL` from the pathname when deciding the
active link.

## Update Scaffold
- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
- [ ] Update any `.mex/context/` files that are now out of date
- [ ] If this is a new task type without a pattern, create one in `.mex/patterns/` and add to `INDEX.md`
