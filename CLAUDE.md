# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

LunarCSS is a classless CSS theme: SCSS compiled by Vite into a single stylesheet that styles plain HTML elements. There is no JS library code, and there are no tests or linters; formatting is handled by Prettier.

## Commands

The repo uses pnpm, pinned via `packageManager` in `package.json`. `pnpm-workspace.yaml` holds `allowBuilds`, the allowlist of dependencies whose install scripts may run (esbuild and @parcel/watcher). Add a dependency there if it needs an install script.

- `pnpm dev`: Vite dev server on port 3000, serving the showcase page `src/index.html` with hot reload
- `pnpm build`: production build of the minified theme CSS and the showcase to `dist/`
- `pnpm build --mode development`: unminified build with sourcemaps
- `pnpm preview`: serve `dist/` on port 4173
- `pnpm format` / `pnpm format:check`: run Prettier over the repo with default settings (`.prettierrc` is `{}`). `dist/` and `pnpm-lock.yaml` are ignored. Run `pnpm format` after editing.
- `pnpm release:patch|minor|major`: runs `npm version`, which bumps `package.json`, commits and tags `vX.Y.Z`. It needs a clean tree. Pushing the tag runs `.github/workflows/release.yml`, which checks the tag matches `package.json`, publishes to npm through trusted publishing (no token) and creates a GitHub release. Don't push tags or publish without being asked.
- `npm pack --dry-run --ignore-scripts`: list exactly what would be published.

## Architecture

- **Vite root is `src/`** ([vite.config.js](vite.config.js)). There are three Rollup inputs:
  - `src/scss/main.scss`: the distributed theme
  - `src/scss/fonts.scss`: the optional fonts stylesheet
  - `src/scss/layout.scss`: the optional layout stylesheet
  - `src/index.html`: the showcase (element reference, with source previews)
  - `src/demo.html`: the Acme Robotics demo page

  `base: "./"` keeps asset URLs relative, so the fonts CSS works from any CDN path. A custom `assetFileNames` names the theme output `dist/lunarcss.min.css` in production and `dist/lunarcss.css` in development mode (the fonts CSS follows the same pattern), and writes font files to `dist/fonts/` without hashes. It matches on `lunarcss.css`, because Vite names the asset after the input key, not the source file. `package.json` (`style`, `exports`, `files`), the docs' CDN URLs and the release workflow all depend on the `.min.css` name. A `banner()` plugin in the same file adds `/*! LunarCSS vX.Y.Z … */` after `@charset`, which must stay the first statement.

- **Publishing:** the package is `@nikolaiwu/lunarcss`, because unscoped `lunarcss` is taken on npm. `files` ships only these:
  - `dist/lunarcss.min.css`
  - `dist/lunarcss-fonts.min.css`
  - `dist/fonts/`
  - `src/scss`, except `showcase.scss` and `fonts.scss`, whose package URLs only resolve inside this repo's Vite build

  The built showcase `index.html` is not shipped either. `exports["./scss"]` lets Sass users `@use "pkg:@nikolaiwu/lunarcss/scss"` with the Node package importer (a bare path without `pkg:` does not resolve), so SCSS partials must keep resolving from `main.scss` with relative paths. The jsDelivr and unpkg CDNs serve straight from npm.

- **Versioning:** SemVer, with CHANGELOG.md in Keep a Changelog format. Removing or renaming a `--lunar-*` token or changing which elements a rule targets is a breaking change (minor bump while below 1.0). Add user-facing changes under `[Unreleased]`.
- **`main.scss` sets the cascade order and wraps everything in `@layer lunarcss { … }`**, so unlayered user CSS and later layers (e.g. Tailwind v4 utilities) always override the theme, regardless of specificity.
  - `@use` can't go inside `@layer`, so partials are loaded with `@include meta.load-css("…")`, in the order config → themes → reset → base → elements. Every new partial must be added there.
  - Don't emit theme CSS outside the layer, and don't rely on specificity or `!important` to beat user styles.
  - `fonts.scss` (only `@font-face`) and `showcase.scss` are not layered.
