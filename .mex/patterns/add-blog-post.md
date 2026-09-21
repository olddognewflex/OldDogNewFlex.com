---
name: add-blog-post
description: Publish a new post into learn, share, or journey — frontmatter, filename/slug rules, images, drafts, and featured. The single most common task in this repo.
triggers:
  - "add a post"
  - "new post"
  - "write a blog post"
  - "publish"
  - "frontmatter"
  - "draft"
  - "featured post"
edges:
  - target: context/content-pipeline.md
    condition: always — it holds the schema, the slug rules, and the draft/featured semantics
  - target: patterns/debug-build-routing.md
    condition: when the post builds but does not appear, or 404s
  - target: context/conventions.md
    condition: when the post needs a custom component or an MDX island
grounds_to:
  - node: "constant:f6a7ebd31ab1911268e7564691f7b6a2"
    fingerprint: "mh:64:7b226d696e68617368223a5b36343739393834382c39313030393339342c37323036373631342c3138383430363032342c34373830363431312c34383333373239362c34313735343830312c3236363733363435332c32353331383030302c31313130393635372c31373931303839362c35383132383035332c36303336323334302c33323732323635302c3137303237303139372c3135373039323235362c3135363939333132302c38313637313331362c3137303233333437392c3132373139343932322c3233313730323533322c36333339373932372c31373338313333312c34383139353833382c3134303435373035302c3236363830353131362c3237353136333030392c32333239363630332c33323435303830362c3130313933303030352c3132303432363534392c33383338343936302c32303831363335352c3235333133373437382c3235303933343839362c313934333631382c31393239333031372c3132313738313635372c35333436343834372c33343138353431362c39303538363132342c3730343437363437312c3235313235383330332c3135303933363534382c353630353534392c3236343233343233322c3238333735333938302c36333334393834332c35333833313035372c34303231373131352c34353934333130312c3130383534353235312c3131363836363834352c32313331353230302c33303531373438302c3234373534363431352c35373231353235322c3432333439313931312c3132393335343939322c3137383235383836352c3130323539343134302c393134333130362c32333032383630312c39383130393938375d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a3131377d"
  - node: "function:c4240932d9e3eb02294699461d780cb6"
    fingerprint: "mh:64:7b226d696e68617368223a5b34383132393839322c35313932353935382c32393535353836342c3130383538333939332c34373830363431312c32383836323132392c34343535333035312c31363137323133332c32313731343337332c31313130393635372c31373931303839362c363734383038362c35303439373036322c32343837333139332c37343036323738392c3136383635372c39353235363831352c31323332383133372c34393131313036332c33353335323837352c3135333932323934372c3231303339343835302c313830393030342c33333034393536352c3234323134352c3135303135313137312c37323536323139362c3133363637383235332c3135363031343738382c313431343134372c3133333735313135382c37323632343133322c32373733383333372c33333135313633322c31343134333938332c313934333631382c31383433383939352c36353430383938362c34383932333430322c37303536373236302c3133373832333535342c35383538323031332c34383834343735332c313236363537352c373435383831382c32383934373634372c32363234373734362c333235323338352c3139333739393034362c35393233333236332c31353130383138322c35333536323533322c37393238343239302c3135303932333430382c32373139323736362c31353033333735322c3130373532333635382c32363531373633392c31373434373134362c3130383433353031322c3130343031363033332c393134333130362c373435303735342c31313732363932355d2c226e65696768626f7273223a5b2266756e6374696f6e3a6331376665666539663963626565666230366132613263336132376365623865225d2c22746f6b656e436f756e74223a3132397d"
last_updated: 2026-09-21
---

# Add a Blog Post

## Context

