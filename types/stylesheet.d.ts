// The package's CSS entry points (the theme, fonts and layout) are imported
// for their side effect: `import "@nikolaiwu/lunarcss"`. Their exports point
// TypeScript here through the "types" condition, so it has a module to
// resolve the import to and doesn't flag it (noUncheckedSideEffectImports).
// Bundlers still load the CSS through "default". There's nothing to export.
export {};
