# Changelog

All notable changes to LunarCSS are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

For a CSS theme, a **breaking change** (major version) is anything that can change how an existing page looks or that breaks a user's overrides:

- removing or renaming a `--lunar-*` token
- changing which elements a rule targets, or significantly changing default styles
- raising the minimum browser versions

New tokens, new element styles and bug fixes are minor or patch releases. Before 1.0.0, breaking changes bump the minor version.

## [Unreleased]

Initial release, to be published as 0.1.0.

### Added

- Classless styles for headings, text, inline elements, lists, tables, forms, media and interactive elements
- Cards: every `<article>` is a cut-corner bordered box with optional `<header>` (dashed rule) / `<footer>` (striped band), and a parent containing only articles lays them out as a responsive grid (`--lunar-card-min-width`). `<dialog>` shares the same card look
- Light and dark themes via `light-dark()`, with `data-theme` to force either mode
- `--lunar-light` / `--lunar-dark` main color tokens, plus semantic, typography, spacing, radius, shadow, transition, z-index and content-width tokens
- Published to npm as `@nikolaiwu/lunarcss`, with the compiled CSS and SCSS source

[Unreleased]: https://github.com/nikolaiwu/lunarcss/commits/main
