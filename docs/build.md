# Build

Vite root is `src/` ([vite.config.js](../vite.config.js)), with five Rollup inputs:

| Input                  | Output                                                 |
| ---------------------- | ------------------------------------------------------ |
| `src/scss/main.scss`   | the distributed theme                                  |
| `src/scss/fonts.scss`  | the optional fonts stylesheet                          |
| `src/scss/layout.scss` | the optional layout stylesheet                         |
| `src/index.html`       | the showcase (element reference, with source previews) |
| `src/demo.html`        | the Acme Robotics demo page                            |

- `base: "./"` keeps asset URLs relative, so the fonts CSS works from any CDN path.
- A custom `assetFileNames` names each stylesheet `dist/<name>.min.css` in production and `dist/<name>.css` in development, and writes font files to `dist/fonts/` without hashes. It matches on `lunarcss.css`, because Vite names the asset after the input key, not the source file. `package.json` (`style`, `exports`, `files`), the docs' CDN URLs and the release workflow all depend on the `.min.css` names.
- The `banner()` plugin adds `/*! LunarCSS vX.Y.Z … */` after `@charset`, which must stay the first statement. `fontLicenses()` copies the OFL license texts into `dist/fonts/`.
