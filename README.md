# 🌙 LunarCSS

A plug-and-play CSS theme that styles all standard HTML elements using pure element selectors. No classes needed—just beautiful defaults out of the box.

## Features

- **Classless** — Styles all HTML elements using element selectors only
- **Light & Dark** — Built-in theme support with automatic system preference detection
- **CSS Variables** — Fully customizable via CSS custom properties
- **Modern** — Built with SCSS, processed with Vite
- **Lightweight** — Minimal footprint, maximum impact
- **Accessible** — Focus states, reduced motion support, and semantic HTML styling

## Quick Start

### CDN (Coming Soon)

```html
<link rel="stylesheet" href="https://unpkg.com/lunarcss@latest/dist/lunarcss.min.css">
```

### NPM

```bash
npm install lunarcss
```

```html
<link rel="stylesheet" href="node_modules/lunarcss/dist/lunarcss.min.css">
```

### Download

Download `lunarcss.min.css` from the [releases page](https://github.com/lunarcss/lunarcss/releases) and include it in your HTML:

```html
<link rel="stylesheet" href="lunarcss.min.css">
```

That's it! Your HTML will now have beautiful default styles.

## Theme Switching

LunarCSS supports both automatic and manual theme switching.

### Automatic (System Preference)

By default, LunarCSS respects the user's system preference via `prefers-color-scheme`.

### Manual Toggle

Add a `data-theme` attribute to the `<html>` element:

```html
<!-- Light theme -->
<html data-theme="light">

<!-- Dark theme -->
<html data-theme="dark">
```

Toggle with JavaScript:

```javascript
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
}
```

## Customization

Override CSS custom properties to customize the theme:

```css
:root {
  /* Change primary accent color */
  --lunar-primary-500: #8b5cf6;
  --lunar-primary-600: #7c3aed;

  /* Change font family */
  --lunar-font-sans: 'Inter', system-ui, sans-serif;

  /* Adjust spacing */
  --lunar-space-4: 1.25rem;
}
```

See the [User Guide](USER-GUIDE.md) for a complete list of CSS variables.

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/lunarcss/lunarcss.git
cd lunarcss

# Install dependencies
npm install

# Start development server
npm run dev
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production CSS to `dist/` |
| `npm run preview` | Preview production build |

### Project Structure

```
lunarcss/
├── src/
│   ├── scss/
│   │   ├── _config.scss          # Design tokens & CSS variables
│   │   ├── _reset.scss           # CSS reset
│   │   ├── base/
│   │   │   ├── _root.scss        # :root, html, body styles
│   │   │   └── _typography.scss  # Base typography
│   │   ├── elements/
│   │   │   ├── _headings.scss    # h1-h6
│   │   │   ├── _text.scss        # p, blockquote, pre, hr
│   │   │   ├── _inline.scss      # a, strong, em, code, etc.
│   │   │   ├── _lists.scss       # ul, ol, li, dl, dt, dd
│   │   │   ├── _tables.scss      # table, thead, tbody, etc.
│   │   │   ├── _forms.scss       # form, input, button, etc.
│   │   │   ├── _media.scss       # img, video, audio, etc.
│   │   │   └── _interactive.scss # details, summary, dialog
│   │   ├── themes/
│   │   │   ├── _light.scss       # Light theme variables
│   │   │   └── _dark.scss        # Dark theme variables
│   │   ├── main.scss             # Production entry point
│   │   └── showcase.scss         # Showcase-only styles
│   └── index.html                # Showcase page
├── dist/                         # Build output
├── vite.config.js
├── package.json
├── README.md
└── USER-GUIDE.md
```

## Browser Support

LunarCSS supports all modern browsers:

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Principles

1. **Element selectors only** — The production CSS uses no classes, only HTML element selectors
2. **Progressive enhancement** — Base styles work everywhere, enhanced features for modern browsers
3. **Customization via variables** — All design decisions exposed as CSS custom properties
4. **Minimal reset** — Just enough to normalize, not opinionated overrides

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
