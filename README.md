# Old Dog New Flex

[![Netlify Status](https://api.netlify.com/api/v1/badges/SITE_ID/deploy-status)](https://app.netlify.com/sites/SITE_NAME/deploys)

Proving it’s never too late to refactor your comfort zone!

This is a static blog site built with [Astro](https://astro.build) featuring MDX content, React components, and Tailwind CSS with the Catppuccin theme palette.

## Getting Started

### Prerequisites

- Node.js v16 or later
- npm (comes with Node.js)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build & Preview

```bash
npm run build
npm run preview
```

### Testing

```bash
npm run test
```

## Project Structure

```
.
├── astro.config.mjs        # Astro configuration (MDX, React, sitemap, Tailwind)
├── tailwind.config.mjs     # Tailwind CSS configuration (Catppuccin themes)
├── postcss.config.mjs      # PostCSS plugins
├── tsconfig.json           # TypeScript configuration
├── package.json            # npm scripts and dependencies
├── src/
│   ├── consts.ts           # Site metadata (title, description)
│   ├── content.config.ts   # Astro content collections & frontmatter schema
│   ├── content/            # Markdown/MDX posts (learn, share, journey)
│   ├── lib/                # Blog helpers (getAllPosts, reading time, URL helpers)
│   ├── pages/              # Astro pages and dynamic routes
│   ├── layouts/            # Layout components (BaseLayout, BlogPost)
│   ├── components/         # Reusable UI components (Header, Footer, ThemePills, etc.)
│   ├── styles/             # Tailwind directives and global CSS (Catppuccin variables)
│   └── utils/              # Utility modules (theme list)
├── public/                 # Static assets (images, fonts, favicon)
└── tests/                  # Vitest test suite
```

## Content & Routing

- **Content Collections:** Defined in `src/content.config.ts` using Astro’s Content Collections API.  Supports `learn`, `share`, and `journey` categories.
- **Adding a Post:** Place a `.md` or `.mdx` file in the appropriate folder under `src/content/{learn,share,journey}` and add frontmatter per the Zod schema.
- **Dynamic Routes:** `src/pages/[category]/[slug].astro` generates static pages for each post.

## Styling & Theming

- **Tailwind CSS** with a custom Catppuccin OKLCH palette (`tailwind.config.mjs`).
- **Themes** (latte, frappe, macchiato, mocha) defined via CSS variables in `src/styles/global.css`.
- **ThemePills** component (`src/components/ThemePills.astro`) lets users switch themes (client-side).

## License

This project is licensed under MIT. (Add your license file if needed.)
