# Publishing and versioning

The package is `@nikolaiwu/lunarcss`, because unscoped `lunarcss` is taken on npm.

- **Shipped:** `dist/lunarcss.min.css`, `dist/lunarcss-fonts.min.css`, `dist/lunarcss-layout.min.css`, `dist/fonts/`, `types/stylesheet.d.ts`, and `src/scss` — except `fonts.scss`, `showcase.scss` and `showcase/`. The built pages are not shipped.
- **Sass users:** `exports["./scss"]` and `exports["./scss/layout"]` let them `@use "pkg:@nikolaiwu/lunarcss/scss"` with the Node package importer (a bare path without `pkg:` does not resolve), so SCSS partials must keep resolving from their entry with relative paths. `fonts.scss` is excluded because its `@font-face` URLs only resolve inside this repo's Vite build.
- **TypeScript:** the three CSS exports are conditional: `types` points at `types/stylesheet.d.ts` (an empty module) and `default` at the stylesheet. Without it, TypeScript's `noUncheckedSideEffectImports` flags `import "@nikolaiwu/lunarcss"` (TS2882), since it doesn't treat a `.css` file as a module and a bare package name doesn't match a `*.css` wildcard declaration. Bundlers ignore the `types` condition. A top-level `types` field covers old resolvers that ignore `exports`.
- **CDNs:** jsDelivr and unpkg serve straight from npm.
- **Versioning:** SemVer, with CHANGELOG.md in Keep a Changelog format. Removing or renaming a `--lunar-*` token, changing which elements a rule targets, or moving a rule between the theme and the optional stylesheets is a breaking change (minor bump while below 1.0). Add user-facing changes under `[Unreleased]`.
