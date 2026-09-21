---
name: conventions
description: How code is written in this project — naming, structure, patterns, and style. Load when writing new code or reviewing existing code.
triggers:
  - "convention"
  - "pattern"
  - "naming"
  - "style"
  - "how should I"
  - "what's the right way"
edges:
  - target: context/architecture.md
    condition: when a convention depends on understanding the system structure
  - target: context/stack.md
    condition: when the convention is really a library choice (Tailwind v4, lucide, vitest)
  - target: context/theming.md
    condition: when writing anything with a colour, spacing, or font token in it
  - target: patterns/INDEX.md
    condition: before starting a concrete task — a pattern may already encode these rules
grounds_to:
  - node: "function:ab59aed3986ca766a3bd26610fbfca35"
    fingerprint: "mh:64:7b226d696e68617368223a5b35303937343339392c32313036363539332c32393535353836342c3133373137323931372c33393033373332382c35393439383430392c34313735343830312c343137323934392c32303237353134322c32333232373733322c363033313032362c39363839373336362c363938353135382c33323732323635302c39343738313435322c37323739343834302c35343439373235392c33303130323934322c3131343836363437352c32333636393532352c34313931393439392c36313432383531352c35313436343430362c31303533383338302c31363232312c36363234363235312c39363132343836332c3137383335383237352c33323435303830362c353034313033372c3130343639322c33353636343538312c37393639383434372c393934373339352c31323433333437322c313934333631382c31383433383939352c31353632363339312c3135333335323137322c33343138353431362c39303538363132342c32313636393532312c34363737363635332c3137363738393032312c39373531363434342c34313539343836332c39363132323030392c35313139333435372c31373538303632312c34313639373939382c33353437333939322c33353632363636302c373636383834382c36303334393839322c31343635393033342c37313039303634352c353538303432302c32303634323234372c31373434373134362c36363837383730322c33353637313934352c32313335383439382c32333032383630312c31313732363932355d2c226e65696768626f7273223a5b2266756e6374696f6e3a6534623532646465646136306232396639666331396262623535323038343763225d2c22746f6b656e436f756e74223a3137367d"
  - node: "function:95dec1a8277af2c73099ce9aaa73c019"
    fingerprint: "mh:64:7b226d696e68617368223a5b313336333738322c37303235383936332c33303336373738352c38343238363632302c31353435343230392c35393439383430392c34343535333035312c343137323934392c31393139353135382c333739393934392c363033313032362c39303232373834392c363938353135382c35343634373832322c31393336353234342c37323737303838352c34323937323939352c343436313432352c3635333636352c32333636393532352c343231373036342c36303038383039312c313830393030342c363736383239302c31363232312c3133373534333233382c323034383432372c31323632343133392c33383334343132352c353034313033372c3130343639322c34373232363236382c36323433373638342c37303634383735302c34373532333639342c313934333631382c393033313736362c333336353038332c3232373936302c3134343833343039302c31343333363032382c34393738313133382c3131373934363332392c31303137373432342c32333330343039302c33373830343637332c32363234373734362c36333334393834332c363837393436372c33353233393537342c32383731303635392c31353232313031332c373636383834382c32333532353734372c363132393133352c31343139343035362c31353038393935392c32303634323234372c31373434373134362c35383739323034352c31383833373432382c393134333130362c35383633343432362c31313732363932355d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a3231337d"
last_updated: 2026-09-21
---

# Conventions

## Naming

- **Components: PascalCase**, matching the filename — `WritingRow.astro`, `ThemePills.astro`,
  `CodeBlock.tsx`. Filename and exported/component name always agree.
- **Content files: kebab-case, no date prefix** — `why-old-dog-new-flex-exists.md`. The
  filename *is* the URL slug; renaming a file breaks its permalink.
- **Utility modules: lowercase** — `src/lib/blog.ts`, `src/utils/themes.ts`,
  `src/constants/index.ts`. Functions inside are camelCase and verb-first
  (`getAllPosts`, `getPostUrl`, `resolveGiscusTheme`).
- **Exported constants: SCREAMING_SNAKE with `as const`** — `SITE_CONFIG`, `COLLECTIONS`,
  `FEATURED_POSTS_LIMIT`, `THEME_MAP`.
