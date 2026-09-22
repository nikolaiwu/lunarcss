# Layout

The theme itself has **no layout rules** — it styles elements, never places them. Page structure lives in the optional [src/scss/layout.scss](../src/scss/layout.scss), loaded after the theme.

- Structure only: widths, spacing, flex/grid and alignment, selected structurally — `body` shell, `body > header` with a nav, `nav > ul`, `main` + `aside` sidebar (either order), `body > footer`, the card grid, and button/input groups.
- Its tokens (`--lunar-page-width`, `--lunar-sidebar-width`, `--lunar-layout-gap`, `--lunar-page-gutter`, `--lunar-card-min-width`, `--lunar-button-gap`) are defined there, not in `_config.scss`.
- Both demo pages link it.
