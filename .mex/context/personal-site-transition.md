---
name: personal-site-transition
description: The blog-to-personal-site transition — audit of the pre-transition site, the locked information architecture, and the phase plan. Load when working on navigation, the homepage, /now, /projects, /writing, /notes, or any route added by this transition.
triggers:
  - "personal site"
  - "information architecture"
  - "now page"
  - "projects"
  - "notes"
  - "writing hub"
  - "navigation"
edges:
  - target: context/content-pipeline.md
    condition: when touching collections, slugs, RSS, or src/lib/blog.ts
  - target: context/architecture.md
    condition: when you need how the existing pieces connect
  - target: context/theming.md
    condition: when doing the Phase 5 visual pass
  - target: patterns/add-page-route.md
    condition: when adding any route named in the IA below
last_updated: 2026-09-21
---

# Blog → Personal Site Transition

The site is moving from "this is my blog" to "this is my corner of the internet":
a living record of an experienced engineer who keeps building, learning, and
reinventing. Writing becomes one component rather than the whole identity.

It must NOT become a corporate portfolio, a resume site, a personal-brand funnel,
or a generic developer blog. If a change makes it feel like one of those, back up
and simplify.

## Audit of the pre-transition site (2026-09-20)

### Stack, as installed

Astro 7, `output: "static"`. The root `AGENTS.md` still says "Astro 5.x" — trust
`package.json` over it.

