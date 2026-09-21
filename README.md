# 🌙 LunarCSS

A plug-and-play CSS theme that styles all standard HTML elements using pure element selectors. No classes. Defaults out of the box, and a set of tokens to build your own look on top.

## Features

- **Classless** — Styles all HTML elements using element selectors only
- **Cards** — Every `<article>` is a card with optional `<header>` / `<footer>`; sibling articles form a responsive grid
- **Light & Dark** — Built-in theme support with automatic system preference detection
- **CSS Variables** — Fully customizable via CSS custom properties
- **Modern** — Built with SCSS, processed with Vite
- **Lightweight** — Minimal footprint, maximum impact
- **Optional layout** — Classless page structure (header, nav, main + aside, footer, card grid) in a separate ~0.6 kB stylesheet
- **Private fonts** — System fonts by default; optional self-hosted Space Grotesk and Space Mono with no Google requests
- **Accessible** — Focus states, reduced motion support, and semantic HTML styling

## Quick Start

### CDN

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nikolaiwu/lunarcss@0.1/dist/lunarcss.min.css"
/>
```

Pin a version range (like `@0.1` above) so a future breaking release can't change your site. unpkg works too: `https://unpkg.com/@nikolaiwu/lunarcss@0.1/dist/lunarcss.min.css`.

For the full look, also load the optional self-hosted fonts (Space Grotesk and Space Mono) before the theme. Nothing is requested from Google:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nikolaiwu/lunarcss@0.1/dist/lunarcss-fonts.min.css"
/>
```

### npm

```bash
npm install @nikolaiwu/lunarcss
```

Import it in your bundler entry point:

```javascript
import "@nikolaiwu/lunarcss/fonts"; // optional
import "@nikolaiwu/lunarcss";
import "@nikolaiwu/lunarcss/layout"; // optional, after the theme
```

Sass users can also compile from source with `@use "pkg:@nikolaiwu/lunarcss/scss";` (requires Sass's Node package importer; see the [User Guide](USER-GUIDE.md#using-the-scss-source)).

### Download

Download `lunarcss.min.css` from the [releases page](https://github.com/nikolaiwu/lunarcss/releases) and include it in your HTML:

```html
<link rel="stylesheet" href="lunarcss.min.css" />
```

For the fonts, download the release `.zip` instead and keep `lunarcss-fonts.min.css` next to its `fonts/` folder.

That's it! Your HTML now has the theme's defaults, ready to build on.

## Theme Switching

LunarCSS supports both automatic and manual theme switching.

### Automatic (System Preference)

By default, LunarCSS respects the user's system preference via `prefers-color-scheme`.

### Manual Toggle

Add a `data-theme` attribute to the `<html>` element:

```html
<!-- Light theme -->
<html data-theme="light"></html>

