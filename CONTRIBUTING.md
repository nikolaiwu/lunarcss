# Contributing to LunarCSS

Bug reports, fixes and new element styles are welcome. For anything bigger, such as a new component or a change to how the theme is built, open an issue first so we can agree on the approach.

## Principles

1. **Element selectors only.** The production CSS (everything `main.scss` loads) uses no classes, only HTML element selectors.
2. **Tokens, not values.** Element styles use `var(--lunar-*)` tokens, never raw values or `--color-*` primitives, so every design decision can be overridden.
3. **Style, don't place.** The theme styles elements but never positions them. Page structure belongs in the optional layout stylesheet.
4. **Easy to override.** Everything lives in the `lunarcss` cascade layer, so users' CSS and utility frameworks always win. Never rely on specificity or `!important` to beat them.
5. **Progressive enhancement.** Base styles work in every supported browser; newer features are layered on where they're supported.
6. **Minimal reset.** Just enough to normalize, not opinionated overrides.

The [docs/](docs/) folder explains how the pieces fit: cascade layers, tokens, mixins, components, the build and the demo pages.

## Setup

You need Node.js 18+ and pnpm. The pnpm version is pinned in `package.json` (`packageManager`); run `corepack enable` to use it.

```bash
git clone https://github.com/nikolaiwu/lunarcss.git
cd lunarcss
pnpm install
pnpm dev
```

`pnpm dev` opens the showcase (every element, with its source) and the demo page, a classless landing page.

## Commands

| Command             | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| `pnpm dev`          | Start the development server with hot reload                   |
| `pnpm build`        | Build the minified stylesheets and both pages to `dist/`       |
| `pnpm preview`      | Preview the production build                                   |
| `pnpm format`       | Format all files with Prettier                                 |
| `pnpm format:check` | Check formatting without writing changes (the release runs it) |

## Making a change

- Restyling an element moves it into its own `src/scss/elements/_<element>.scss`, loaded from `main.scss` where its rules used to be. Add it to the project structure below. See [docs/conventions.md](docs/conventions.md).
- Keep the docs in step: [docs/](docs/) for how things work, [USER-GUIDE.md](USER-GUIDE.md) when tokens or usage change.
- Check both pages in light and dark mode, in Chrome, Firefox and Safari.
- Run `pnpm format`, and add a line under `[Unreleased]` in [CHANGELOG.md](CHANGELOG.md).

## Pull requests

1. Fork the repository and create a branch (`git checkout -b fix-table-caption`).
2. Commit your changes, with a message that says what changed and why.
3. Push the branch and open a pull request against `main`.

## Project structure

```
lunarcss/
├── src/
│   ├── scss/
│   │   ├── main.scss             # Theme entry → lunarcss.min.css
│   │   ├── fonts.scss            # Optional fonts entry → lunarcss-fonts.min.css
│   │   ├── layout.scss           # Optional layout entry → lunarcss-layout.min.css
│   │   ├── showcase.scss         # Showcase-only styles (+ showcase/)
│   │   ├── _config.scss          # Design tokens (all colors via light-dark())
│   │   ├── _reset.scss           # CSS reset
│   │   ├── themes/               # [data-theme] → color-scheme
│   │   ├── base/
│   │   │   ├── _root.scss        # :root, html, body, selection, focus
│   │   │   ├── _print.scss       # Print: light scheme, wrapping, page breaks
│   │   │   └── _forced-colors.scss # Windows contrast themes
│   │   ├── mixins/               # _index.scss forwards them all
│   │   │   ├── _cut-corner.scss  # cut corners: border, polygon, edges
│   │   │   ├── _card.scss        # card look (article, dialog)
│   │   │   ├── _brackets.scss    # corner brackets
│   │   │   ├── _field.scss       # field brackets and tick ruler
│   │   │   ├── _ruler.scss       # tick ruler
│   │   │   ├── _striped.scss     # diagonal stripes
│   │   │   ├── _striped-label.scss # text set into a striped rule
│   │   │   └── _dotted.scss      # dot grid
│   │   └── elements/             # one partial per element (or tight pair)
│   │       ├── _section.scss, _p.scss, _address.scss, _headings.scss, _hr.scss
│   │       ├── _blockquote.scss, _pre.scss, _a.scss, _inline.scss
│   │       ├── _mark.scss, _code.scss, _kbd.scss, _samp.scss, _var.scss
│   │       ├── _lists.scss, _tables.scss, _fieldset.scss, _forms.scss
│   │       ├── _checkboxes.scss, _radios.scss, _range.scss
│   │       ├── _progress.scss, _meter.scss, _color.scss, _buttons.scss
│   │       ├── _media.scss, _details.scss, _dialog.scss, _popover.scss
│   │       └── _article.scss
│   ├── index.html                # Showcase: every element, with its source
│   ├── demo.html                 # Acme Robotics: a classless landing page
│   ├── theme-toggle.js           # Shared light/dark toggle for both pages
│   └── copy.js                   # Copy buttons for the showcase's CDN links
├── types/stylesheet.d.ts         # Lets TypeScript resolve the CSS imports
├── public/                       # Copied as is: favicon, social image, robots.txt
├── design/                       # Social image source and its generator
├── docs/                         # How the theme is built
├── vite/demo-source.js           # Build-time source previews for the showcase
├── .github/workflows/
│   ├── release.yml               # Publish to npm + GitHub release on tags
│   └── pages.yml                 # Deploy the showcase to GitHub Pages on tags
├── vite.config.js
├── CHANGELOG.md
├── CONTRIBUTING.md
├── README.md
└── USER-GUIDE.md
```

## Releasing

For maintainers. Versions follow [Semantic Versioning](https://semver.org/); [CHANGELOG.md](CHANGELOG.md) says what counts as a breaking change.

1. Move the `[Unreleased]` notes in `CHANGELOG.md` under a new version heading. The README's size badge is static, so check it against `pnpm build && gzip -9c dist/lunarcss.min.css | wc -c` and update it if the rounded kB figure changed. Commit.
2. Bump the version: `pnpm release:patch`, `pnpm release:minor` or `pnpm release:major`. This updates `package.json`, commits and creates a `vX.Y.Z` tag. The working tree must be clean.
3. Push the commit and tag: `git push --follow-tags`.

Pushing the tag runs the [release workflow](.github/workflows/release.yml), which publishes to npm (and so to the CDNs) and creates a GitHub release with `lunarcss.min.css` attached, and the [Pages workflow](.github/workflows/pages.yml), which deploys the showcase and demo to https://nikolaiwu.github.io/lunarcss/.
