# LunarCSS User Guide

This guide covers everything you need to know to use and customize LunarCSS.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Theme Switching](#theme-switching)
- [CSS Variables Reference](#css-variables-reference)
- [Customization Examples](#customization-examples)
- [Working with Frameworks](#working-with-frameworks)
- [Troubleshooting](#troubleshooting)

---

## Installation

### Option 1: CDN (Recommended for Quick Start)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@nikolaiwu/lunarcss@0.1/dist/lunarcss.min.css"
    />
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello, LunarCSS!</h1>
    <p>Your content is now beautifully styled.</p>
  </body>
</html>
```

The `@0.1` in the URL is a version range: you get fixes automatically, but not breaking changes. Use an exact version (e.g. `@0.1.0`) to pin completely, or `@latest` only for experiments. The same paths work on unpkg (`https://unpkg.com/@nikolaiwu/lunarcss@0.1/dist/lunarcss.min.css`).

### Option 2: npm

```bash
npm install @nikolaiwu/lunarcss
```

Then import it in a JavaScript bundler:

```javascript
import "@nikolaiwu/lunarcss";
```

Or link the file directly:

```html
<link
  rel="stylesheet"
  href="node_modules/@nikolaiwu/lunarcss/dist/lunarcss.min.css"
/>
```

#### Using the SCSS source

The package also includes the SCSS source, so Sass users can compile the theme as part of their own build:

```scss
@use "pkg:@nikolaiwu/lunarcss/scss";
```

The `pkg:` URL needs Sass's Node package importer (Dart Sass 1.71+). On the command line, pass `--pkg-importer=node`. In the JS API, pass `importers: [new NodePackageImporter()]`, which is also how to configure it in bundlers such as Vite (under `css.preprocessorOptions.scss`).

### Option 3: Download

Download `lunarcss.min.css` from the [releases page](https://github.com/nikolaiwu/lunarcss/releases) and add it to your project:

```html
<link rel="stylesheet" href="path/to/lunarcss.min.css" />
```

---

## Basic Usage

LunarCSS styles all standard HTML elements automatically. Just write semantic HTML:

```html
<article>
  <h1>Article Title</h1>
  <p>
    This is a paragraph with <strong>bold</strong> and <em>italic</em> text.
  </p>

  <h2>A Subheading</h2>
  <p>More content with a <a href="#">link</a>.</p>

  <blockquote>
    <p>A beautiful quote.</p>
    <cite>Someone Famous</cite>
  </blockquote>

  <ul>
    <li>List item one</li>
    <li>List item two</li>
  </ul>
</article>
```

No classes needed!

---

## Theme Switching

### Automatic Theme Detection

By default, LunarCSS respects the user's operating system preference via the CSS `prefers-color-scheme` media query. All color tokens use `light-dark()`, so the browser automatically picks the right value.

### Manual Theme Control

To manually control the theme, add the `data-theme` attribute to the `<html>` element:

```html
<!-- Force light theme -->
<html data-theme="light"></html>

<!-- Force dark theme -->
<html data-theme="dark"></html>
```

This works by switching the `color-scheme` property, which flips all `light-dark()` values simultaneously. Because `color-scheme` is inherited, you can also put `data-theme` on any element to theme just that subtree (e.g. a dark `<aside>` on a light page).

### JavaScript Theme Toggle

Here's a complete theme toggle implementation:

```javascript
// Toggle between light and dark
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

// Load saved theme on page load
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
}

// Call on page load
loadTheme();
```

### Theme Toggle Button Example

```html
<button onclick="toggleTheme()" aria-label="Toggle theme">
  🌓 Toggle Theme
</button>
```

---

## CSS Variables Reference

LunarCSS uses CSS custom properties for all design tokens. Override these in your own stylesheet to customize the theme.

### Color Tokens

#### Main colors

LunarCSS is built on two main colors. Light mode uses the light color for the background and the dark color for text and borders, and dark mode swaps them. To change the overall look, override just these two:

```css
:root {
  --lunar-light: #f5f5f4;
  --lunar-dark: #1c1917;
}
```

#### Semantic tokens

The remaining color tokens are listed below. Most use `light-dark()`, so one definition covers both modes and no theme overrides are needed.

| Token             | Used for                                                           |
| ----------------- | ------------------------------------------------------------------ |
| `--lunar-bg`      | Page background (built from `--lunar-light` / `--lunar-dark`)      |
| `--lunar-fg`      | Primary text (built from `--lunar-light` / `--lunar-dark`)         |
| `--lunar-border`  | Borders and dividers (built from `--lunar-light` / `--lunar-dark`) |
| `--lunar-accent`  | Links, interactive elements, focus                                 |
| `--lunar-muted`   | Secondary text, placeholders                                       |
| `--lunar-success` | Success state                                                      |
| `--lunar-warning` | Warning state                                                      |
| `--lunar-error`   | Error state                                                        |
| `--lunar-info`    | Informational state                                                |

For the default values, see `src/scss/_config.scss`.

Override any token to rebrand. For example, to change the accent to purple:

```css
:root {
  --lunar-accent: light-dark(#7c3aed, #a78bfa);
}
```

Or use a single color (same in both modes):

```css
:root {
  --lunar-accent: #7c3aed;
}
```

### Typography

```css
:root {
  /* Font families */
  --lunar-font-sans:
    system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  --lunar-font-serif: Georgia, Cambria, "Times New Roman", Times, serif;
  --lunar-font-mono:
    ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono",
    monospace;

  /* Font sizes */
  --lunar-text-xs: 0.75rem; /* 12px */
  --lunar-text-sm: 0.875rem; /* 14px */
  --lunar-text-base: 1rem; /* 16px */
  --lunar-text-lg: 1.125rem; /* 18px */
  --lunar-text-xl: 1.25rem; /* 20px */
  --lunar-text-2xl: 1.5rem; /* 24px */
  --lunar-text-3xl: 1.875rem; /* 30px */
  --lunar-text-4xl: 2.25rem; /* 36px */
  --lunar-text-5xl: 3rem; /* 48px */
  --lunar-text-6xl: 3.75rem; /* 60px */

  /* Line heights */
  --lunar-leading-none: 1;
  --lunar-leading-tight: 1.25;
  --lunar-leading-snug: 1.375;
  --lunar-leading-normal: 1.5;
  --lunar-leading-relaxed: 1.625;
  --lunar-leading-loose: 2;

  /* Font weights */
  --lunar-font-thin: 100;
  --lunar-font-light: 300;
  --lunar-font-regular: 400;
  --lunar-font-medium: 500;
  --lunar-font-semibold: 600;
  --lunar-font-bold: 700;
  --lunar-font-extrabold: 800;

  /* Letter spacing */
  --lunar-tracking-tight: -0.025em;
  --lunar-tracking-normal: 0;
  --lunar-tracking-wide: 0.025em;
}
```

### Spacing

```css
:root {
  --lunar-space-0: 0;
  --lunar-space-1: 0.25rem; /* 4px */
  --lunar-space-2: 0.5rem; /* 8px */
  --lunar-space-3: 0.75rem; /* 12px */
  --lunar-space-4: 1rem; /* 16px */
  --lunar-space-5: 1.25rem; /* 20px */
  --lunar-space-6: 1.5rem; /* 24px */
  --lunar-space-8: 2rem; /* 32px */
  --lunar-space-10: 2.5rem; /* 40px */
  --lunar-space-12: 3rem; /* 48px */
  --lunar-space-16: 4rem; /* 64px */
  --lunar-space-20: 5rem; /* 80px */
  --lunar-space-24: 6rem; /* 96px */
}
```

### Borders

```css
:root {
  --lunar-border-width: 2px;

  /* Radius */
  --lunar-radius-none: 0;
  --lunar-radius-sm: 0.125rem; /* 2px */
  --lunar-radius-md: 0.375rem; /* 6px */
  --lunar-radius-lg: 0.5rem; /* 8px */
  --lunar-radius-xl: 0.75rem; /* 12px */
  --lunar-radius-2xl: 1rem; /* 16px */
  --lunar-radius-full: 9999px;
}
```

### Shadows

```css
:root {
  --lunar-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --lunar-shadow-md:
    0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --lunar-shadow-lg:
    0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --lunar-shadow-xl:
    0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

### Transitions

```css
:root {
  --lunar-transition-fast: 150ms ease;
  --lunar-transition-base: 200ms ease;
  --lunar-transition-slow: 300ms ease;
}
```

### Z-Index

```css
:root {
  --lunar-z-dropdown: 1000;
  --lunar-z-sticky: 1020;
  --lunar-z-fixed: 1030;
  --lunar-z-modal-backdrop: 1040;
  --lunar-z-modal: 1050;
  --lunar-z-popover: 1060;
  --lunar-z-tooltip: 1070;
}
```

### Content Width

```css
:root {
  --lunar-content-width: 65ch;
  --lunar-content-width-wide: 80ch;
}
```

---

## Customization Examples

### Change Accent Color to Purple

```css
:root {
  --lunar-accent: light-dark(#7c3aed, #a78bfa);
}
```

### Warmer Neutral Background

```css
:root {
  --lunar-light: #faf9f7;
  --lunar-dark: #1c1917;
  --lunar-muted: light-dark(#78716c, #a8a29e);
}
```

### Use Custom Fonts

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

:root {
  --lunar-font-sans: "Inter", system-ui, sans-serif;
}
```

### Increase Base Font Size

```css
html {
  font-size: 112.5%; /* 18px base instead of 16px */
}
```

---

## Working with Frameworks

### With Tailwind CSS

LunarCSS works great as a base layer before adding Tailwind:

```html
<!-- LunarCSS first for base element styles -->
<link rel="stylesheet" href="lunarcss.min.css" />
<!-- Tailwind second for utility classes -->
<link rel="stylesheet" href="output.css" />
```

Your HTML elements will have beautiful defaults, and you can use Tailwind utilities for layout and customization.

### With Bootstrap

Load LunarCSS before Bootstrap to provide better defaults:

```html
<link rel="stylesheet" href="lunarcss.min.css" />
<link rel="stylesheet" href="bootstrap.min.css" />
```

### With React/Vue/Svelte

Import LunarCSS in your entry point:

```javascript
// main.js or App.jsx
import "@nikolaiwu/lunarcss";
import "./your-styles.css"; // Your custom styles after
```

---

## Troubleshooting

### Styles Not Applying

1. **Check CSS load order**: LunarCSS should load before your custom styles
2. **Check specificity**: LunarCSS uses element selectors, which have low specificity. Your custom styles should override easily.
3. **Check for conflicting resets**: If you have another CSS reset, it may conflict with LunarCSS.

### Dark Mode Not Working

1. **Check `data-theme` attribute**: To theme the whole page, put it on the `<html>` element. On any other element it only themes that element and its children.
2. **Check system preference**: Without `data-theme`, LunarCSS follows `prefers-color-scheme` via the `light-dark()` CSS function
3. **Browser support**: `light-dark()` requires a modern browser (Chrome 123+, Firefox 120+, Safari 17.5+). Older browsers don't fall back to either theme: the color tokens that use it are ignored, and those elements get browser default colors.

### Forms Look Different

Different browsers render form elements differently. LunarCSS normalizes most elements, but some (like date pickers) depend heavily on the browser.

### Print Styles

LunarCSS doesn't include print styles. Add your own `@media print` rules if you need them. (It does respect `prefers-reduced-motion` by disabling animations and transitions.)

---

## Support

- **Documentation**: [github.com/nikolaiwu/lunarcss](https://github.com/nikolaiwu/lunarcss)
- **GitHub Issues**: [github.com/nikolaiwu/lunarcss/issues](https://github.com/nikolaiwu/lunarcss/issues)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

---

Made with 🌙 by the LunarCSS team
