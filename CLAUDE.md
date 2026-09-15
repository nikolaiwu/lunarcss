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
  - `src/index.html`: the showcase

  `base: "./"` keeps asset URLs relative, so the fonts CSS works from any CDN path. A custom `assetFileNames` names the theme output `dist/lunarcss.min.css` in production and `dist/lunarcss.css` in development mode (the fonts CSS follows the same pattern), and writes font files to `dist/fonts/` without hashes. It matches on `lunarcss.css`, because Vite names the asset after the input key, not the source file. `package.json` (`style`, `exports`, `files`), the docs' CDN URLs and the release workflow all depend on the `.min.css` name. A `banner()` plugin in the same file adds `/*! LunarCSS vX.Y.Z … */` after `@charset`, which must stay the first statement.

- **Publishing:** the package is `@nikolaiwu/lunarcss`, because unscoped `lunarcss` is taken on npm. `files` ships only these:
  - `dist/lunarcss.min.css`
  - `dist/lunarcss-fonts.min.css`
  - `dist/fonts/`
  - `src/scss`, except `showcase.scss` and `fonts.scss`, whose package URLs only resolve inside this repo's Vite build

  The built showcase `index.html` is not shipped either. `exports["./scss"]` lets Sass users `@use "pkg:@nikolaiwu/lunarcss/scss"` with the Node package importer (a bare path without `pkg:` does not resolve), so SCSS partials must keep resolving from `main.scss` with relative paths. The jsDelivr and unpkg CDNs serve straight from npm.

- **Versioning:** SemVer, with CHANGELOG.md in Keep a Changelog format. Removing or renaming a `--lunar-*` token or changing which elements a rule targets is a breaking change (minor bump while below 1.0). Add user-facing changes under `[Unreleased]`.
- **`main.scss` sets the cascade order** using `@use` (the modern Sass module system, `api: 'modern-compiler'`): config → themes → reset → base → elements. Every new partial must be added there.
- **Theming uses CSS `light-dark()`, not duplicated variable sets.** All color tokens live in [src/scss/_config.scss](src/scss/_config.scss) on `:root` with `color-scheme: light dark`. `themes/_light.scss` and `themes/_dark.scss` only set `color-scheme` under `[data-theme="light"|"dark"]` to force a mode. To add or change colors, edit `_config.scss`; don't add per-theme overrides.
- **Token naming:** public tokens use the `--lunar-*` prefix (`--lunar-bg`, `--lunar-fg`, `--lunar-accent`, `--lunar-muted`, `--lunar-border`, and the status colors, plus the typography, spacing, radius, and transition scales). Color layers:
  1. `--color-*` primitives hold raw values and are referenced only by `--lunar-light` and `--lunar-dark` in `_config.scss`.
  2. `--lunar-light` and `--lunar-dark` are the main colors, used by `--lunar-bg`, `--lunar-fg`, `--lunar-border` and element styles.
  3. Semantic tokens such as `--lunar-bg` and `--lunar-fg`.

  Element styles should use `var(--lunar-*)` and never `--color-*` or hard-coded values. The docs deliberately don't list default color values; they tell users to override `--lunar-light` and `--lunar-dark`.

- **Fonts:** the theme never downloads fonts. `--lunar-font-sans` and `--lunar-font-mono` in `_config.scss` start with "Space Grotesk" and "Space Mono", then fall back to system stacks.
  - The optional [src/scss/fonts.scss](src/scss/fonts.scss) generates woff2-only `@font-face` rules for each unicode subset, pointing at the Fontsource devDependencies (`@fontsource-variable/space-grotesk`, `@fontsource/space-mono`). Vite resolves and copies those files.
  - The Grotesk family is declared as plain "Space Grotesk", not Fontsource's "Space Grotesk Variable", so it matches the token stack.
  - The `fontLicenses()` Vite plugin copies the OFL license texts into `dist/fonts/`, as the license requires.
  - No Google Fonts or other remote font URLs, anywhere.
  - The release workflow attaches a zip of both stylesheets plus `fonts/`.
- **Cards:** `article` is the classless card component ([elements/_article.scss](src/scss/elements/_article.scss)), with optional `header` (irregular dashed rule below it) and `footer` (45° striped band above it). The look comes from the `card` mixin (shared with `dialog`), with local `--_card-*` properties at its top. A parent whose direct children are all articles (two or more) becomes a responsive grid, selected with `:has()`. That's the only intentional layout rule; don't add other layout styles.
- **Mixins:** [src/scss/mixins/](src/scss/mixins/) holds one file per mixin. `_index.scss` `@forward`s them all, so modules import them with `@use "../mixins"` and call `mixins.<name>` (`_article.scss` and `_interactive.scss` do). The folder isn't in `main.scss` and emits no CSS on its own. Add new mixin files to `_index.scss`; a mixin that uses another one `@use`s that sibling file directly (as `_card.scss` does with `cut-corner`).
  - `cut-corner-border($corners, $size, $border-width, $border-color, $background)` draws a bordered box with 45° cut corners. `clip-path` can't draw a border along the diagonal, so `::before` is the border shape and `::after` is the fill, inset by the border width (the inner cut is `size − width × 0.5858`). It takes over the host's `::before` and `::after`, and sets `position: relative`, `isolation: isolate`, `border: 0` and a transparent background. A host box-shadow would show as a rectangle past the cuts.
  - `card` is the full card look (padding, cut-corner border, `> header` dashes, `> footer` stripes). `article` and `dialog` both include it. A host that needs its own `position` or other overrides should put them in a `& { … }` block after the `@include`, so they come after the mixin's output (see `dialog`).
  - Runtime overrides for users: `--lunar-cut-size`, `--lunar-cut-border-width`, `--lunar-cut-border-color` and `--lunar-cut-bg`.
- **Showcase vs. production:** `src/index.html` links `main.scss` and `showcase.scss` directly. It may use classes; the production theme may not. `showcase.scss` is currently entirely commented out.

## Conventions

- Production SCSS (everything reachable from `main.scss`) uses **element selectors only, no classes**. Attribute selectors and pseudo-classes are fine.
- Each SCSS file starts with the `// ===` banner comment block and groups rules under `// ---` section headers. Match this style.
- When tokens in `_config.scss` change, update the variable reference in [USER-GUIDE.md](USER-GUIDE.md) and the customization example in the README to match.
