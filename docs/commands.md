# Commands

The repo uses pnpm, pinned via `packageManager` in `package.json`. `pnpm-workspace.yaml` holds `allowBuilds`, the allowlist of dependencies whose install scripts may run (esbuild and @parcel/watcher). Add a dependency there if it needs an install script.

- `pnpm dev`: Vite dev server on port 3000, serving the showcase page `src/index.html` with hot reload
- `pnpm build`: production build of the minified theme CSS and the showcase to `dist/`
- `pnpm build --mode development`: unminified build with sourcemaps
- `pnpm preview`: serve `dist/` on port 4173
- `pnpm format` / `pnpm format:check`: run Prettier over the repo with default settings (`.prettierrc` is `{}`). `dist/` and `pnpm-lock.yaml` are ignored. Run `pnpm format` after editing.
- `pnpm release:patch|minor|major`: runs `npm version`, which bumps `package.json`, commits and tags `vX.Y.Z`. It needs a clean tree. Pushing the tag runs `.github/workflows/release.yml`, which checks the tag matches `package.json`, publishes to npm through trusted publishing (no token) and creates a GitHub release. Don't push tags or publish without being asked.
- `npm pack --dry-run --ignore-scripts`: list exactly what would be published. If `dist/` files are missing from the list, the build didn't run — Vite empties `dist/` first.
