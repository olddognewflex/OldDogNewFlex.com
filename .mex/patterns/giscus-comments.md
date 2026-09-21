---
name: giscus-comments
description: Working on the giscus comment island — hardcoded repo identifiers, the client:load requirement, and the data-theme bridge. The integration most likely to fail silently.
triggers:
  - "comments"
  - "giscus"
  - "discussions"
  - "comment box empty"
  - "Comments.tsx"
edges:
  - target: context/theming.md
    condition: when the problem is the widget's colours rather than its content
  - target: context/decisions.md
    condition: when you need why giscus and why the React wrapper
  - target: patterns/add-page-route.md
    condition: when adding comments to a page that does not have them yet
grounds_to:
  - node: "function:ab59aed3986ca766a3bd26610fbfca35"
    fingerprint: "mh:64:7b226d696e68617368223a5b35303937343339392c32313036363539332c32393535353836342c3133373137323931372c33393033373332382c35393439383430392c34313735343830312c343137323934392c32303237353134322c32333232373733322c363033313032362c39363839373336362c363938353135382c33323732323635302c39343738313435322c37323739343834302c35343439373235392c33303130323934322c3131343836363437352c32333636393532352c34313931393439392c36313432383531352c35313436343430362c31303533383338302c31363232312c36363234363235312c39363132343836332c3137383335383237352c33323435303830362c353034313033372c3130343639322c33353636343538312c37393639383434372c393934373339352c31323433333437322c313934333631382c31383433383939352c31353632363339312c3135333335323137322c33343138353431362c39303538363132342c32313636393532312c34363737363635332c3137363738393032312c39373531363434342c34313539343836332c39363132323030392c35313139333435372c31373538303632312c34313639373939382c33353437333939322c33353632363636302c373636383834382c36303334393839322c31343635393033342c37313039303634352c353538303432302c32303634323234372c31373434373134362c36363837383730322c33353637313934352c32313335383439382c32333032383630312c31313732363932355d2c226e65696768626f7273223a5b2266756e6374696f6e3a6534623532646465646136306232396639666331396262623535323038343763225d2c22746f6b656e436f756e74223a3137367d"
  - node: "function:e4b52ddeda60b29f9fc19bbb5520847c"
    fingerprint: "mh:64:7b226d696e68617368223a5b3231373836303036362c3130353931373734352c3333323834383336312c3133373137323931372c34373830363431312c33303133353032342c3130303137383737392c35303232353939342c3132343734393131312c32333232373733322c31373931303839362c3138323838363835372c36303336323334302c373735353530302c3331303338333730392c323038323932322c3231343535353238372c3135383430353935342c36363939323630362c3138303335343938322c39353435343335342c3136333739353239322c3133373832313233342c363736383239302c3135333330393631332c3135303135313137312c34313937323036332c3439393732353331362c3333333535363632302c3130313933303030352c33363737343630322c3331343438373436392c32393338393836312c3130383633383538372c3236303137313032382c313934333631382c3230333234303239382c34373936323638392c36393830333139372c35303036303435312c3138383234373531312c3237373537373335362c36303030303437352c39343334303633382c39373531363434342c39383639303032362c32333535343436372c36333334393834332c37383937323536352c3135353032363532342c3132383134363431332c35333536323533322c3535383838392c38323434343230362c38363439353230312c33353733343434372c36353435333637382c3339393634333130332c3135393739323234342c3130383433353031322c3130343031363033332c393134333130362c3330353737383239372c39383130393938375d2c226e65696768626f7273223a5b2266756e6374696f6e3a6162353961656433393836636137363661336264323636313066626663613335225d2c22746f6b656e436f756e74223a34307d"
  - node: "constant:1dd4bde7c097bea18a3d8d1937033716"
    fingerprint: "mh:64:7b226d696e68617368223a5b3231353831363131302c3134323037373935372c37323036373631342c3335383030373432322c36313937343737392c35373037323531342c3131343031323131322c33343333313735322c35303932373039332c35303332323230372c32383930353533362c3236343736313736362c3338393539383436372c3138363431303630382c3136313530393532322c33343534313332322c3436313634383437362c3137343231393135362c38373032323639322c3630303236383139392c3531343532343330322c3230393534323739312c31303338313436342c3138333935313536312c3334353735363332342c3135303135313137312c39323837383237382c33383531353435302c37303237313637332c363332363430302c37393238323435382c3231363438323430362c32373733383333372c373137383631302c3235303933343839362c39313533353231392c39373530353833372c3638373233363536362c3131333638353436382c3134343833343039302c39303538363132342c3135323236313837342c3736343039313838342c3833363431363731392c3934313933343732392c39333838383936352c3236313735333837362c3538313737353736372c3436363238313233312c37383738303537322c3535303732323137362c3334313434303135382c3133323036363130392c3531353032373336352c38313333393738352c3238313539333332392c3134363837333630382c3239313739393037332c3234313235303433362c3537393933373330382c3639383936343531332c33313832383534362c3234303037393037352c3238383537343138325d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a33377d"
