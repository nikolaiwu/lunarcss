# Fonts

The theme never downloads fonts. `--lunar-font-sans` and `--lunar-font-mono` start with "Space Grotesk" and "Space Mono", then fall back to system stacks.

- The optional [src/scss/fonts.scss](../src/scss/fonts.scss) generates woff2-only `@font-face` rules for each unicode subset, pointing at the Fontsource devDependencies (`@fontsource-variable/space-grotesk`, `@fontsource/space-mono`). Vite resolves and copies those files.
- The Grotesk family is declared as plain "Space Grotesk", not Fontsource's "Space Grotesk Variable", so it matches the token stack.
- No Google Fonts or other remote font URLs, anywhere.
- The release workflow attaches a zip of all three stylesheets plus `fonts/`.
