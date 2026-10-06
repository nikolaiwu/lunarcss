# LunarCSS User Guide

This guide covers everything you need to know to use and customize LunarCSS.

## Table of Contents

- [Installation](#installation)
- [Fonts](#fonts)
- [Basic Usage](#basic-usage)
- [Cards](#cards)
- [Layout](#layout)
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

Then import it in a JavaScript bundler. The [fonts](#fonts) and [layout](#layout) stylesheets are optional; the layout goes after the theme:

```javascript
import "@nikolaiwu/lunarcss/fonts"; // optional
import "@nikolaiwu/lunarcss";
import "@nikolaiwu/lunarcss/layout"; // optional, after the theme
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

To use the fonts as well, download the release `.zip`. It contains `lunarcss.min.css`, `lunarcss-fonts.min.css` and the `fonts/` folder, which must stay next to `lunarcss-fonts.min.css`.

---

## Fonts

LunarCSS is designed around two open-license fonts: **Space Grotesk** for body text and headings, and **Space Mono** for code. The theme itself **never downloads fonts**. `--lunar-font-sans` and `--lunar-font-mono` list them first, and fall back to system fonts when they aren't available.

### Loading the bundled fonts (optional)

For the full look, load `lunarcss-fonts.min.css` **before** the theme:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nikolaiwu/lunarcss@0.1/dist/lunarcss-fonts.min.css"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nikolaiwu/lunarcss@0.1/dist/lunarcss.min.css"
/>
```

With npm and a bundler:

```javascript
import "@nikolaiwu/lunarcss/fonts";
import "@nikolaiwu/lunarcss";
```

- **Self-hosted:** the font files are served from the same place as the stylesheet (the CDN, your `node_modules`, or your own server). Nothing is requested from Google, so there's no third-party tracking or GDPR concern.
- **Only what's needed is downloaded:** fonts are split into Latin, Latin Extended and Vietnamese subsets, and browsers fetch only the subsets a page uses, and only for the weights and styles it renders.
- **No invisible text:** `font-display: swap` shows system fonts until the custom fonts have loaded.
- **Licensing:** both fonts use the SIL Open Font License 1.1. The license texts ship in `dist/fonts/`.
- **Sass users:** `pkg:@nikolaiwu/lunarcss/scss` compiles only the theme. Load `lunarcss-fonts.min.css` separately.

### Using your own fonts

Skip the fonts stylesheet and override the font tokens:

```css
:root {
  --lunar-font-sans: "Inter", system-ui, sans-serif;
  --lunar-font-mono: "Fira Code", ui-monospace, monospace;
}
```

For plain system fonts, remove the first entry from each stack:

```css
:root {
  --lunar-font-sans: system-ui, sans-serif;
  --lunar-font-mono: ui-monospace, monospace;
}
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

### Pseudo-elements the theme uses

Some elements are drawn partly with `::before` and `::after`. On these, the theme owns the pseudo-element, so adding your own `content` there replaces part of the element's look:

| Element                               | Uses                  | For                          |
| ------------------------------------- | --------------------- | ---------------------------- |
| `article`, `dialog`, `[popover]`      | `::before`, `::after` | Cut-corner border and fill   |
| `article > footer`, `dialog > footer` | `::before`            | Striped band                 |
| `h1`, `h2`, `h3`                      | `::before`            | Slanted-bar mark             |
| `ul > li`                             | `::before`            | Tick bullet                  |
| `dt`                                  | `::after`             | Dotted leader                |
| `legend`, `figcaption`                | `::before`, `::after` | Striped rule around the text |
| `blockquote`                          | `::before`            | Tinted panel                 |
| `blockquote cite`                     | `::before`            | The dash before the source   |
| `code`, `kbd`                         | `::before`, `::after` | Cut-corner chip              |
| `summary`                             | `::after`             | Plus/minus marker            |
| `q`                                   | `::before`, `::after` | Quotation marks              |
| `a[target="_blank"]`                  | `::after`             | New-tab arrow                |

Everything else, buttons and links included, leaves both free.

### Wide tables

Tables fill the width and wrap their cell text. If a table is still too wide for small screens, wrap it in any element (or a `<figure>`, if it has a caption outside the table), and the wrapper scrolls sideways:

```html
<div>
  <table>
    …
  </table>
</div>
```

The wrapper only scrolls when the table is its sole child (or it's a `<figure>`), so it never affects other layouts.

---

## Cards

Every `<article>` is a card: a bordered box with cut corners for self-contained content such as a post preview, product, comment or pricing tier. Add an optional `<header>` (it gets a dashed rule below it) and `<footer>` (a striped band separates it from the content). Put the body content directly inside the article:

```html
<article>
  <header>
    <h3>Card title</h3>
  </header>
  <p>Card body content.</p>
  <footer>
    <button>Action</button>
  </footer>
</article>
```

Pick the title's heading level to fit the page's outline: `h2` when the cards sit right under the page's `h1`, `h3` under a section's `h2`. A title in the card's `header` is the same size at any level from `h2` to `h6`, so the outline never changes the look. An `h1` keeps its full size, for an article that is the page's main content.

Use `article`, not `section`, for cards: `section` is meant for a themed part of a larger document.

### Cut corners

By default, the top-right and bottom-left corners are cut at 45°. Adjust the look with these custom properties, globally on `:root` or on specific cards:

```css
:root {
  --lunar-cut-size: 1.5rem; /* size of each corner cut */
  --lunar-cut-border-width: 1px; /* border thickness */
  --lunar-cut-border-color: var(--lunar-accent);
  --lunar-cut-bg: var(--lunar-bg); /* card fill */
}
```

The border and fill are drawn with the card's `::before` and `::after` pseudo-elements, so don't use those on `article` or `dialog` for anything else.

Popovers (`[popover]`) share the same cut, on the top-right corner only, and all four overrides. Buttons are cut differently (with `clip-path` on the button itself), so of these they only follow `--lunar-cut-size`, and only when it's set on the button: they set their own size, so a value on `:root` doesn't reach them.

### Dialogs

`<dialog>` shares the card look, including the cut corners, the `--lunar-cut-*` overrides, and the optional `<header>` and `<footer>`:

```html
<dialog id="confirm">
  <header><h3>Delete file?</h3></header>
  <p>This can't be undone.</p>
  <footer>
    <form method="dialog"><button>Close</button></form>
  </footer>
</dialog>
```

### Card grid

With the optional [layout stylesheet](#layout) loaded, a parent whose direct children are **all** articles (at least two) lays them out as a responsive grid that wraps to fewer columns on narrow screens:

```html
<div>
  <article>…</article>
  <article>…</article>
  <article>…</article>
</div>
```

Any other direct child turns the grid off, so put a heading **outside** the wrapper:

```html
<section>
  <h2>Latest posts</h2>
  <div>
    <article>…</article>
    <article>…</article>
  </div>
</section>
```

Change the minimum card width (default `18rem`) before columns wrap:

```css
:root {
  --lunar-card-min-width: 22rem;
}
```

Cards in a grid stretch to the same height, and their footers line up at the bottom.

Without the layout stylesheet, cards simply stack, which is the theme's default flow.

### Full-page articles

A blog post is semantically an `<article>`, but a whole post drawn as a card looks wrong. So an article that's the only one in `<main>` is left plain: no border, padding or header and footer rules. Several articles in `<main>` are still cards.

```html
<main>
  <article>
    <header><h1>Post title</h1></header>
    <p>The post…</p>
  </article>
</main>
```

To make a lone article a card anyway, wrap it in a `<section>` or any other element inside `<main>`.

## Layout

The theme styles elements but never places them, so your own layout (or a framework's) stays in charge. `lunarcss-layout.min.css` is an optional stylesheet that adds page structure, still without a single class. Load it **after** the theme:

```html
<link rel="stylesheet" href="…/lunarcss.min.css" />
<link rel="stylesheet" href="…/lunarcss-layout.min.css" />
```

```javascript
import "@nikolaiwu/lunarcss";
import "@nikolaiwu/lunarcss/layout";
```

It's about 0.8 kB gzipped and gives you:

| Markup                             | Layout                                                                                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `body`                             | Centred page, limited to `--lunar-page-width`, with a `--lunar-page-gutter` at the screen edges                                                   |
| `body > header` containing a `nav` | Title and navigation on one row, wrapping on small screens                                                                                        |
| `nav ul`                           | Horizontal row of links, no bullets. Mark the current page's link with `aria-current="page"`: the theme shows it in its hover state.              |
| `main` and `aside` as siblings     | Sidebar beside the content above 60rem, stacked below. Source order picks the side: `aside` first puts it on the left, `main` first on the right. |
| A parent of only `article`s        | [Responsive card grid](#card-grid), equal heights, footers aligned                                                                                |
| A parent of only form controls     | Button/input group: a flex row with a `--lunar-button-gap` (2px) gap, so grouped controls read as one shape                                       |
| `body > footer`                    | Its blocks spread across one row, wrapping on small screens. On a short page it sits at the bottom of the window                                  |

So a full page needs no classes at all:

```html
<body>
  <header>
    <h1>Acme Robotics</h1>
    <nav>
      <ul>
        <li><a href="#products">Products</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section id="products">…</section>
  </main>
  <aside>…</aside>
  <footer>…</footer>
</body>
```

### Without the layout stylesheet

The theme doesn't pad the page, so without the layout stylesheet your content runs to the screen edges. If a gutter is all you want, a few lines of your own CSS will do:

```css
body {
  max-width: 72rem;
  margin-inline: auto;
  padding: 1rem;
}
```

### Layout tokens

```css
:root {
  --lunar-page-width: 72rem; /* page width, including the sidebar */
  --lunar-sidebar-width: 20rem; /* aside beside main */
  --lunar-layout-gap: var(--lunar-space-8); /* between page regions */
  --lunar-page-gutter: var(--lunar-space-4); /* page edge to content */
  --lunar-card-min-width: 18rem; /* card grid column before it wraps */
  --lunar-button-gap: calc(
    var(--lunar-space-1) / 2
  ); /* between grouped controls */
}
```

### Overriding it

The layout lives in its own `lunarcss-layout` cascade layer, declared after the theme's. Your own unlayered CSS overrides both, so you can keep the parts you want and replace the rest:

```css
body {
  max-width: none;
}
```

Sass users can compile it from source with `@use "pkg:@nikolaiwu/lunarcss/scss/layout";`.

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

| Token                | Used for                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| `--lunar-bg`         | Page background (built from `--lunar-light` / `--lunar-dark`)                                       |
| `--lunar-fg`         | Primary text (built from `--lunar-light` / `--lunar-dark`)                                          |
| `--lunar-border`     | Borders and dividers (built from `--lunar-light` / `--lunar-dark`)                                  |
| `--lunar-muted`      | Decoration: rules, brackets, ticks, stripes (built from `--lunar-light` / `--lunar-dark`)           |
| `--lunar-muted-text` | Secondary text: captions, dates, labels, placeholders (built from `--lunar-light` / `--lunar-dark`) |
| `--lunar-accent`     | Buttons, link underlines, checked controls, focus, the text caret                                   |
| `--lunar-success`    | Success state, a valid field's border, a meter in its optimum range                                 |
| `--lunar-warning`    | Warning state, a meter in its suboptimal range                                                      |
| `--lunar-error`      | Error state, an invalid field's border, a meter far from its optimum                                |
| `--lunar-info`       | Informational state                                                                                 |
| `--lunar-backdrop`   | Dim behind an open `<dialog>` (the page color at half opacity)                                      |

For the default values, see `src/scss/_config.scss`.

#### Muted colors

Two tokens follow your main colors automatically, both mixing the background color toward the text color: a bit darker than the background in light mode, a bit lighter in dark mode.

- `--lunar-muted` is for decoration (rules, brackets, list ticks, stripes), so it's kept light and doesn't compete with the content.
- `--lunar-muted-text` is for secondary text (captions, dates, table labels, `small`, placeholders). It goes further toward the text color, so it stays readable.

Adjust how far each one moves:

```css
:root {
  --lunar-muted-mix: 60%; /* decoration; default 50% */
  --lunar-muted-text-mix: 70%; /* text; default 65%; higher = more contrast */
}
```

With the default colors, muted text is about 4.6:1 in light mode and 5.4:1 in dark mode, which meets WCAG AA (4.5:1) for small text. Keep `--lunar-muted-text-mix` at `65%` or more, and if you change the main colors, check the contrast again.

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
  /* Font families (see Fonts for loading Space Grotesk / Space Mono) */
  --lunar-font-sans:
    "Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  --lunar-font-mono:
    "Space Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
    "Liberation Mono", monospace;

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
  --lunar-border-width: 1px;

  /* Radius */
  --lunar-radius-none: 0;
  --lunar-radius-sm: 0.125rem; /* 2px */
  --lunar-radius-md: 0.25rem; /* 4px */
  --lunar-radius-lg: 0.375rem; /* 6px */
  --lunar-radius-full: 9999px;
}
```

Text fields, textareas, selects, checkboxes, the color swatch, the range track and `details` use `--lunar-radius-md`, and the range thumb uses `--lunar-radius-sm`. Change the tokens to round or square them all at once. Cards, dialogs and buttons use [cut corners](#cut-corners) instead, and progress and meter stay square. To round something yourself:

```css
img {
  border-radius: var(--lunar-radius-lg);
}
```

### Transitions

```css
:root {
  --lunar-transition-fast: 150ms ease;
  --lunar-transition-base: 200ms ease;
  --lunar-transition-slow: 300ms ease;
  --lunar-transition-slower: 600ms ease;
}
```

### Z-Index

A scale for your own components; the theme doesn't set `z-index` itself.

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

### Controls

Form controls share one height, so a field, a button, a checkbox and a range line up in a row. The other control sizes are derived from it, so changing the control height or the tokens it's built from resizes them all together.

```css
:root {
  /* One line of base text, plus vertical padding and border (42px by default) */
  --lunar-control-height: calc(
    var(--lunar-text-base) * var(--lunar-leading-normal) +
      var(--lunar-space-2) * 2 + var(--lunar-border-width) * 2
  );

  /* Checkbox switch and radio */
  --lunar-checkbox-width: calc(var(--lunar-control-height) * 0.6);
  --lunar-checkbox-padding: var(--lunar-space-1);
  --lunar-radio-size: var(--lunar-checkbox-width);
  --lunar-radio-padding: var(--lunar-space-1);

  /* Range, progress and meter: the bar takes two thirds of the control
     height; the gap and the tick ruler below it share the rest */
  --lunar-bar-height: calc(var(--lunar-control-height) * 2 / 3);
  --lunar-bar-gap: var(--lunar-space-1);
  --lunar-bar-tick-height: calc(
    (
        var(--lunar-control-height) - var(--lunar-bar-height) -
          var(--lunar-bar-gap)
      ) *
      0.65
  );
  /* Between the bar's border and the fill or thumb inside it */
  --lunar-bar-inset: calc(var(--lunar-border-width) * 2);
  /* Track color where the browser has no bordered track to style (Firefox's
     progress and meter) */
  --lunar-bar-track: color-mix(
    in oklch,
    var(--lunar-bg) 85%,
    var(--lunar-muted)
  );
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
  --lunar-muted-mix: 65%; /* muted text at WCAG AA contrast */
}
```

### Use Custom Fonts

Load your font however you like (ideally self-hosted), then point the token at it:

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}

:root {
  --lunar-font-sans: "Inter", system-ui, sans-serif;
}
```

See [Fonts](#fonts) for the bundled Space Grotesk and Space Mono.

### Adjust Spacing

The spacing scale (`--lunar-space-1` to `--lunar-space-24`) sets every gap and padding. Change a step and everything built on it follows:

```css
:root {
  --lunar-space-4: 1.25rem; /* 20px instead of 16px */
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

### How LunarCSS stays out of your way

All LunarCSS styles live in a single [cascade layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) named `lunarcss`. In CSS, styles that aren't in any layer always beat layered styles, **whatever their specificity or load order**. So:

- **Your own CSS always wins.** `p { margin: 0 }` overrides the theme without extra specificity or `!important`.
- **Later layers win too.** Frameworks that use layers (like Tailwind v4) override the theme, whichever file loads first.

### With Tailwind CSS

**Tailwind v4** puts its utilities in layers, so they override LunarCSS automatically. Skip Tailwind's Preflight reset, which would strip LunarCSS's element styles, by importing only the theme and utilities:

```css
/* app.css */
@import "@nikolaiwu/lunarcss";
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
```

To make the order explicit, declare it once at the top. Later layers win:

```css
@layer lunarcss, theme, utilities;
```

**Tailwind v3** emits utilities without layers, so they already override LunarCSS. Set `corePlugins: { preflight: false }` to keep the theme's element styles.

### With Bootstrap

Bootstrap's CSS isn't layered, so it overrides LunarCSS completely, including its reset and component styles. LunarCSS then only fills in what Bootstrap doesn't style. Mixing two full design systems usually isn't worth it. Pick one, or use LunarCSS with a utility-only library.

```html
<link rel="stylesheet" href="lunarcss.min.css" />
<link rel="stylesheet" href="bootstrap.min.css" />
```

### With React/Vue/Svelte

Import LunarCSS in your entry point:

```javascript
// main.js or App.jsx
import "@nikolaiwu/lunarcss";
import "./your-styles.css"; // your styles override the theme, whatever the order
```

---

## Troubleshooting

### Styles Not Applying

1. **Your override isn't working?** Check whether your CSS is itself inside a `@layer`. Unlayered CSS always overrides LunarCSS, but a layered style only wins if its layer comes after `lunarcss` in the order. Declare the order with `@layer lunarcss, your-layer;`.
2. **LunarCSS isn't applying?** Unlayered CSS always wins over the theme, so any other reset or framework stylesheet (like Bootstrap, or Tailwind's Preflight) overrides it. Remove the conflicting reset.
3. **`!important` in the theme:** only the reduced-motion rules use it. Inside a layer, `!important` beats unlayered `!important`, so users who prefer reduced motion always get it.

### Dark Mode Not Working

1. **Check `data-theme` attribute**: To theme the whole page, put it on the `<html>` element. On any other element it only themes that element and its children.
2. **Check system preference**: Without `data-theme`, LunarCSS follows `prefers-color-scheme` via the `light-dark()` CSS function
3. **Browser support**: `light-dark()` requires a modern browser (Chrome 123+, Firefox 120+, Safari 17.5+). Older browsers don't fall back to either theme: the color tokens that use it are ignored, and those elements get browser default colors.

### Parts of a Form Still Look Native

LunarCSS restyles the controls themselves, the same in every supported browser:

- **Text fields, textareas and selects:** corner brackets that grow on focus, a tick ruler that slides in under the field, mono values and an accent caret. A select, and an input with a `<datalist>`, get the theme's chevron.
- **Checkboxes and radios:** a vertical switch whose knob slides up and fills with the accent; a circle that fills with an animated sweep.
- **Range, progress and meter:** a bar over a tick ruler. Progress and meter fill with stripes; the meter's color shows how its value sits against `low`, `high` and `optimum`.
- **Color:** the chosen color, masked to a droplet in a bordered chip.
- **Buttons:** cut corners and mono labels. Adjacent controls join into one group, dropping the cuts and rounded corners where they touch.
- **Number spinners, the date and time picker buttons and the file input's button** follow the theme too.

Parts the browser draws in its own layer can't be styled from CSS, so they keep the system look: the date and time picker panels, a select's dropdown list, a datalist's suggestions, and the file chooser dialog.

Fields flag themselves after you fill them in and move on: `:user-invalid` turns the border the error color, `:user-valid` turns the border the success color. Neither matches an untouched field, so an empty required field isn't red before it's been used.

### Print Styles

Printed pages always use the light theme: printing keeps the page's color scheme but drops its background, so dark mode would put light text on white paper. Code blocks wrap their long lines, and cards, figures, code blocks, quotes, table rows and images stay whole on one page where they fit, with headings kept with what follows.

Browsers leave out background colors and images when printing unless "Background graphics" is on, so the theme's decoration drawn with them (brackets, ticks, stripes, fills) drops out on paper. The content still reads without it. Add your own `@media print` rules for anything more. (The theme also respects `prefers-reduced-motion` by disabling animations and transitions.)

---

## Support

- **Documentation**: [github.com/nikolaiwu/lunarcss](https://github.com/nikolaiwu/lunarcss)
- **GitHub Issues**: [github.com/nikolaiwu/lunarcss/issues](https://github.com/nikolaiwu/lunarcss/issues)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
