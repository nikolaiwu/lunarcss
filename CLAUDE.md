# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

LunarCSS is a classless CSS theme: SCSS compiled by Vite into a single stylesheet that styles plain HTML elements. There is no JS library code, and there are no tests or linters.

## Commands

The repo uses pnpm, pinned via `packageManager` in `package.json`. `pnpm-workspace.yaml` holds `allowBuilds`, the allowlist of dependencies whose install scripts may run (esbuild and @parcel/watcher). Add a dependency there if it needs an install script.

- `pnpm dev`: Vite dev server on port 3000, serving the showcase page `src/index.html` with hot reload
- `pnpm build`: production build of the minified theme CSS and the showcase to `dist/`
- `pnpm build --mode development`: unminified build with sourcemaps
- `pnpm preview`: serve `dist/` on port 4173

## Architecture

- **Vite root is `src/`** ([vite.config.js](vite.config.js)). There are two Rollup inputs: `src/scss/main.scss` (the distributed theme) and `src/index.html` (the showcase). A custom `assetFileNames` names the theme output `dist/lunarcss.min.css` in production and `dist/lunarcss.css` in development mode. It matches on `lunarcss.css`, because Vite names the asset after the input key, not the source file. `package.json` `main` and the docs depend on the `.min.css` name.
- **`main.scss` sets the cascade order** using `@use` (the modern Sass module system, `api: 'modern-compiler'`): config → themes → reset → base → elements. Every new partial must be added there.
- **Theming uses CSS `light-dark()`, not duplicated variable sets.** All color tokens live in [src/scss/_config.scss](src/scss/_config.scss) on `:root` with `color-scheme: light dark`. `themes/_light.scss` and `themes/_dark.scss` only set `color-scheme` under `[data-theme="light"|"dark"]` to force a mode. To add or change colors, edit `_config.scss`; don't add per-theme overrides.
- **Token naming:** public tokens use the `--lunar-*` prefix (`--lunar-bg`, `--lunar-fg`, `--lunar-accent`, `--lunar-muted`, `--lunar-border`, and the status colors, plus the typography, spacing, radius, and transition scales). Raw palette values use `--color-*`. Element styles should use `var(--lunar-*)`, not hard-coded values.
- **Mixins:** [src/scss/mixins.scss](src/scss/mixins.scss) is not a partial and is not in `main.scss`. Modules that need it import it themselves with `@use "../mixins"` (for example, `elements/_interactive.scss` uses `cyberbox`).
- **Showcase vs. production:** `src/index.html` links `main.scss` and `showcase.scss` directly. It may use classes; the production theme may not. `showcase.scss` is currently entirely commented out.

## Conventions

- Production SCSS (everything reachable from `main.scss`) uses **element selectors only, no classes**. Attribute selectors and pseudo-classes are fine.
- Each SCSS file starts with the `// ===` banner comment block and groups rules under `// ---` section headers. Match this style.
- When tokens in `_config.scss` change, update the variable reference in [USER-GUIDE.md](USER-GUIDE.md) and the customization example in the README to match.
