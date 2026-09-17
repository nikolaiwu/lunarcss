# Publishing and versioning

The package is `@nikolaiwu/lunarcss`, because unscoped `lunarcss` is taken on npm.

- **Shipped:** `dist/lunarcss.min.css`, `dist/lunarcss-fonts.min.css`, `dist/lunarcss-layout.min.css`, `dist/fonts/`, and `src/scss` — except `fonts.scss`, `showcase.scss` and `showcase/`. The built pages are not shipped.
- **Sass users:** `exports["./scss"]` and `exports["./scss/layout"]` let them `@use "pkg:@nikolaiwu/lunarcss/scss"` with the Node package importer (a bare path without `pkg:` does not resolve), so SCSS partials must keep resolving from their entry with relative paths. `fonts.scss` is excluded because its `@font-face` URLs only resolve inside this repo's Vite build.
- **CDNs:** jsDelivr and unpkg serve straight from npm.
- **Versioning:** SemVer, with CHANGELOG.md in Keep a Changelog format. Removing or renaming a `--lunar-*` token, changing which elements a rule targets, or moving a rule between the theme and the optional stylesheets is a breaking change (minor bump while below 1.0). Add user-facing changes under `[Unreleased]`.
