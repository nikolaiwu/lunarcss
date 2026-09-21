# Cascade layers

`main.scss` sets the cascade order and wraps everything in `@layer lunarcss { … }`, so unlayered user CSS and later layers (e.g. Tailwind v4 utilities) always override the theme, regardless of specificity.

- `@use` can't go inside `@layer`, so partials are loaded with `@include meta.load-css("…")`, in the order config → themes → reset → base → elements, then `base/forced-colors` last so it overrides the element rules. Every new partial must be added there.
- Don't emit theme CSS outside the layer, and don't rely on specificity or `!important` to beat user styles.
- `layout.scss` has its own `@layer lunarcss-layout`, declared after the theme's so it wins. `fonts.scss` (only `@font-face`) and `showcase.scss` are not layered.
