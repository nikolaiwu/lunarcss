# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Details live in `docs/`. Each section below says what its file covers — read it when the task touches that area.

## Project

LunarCSS is a classless CSS theme: SCSS compiled by Vite into a single stylesheet that styles plain HTML elements. There is no JS library code, and there are no tests or linters; formatting is handled by Prettier.

These hold everywhere, so they're worth stating up front:

- Production SCSS (everything reachable from `main.scss`) uses **element selectors only, no classes**.
- All theme CSS is emitted inside `@layer lunarcss`, so user CSS always wins. Never rely on specificity or `!important` to beat it.
- The theme styles elements but **never places them**; page structure belongs in the optional layout stylesheet.
- Element styles use `var(--lunar-*)` tokens, never raw values or `--color-*` primitives.
- Run `pnpm format` after editing.

## Commands

Reference `docs/commands.md`: pnpm scripts (dev, build, preview, format, release), and the pnpm/`allowBuilds` setup.

## Build

Reference `docs/build.md`: Vite root and the five Rollup inputs, output naming, relative `base`, and the `banner()` / `fontLicenses()` plugins.

## Publishing and versioning

Reference `docs/publishing.md`: package name, what `files` ships, the Sass `exports`, CDNs, and what counts as a breaking change.

## Cascade layers

Reference `docs/cascade-layers.md`: how `main.scss` wraps the theme in `@layer lunarcss` with `meta.load-css`, the partial order, and which stylesheets stay unlayered.

## Tokens and theming

Reference `docs/tokens.md`: `light-dark()` theming, the `--color-*` → `--lunar-light`/`--lunar-dark` → semantic token layers, and runtime `color-mix()` derivation.

## Fonts

Reference `docs/fonts.md`: the optional self-hosted Space Grotesk / Space Mono stylesheet, generated from the Fontsource packages, and the no-remote-fonts rule.

## Layout

Reference `docs/layout.md`: the optional layout stylesheet — page shell, sidebar, card grid, control groups, and its own tokens.

## Components

Reference `docs/components.md`: cards (`article` + `dialog`), buttons and their group cuts, and the checkbox switch / radio circle.

## Mixins

Reference `docs/mixins.md`: `cut-corner-border`, `card`, `dotted`, `striped`, how they're forwarded, and their runtime overrides.

## Demo pages

Reference `docs/demo-pages.md`: the classless Acme demo, the showcase and its build-time source previews, and `showcase.scss`.

## Conventions

Reference `docs/conventions.md`: SCSS file structure, the classless rule, and keeping the docs in sync with tokens.
