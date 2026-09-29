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
- `base: "./"` is also what lets the site work from GitHub Pages' `/lunarcss/` subpath. [.github/workflows/pages.yml](../.github/workflows/pages.yml) builds and deploys `dist/` there on every `v*` tag (next to the npm release, so the site shows the published theme) or by hand from the Actions tab. It deploys through the `github-pages` environment, which needs a `v*` tag rule to accept tag deploys.
- The `analytics()` plugin adds the Cloudflare Web Analytics beacon (a deferred script at the end of `<body>`) to the built pages, only when `CF_ANALYTICS_TOKEN` is set. The Pages workflow passes it from a GitHub variable (`vars.CF_ANALYTICS_TOKEN`, on the `github-pages` environment or the repository), so local builds, `pnpm dev` and the npm release get no beacon. The token is public by design; the stylesheets have no HTML, so they're unaffected. It also swaps the `<!-- analytics-notice -->` comment in each page's footer for a line disclosing the analytics, so the notice appears exactly where the beacon does (without a token, the comment is just removed).
- The `banner()` plugin adds `/*! LunarCSS vX.Y.Z … */` after `@charset`, which must stay the first statement. `fontLicenses()` copies the OFL license texts into `dist/fonts/`.