*Correction:* this audit originally reported that `package.json` declared Astro 5
while Astro 7 was installed. That was wrong. The audit was run from a checkout whose
local `main` predated the Astro 7 upgrade (PR #13) already merged upstream, so it read
the old `package.json`. The real problem was narrower — see risk 6 below.

Tailwind v4 through `@tailwindcss/vite` — there is no JS config, tokens live in
an `@theme` block inside `src/styles/global.css`. Integrations: `mdx()`,
`react()`, `sitemap()`. Exactly one hydrated island exists on the whole site:
`<Comments client:load />` (giscus). `src/components/blog/CodeBlock.tsx` is dead
code — nothing imports it.

### URL surface before the transition

| Route | File | Notes |
|---|---|---|
| `/` | `pages/index.astro` | hero, 3-lens explainer, Featured, Latest |
| `/blog` | `pages/blog.astro` | near-duplicate of `/`; not linked from nav |
| `/learn` `/share` `/journey` | `pages/[category]/index.astro` | hardcoded `getStaticPaths`, emoji + hero per lens |
| `/{category}/{slug}` | `pages/[category]/[slug].astro` | 8 posts |
| `/about` | `pages/about.astro` | long essay, plus another Latest grid |
| `/start-here` | `pages/start-here.astro` | 3 curated reading paths, hand-linked |
| `/contact` | `pages/contact.astro` | not linked from nav |
| `/products`, `/products/responsible-ai-adult` | | product array hardcoded in the page |
| `/rss.xml`, `/404`, `/sitemap-index.xml` | | |

Navigation lived in `Header.astro` and was **duplicated** between the desktop
list and the mobile slide-out panel: HOME · LEARN · JOURNEY · SHARE · START HERE
· PRODUCTS · ABOUT. Seven items was over budget — there was a `768px–900px`
media query dropping link font-size to `0.7rem` to make them fit.

### Content architecture

Three collections (`learn`, `share`, `journey`), each a `glob` loader over
`**/*.{md,mdx}`, all sharing one Zod schema. `getAllPosts()` filters `!draft`
and sorts by `publishedDate` descending. `getPostUrl()` returns
`/{collection}/{basename-without-extension}`.

Post inventory at audit time: **learn 6, journey 2, share 0.**

Posts carry `section:` and `status:` frontmatter keys that the schema does not
declare — Zod strips them silently, so they are decorative. Two posts also have
a stray `# src/content/learn/astro-migration-journey.md` comment line sitting
inside the frontmatter fence.

**There was zero project content anywhere in the repo.** Every project entry is
net-new content authored from the owner's authoritative descriptions.

### Design system

Catppuccin in four flavours via `data-theme` plus CSS custom properties,
persisted to `localStorage`, with a working inline anti-FOUC script in
`BaseLayout`. UI primitives: `Container`, `Card`, `Badge`, `Button`, `Image`.

Two things the transition treats as debt:

- `Card`'s default variant is `bg-gradient-to-br from-mauve/75 to-mauve/50` — a
  saturated purple gradient behind every post card. Together with the
  emoji headers on lens pages it reads as card soup, which is explicitly
  what the personal-site direction is trying to avoid.
- `PageHero` renders a 16:5 image, and then **every page separately
  absolutely-positions its own tagline** with copy-pasted inline
  `style="top: 140px; left: 30px"` plus a text-shadow. Fragile and unshared.

Both are deferred to the Phase 5 visual pass. They are known, not overlooked.

### Migration risks found

*Status after the transition: 1–6 are fixed (6 by the pnpm deploy change, PR #15).
7 — no CI — remains open.*

1. **`.mdx` posts 404.** `[slug].astro`'s `getStaticPaths()` uses a literal
   `.replace('.md','')` while `getPostUrl()` uses `/\.(md|mdx)$/`. An `.mdx`
   file therefore builds at one path and is linked at another. This blocks
   using MDX anywhere, including new project pages — fix before adding content.
2. **Drafts leak.** `rss.xml.js` calls `getCollection()` with no draft filter,
   and `[slug].astro` builds a live page for every draft.
3. **`/share` was an empty room** linked from the primary navigation.
4. **Triple duplication** — `/`, `/blog`, and `/about` each rendered the same
   "Latest" grid.
5. `[category]/index.astro`'s `getStaticPaths` is a hardcoded array, so adding a
   lens means editing it.
6. Two lockfiles. Development uses pnpm, but the npm lockfile was never removed
   when the project moved to pnpm, and `.deploy.sh` still installed from it with npm
   — pinning Astro 5 on every deploy.
7. No CI. `.github/workflows/` is empty.

## Locked information architecture

Design rule, non-negotiable: **no existing post URL changes.**

```
NAV:  HOME · NOW · PROJECTS · WRITING · ABOUT
      footer: Start Here · Products · Contact · RSS

/                     evolved homepage
/now                  new — markdown page, editable without touching code
/projects             new — workbench, grouped by status
/projects/{slug}      new — `projects` collection
/writing              new — hub; lens filters hide empty lenses
/blog                 redirect → /writing
/learn /journey       unchanged lens listings
/share                unchanged URL, hidden from filters until it has posts
/{lens}/{slug}        unchanged — all 8 posts, zero URL churn
/notes                new — `notes` collection, short-form
/notes/{slug}         new
/about                trimmed (duplicate Latest grid removed)
/start-here           unchanged, linked from /writing + footer
/products/*           unchanged URLs, out of primary nav
/rss.xml              + notes, draft leak fixed
```

### Decisions taken by the site owner

- **Empty lenses auto-hide.** `/share` stays a valid URL but does not appear in
  the Writing filter bar until it has published posts. No advertised dead ends.
- **`/blog` redirects to `/writing`.** "Writing" matches the new mental model;
  the old URL is kept alive as a static redirect.
- **Products demoted** to the footer and contextual links from Projects. The
  `/products/*` URLs are untouched. Products must not dominate a personal site.
- **`/start-here` kept as-is**, moved out of primary nav. It is good working
  content and a genuine front door for new readers.

### Deviations from the original brief's sketch

- The brief sketched posts nested under `/writing/learn/...`. They are **not**
  being moved — `/learn/{slug}` stays canonical and `/writing` is a hub that
  links out. Avoids eight redirects for no benefit.
- `notes` is its own collection rather than a lens on the existing blog schema,
  because it deliberately has a *different* schema — no required `summary`.
  That reduced ceremony is the entire point of Notes.
- Products stays a separate route rather than folding into `/projects`.
  Different intent (selling versus showing), and the URLs survive.

### `projects` collection shape

```ts
name, tagline, kind: 'product'|'open-source'|'practice',
status: 'building'|'exploring'|'paused'|'shipped'|'archived',
tech?: string[], links?: {label,url}[],
related?: string[],        // project slugs → "Related: TKT · TKTBAN"
writingTags?: string[],    // pulls matching posts into "Related writing"
featured?: boolean, order?: number, startedDate?, updatedDate?, draft?
```

The body is prose answering the six project-page questions: what is this, why
does it exist, what problem was I solving, what state is it in, what did I learn,
where can someone explore it. `kind` drives the page template and the grouping on
`/projects`; it is deliberately **not** exposed as filter UI, because surfacing
the taxonomy makes the site feel over-structured.

Seed entries: `qi`, `somehow`, `tkt`, `tktban`, `ai-native-software-development`.
Their descriptions are authoritative and supplied by the owner — preserve their
substance and technical specificity, and **invent no additional claims, metrics,
users, or outcomes.**

### `notes` collection shape

`title, publishedDate, tags?, link?, draft?`. No required `summary`. Notes render
inline on `/notes` and each gets a permalink.

### `/now`

Intentionally temporal: what I am doing right now, not a biography. Sections are
Building / Learning / Thinking About / Writing / Life. Implemented as a markdown
page so updating it needs no code change and no CMS.

## Phase plan

- **Phase 1** — reconnaissance and audit. *Done, this document.*
- **Phase 2** — information architecture. *Done, locked above.*
- **Phase 3** — foundation. *Done.* Prerequisite fixes landed (`getPostSlug()` as
  the single slug source, drafts filtered out of RSS and `getStaticPaths()`, lens
  paths derived from `BLOG_CATEGORIES`). `notes` and `projects` collections added
  with five project entries and a seed note. Routes `/now`, `/projects`,
  `/projects/[slug]`, `/writing`, `/notes`, `/notes/[slug]` built; `/blog`
  redirects. Nav cut to five items. Homepage rebuilt around identity → currently →
  projects → recent writing → elsewhere. Also fixed:
  `src/pages/products/README.md` was publishing as a real page at
  `/products/README`. (The branch also stubbed `astro:content` to get vitest
  running. That duplicated the `getViteConfig()` fix already on `main` from the
  Astro 7 upgrade — see `context/decisions.md` — and the stub was dropped when
  `main` was merged in.)
- **Phase 4** — content migration. *Done, and a no-op by design:* the IA was
  chosen so existing posts keep their URLs, titles, dates, and metadata. Verified
  against the built output — all 8 post URLs, `/about`, `/contact`, `/start-here`,
  `/share`, `/products` and `/products/responsible-ai-adult` are unchanged, and a
  link check over all 28 built pages found zero broken internal links.
- **Phase 5** — visual refinement. *Done.* Verified in a real browser at 1440px
  and in a 390px viewport, in both a dark flavour and `latte`.
  - **Card soup removed.** `BlogCard`, `Card` and `Badge` deleted; posts, notes
    and projects all render as bordered rows (`writing/WritingRow.astro`,
    `projects/ProjectRow.astro`). The mauve gradient is gone.
  - **Emoji lens headers removed** (🎓🤝🚀 and the 📝 empty state). Lens pages now
    match `/writing` and `/projects` typographically, and the empty state points
    somewhere useful instead of saying "check back soon".
  - **Hero taglines unified.** Five copy-pasted absolutely-positioned blocks
    replaced by `heroTagline` / `heroAlign` props on `PageHero`.
  - **The hero's `aspect-ratio` never applied** — an in-flow `h-full` image
    collapsed the percentage height to auto and drove layout from the intrinsic
    image size, making the hero 783px tall on a 900px viewport. The image is now
    absolutely positioned inside the ratio box: a 16:5 band on desktop, 3:2 on
    phones where a letterbox would be a 120px sliver.
  - **Two cascade-layer bugs found and fixed** — see `context/theming.md`. Both
    were pre-existing and invisible until the layout was looked at directly.
  - **Prose rhythm** — reading column moved from a viewport-relative `70%` to
    `68ch`, and article headings got a scale separate from the display scale.
- **Phase 6** — review. Existing URLs still valid, every post reachable, the
  homepage communicates what ODNF is within seconds, unfinished projects sit
  naturally beside shipped ones, short notes coexist with long essays, `/now` is
  trivial to update, the voice survived — and we did not accidentally build a
  corporate portfolio.

## Known gaps after the transition

- **Featured posts lost their surface.** The old homepage, `/blog` and `/about` all
  rendered a Featured section. None survived, and nothing else calls
  `getFeaturedPosts()`, so `featured: true` on the five flagged posts now does
  nothing. This was not called out when the transition shipped.
- **Content the owner still needs to write.** HTML-comment placeholders addressed to
  the owner (they render as nothing) mark the App Store link in `projects/somehow.md` and the
  Learning and Life sections of `src/pages/now.md`.
- **Phase 6 was not run as a separate review pass.** Its checks were exercised
  during Phases 3–5 (URL survival, link check, rendering in both themes and at
  phone width), but not as the independent end-to-end review the plan describes.

Shipped in PR #14 and deployed on 2026-09-20 from `main` at `2b1e0da`.

## Success test

The transition worked if any of these can be added tomorrow without first asking
"does this qualify as a blog post?" — a new Qi feature, a technical discovery, a
failed experiment, a tool being learned, a short opinion, a career reflection, an
abandoned project, a mental model, a weekend build, a long essay.
