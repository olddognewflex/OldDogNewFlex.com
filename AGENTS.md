# PROJECT KNOWLEDGE BASE

**Project**: Old Dog New Flex  
**Type**: Astro 5.x static blog with React  
**Stack**: Astro, TypeScript (strict), Tailwind CSS v4, React (minimal), MDX  
**Theme**: Custom Catppuccin-inspired dark palette with neon accents

---

## STRUCTURE

```
.
├── src/
│   ├── components/     # UI components (feature-organized)
│   ├── layouts/        # Page templates (BaseLayout, BlogPost)
│   ├── pages/          # File-based routes + dynamic [category]/[slug]
│   ├── content/        # MDX posts (learn, share, journey collections)
│   ├── lib/            # Blog utilities (getAllPosts, getReadingTime)
│   ├── constants/      # SITE_CONFIG, THEME_COLORS, COLLECTIONS
│   ├── styles/         # Tailwind + global CSS
│   └── types/          # TypeScript types
├── public/             # Static assets (images, fonts)
├── tests/              # Vitest (blog.test.ts)
└── .deploy.sh          # Custom SSH deployment script
```

---

## WHERE TO LOOK

| Task           | Location                                        | Notes                                            |
| -------------- | ----------------------------------------------- | ------------------------------------------------ |
| Add page       | `src/pages/`                                    | File = route. Dynamic: `[category]/[slug].astro` |
| Add component  | `src/components/{blog,ui,products}/`            | Feature-based organization                       |
| Add content    | `src/content/{learn,share,journey}/`            | MDX with Zod schema validation                   |
| Edit constants | `src/constants/index.ts`                        | Centralized; re-exported via `src/consts.ts`     |
| Edit styles    | `tailwind.config.mjs` + `src/styles/global.css` | Custom palette, neon shadows                     |
| Add test       | `tests/*.test.ts`                               | Vitest, minimal config                           |
| Deploy         | `.deploy.sh` (manual SSH) or push to main       | See ANTI-PATTERNS for CI gap                     |

---

## CONVENTIONS

### Component Organization

- **Feature-based**: `blog/`, `ui/`, `products/` subdirectories
- **Astro default**: `.astro` files for static; React only for interactive
- **Naming**: PascalCase for components, camelCase for utilities

### Content Schema (Zod)

```typescript
blogSchema = {
  title: string (required),
  subtitle?: string,
  summary: string (required),
  publishedDate: Date (required),
  updatedDate?: Date,
  heroImage?: string,
  tags?: string[],
  featured?: boolean,
  draft?: boolean
}
```

### Styling

- Tailwind v4 with custom Catppuccin palette
- Custom colors: `background: '#0E0C1B'`, `surface: '#1C1A2E'`
- Neon accents: pink `#FF4CAD`, cyan `#5DEEFF`, etc.
- Fonts: Orbitron (headings), Share Tech Mono (mono)
- `.sr-only` class for screen readers (legacy browser support required)

### Constants Pattern

```typescript
// Centralized in src/constants/index.ts
export const SITE_CONFIG = { ... } as const;
export const COLLECTIONS = { learn, share, journey } as const;
```

---

## ANTI-PATTERNS (THIS PROJECT)

### Code

- **React ONLY for interactive components** — Comment in astro.config.mjs explicitly restricts React usage
- **TypeScript strict mode required** — `strictNullChecks: true` in tsconfig.json
- **No `any` types** — Strict mode enforced; use proper typing

### Production Safety

- **"A vague prompt in a production codebase isn't just unclear — it's dangerous"** — From ai-is-fast-production-is-fragile.md
- **"The better our predictions get, the more dangerous it is to confuse them with guarantees"** — AI risk management rule
- **Don't confuse predictions with guarantees** — Applies to AI-generated code and content

### Product Development

- **"Bundles are leverage, not validation"** — Don't launch with bundles first
- **"Don't build everything at once"** — Scope control to prevent hobby-creep
- **"You are selling judgment, not text"** — Pricing reflects value, not just content

### CSS/Accessibility

- **MUST keep legacy browser support** — `.sr-only` uses deprecated `clip: rect()` for compatibility
- **MUST include `white-space: nowrap` in `.sr-only`** — Prevents screen reader word smushing
- **MUST use `!important` on `.sr-only` position** — Required for screen reader-only content

### Deployment

- **No CI/CD configured** — `.github/workflows/` is empty; deployment is manual via `.deploy.sh`
- **No automated testing on PRs** — Vitest exists but no GitHub Actions workflow
- **Custom SSH deployment** — Hardcoded server details in `.deploy.sh`

---

## COMMANDS

```bash
npm run dev       # Astro dev server (port 3000)
npm run build     # Static build to `dist/`
npm run preview   # Preview production build
npm run test      # Vitest (currently minimal)
```

---

## NOTES

- **Dual constants files**: `src/consts.ts` re-exports from `src/constants/index.ts` for backward compatibility
- **Netlify badge in README but custom SSH deployment** — Possible migration in progress
- **Prettier typo**: `.prettierrc` references `glolbal.css` instead of `global.css`
- **No ESLint**: Relies on TypeScript strict mode + Prettier
- **No .nvmrc**: Referenced in deploy script but missing
- **No .env.example**: Environment variables undocumented

---

## GOTCHAS

1. **Component imports**: Use relative paths (`../components/...`) from pages
2. **Content loading**: All posts filtered by `!draft` in `getAllPosts()`
3. **Dynamic routes**: `[category]/[slug].astro` handles all three collections
4. **RSS**: Generated at `/rss.xml.js` from all collections
5. **Images**: Passthrough service (no optimization); store in `public/images/`
