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
- Buttons: a `<button>` is cut at the top-right and bottom-left. Put controls next to each other and they group up — only the first keeps its bottom-left cut and only the last its top-right one, so the row reads as one shape. Input buttons stay rectangular, since a void element has no pseudo-elements to draw the cut
- Checkboxes are vertical switches (knob slides from bottom to top, filling with the accent) and radios are circles that fill with an animated conic sweep; both are as tall as the other controls via `--lunar-control-height`
- Cards: every `<article>` is a cut-corner bordered box with optional `<header>` (dashed rule) / `<footer>` (striped band), and a parent containing only articles lays them out as a responsive grid (`--lunar-card-min-width`). `<dialog>` shares the same card look
- Optional layout stylesheet `lunarcss-layout.min.css`: classless page structure (centred page, header with nav, horizontal nav lists, `main` + `aside` sidebar, footer row), button/input groups (`--lunar-button-gap`) and the card grid, which moved here from the theme, in its own `lunarcss-layout` cascade layer
- Optional self-hosted fonts: `lunarcss-fonts.min.css` (Space Grotesk and Space Mono, SIL OFL 1.1, woff2 subsets, no Google requests). `--lunar-font-sans` / `--lunar-font-mono` list them first and fall back to system fonts
- All theme styles live in the `lunarcss` cascade layer, so your own CSS and layered frameworks (e.g. Tailwind v4 utilities) override the theme regardless of specificity or load order
- Light and dark themes via `light-dark()`, with `data-theme` to force either mode
- `--lunar-light` / `--lunar-dark` main color tokens, plus semantic, typography, spacing, radius, shadow, transition, z-index and content-width tokens
- Published to npm as `@nikolaiwu/lunarcss`, with the compiled CSS and SCSS source

[Unreleased]: https://github.com/nikolaiwu/lunarcss/commits/main
