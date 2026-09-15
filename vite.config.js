import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8"),
);

// Prepends a license/version banner to the theme CSS (`/*!` survives minification)
function banner() {
  const text = `/*! LunarCSS v${pkg.version} | ${pkg.license} License | ${pkg.homepage} */\n`;

  return {
    name: "lunarcss-banner",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (
          file.type === "asset" &&
          /^lunarcss(\.min)?\.css$/.test(file.fileName)
        ) {
          // @charset must stay the very first statement, so insert after it
          const source = String(file.source);
          const charset = source.match(/^@charset "[^"]*";\s*/)?.[0] ?? "";
          file.source = charset + text + source.slice(charset.length);
        }
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    root: "src",
    plugins: [banner()],
    publicDir: "../public",

    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },

    build: {
      outDir: "../dist",
      emptyOutDir: true,
      sourcemap: !isProduction,
      minify: isProduction ? "esbuild" : false,

      rollupOptions: {
        input: {
          // Main theme entry (production output)
          lunarcss: resolve(__dirname, "src/scss/main.scss"),
          // Showcase page (for preview site)
          index: resolve(__dirname, "src/index.html"),
        },
        output: {
          assetFileNames: (assetInfo) => {
            // Output CSS with proper naming
            if (assetInfo.name?.endsWith(".css")) {
              // Name the main theme CSS appropriately
              // (Vite names it after the `lunarcss` input key, not the source file)
              if (assetInfo.name === "lunarcss.css") {
                return isProduction ? "lunarcss.min.css" : "lunarcss.css";
              }
              return "[name].[ext]";
            }
            return "assets/[name]-[hash][extname]";
          },
        },
      },

      cssMinify: isProduction,
    },

    server: {
      port: 3000,
      open: true,
      watch: {
        usePolling: false,
      },
    },

    preview: {
      port: 4173,
      open: true,
    },
  };
});
