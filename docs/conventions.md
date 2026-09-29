# Conventions

- Production SCSS (everything reachable from `main.scss`) uses **element selectors only, no classes**. Attribute selectors and pseudo-classes are fine.
- Each SCSS file starts with the `// ===` banner comment block and groups rules under `// ---` section headers. Match this style.
- When tokens in `_config.scss` change, update the variable reference and the customization examples in [USER-GUIDE.md](../USER-GUIDE.md) to match.
- One element per partial: when an element is restyled, it moves out of the shared file into its own `elements/_<element>.scss` (details and summary share one, since a summary only exists inside details; so do fieldset and legend). Load it from `main.scss` next to where its rules used to be, so the cascade order stays the same, and add it to the project structure in [CONTRIBUTING.md](../CONTRIBUTING.md).
