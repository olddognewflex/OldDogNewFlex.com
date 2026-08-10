---
name: theming
description: The four-flavour Catppuccin theme system — Tailwind v4 @theme tokens, the data-theme attribute, localStorage persistence, FOUC prevention, and the giscus theme bridge. Load before changing any colour, token, or theme-switching code.
triggers:
  - "theme"
  - "colour"
  - "color"
  - "catppuccin"
  - "dark mode"
  - "tailwind"
  - "css variable"
  - "data-theme"
  - "FOUC"
edges:
  - target: context/stack.md
    condition: when you need the Tailwind v4 / CSS-first configuration facts
  - target: context/decisions.md
    condition: when you need why the JS Tailwind config was deleted or why themes persist client-side
  - target: context/conventions.md
    condition: when writing component markup that consumes these tokens
  - target: patterns/giscus-comments.md
    condition: when the thing that looks wrong is the comment widget's colours
  - target: context/architecture.md
    condition: when you need where BaseLayout and the stylesheets sit in the overall flow
  - target: patterns/add-page-route.md
    condition: when the task is building new UI that must consume these tokens
grounds_to:
  - node: "constant:1dd4bde7c097bea18a3d8d1937033716"
    fingerprint: "mh:64:7b226d696e68617368223a5b3231353831363131302c3134323037373935372c37323036373631342c3335383030373432322c36313937343737392c35373037323531342c3131343031323131322c33343333313735322c35303932373039332c35303332323230372c32383930353533362c3236343736313736362c3338393539383436372c3138363431303630382c3136313530393532322c33343534313332322c3436313634383437362c3137343231393135362c38373032323639322c3630303236383139392c3531343532343330322c3230393534323739312c31303338313436342c3138333935313536312c3334353735363332342c3135303135313137312c39323837383237382c33383531353435302c37303237313637332c363332363430302c37393238323435382c3231363438323430362c32373733383333372c373137383631302c3235303933343839362c39313533353231392c39373530353833372c3638373233363536362c3131333638353436382c3134343833343039302c39303538363132342c3135323236313837342c3736343039313838342c3833363431363731392c3934313933343732392c39333838383936352c3236313735333837362c3538313737353736372c3436363238313233312c37383738303537322c3535303732323137362c3334313434303135382c3133323036363130392c3531353032373336352c38313333393738352c3238313539333332392c3134363837333630382c3239313739393037332c3234313235303433362c3537393933373330382c3639383936343531332c33313832383534362c3234303037393037352c3238383537343138325d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a33377d"
  - node: "function:e4b52ddeda60b29f9fc19bbb5520847c"
    fingerprint: "mh:64:7b226d696e68617368223a5b3231373836303036362c3130353931373734352c3333323834383336312c3133373137323931372c34373830363431312c33303133353032342c3130303137383737392c35303232353939342c3132343734393131312c32333232373733322c31373931303839362c3138323838363835372c36303336323334302c373735353530302c3331303338333730392c323038323932322c3231343535353238372c3135383430353935342c36363939323630362c3138303335343938322c39353435343335342c3136333739353239322c3133373832313233342c363736383239302c3135333330393631332c3135303135313137312c34313937323036332c3439393732353331362c3333333535363632302c3130313933303030352c33363737343630322c3331343438373436392c32393338393836312c3130383633383538372c3236303137313032382c313934333631382c3230333234303239382c34373936323638392c36393830333139372c35303036303435312c3138383234373531312c3237373537373335362c36303030303437352c39343334303633382c39373531363434342c39383639303032362c32333535343436372c36333334393834332c37383937323536352c3135353032363532342c3132383134363431332c35333536323533322c3535383838392c38323434343230362c38363439353230312c33353733343434372c36353435333637382c3339393634333130332c3135393739323234342c3130383433353031322c3130343031363033332c393134333130362c3330353737383239372c39383130393938375d2c226e65696768626f7273223a5b2266756e6374696f6e3a6162353961656433393836636137363661336264323636313066626663613335225d2c22746f6b656e436f756e74223a34307d"
last_updated: 2026-08-10
---

# Theming

## How it works

