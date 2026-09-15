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

- **Vite root is `src/`** ([vite.config.js](vite.config.js)). There are two Rollup inputs: `src/scss/main.scss` (the distributed theme) and `src/index.html` (the showcase). A custom `assetFileNames` names the theme output `dist/lunarcss.min.css` in production and `dist/lunarcss.css` in development mode. It matches on `lunarcss.css`, because Vite names the asset after the input key, not the source file. `package.json` (`style`, `exports`, `files`), the docs' CDN URLs and the release workflow all depend on the `.min.css` name. A `banner()` plugin in the same file adds `/*! LunarCSS vX.Y.Z … */` after `@charset`, which must stay the first statement.
- **Publishing:** the package is `@nikolaiwu/lunarcss`, because unscoped `lunarcss` is taken on npm. `files` ships only `dist/lunarcss.min.css` and `src/scss` (not `showcase.scss`, and not the built showcase `index.html`). `exports["./scss"]` lets Sass users `@use "pkg:@nikolaiwu/lunarcss/scss"` with the Node package importer (a bare path without `pkg:` does not resolve), so SCSS partials must keep resolving from `main.scss` with relative paths. The jsDelivr and unpkg CDNs serve straight from npm.
- **Versioning:** SemVer, with CHANGELOG.md in Keep a Changelog format. Removing or renaming a `--lunar-*` token or changing which elements a rule targets is a breaking change (minor bump while below 1.0). Add user-facing changes under `[Unreleased]`.
- **`main.scss` sets the cascade order** using `@use` (the modern Sass module system, `api: 'modern-compiler'`): config → themes → reset → base → elements. Every new partial must be added there.
- **Theming uses CSS `light-dark()`, not duplicated variable sets.** All color tokens live in [src/scss/_config.scss](src/scss/_config.scss) on `:root` with `color-scheme: light dark`. `themes/_light.scss` and `themes/_dark.scss` only set `color-scheme` under `[data-theme="light"|"dark"]` to force a mode. To add or change colors, edit `_config.scss`; don't add per-theme overrides.
- **Token naming:** public tokens use the `--lunar-*` prefix (`--lunar-bg`, `--lunar-fg`, `--lunar-accent`, `--lunar-muted`, `--lunar-border`, and the status colors, plus the typography, spacing, radius, and transition scales). Color layers:
  1. `--color-*` primitives hold raw values and are referenced only by `--lunar-light` and `--lunar-dark` in `_config.scss`.
  2. `--lunar-light` and `--lunar-dark` are the main colors, used by `--lunar-bg`, `--lunar-fg`, `--lunar-border` and element styles.
  3. Semantic tokens such as `--lunar-bg` and `--lunar-fg`.

  Element styles should use `var(--lunar-*)` and never `--color-*` or hard-coded values. The docs deliberately don't list default color values; they tell users to override `--lunar-light` and `--lunar-dark`.

- **Mixins:** [src/scss/mixins.scss](src/scss/mixins.scss) is not a partial and is not in `main.scss`. Modules that need it import it themselves with `@use "../mixins"` (for example, `elements/_interactive.scss` uses `cyberbox`).
- **Showcase vs. production:** `src/index.html` links `main.scss` and `showcase.scss` directly. It may use classes; the production theme may not. `showcase.scss` is currently entirely commented out.

## Conventions

- Production SCSS (everything reachable from `main.scss`) uses **element selectors only, no classes**. Attribute selectors and pseudo-classes are fine.
- Each SCSS file starts with the `// ===` banner comment block and groups rules under `// ---` section headers. Match this style.
- When tokens in `_config.scss` change, update the variable reference in [USER-GUIDE.md](USER-GUIDE.md) and the customization example in the README to match.
