# Tokens and theming

Theming uses CSS `light-dark()`, not duplicated variable sets. All color tokens live in [src/scss/\_config.scss](../src/scss/_config.scss) on `:root` with `color-scheme: light dark`. `themes/_light.scss` and `themes/_dark.scss` only set `color-scheme` under `[data-theme="light"|"dark"]` to force a mode. To add or change colors, edit `_config.scss`; don't add per-theme overrides.

Public tokens use the `--lunar-*` prefix (`--lunar-bg`, `--lunar-fg`, `--lunar-accent`, `--lunar-muted`, `--lunar-border`, the status colors, plus the typography, spacing, radius, transition and control scales). Color layers:

1. `--color-*` primitives hold raw values and are referenced only by `--lunar-light` and `--lunar-dark` in `_config.scss`.
2. `--lunar-light` and `--lunar-dark` are the main colors, used by `--lunar-bg`, `--lunar-fg`, `--lunar-border`, `--lunar-muted` and element styles. Derived colors are computed at runtime with CSS `color-mix(in oklch, …)`, not Sass, so user overrides of the main colors carry through. `--lunar-muted` mixes the background toward the text color by `--lunar-muted-mix` (default 60%).
3. Semantic tokens such as `--lunar-bg` and `--lunar-fg`.

Element styles should use `var(--lunar-*)` and never `--color-*` or hard-coded values. The docs deliberately don't list default color values; they tell users to override `--lunar-light` and `--lunar-dark`.
