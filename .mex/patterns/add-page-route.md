---
name: add-page-route
description: Add a page under src/pages — static, dynamic, or listing — wired to BaseLayout, the nav, and the sitemap. Covers when to reach for a React island instead of an .astro component.
triggers:
  - "add a page"
  - "new route"
  - "getStaticPaths"
  - "dynamic route"
  - "add a component"
  - "landing page"
edges:
  - target: context/conventions.md
    condition: always — naming, the Astro-vs-React rule, and the verify checklist
  - target: context/content-pipeline.md
    condition: when the page lists or links to posts
  - target: context/theming.md
    condition: when the page needs colours, tokens, or a theme-aware element
  - target: patterns/debug-build-routing.md
    condition: when the route builds but does not resolve
grounds_to:
  - node: "function:c4240932d9e3eb02294699461d780cb6"
    fingerprint: "mh:64:7b226d696e68617368223a5b34383132393839322c35313932353935382c32393535353836342c3130383538333939332c34373830363431312c32383836323132392c34343535333035312c31363137323133332c32313731343337332c31313130393635372c31373931303839362c363734383038362c35303439373036322c32343837333139332c37343036323738392c3136383635372c39353235363831352c31323332383133372c34393131313036332c33353335323837352c3135333932323934372c3231303339343835302c313830393030342c33333034393536352c3234323134352c3135303135313137312c37323536323139362c3133363637383235332c3135363031343738382c313431343134372c3133333735313135382c37323632343133322c32373733383333372c33333135313633322c31343134333938332c313934333631382c31383433383939352c36353430383938362c34383932333430322c37303536373236302c3133373832333535342c35383538323031332c34383834343735332c313236363537352c373435383831382c32383934373634372c32363234373734362c333235323338352c3139333739393034362c35393233333236332c31353130383138322c35333536323533322c37393238343239302c3135303932333430382c32373139323736362c31353033333735322c3130373532333635382c32363531373633392c31373434373134362c3130383433353031322c3130343031363033332c393134333130362c373435303735342c31313732363932355d2c226e65696768626f7273223a5b2266756e6374696f6e3a6331376665666539663963626565666230366132613263336132376365623865225d2c22746f6b656e436f756e74223a3132397d"
  - node: "function:455f6c97bf78e06c647c83f80b2d6235"
    fingerprint: "mh:64:7b226d696e68617368223a5b3130383136303430332c3131333233313235342c3139303938333739362c32353136363235312c34373830363431312c32313837393434392c34343535333035312c31343033323935312c36393133393135392c333739393934392c393039393633342c36313432313439312c36363435323635392c33323732323635302c36383634343931332c3138333231343230382c36333435343536342c3133303231353631342c383837383434342c3134393737383637342c39343730333535332c38393934353737312c343332353730332c3133343232353733372c3135333330393631332c36383732393532372c3131323730353930362c32333930353139302c33323538393738392c3130313933303030352c37393238323435382c34373834333231352c3235353736363430362c32343135353630382c38353537353737362c313934333631382c31383433383939352c3131393936353135342c3138323233353635352c3234323035343139312c3135373835393236382c31363938313435312c3138303538393430312c31303137373432342c39373531363434342c39333838383936352c36363634393838362c37373537363934392c31373131383338312c33353233393537342c3134373239353035302c3130383330383539372c3337323430303634342c3230383337353737342c3237353239313339302c31343139343035362c35383232363436322c32373733303637382c31373434373134362c38393032353935302c3130343031363033332c33313832383534362c3236323135303136302c31313732363932355d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a36377d"
last_updated: 2026-09-21
---

# Add a Page or Route

## Context

Routing is file-based: `src/pages/about.astro` → `/about`,
`src/pages/products/index.astro` → `/products`. Because `output: "static"`, every route
must be fully enumerable at build time — any dynamic segment needs `getStaticPaths()`.

Existing pages to copy from, by shape:

- **Simple content page** → `src/pages/about.astro`, `src/pages/start-here.astro`
- **Markdown page, no code** → `src/pages/now.md`, with
  `layout: ../layouts/MarkdownPage.astro` in its frontmatter
- **Listing page** → `src/pages/writing.astro` (calls `getRecentWriting()`) or
  `src/pages/projects/index.astro` (calls `getProjectsByKind()`)
