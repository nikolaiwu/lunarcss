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
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/lunarcss@latest/dist/lunarcss.min.css">
  <title>My Page</title>
</head>
<body>
  <h1>Hello, LunarCSS!</h1>
  <p>Your content is now beautifully styled.</p>
</body>
</html>
```

### Option 2: NPM

```bash
npm install lunarcss
```

Then import in your HTML or build system:

```html
<link rel="stylesheet" href="node_modules/lunarcss/dist/lunarcss.min.css">
```

Or in a JavaScript bundler:

```javascript
import 'lunarcss/dist/lunarcss.min.css';
```

### Option 3: Download

Download `lunarcss.min.css` from the releases page and add it to your project:

```html
<link rel="stylesheet" href="path/to/lunarcss.min.css">
```

---

## Basic Usage

LunarCSS styles all standard HTML elements automatically. Just write semantic HTML:

```html
<article>
  <h1>Article Title</h1>
  <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>

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

By default, LunarCSS respects the user's operating system preference:

- **Light mode**: If the user's OS is set to light mode
- **Dark mode**: If the user's OS is set to dark mode

This works via the CSS `prefers-color-scheme` media query.

### Manual Theme Control

To manually control the theme, add the `data-theme` attribute to the `<html>` element:

```html
<!-- Force light theme -->
<html data-theme="light">

<!-- Force dark theme -->
<html data-theme="dark">
```

### JavaScript Theme Toggle

Here's a complete theme toggle implementation:

```javascript
// Toggle between light and dark
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Load saved theme on page load
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
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

### Color Primitives

```css
:root {
  /* Gray scale */
  --lunar-gray-50: #fafafa;
  --lunar-gray-100: #f4f4f5;
  --lunar-gray-200: #e4e4e7;
  --lunar-gray-300: #d4d4d8;
  --lunar-gray-400: #a1a1aa;
  --lunar-gray-500: #71717a;
  --lunar-gray-600: #52525b;
  --lunar-gray-700: #3f3f46;
  --lunar-gray-800: #27272a;
  --lunar-gray-900: #18181b;
  --lunar-gray-950: #09090b;

  /* Primary accent (blue) */
  --lunar-primary-50: #eff6ff;
  --lunar-primary-100: #dbeafe;
  --lunar-primary-200: #bfdbfe;
  --lunar-primary-300: #93c5fd;
  --lunar-primary-400: #60a5fa;
  --lunar-primary-500: #3b82f6;
  --lunar-primary-600: #2563eb;
  --lunar-primary-700: #1d4ed8;
  --lunar-primary-800: #1e40af;
  --lunar-primary-900: #1e3a8a;

  /* Semantic colors */
  --lunar-success: #22c55e;
  --lunar-warning: #f59e0b;
  --lunar-error: #ef4444;
  --lunar-info: #3b82f6;
}
```

### Semantic Colors (Theme-aware)

These colors automatically adjust based on light/dark theme:

```css
:root {
  /* Backgrounds */
  --lunar-bg: /* Base background */
  --lunar-bg-subtle: /* Slightly emphasized */
  --lunar-bg-muted: /* More emphasized */
  --lunar-bg-emphasis: /* Most emphasized */

  /* Foreground / Text */
  --lunar-fg: /* Primary text */
  --lunar-fg-muted: /* Secondary text */
  --lunar-fg-subtle: /* Tertiary text */

  /* Borders */
  --lunar-border: /* Default border */
  --lunar-border-muted: /* Subtle border */
  --lunar-border-emphasis: /* Strong border */

  /* Interactive / Accent */
  --lunar-accent: /* Primary action color */
  --lunar-accent-hover: /* Hover state */
  --lunar-accent-muted: /* Light accent background */
  --lunar-accent-fg: /* Text on accent background */

  /* Links */
  --lunar-link: /* Link color */
  --lunar-link-hover: /* Link hover */
  --lunar-link-visited: /* Visited link */

  /* Forms */
  --lunar-input-bg: /* Input background */
  --lunar-input-border: /* Input border */
  --lunar-input-border-hover: /* Input border on hover */
  --lunar-input-border-focus: /* Input border on focus */
  --lunar-input-placeholder: /* Placeholder text */

  /* Code */
  --lunar-code-bg: /* Inline code background */
  --lunar-code-fg: /* Inline code text */
  --lunar-pre-bg: /* Code block background */
  --lunar-pre-fg: /* Code block text */

  /* Tables */
  --lunar-table-border: /* Table borders */
  --lunar-table-header-bg: /* Header background */
  --lunar-table-row-hover: /* Row hover */
  --lunar-table-stripe: /* Striped row */
}
```

### Typography

```css
:root {
  /* Font families */
  --lunar-font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --lunar-font-serif: Georgia, Cambria, 'Times New Roman', Times, serif;
  --lunar-font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;

  /* Font sizes */
  --lunar-text-xs: 0.75rem;    /* 12px */
  --lunar-text-sm: 0.875rem;   /* 14px */
  --lunar-text-base: 1rem;     /* 16px */
  --lunar-text-lg: 1.125rem;   /* 18px */
  --lunar-text-xl: 1.25rem;    /* 20px */
  --lunar-text-2xl: 1.5rem;    /* 24px */
  --lunar-text-3xl: 1.875rem;  /* 30px */
  --lunar-text-4xl: 2.25rem;   /* 36px */
  --lunar-text-5xl: 3rem;      /* 48px */
  --lunar-text-6xl: 3.75rem;   /* 60px */

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
}
```

### Spacing

```css
:root {
  --lunar-space-0: 0;
  --lunar-space-1: 0.25rem;   /* 4px */
  --lunar-space-2: 0.5rem;    /* 8px */
  --lunar-space-3: 0.75rem;   /* 12px */
  --lunar-space-4: 1rem;      /* 16px */
  --lunar-space-5: 1.25rem;   /* 20px */
  --lunar-space-6: 1.5rem;    /* 24px */
  --lunar-space-8: 2rem;      /* 32px */
  --lunar-space-10: 2.5rem;   /* 40px */
  --lunar-space-12: 3rem;     /* 48px */
  --lunar-space-16: 4rem;     /* 64px */
  --lunar-space-20: 5rem;     /* 80px */
  --lunar-space-24: 6rem;     /* 96px */
}
```

### Border Radius

```css
:root {
  --lunar-radius-none: 0;
  --lunar-radius-sm: 0.125rem;   /* 2px */
  --lunar-radius-md: 0.375rem;   /* 6px */
  --lunar-radius-lg: 0.5rem;     /* 8px */
  --lunar-radius-xl: 0.75rem;    /* 12px */
  --lunar-radius-2xl: 1rem;      /* 16px */
  --lunar-radius-full: 9999px;
}
```

### Shadows

```css
:root {
  --lunar-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --lunar-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --lunar-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --lunar-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
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

---

## Customization Examples

### Change Primary Color to Purple

```css
:root {
  --lunar-primary-50: #faf5ff;
  --lunar-primary-100: #f3e8ff;
  --lunar-primary-200: #e9d5ff;
  --lunar-primary-300: #d8b4fe;
  --lunar-primary-400: #c084fc;
  --lunar-primary-500: #a855f7;
  --lunar-primary-600: #9333ea;
  --lunar-primary-700: #7e22ce;
  --lunar-primary-800: #6b21a8;
  --lunar-primary-900: #581c87;
}
```

### Use Custom Fonts

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --lunar-font-sans: 'Inter', system-ui, sans-serif;
}
```

### Increase Base Font Size

```css
html {
  font-size: 112.5%; /* 18px base instead of 16px */
}
```

### Warmer Color Palette

```css
:root {
  --lunar-gray-50: #fafaf9;
  --lunar-gray-100: #f5f5f4;
  --lunar-gray-200: #e7e5e4;
  --lunar-gray-300: #d6d3d1;
  --lunar-gray-400: #a8a29e;
  --lunar-gray-500: #78716c;
  --lunar-gray-600: #57534e;
  --lunar-gray-700: #44403c;
  --lunar-gray-800: #292524;
  --lunar-gray-900: #1c1917;
}
```

---

## Working with Frameworks

### With Tailwind CSS

LunarCSS works great as a base layer before adding Tailwind:

```html
<!-- LunarCSS first for base element styles -->
<link rel="stylesheet" href="lunarcss.min.css">
<!-- Tailwind second for utility classes -->
<link rel="stylesheet" href="output.css">
```

Your HTML elements will have beautiful defaults, and you can use Tailwind utilities for layout and customization.

### With Bootstrap

Load LunarCSS before Bootstrap to provide better defaults:

```html
<link rel="stylesheet" href="lunarcss.min.css">
<link rel="stylesheet" href="bootstrap.min.css">
```

### With React/Vue/Svelte

Import LunarCSS in your entry point:

```javascript
// main.js or App.jsx
import 'lunarcss/dist/lunarcss.min.css';
import './your-styles.css'; // Your custom styles after
```

---

## Troubleshooting

### Styles Not Applying

1. **Check CSS load order**: LunarCSS should load before your custom styles
2. **Check specificity**: LunarCSS uses element selectors, which have low specificity. Your custom styles should override easily.
3. **Check for conflicting resets**: If you have another CSS reset, it may conflict with LunarCSS.

### Dark Mode Not Working

1. **Check `data-theme` attribute**: Make sure it's on the `<html>` element, not `<body>`
2. **Check system preference**: LunarCSS respects `prefers-color-scheme` by default
3. **Check for conflicts**: Other CSS may override theme variables

### Forms Look Different

Different browsers render form elements differently. LunarCSS normalizes most elements, but some (like date pickers) depend heavily on the browser.

### Print Styles

LunarCSS includes basic print-friendly styles via `prefers-reduced-motion`. For extensive print support, add your own `@media print` rules.

---

## Support

- **Documentation**: [lunarcss.dev](https://lunarcss.dev)
- **GitHub Issues**: [github.com/lunarcss/lunarcss/issues](https://github.com/lunarcss/lunarcss/issues)
- **Discussions**: [github.com/lunarcss/lunarcss/discussions](https://github.com/lunarcss/lunarcss/discussions)

---

Made with 🌙 by the LunarCSS team