- **Theming uses CSS `light-dark()`, not duplicated variable sets.** All color tokens live in [src/scss/_config.scss](src/scss/_config.scss) on `:root` with `color-scheme: light dark`. `themes/_light.scss` and `themes/_dark.scss` only set `color-scheme` under `[data-theme="light"|"dark"]` to force a mode. To add or change colors, edit `_config.scss`; don't add per-theme overrides.
- **Token naming:** public tokens use the `--lunar-*` prefix (`--lunar-bg`, `--lunar-fg`, `--lunar-accent`, `--lunar-muted`, `--lunar-border`, and the status colors, plus the typography, spacing and transition scales). Color layers:
  1. `--color-*` primitives hold raw values and are referenced only by `--lunar-light` and `--lunar-dark` in `_config.scss`.
  2. `--lunar-light` and `--lunar-dark` are the main colors, used by `--lunar-bg`, `--lunar-fg`, `--lunar-border`, `--lunar-muted` and element styles. Derived colors are computed at runtime with CSS `color-mix(in oklch, …)`, not Sass, so user overrides of the main colors carry through. `--lunar-muted` mixes the background toward the text color by `--lunar-muted-mix` (default 60%).
  3. Semantic tokens such as `--lunar-bg` and `--lunar-fg`.

  Element styles should use `var(--lunar-*)` and never `--color-*` or hard-coded values. The docs deliberately don't list default color values; they tell users to override `--lunar-light` and `--lunar-dark`.

- **Fonts:** the theme never downloads fonts. `--lunar-font-sans` and `--lunar-font-mono` in `_config.scss` start with "Space Grotesk" and "Space Mono", then fall back to system stacks.
  - The optional [src/scss/fonts.scss](src/scss/fonts.scss) generates woff2-only `@font-face` rules for each unicode subset, pointing at the Fontsource devDependencies (`@fontsource-variable/space-grotesk`, `@fontsource/space-mono`). Vite resolves and copies those files.
  - The Grotesk family is declared as plain "Space Grotesk", not Fontsource's "Space Grotesk Variable", so it matches the token stack.
  - The `fontLicenses()` Vite plugin copies the OFL license texts into `dist/fonts/`, as the license requires.
  - No Google Fonts or other remote font URLs, anywhere.
  - The release workflow attaches a zip of both stylesheets plus `fonts/`.