Four Catppuccin flavours — `latte` (light), `frappe`, `macchiato` (default), `mocha` — all
selected by one attribute: `data-theme` on `<html>`.

```
src/styles/global.css
  @import "tailwindcss"; @plugin "@tailwindcss/typography";
  @theme { --color-*: oklch(...) }      ← base token set, generates the utilities
  :root[data-theme="mocha"]    { --color-*: #hex }   ← per-flavour override
  :root[data-theme="latte"]    { ... }
  :root[data-theme="frappe"]   { ... }
  :root[data-theme="macchiato"]{ ... }
```

Tailwind's `@theme` block is what makes `bg-mantle`, `text-subtext0`, `border-surface1`
exist as utility classes. The `:root[data-theme=...]` blocks then re-point the same
custom properties at different values, so a flavour switch needs no class changes
anywhere — the utilities resolve through the variables.

`src/styles/layout.css` is separate and holds structural rules only (`.prose` reading
column, footer, logo). Both stylesheets are imported once, in `BaseLayout.astro`.

## Runtime switching

Three things cooperate, in this order:

1. **`BaseLayout.astro`** renders `<html data-theme="macchiato">` — the baked-in default.
2. An **`is:inline` blocking script in `<head>`** reads `localStorage.theme`, validates it
   against `['latte','frappe','macchiato','mocha']`, and rewrites the attribute *before
   first paint*. This is the anti-FOUC mechanism. It must stay `is:inline` and must stay
   first in `<head>` — bundling it or moving it below other scripts brings the flash back.
3. **`ThemePills.astro`** renders a `<select class="theme-select">` (a dropdown despite
   the "pills" name) and a bundled `<script>` that writes both `data-theme` and
   `localStorage.theme` on change.

## The giscus bridge

The comment widget is an iframe and cannot read the site's CSS variables, so its theme is
passed as a prop. `THEME_MAP` in `Comments.tsx` maps each site flavour onto the matching
`catppuccin_*` giscus theme, and
[`resolveGiscusTheme()`](mex://function:e4b52ddeda60b29f9fc19bbb5520847c) reads the live
`data-theme` attribute, falling back to `macchiato` twice over — once for a missing
attribute, once for an unmapped value. A `MutationObserver` filtered to `data-theme`
re-runs it whenever the reader switches flavour, so the iframe follows the page.

Adding a flavour therefore means adding a `THEME_MAP` entry too, or comments silently
fall back to `catppuccin_macchiato` on the new theme.

## Gotchas

- **The flavour list is duplicated in six places** and they do not all agree in order:
  `src/utils/themes.ts`, the `<script>` in `ThemePills.astro`, the `<option>` markup in
  `ThemePills.astro`, the inline script in `BaseLayout.astro`, `THEME_MAP` in
  `Comments.tsx`, and the `:root[data-theme=...]` blocks in `global.css`. There is no
  single source of truth. **`src/utils/themes.ts` is imported by nothing** — editing it
  changes no behaviour, which makes it the most tempting and least effective place to
  "fix" the theme list.
- **Syntax highlighting does not follow the theme.** `astro.config.mjs` sets
  `markdown.shikiConfig.theme: "github-light"` — a light theme, baked into the HTML at
  build time, on a site that is dark by default. Code blocks look wrong in three of the
  four flavours and no runtime switch can correct it.
- **Prettier cannot see the tokens.** `.prettierrc` declares
  `"tailwindStylesheet": "src/styles/glolbal.css"` (typo) and a `tailwind.config.js` that
  does not exist, so `prettier-plugin-tailwindcss` sorts classes without knowledge of the
  real palette.
- **`THEME_COLORS` in `src/constants/index.ts` is dead.** It maps semantic names onto
  `var(--color-*)` strings and nothing imports it. Do not add colours there expecting them
  to apply; add them to the `@theme` block instead.
- **`.sr-only` in `global.css` is deliberately non-standard** — the legacy `clip: rect()`
  form, `white-space: nowrap`, and `position: absolute !important` are all intentional for
  screen-reader and old-browser behaviour. Do not "modernise" it to a clip-path-only rule.