<!-- Dark theme -->
<html data-theme="dark"></html>
```

Toggle with JavaScript:

```javascript
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme");
  html.setAttribute("data-theme", current === "dark" ? "light" : "dark");
}
```

## Customization

Override CSS custom properties to customize the theme:

```css
:root {
  /* Change the main colors (background, text and borders in both modes) */
  --lunar-light: #f5f5f4;
  --lunar-dark: #1c1917;

  /* Change accent color (separate light/dark values) */
  --lunar-accent: light-dark(#7c3aed, #a78bfa);

  /* Change font family */
  --lunar-font-sans: "Inter", system-ui, sans-serif;

  /* Adjust spacing */
  --lunar-space-4: 1.25rem;
}
```

See the [User Guide](USER-GUIDE.md) for a complete list of CSS variables.

## Development

### Prerequisites

- Node.js 18+
- pnpm (version pinned via `packageManager` in `package.json`; run `corepack enable` to use it)

### Setup

```bash
# Clone the repository
git clone https://github.com/nikolaiwu/lunarcss.git
cd lunarcss

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Commands

| Command             | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `pnpm dev`          | Start development server with hot reload                      |
| `pnpm build`        | Build the minified theme CSS and the showcase page to `dist/` |
| `pnpm preview`      | Preview production build                                      |
| `pnpm format`       | Format all files with Prettier                                |
| `pnpm format:check` | Check formatting without writing changes                      |

### Releasing

Versions follow [Semantic Versioning](https://semver.org/); see [CHANGELOG.md](CHANGELOG.md) for what counts as a breaking change.

1. Move the `[Unreleased]` notes in `CHANGELOG.md` under a new version heading and commit.
2. Bump the version: `pnpm release:patch`, `pnpm release:minor` or `pnpm release:major`. This updates `package.json`, commits and creates a `vX.Y.Z` tag. The working tree must be clean.
3. Push the commit and tag: `git push --follow-tags`.

Pushing the tag runs the [release workflow](.github/workflows/release.yml), which publishes to npm (and so to the CDNs) and creates a GitHub release with `lunarcss.min.css` attached.

### Project Structure

```
lunarcss/
├── src/
│   ├── scss/
│   │   ├── _config.scss          # Design tokens & CSS variables (all colors, via light-dark())
│   │   ├── _reset.scss           # CSS reset
│   │   ├── mixins/               # Shared SCSS mixins (_index.scss forwards all)
│   │   │   ├── _cut-corner.scss  # cut-corner-border
│   │   │   └── _card.scss        # card look (article, dialog)
│   │   ├── base/
│   │   │   ├── _root.scss        # :root, html, body styles
│   │   │   └── _typography.scss  # Base typography
│   │   ├── elements/
│   │   │   ├── _headings.scss    # h1-h6
│   │   │   ├── _text.scss        # p, blockquote, pre, hr
│   │   │   ├── _inline.scss      # a, strong, em, code, etc.
│   │   │   ├── _lists.scss       # ul, ol, li, dl, dt, dd
│   │   │   ├── _tables.scss      # table, thead, tbody, etc.
│   │   │   ├── _forms.scss       # form, input, textarea, select, etc.
│   │   │   ├── _buttons.scss     # buttons + button/input groups
│   │   │   ├── _media.scss       # img, video, audio, etc.
│   │   │   ├── _interactive.scss # details, summary, dialog
│   │   │   └── _article.scss     # article cards + card grid
│   │   ├── themes/
│   │   │   ├── _light.scss       # [data-theme="light"] → color-scheme: light
│   │   │   └── _dark.scss        # [data-theme="dark"] → color-scheme: dark
│   │   ├── main.scss             # Production entry point
│   │   ├── fonts.scss            # Optional fonts entry → lunarcss-fonts.min.css
│   │   ├── layout.scss           # Optional layout entry → lunarcss-layout.min.css
│   │   └── showcase.scss         # Showcase-only styles
│   ├── index.html                # Showcase page (element reference)
│   ├── demo.html                 # Acme Robotics demo: a classless landing page
│   └── theme-toggle.js           # Shared light/dark toggle for both pages
├── vite/demo-source.js           # Build-time source previews for the showcase
├── .github/workflows/release.yml # Publish to npm + GitHub release on version tags
├── dist/                         # Build output
├── vite.config.js
├── package.json
├── CHANGELOG.md
├── README.md
└── USER-GUIDE.md
```

## Browser Support

LunarCSS supports all modern browsers:

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

Theming relies on the CSS `light-dark()` function (Chrome 123+, Firefox 120+, Safari 17.5+).

## Principles

1. **Element selectors only** — The production CSS uses no classes, only HTML element selectors
2. **Progressive enhancement** — Base styles work everywhere, enhanced features for modern browsers
3. **Customization via variables** — All design decisions exposed as CSS custom properties
4. **Minimal reset** — Just enough to normalize, not opinionated overrides
5. **Easy to override** — Everything lives in the `lunarcss` cascade layer, so your CSS and utility frameworks always win, no specificity battles

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Made with 🌙 by the LunarCSS team
