# CONTENT

**Purpose**: Markdown/MDX blog posts with schema validation

## STRUCTURE

```
src/content/
├── learn/          # Educational posts
│   ├── why-old-dog-new-flex-exists.md
│   ├── prediction-is-not-resiliance.md
│   └── ...
├── share/          # Project/tool posts (empty)
└── journey/        # Reflective posts
    ├── burnout-wasnt-the-end.md
    └── stop-coding-start-supervising.md
```

## FRONTMATTER SCHEMA

```yaml
---
title: "Post Title" # required
subtitle: "Optional subtitle" # optional
summary: "Brief description" # required
publishedDate: 2024-01-15 # required (Date)
updatedDate: 2024-02-01 # optional (Date)
heroImage: "/images/hero.webp" # optional
tags: ["astro", "react"] # optional
featured: true # optional (shows on home)
draft: true # optional (excluded from build)
---
```

## WHERE TO LOOK

| Task        | Location                 | Notes                             |
| ----------- | ------------------------ | --------------------------------- |
| Add post    | `{collection}/{slug}.md` | Use kebab-case slugs              |
| Edit schema | `src/content.config.ts`  | Zod validation                    |
| Query posts | `src/lib/blog.ts`        | getAllPosts(), getFeaturedPosts() |
| Draft post  | Set `draft: true`        | Excluded from build               |

## CONVENTIONS

- **Slug format**: Kebab-case (`my-post-title.md`)
- **Images**: Store in `public/images/posts/`, reference with `/images/...`
- **Categories**: `learn`, `share`, `journey` only
- **Drafts**: Use `draft: true` to hide from production
- **Featured**: Max 3 featured posts (configured in constants)

## ANTI-PATTERNS

- **NO posts without `title` or `summary`** — Required by schema
- **NO future dates** — Published posts need valid dates
- **NO images in content/** — Use `public/images/`
- **NO extra collections** — Only 3 defined categories
