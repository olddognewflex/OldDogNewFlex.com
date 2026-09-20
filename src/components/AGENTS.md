# COMPONENTS

**Purpose**: Reusable UI components (feature-organized)

## STRUCTURE

```
src/components/
├── blog/           # Post-page components
│   ├── Comments.tsx      # giscus island — the only hydrated component
│   └── CodeBlock.tsx     # UNUSED: nothing imports it, never shipped
├── writing/        # Shared writing presentation
│   └── WritingRow.astro  # One row treatment for posts AND notes
├── projects/       # Workbench components
│   ├── ProjectRow.astro
│   └── StatusPill.astro
├── ui/             # Primitive UI components
│   ├── Button.astro
│   ├── Container.astro
│   └── Image.astro
├── products/       # Product display components
│   └── ProductCard.astro
├── Header.astro
├── BaseHead.astro
├── PageHero.astro  # Hero image + optional overlay tagline
├── ThemePills.astro
└── ...
```

## WHERE TO LOOK

| Task              | Location                      | Notes                                      |
| ----------------- | ----------------------------- | ------------------------------------------ |
| List a post/note  | `writing/WritingRow.astro`    | One treatment everywhere; no cards          |
| List a project    | `projects/ProjectRow.astro`   | Pairs with `projects/StatusPill.astro`      |
| Hero + tagline    | `PageHero.astro`              | Pass `heroTagline` / `heroAlign` via layout |
| Layout wrapper    | `ui/Container.astro`          | Max-width container                         |
| Theme toggle      | `ThemePills.astro`            | Client-side theme switching                 |
| SEO head          | `BaseHead.astro`              | Meta tags, fonts, favicon                   |

## CONVENTIONS

- **Astro default**: Static components use `.astro`
- **React exception**: Only for interactive elements (giscus `Comments`)
- **Import pattern**: Relative from pages (`../components/...`)
- **Naming**: PascalCase for components
- **Props**: Typed via Astro Props interface

## ANTI-PATTERNS

- **NO React for static content** — Use Astro components
- **NO logic in components** — Keep in `src/lib/`
- **NO direct content fetching** — Pass data via props
- **NO card soup** — Posts, notes and projects are bordered rows, not gradient
  cards. `Card`/`Badge`/`BlogCard` were removed for exactly this reason; do not
  reintroduce them for list views.