- **CSS custom properties: `--color-<catppuccin-name>`** — `--color-mauve`,
  `--color-surface0`, `--color-crust`. Never invent a new colour name outside the
  Catppuccin vocabulary.

## Structure

- **Data access lives in `src/lib/blog.ts`.** Components and pages receive data via props
  or call the `src/lib` helpers. Calling `getCollection()` from a component is a
  deviation — the three existing exceptions (`[slug].astro`, `[category]/index.astro`,
  `rss.xml.js`) are getStaticPaths/feed code, not a licence to add more.
- **Shared prop types live in `src/types/index.ts`.** The `ui/` primitives import them
  (`import type { ButtonProps } from '../../types'`); page-local components declare a
  local `interface Props` in the frontmatter fence instead. Follow whichever the sibling
  files use.
- **Components are grouped by feature, not by kind** — `src/components/blog/`,
  `src/components/ui/`, `src/components/products/`, with cross-cutting chrome
  (`Header.astro`, `BaseHead.astro`, `ThemePills.astro`) sitting flat at the top.
- **Stylesheets are imported exactly once**, in `src/layouts/BaseLayout.astro`. Do not
  add `import "../styles/global.css"` to a page or component.
- **Constants are added to `src/constants/index.ts` and re-exported from `src/consts.ts`.**
  Both files are load-bearing; `src/consts.ts` exists only for backward compatibility but
  `rss.xml.js` still imports `SITE_TITLE` from it.
- **List views are bordered rows, not cards.** Posts and notes render through
  `writing/WritingRow.astro`, projects through `projects/ProjectRow.astro`. `Card`,
  `Badge` and `BlogCard` were deleted to get rid of card soup; do not reintroduce a card
  component for a list.
- **Tests live in `tests/`, not beside the source.** One file exists: `tests/blog.test.ts`.
- **Imports are relative** (`../../lib/blog`). There is no path alias configured.

## Patterns

**1. Astro by default; React only when the browser must do something.**
`astro.config.mjs` says it in a comment, and the codebase honours it — of ~20 components
only two are `.tsx`. [`Comments()`](mex://function:ab59aed3986ca766a3bd26610fbfca35)
qualifies because it needs `useState` plus a `MutationObserver`;
[`CodeBlock()`](mex://function:95dec1a8277af2c73099ce9aaa73c019) qualifies because it
needs the clipboard API. If the component only renders markup, it is `.astro`.

```
// Correct — static markup
src/components/projects/StatusPill.astro

// Wrong — a .tsx that renders a span and nothing else
src/components/projects/StatusPill.tsx
```

**2. A React island without a `client:*` directive is dead weight.**
Astro renders `.tsx` to static HTML unless hydrated. The whole codebase contains exactly
one directive — `<Comments client:load />` in `src/pages/[category]/[slug].astro`.
`CodeBlock.tsx` has no importer at all, which is why its copy button has never worked.

```
// Correct
<Comments client:load />

// Wrong — ships the component, drops the interactivity, no error
<Comments />
```

**3. Colours come from tokens, never from literals.**

```
// Correct
class="bg-mantle text-text"
style={`color: var(--color-mauve)`}

// Wrong — breaks the moment the reader switches Catppuccin flavour
class="bg-[#1C1A2E]"
style="color: #FF4CAD"
```

**4. Derive a post URL with `getPostUrl()`, not by hand.**
See `context/content-pipeline.md` — three separate slug derivations already exist in this
repo and they do not all agree. Do not add a fourth.

## Verify Checklist

Before presenting any code:

- [ ] `npx astro check` passes — strict TS with `strictNullChecks`; `post.filePath` is
      optional, so it must be guarded or `?.`-accessed.
- [ ] `pnpm build` succeeds. This is the real test: Zod schema errors, broken
      `getStaticPaths()`, and bad imports only surface at build time.
- [ ] `pnpm test` passes (`tests/blog.test.ts` covers the slug/URL helpers).
- [ ] No new `.tsx` component unless it needs browser state/APIs — and if it is one, it
      has a `client:*` directive at every usage site.
- [ ] No hardcoded hex colours, no `tailwind.config.*` file created, no new
      `import "../styles/*.css"` outside `BaseLayout.astro`.
- [ ] Post URLs come from `getPostUrl()`; new content lives in one of the three existing
      collections with all required frontmatter fields.
- [ ] `npx prettier --check .` is clean if you touched formatting-sensitive files.
