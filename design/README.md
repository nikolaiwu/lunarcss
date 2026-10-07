# Design tools

Generators for the images around LunarCSS and the templates built on it: social preview cards, promo images and icons. They're kept here, versioned with the theme, so they can follow the theme's look, and so the templates themselves ship minimal.

Nothing in `design/` is part of the npm package (it isn't in `files`).

| Folder                             | For                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [lunarcss-theme/](lunarcss-theme/) | The theme's own site: its social card and before/after image                                                  |
| [lunar-blog/](lunar-blog/)         | [Lunar Blog](https://github.com/nikolaiwu/lunar-blog), the Astro blog starter: its social card and touch icon |

Each folder has a README with what its tools make, how to run them and what to update when the theme changes. A new template gets its own folder, named like its repo. See [docs/templates.md](../docs/templates.md).

## Shared conventions

- No dependencies beyond plain Python 3, Node and a shell, so nothing has to be installed to run them.
- Shapes are drawn from the theme's real geometry and colours, worked out ahead of time (OKLCH mixes included), so the images match the theme pixel for pixel. When the theme's look changes, update the numbers and regenerate.
- Lines are snapped to whole pixels so a 1× export stays crisp, and there are no `<pattern>` fills, which Figma drops on import.
- Rendering to PNG uses headless Chrome. `CHROME` overrides the browser path, which defaults to the macOS one.
- A template's tools find its checkout next to this repo (`../lunar-blog` and so on), or wherever an environment variable points.
