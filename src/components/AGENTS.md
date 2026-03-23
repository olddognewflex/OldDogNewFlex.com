# COMPONENTS

**Purpose**: Reusable UI components (feature-organized)

## STRUCTURE

```
src/components/
├── blog/           # Blog-specific components
│   ├── BlogCard.astro
│   └── CodeBlock.tsx     # Only React component (interactive)
├── ui/             # Primitive UI components
│   ├── Badge.astro
│   ├── Button.astro
│   ├── Card.astro
│   ├── Container.astro
│   └── Image.astro
├── products/       # Product display components
│   └── ProductCard.astro
├── Header.astro
├── Footer.astro
├── BaseHead.astro
├── ThemePills.astro
└── ...
```

## WHERE TO LOOK

| Task              | Location              | Notes                         |
| ----------------- | --------------------- | ----------------------------- |
| Blog card         | `blog/BlogCard.astro` | Featured + regular variants   |
| Code highlighting | `blog/CodeBlock.tsx`  | React component (interactive) |
| Layout wrapper    | `ui/Container.astro`  | Max-width container           |
| Theme toggle      | `ThemePills.astro`    | Client-side theme switching   |
| SEO head          | `BaseHead.astro`      | Meta tags, fonts, favicon     |

## CONVENTIONS

- **Astro default**: Static components use `.astro`
- **React exception**: Only for interactive elements (CodeBlock)
- **Import pattern**: Relative from pages (`../components/...`)
- **Naming**: PascalCase for components
- **Props**: Typed via Astro Props interface

## ANTI-PATTERNS

- **NO React for static content** — Use Astro components
- **NO logic in components** — Keep in `src/lib/`
- **NO direct content fetching** — Pass data via props