- **Layout:** the theme itself has **no layout rules** — it styles elements, never places them. Page structure lives in the optional [src/scss/layout.scss](src/scss/layout.scss) (built to `dist/lunarcss-layout.min.css`, `@layer lunarcss-layout`, declared after the theme's layer so it wins, while unlayered user CSS still beats both). It must be loaded after the theme, and holds only structure (widths, spacing, flex/grid, alignment) selected structurally: `body` shell, `body > header` with a nav, `nav ul`, `main` + `aside` sidebar, `body > footer`, and the card grid. Its tokens (`--lunar-page-width`, `--lunar-sidebar-width`, `--lunar-layout-gap`, `--lunar-card-min-width`) are defined there, not in `_config.scss`. Both demo pages link it.
- **Buttons:** [elements/_buttons.scss](src/scss/elements/_buttons.scss) holds `button` and the input button types, cut at top-right and bottom-left via `cut-corner-border`, plus the grouping rules. Adjacent form controls drop the cuts where they touch (`:is(button, input, select, textarea)` adjacency, with `button` always the subject, since void elements have no pseudo-elements). The fill is the mixin's `::after`, so states set `--lunar-cut-bg` rather than `background-color`, and the host background must stay transparent. Spacing between grouped controls comes from the layout stylesheet.
- **Cards:** `article` is the classless card component ([elements/_article.scss](src/scss/elements/_article.scss)), with optional `header` (irregular dashed rule below it) and `footer` (45° striped band above it). The look comes from the `card` mixin (shared with `dialog`), with local `--_card-*` properties at its top. The card grid (a parent whose direct children are all articles) lives in the layout stylesheet, not here.
- **Mixins:** [src/scss/mixins/](src/scss/mixins/) holds one file per mixin. `_index.scss` `@forward`s them all, so modules import them with `@use "../mixins"` and call `mixins.<name>` (`_article.scss`, `_buttons.scss`, `_text.scss` and `_interactive.scss` do). The folder isn't in `main.scss` and emits no CSS on its own. Add new mixin files to `_index.scss`; a mixin that uses another one `@use`s that sibling file directly (as `_card.scss` does with `cut-corner`).
  - `cut-corner-border($corners, $size, $border-width, $border-color, $background)` draws a bordered box with 45° cut corners. `clip-path` can't draw a border along the diagonal, so `::before` is the border shape and `::after` is the fill, inset by the border width (the inner cut is `size − width × 0.5858`). It takes over the host's `::before` and `::after`, and sets `position: relative`, `isolation: isolate`, `border: 0` and a transparent background. A host box-shadow would show as a rectangle past the cuts.
  - `dotted($size, $gap, $color)` paints a repeating dot grid (one `radial-gradient` tile); `hr` uses it as a 20px band. Overrides: `--lunar-dot-size`, `--lunar-dot-gap`, `--lunar-dot-color`.
  - `striped($width, $gap, $angle, $color)` paints repeating diagonal stripes; the card footer band uses it. Overrides: `--lunar-stripe-width`, `--lunar-stripe-gap`, `--lunar-stripe-angle`, `--lunar-stripe-color`. Both set only `background-image`, so the host keeps its own background color.
  - `card` is the full card look (padding, cut-corner border, `> header` dashes, `> footer` stripes). `article` and `dialog` both include it. A host that needs its own `position` or other overrides should put them in a `& { … }` block after the `@include`, so they come after the mixin's output (see `dialog`).
  - Runtime overrides for users: `--lunar-cut-size`, `--lunar-cut-border-width`, `--lunar-cut-border-color` and `--lunar-cut-bg`.
- **Demo page:** [src/demo.html](src/demo.html) is a fictional company (Acme Robotics, made-up data) showing the theme on a realistic landing page. It must stay **completely classless** — no `class` attributes, no inline styles, no showcase CSS — so it only links `fonts.scss` and `main.scss`. Anything it can't express means the theme is missing something; fix the theme, don't add page CSS. Both pages share [src/theme-toggle.js](src/theme-toggle.js) (buttons opt in with `data-theme-toggle`), plus a tiny inline head script that applies the saved theme before first paint.
- **Showcase vs. production:** `src/index.html` links `fonts.scss`, `main.scss` and `showcase.scss` directly. It may use classes; the production theme may not. Every `.demo-box` gets a highlighted source preview beside it, generated at build time by [vite/demo-source.js](vite/demo-source.js): it takes the element's own inner HTML, formats it with Prettier, highlights it with Shiki (`defaultColor: "light-dark()"`, background stripped so the theme styles the `<pre>`), and wraps both in `.demo`. Adding `demo-wide` to a `.demo-box` carries over to the wrapper and makes that demo full width with the source below, for demos that need the room (the card grid). So never hand-write demo code blocks; edit the demo markup and the preview follows. The showcase ships no highlighting JS or CSS. `showcase.scss` is **layout only**: width, spacing, flex/grid and alignment for the demo page. No colors, borders, typography or other visual styles, so the showcase shows the theme as-is. It doesn't `@use "main"`, because the theme is linked separately.

## Conventions

- Production SCSS (everything reachable from `main.scss`) uses **element selectors only, no classes**. Attribute selectors and pseudo-classes are fine.
- Each SCSS file starts with the `// ===` banner comment block and groups rules under `// ---` section headers. Match this style.
- When tokens in `_config.scss` change, update the variable reference in [USER-GUIDE.md](USER-GUIDE.md) and the customization example in the README to match.