last_updated: 2026-08-10
---

# Giscus Comments

## Context

Comments are GitHub Discussions rendered in an iframe by `@giscus/react`. The entire
integration is one file, `src/components/blog/Comments.tsx`, used in exactly one place:
`<Comments client:load />` near the bottom of `src/pages/[category]/[slug].astro`.

[`Comments()`](mex://function:ab59aed3986ca766a3bd26610fbfca35) holds the giscus config as
**literal props in JSX** — `repo="olddognewflex/OldDogNewFlex.com"`, `repoId`, `category`
and `categoryId` — with `mapping="pathname"`, so each post's thread is keyed by its URL.
[`resolveGiscusTheme()`](mex://function:e4b52ddeda60b29f9fc19bbb5520847c) reads
`document.documentElement`'s `data-theme` and maps it through `THEME_MAP` onto the
matching `catppuccin_*` giscus theme; a `MutationObserver` re-runs it on every flavour
switch.

This is the highest-risk integration in the repo precisely because **nothing about it can
fail the build**. Wrong ids, a deleted discussion category, a missing `client:load` — all
produce a green build and an empty box.

## Steps

**To change which repo or category backs comments:**
1. Get the new `repoId` and `categoryId` from https://giscus.app — they are opaque
   (`R_kgDO...`, `DIC_kwDO...`) and cannot be derived from the repo name.
2. Edit all four literals in `Comments.tsx` together. Changing `repo` without `repoId`
   leaves it pointing at the old repository.
3. Confirm the target repo is public, has Discussions enabled, has the giscus app
   installed, and has a discussion category matching the `category` string.
4. `pnpm build && pnpm preview`, open a post, and confirm the widget loads a real thread.

**To add comments to another page type:**
1. Import the component and hydrate it: `<Comments client:load />`.
2. Because `mapping="pathname"`, the thread is bound to that page's URL — a page whose
   URL later changes loses its comments.

**To add a theme flavour:**
1. Add the flavour to `THEME_MAP` in `Comments.tsx` alongside the other five places listed
   in `context/theming.md`. Without the map entry the widget falls back to
   `catppuccin_macchiato` and looks wrong on the new flavour.

## Gotchas

- **`client:load` is load-bearing.** Drop it and Astro renders the component to static
  HTML: no iframe, no error, no comments.
- **The config is hardcoded, not env-driven.** A fork of this repo ships comments pointing
  at the original repository, and posts to it, until someone edits the file.
- **`repoId`/`categoryId` are the real identity.** The human-readable `repo` and `category`
  strings are not what giscus resolves against; stale ids beat correct names.
- **`resolveGiscusTheme()` touches `document` at module scope of the effect.** It is only
  ever called from inside `useEffect`, which is what keeps it safe under SSR. Do not hoist
  the call into render or the static build will crash on `document is not defined`.
- **The `MutationObserver` is scoped to `attributeFilter: ["data-theme"]`.** If theme
  switching ever moves off that attribute, the observer stops firing silently.
- **The iframe cannot see the site's CSS variables.** Theming only works through the
  `theme` prop; styling the widget with site CSS is impossible.
- **`loading="eager"`** means the iframe loads with the page rather than on scroll —
  a deliberate but real cost on every post.

## Verify

- [ ] `pnpm build && pnpm preview`, open a real post, confirm the widget renders a thread
      (not an empty box, not a giscus error strip)
- [ ] Switch flavour with the theme dropdown and confirm the widget's colours follow
- [ ] Check the browser console for giscus errors — failures surface there, not in the
      build
- [ ] Confirm the thread URL/pathname matches the post's permalink
- [ ] Confirm `client:load` is present at every usage site

## Debug

**Empty box, no error:** almost always a mismatched `repoId`/`categoryId`, Discussions
disabled on the repo, or the giscus app uninstalled. Verify at https://giscus.app before
touching code.
**Widget renders but is the wrong colour:** `THEME_MAP` is missing the current
`data-theme` value, or the attribute is not being set — see `context/theming.md`.
**Nothing renders at all, no iframe in the DOM:** missing `client:load`.
**Build crashes with `document is not defined`:** `resolveGiscusTheme()` is being called
outside `useEffect`.

## Update Scaffold
- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
- [ ] Update any `.mex/context/` files that are now out of date
- [ ] If this is a new task type without a pattern, create one in `.mex/patterns/` and add to `INDEX.md`
