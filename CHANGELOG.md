# Changelog

All notable changes to LunarCSS are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

For a CSS theme, a **breaking change** (major version) is anything that can change how an existing page looks or that breaks a user's overrides:

- removing or renaming a `--lunar-*` token
- changing which elements a rule targets, or significantly changing default styles
- raising the minimum browser versions

New tokens, new element styles and bug fixes are minor or patch releases. Before 1.0.0, breaking changes bump the minor version.

## [Unreleased]

### Added

- A link with `aria-current` (such as `aria-current="page"` on the current page's link in a nav) shows its hover state, the accent sweep, all the time. It also keeps the sweep in forced colors

### Changed

- Links in headings drop the chip (no tint or padding) and keep the accent underline and the hover/focus sweep. The tint covered the underline of each line above when a linked heading wrapped, so wrapped titles, such as post titles in a card grid, showed the underline only under their last line ([#5](https://github.com/nikolaiwu/lunarcss/issues/5))

### Fixed

- In forced colors (Windows contrast themes), a hovered or focused link inside a paragraph, card header or other decorated element kept its text color on the `Highlight` sweep, which made it unreadable in light contrast themes. The text now switches to `HighlightText`

## [0.1.1] - 2026-09-29

### Fixed

- TypeScript no longer flags `import "@nikolaiwu/lunarcss"` (or `/fonts`, `/layout`) with "Cannot find module or type declarations for side-effect import" (TS2882, under `noUncheckedSideEffectImports`, as in new Next.js projects): the CSS exports now point TypeScript at an empty declaration file

## [0.1.0] - 2026-09-29

Initial release.

### Added

**Foundations**

- Classless styles for every standard HTML element, using element selectors only
- All theme styles live in the `lunarcss` cascade layer, so your own CSS and layered frameworks (e.g. Tailwind v4 utilities) override the theme regardless of specificity or load order
- Light and dark themes via `light-dark()`, following the system setting; `data-theme` forces either mode on the page or any element
- Tokens: `--lunar-light` / `--lunar-dark` main colors, semantic colors (`--lunar-muted` mixed from the main colors by `--lunar-muted-mix`), typography, spacing, radius, transition, z-index, control-size and content-width scales
- The theme styles elements but never places them: it doesn't pad the `body` or hide overflow, so wide content scrolls instead of being clipped
- Text selection reverses the page colors

**Text**

- Headings: `h1` to `h3` carry a mark of one, two and three slanted bars
- Paragraphs hang a full-height bracket in the margin, so the text stays aligned; an `address` is mono and bracketed on both sides, with a tick on the left bracket for every line
- Blockquotes: a striped band down the left edge and a tinted panel with bracketed right corners; the source is set in mono
- `pre`: cut corners, corner brackets and a muted edge that turns accent when a scrolling block has focus; inline `code` and `kbd` are cut-corner chips; `mark` has a cut corner
- Links are chips (a tint with an accent underline and a cut corner) that fill with the accent from the left on hover and focus, on every line of a link that wraps; links that open a new tab get an arrow, announced to screen readers
- `hr` is a dotted band

**Lists and tables**

- `ul` bullets are ticks that grow with each nesting level; `ol` numbers are zero-padded mono (`01 /`), then letters, then roman numerals (`@counter-style` `lunar-decimal`, `lunar-alpha`, `lunar-roman`)
- `dl` reads as a spec sheet: terms in a mono column with a dotted leader, definitions beside them
- Tables read as a data sheet: a heavy top rule, mono header cells with a tick ruler marking each column, mono row headers, tabular figures and a striped footer band. They stay `display: table` and fill the width; a wide table scrolls inside a wrapper that holds only the table, or inside a `<figure>`

**Forms**

- Text fields, textareas and selects get corner brackets that grow on focus while the border turns accent, and a tick ruler slides in under them; values are mono, with an accent caret. An input backed by a `<datalist>` shows the select's chevron
- Fields flag themselves once they've been filled in and left: `:user-invalid` turns the border the error color (and keeps it there while the value is being fixed), `:user-valid` the success color
- Buttons (`<button>` and input buttons) have mono, bold, uppercase labels and cut top-right and bottom-left corners; focus shows as a heavier edge inside the shape. Controls placed next to each other group up: the joins lose their cuts and rounded corners, so the row reads as one shape
- Checkboxes are vertical switches (the knob slides up and fills with the accent) and radios are circles that fill with an animated sweep
- Range, progress and meter are a bar over a tick ruler; progress and meter fill with stripes, and the meter's color shows how its value sits against `low` / `high` / `optimum`
- Color inputs show the value as a droplet in a bordered chip; a disabled one turns muted
- Fieldsets are open-topped boxes whose legend is set into a striped rule
- The file input's button, number spinners, the date and time picker buttons and the focused part of a date value follow the theme; a focused file input's dashed border turns solid accent; selected list-box entries use the accent
- Every control shares `--lunar-control-height`, so fields, buttons, checkboxes and bars line up in a row; `output` sits centred on the surrounding text

**Components**

- Cards: every `<article>` is a cut-corner bordered box with an optional `<header>` (dashed rule) and `<footer>` (striped band); `--lunar-cut-*` tokens adjust the cut, border and fill. `<dialog>` shares the card look, over a `--lunar-backdrop` dim
- Popovers take the cut-corner border on their top-right corner and sit under the button that opened them, flipping above when there's no room
- `details` / `summary`: bordered, joined into one list when adjacent, with a plus that turns into a minus and brackets that grow on hover and focus; opening and closing fade the content and, where supported, animate the height
- `figure` is bordered, with its `figcaption` centred in a striped rule; media are responsive by default

**Optional stylesheets**

- `lunarcss-layout.min.css`: classless page structure (centred page with a gutter, header with nav, horizontal nav lists, `main` + `aside` sidebar, footer row), button and input groups (`--lunar-button-gap`) and a responsive card grid (`--lunar-card-min-width`), in its own `lunarcss-layout` cascade layer
- `lunarcss-fonts.min.css`: self-hosted Space Grotesk and Space Mono (SIL OFL 1.1, woff2 subsets, no Google requests). `--lunar-font-sans` / `--lunar-font-mono` list them first and fall back to system fonts

**Accessibility**

- Forced colors (Windows contrast themes): tokens map to system colors, decoration drawn with backgrounds opts out of forcing so it stays visible, buttons fall back to a bordered rectangle, and focus shows a system `Highlight` outline
- Reduced motion turns off animations and transitions, including the `details` open and close
- Print styles: pages print in the light theme (dark mode would otherwise put light text on white paper), code blocks wrap, and cards, figures, code, quotes, table rows and images avoid breaking across pages

**Distribution**

- Published to npm as `@nikolaiwu/lunarcss`, with the compiled CSS and the SCSS source, and served by jsDelivr and unpkg

**Showcase and demo** (not part of the package)

- The showcase documents every element next to its source and carries social tags, a social image and a favicon; the Acme Robotics demo is a classless landing page, kept out of search results with `noindex`

[Unreleased]: https://github.com/nikolaiwu/lunarcss/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/nikolaiwu/lunarcss/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/nikolaiwu/lunarcss/releases/tag/v0.1.0
