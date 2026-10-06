# Layout

The theme itself has **no layout rules** — it styles elements, never places them. Page structure lives in the optional [src/scss/layout.scss](../src/scss/layout.scss), loaded after the theme.

- Structure only: widths, spacing, flex/grid and alignment, selected structurally — `body` shell, `body > header` with a nav, `nav > ul` (which also turns off the theme's bullet ticks), `main` + `aside` sidebar (either order), `body > footer`, the card grid, and button/input groups.
- Sticky footer: on screen, `body` has `min-height: 100dvh` (with a `100vh` fallback) and `body > footer` is `position: sticky; top: 100vh`. The footer wants to sit a window below its place, and the body stops it at its own end, the bottom of the window, so a short page's footer sits at the bottom while a long page's doesn't move. It needs no knowledge of the shell's display or rows, so it works for the block shell and the sidebar grid alike. An ancestor with `overflow` other than `visible` would break it.
- Its tokens (`--lunar-page-width`, `--lunar-sidebar-width`, `--lunar-layout-gap`, `--lunar-page-gutter`, `--lunar-card-min-width`, `--lunar-button-gap`) are defined there, not in `_config.scss`.
- Both demo pages link it.
