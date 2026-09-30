# 🌙 LunarCSS

A classless CSS theme: it styles plain HTML elements with element selectors only, so there are no classes to learn and no markup to change. Retro-futuristic defaults, light and dark, and a set of tokens to make it your own.

[Showcase](https://nikolaiwu.github.io/lunarcss/) · [User Guide](USER-GUIDE.md) · [Changelog](CHANGELOG.md)

[![The same HTML page twice: unstyled browser defaults on the left, and with LunarCSS on the right, split between the light and dark themes](https://nikolaiwu.github.io/lunarcss/before-after.png)](https://nikolaiwu.github.io/lunarcss/demo.html)

## Features

- **Classless**: every standard element styled, no classes needed
- **Light and dark**: follows the system setting, or `data-theme` on any element
- **Tokens**: colors, type, spacing and more as `--lunar-*` custom properties
- **Stays out of your way**: everything sits in the `lunarcss` cascade layer, so your own CSS always wins
- **Optional extras**: a classless layout stylesheet (~0.6 kB) and self-hosted Space Grotesk and Space Mono, with no Google requests
- **Accessible**: visible focus, reduced motion, and Windows contrast themes

## Quick start

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nikolaiwu/lunarcss@0.1/dist/lunarcss.min.css"
/>
```

Or with npm:

```bash
npm install @nikolaiwu/lunarcss
```

```javascript
import "@nikolaiwu/lunarcss";
```

### Optional stylesheets

The theme styles elements but never places them, so it doesn't pad the page. Two extras fill in, both classless:

- **Fonts** (`lunarcss-fonts.min.css`): self-hosted Space Grotesk and Space Mono, with no Google requests. Load it before the theme.
- **Layout** (`lunarcss-layout.min.css`): a centred page with a gutter, a header with nav, a sidebar, a card grid and button groups. Load it after the theme.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nikolaiwu/lunarcss@0.1/dist/lunarcss-fonts.min.css"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nikolaiwu/lunarcss@0.1/dist/lunarcss.min.css"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nikolaiwu/lunarcss@0.1/dist/lunarcss-layout.min.css"
/>
```

```javascript
import "@nikolaiwu/lunarcss/fonts";
import "@nikolaiwu/lunarcss";
import "@nikolaiwu/lunarcss/layout";
```

The [User Guide](USER-GUIDE.md) covers theming, the token reference and customization.

## Browser support

Current Chrome, Edge, Firefox and Safari. Theming relies on `light-dark()`: Chrome 123+, Firefox 120+, Safari 17.5+.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