Load `context/content-pipeline.md` first. A post is a single markdown file; there is no
index to register it in and no build step to run beyond `pnpm build`. The filename
becomes the URL, `blogSchema` decides whether the build succeeds, and
[`getAllPosts()`](mex://function:c4240932d9e3eb02294699461d780cb6) decides whether it
shows up in listings.

Pick the collection deliberately — it is baked into the permalink and moving a post later
breaks the URL:

- `learn` — technical/educational (6 posts)
- `journey` — reflective, career, personal (2 posts)
- `share` — tools and community (currently **empty**; the first post here also proves the
  `/share` route works)

## Steps

1. Choose the collection and create `src/content/<collection>/<kebab-case-slug>.md`.
   Use `.md`. **Do not use `.mdx`** unless you have first read the MDX hazard in
   `context/content-pipeline.md` and fixed `[slug].astro` — every existing post is `.md`
   and the route's slug derivation is only correct for `.md`.
2. Write the frontmatter. Required: `title`, `summary`, `publishedDate`. Optional:
   `subtitle`, `updatedDate`, `heroImage`, `tags`, `featured`, `draft`.

   ```yaml
   ---
   title: "Why I Stopped Guessing"
   subtitle: "And started measuring"
   summary: "A short paragraph used in listings, meta description, and the RSS item."
   publishedDate: 2026-08-01
   heroImage: "/images/posts/stopped-guessing.webp"
   tags: ["astro", "process"]
   featured: false
   draft: true
   ---
   ```

3. If the post has a hero image, put the file in `public/images/posts/` and reference it
   from the site root (`/images/posts/...`), never with a relative path and never from
   inside `src/content/`. Images are served unoptimised — `astro.config.mjs` uses
   `passthroughImageService()` — so export at the size you want shipped.
4. Write the body. Headings start at `##`; `title` supplies the `<h1>`.
5. Run `pnpm build`. Zod validates every post on every build, so a schema error here is
   the fastest feedback you will get.
6. Run `pnpm dev` and check the post at `/<collection>/<slug>`, in the `/<collection>`
   listing, and on `/` if you set `featured: true`.
7. Remove `draft: true` when you are ready to publish, and rebuild.

## Gotchas

- **`draft: true` means unpublished.** A draft is excluded from listings, from RSS, and
  from `getStaticPaths()` — it has no page at all. It is still in the git repository, so
  it is not private. (Before the personal-site transition a draft still got a live page
  and a feed entry.)
- **`featured: true` currently does nothing.** Nothing calls `getFeaturedPosts()` since
  the personal-site transition removed the Featured sections. Setting it is harmless and
  has no visible effect.
- **The filename is the permalink.** Renaming the file changes the URL with no redirect.
  Kebab-case, no date prefix, no spaces.
- **`publishedDate` is coerced, not parsed strictly.** A malformed date can coerce to
  something surprising rather than failing loudly. Use plain `YYYY-MM-DD`.
- **A future `publishedDate` still publishes.** Nothing filters on date; the post just
  sorts to the top.
- **`summary` is user-visible in three places** — the row on `/`, `/writing` and the lens
  page, the `<meta description>`, and the RSS item. Write it as prose, not as a slug.

## Verify

- [ ] `pnpm build` succeeds (this is the Zod gate)
- [ ] The post renders at `/<collection>/<slug>` with the expected slug
- [ ] It appears in the `/<collection>` listing in the right date position
- [ ] Reading time renders (it needs a non-empty body)
- [ ] It appears under "Recent writing" on `/` if it is among the five newest pieces
- [ ] The hero image loads and is not multi-megabyte
- [ ] If still a draft, confirm it has no page in `dist/` and no entry in `/rss.xml`

## Debug

Post missing or 404ing → `patterns/debug-build-routing.md`.
Build failure mentioning a field name → a `blogSchema` violation; check
`src/content.config.ts` for the exact field list.
Build failure mentioning `body` or `filePath` → strict-null handling in
`[slug].astro`, not the content.

## Update Scaffold
- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
- [ ] Update any `.mex/context/` files that are now out of date
- [ ] If this is a new task type without a pattern, create one in `.mex/patterns/` and add to `INDEX.md`