- **Dynamic listing** → `src/pages/[category]/index.astro` (`getStaticPaths()` from
  `BLOG_CATEGORIES`, plus a `categoryInfo` map)
- **Dynamic detail** → `src/pages/[category]/[slug].astro`,
  `src/pages/projects/[slug].astro`, `src/pages/notes/[slug].astro`
- **Non-HTML endpoint** → `src/pages/rss.xml.js`

A new top-level page most likely belongs in the footer nav in `BaseLayout.astro`, not the
primary nav in `Header.astro`. The primary nav is deliberately five items.

## Steps

1. Create the file under `src/pages/`. The path is the URL — no router to register with.
2. In the frontmatter fence, import `BaseLayout` (or `BlogPost` for post-shaped pages)
   with a relative path, and declare a local `interface Props` if the page takes any.
3. Fetch data in the frontmatter fence, not in markup. Use the `src/lib/blog.ts` helpers
   rather than `getCollection()` directly — see `context/conventions.md`.
4. For a dynamic segment, export `getStaticPaths()` returning
   `{ params, props }` objects. Under strict TS, `post.filePath` is optional: use `?.`
   and supply a fallback, as the existing routes do.
5. Wrap the markup in `<BaseLayout title=... description=...>`. Do not import a stylesheet
   — `BaseLayout` already owns `global.css` and `layout.css`.
6. Link to posts with [`getPostUrl(post)`](mex://function:455f6c97bf78e06c647c83f80b2d6235),
   never with a hand-built template string.
7. If the page needs a nav entry, add a `<HeaderLink>` to **both** the desktop and mobile
   lists in `src/components/Header.astro`.
8. Build components as `.astro`. Reach for `.tsx` only if you need `useState`, an effect,
   or a browser API — and then add a `client:*` directive at the usage site or the
   component ships inert.
9. `pnpm build`, then `pnpm preview` and load the real URL.

## Gotchas

- **A `.tsx` component with no `client:*` directive renders as dead static HTML** with no
  warning. `CodeBlock.tsx` is the cautionary example in this repo: it has no importer at
  all, so its copy button has never worked. The only hydrated island on the site is
  `<Comments client:load />`.
- **`getStaticPaths()` runs at build only.** `Astro.params` inside it is meaningless;
  anything you need in the template must be passed through `props`.
- **Every collection fan-out in this repo is hardcoded.** `[category]/index.astro`
  enumerates the three categories by hand and carries a `categoryInfo` map of title, hero
  image, alt text, description and icon. A new category needs edits in both places or the
  route renders with an undefined hero.
- **Only `BaseLayout` may import CSS.** Adding `import "../styles/global.css"` to a page
  duplicates the whole stylesheet into that route's bundle.
- **Icons split by file type**: `@lucide/astro` inside `.astro`, `lucide-react` inside
  `.tsx`. Importing the wrong one fails at build with a confusing JSX error.
- **The sitemap is automatic.** `@astrojs/sitemap` picks up any built route from the
  `site` value in `astro.config.mjs` — nothing to register, but also nothing to exclude a
  page with.
- **There is no path alias.** All imports are relative (`../../lib/blog`).

## Verify

- [ ] `npx astro check` passes (strict null handling on `filePath`, `body`, props)
- [ ] `pnpm build` succeeds and the expected file appears under `dist/`
- [ ] `pnpm preview` serves the route at the URL you expect
- [ ] Any `.tsx` on the page has a `client:*` directive and actually reacts
- [ ] Nav links added to both the desktop and mobile lists, if applicable
- [ ] Post links come from `getPostUrl()`
- [ ] All colours use `--color-*` tokens / Tailwind utilities, no literal hex
- [ ] The page still looks right in `latte` (the one light flavour)

## Debug

Route 404s after a green build → `patterns/debug-build-routing.md`.
Component renders but does nothing → missing `client:*` directive.
Type error on `post.filePath` / `post.body` → strict null checks; guard, do not cast.

## Update Scaffold
- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
- [ ] Update any `.mex/context/` files that are now out of date
- [ ] If this is a new task type without a pattern, create one in `.mex/patterns/` and add to `INDEX.md`
