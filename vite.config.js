import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";
import { demoSource } from "./vite/demo-source.js";

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8"),
);

// Prepends a license/version banner to the theme CSS (`/*!` survives minification)
function banner() {
  const header = `LunarCSS v${pkg.version} | ${pkg.license} License | ${pkg.homepage}`;
  const banners = {
    lunarcss: `/*! ${header} */\n`,
    "lunarcss-fonts": `/*! ${header} | Fonts: Space Grotesk, Space Mono (SIL OFL 1.1, see fonts/) */\n`,
    "lunarcss-layout": `/*! ${header} | Optional layout */\n`,
  };

  return {
    name: "lunarcss-banner",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        const match =
          file.type === "asset" &&
          file.fileName.match(/^(lunarcss(?:-fonts|-layout)?)(?:\.min)?\.css$/);
        if (match) {
          // @charset must stay the very first statement, so insert after it
          const source = String(file.source);
          const charset = source.match(/^@charset "[^"]*";\s*/)?.[0] ?? "";
          file.source =
            charset + banners[match[1]] + source.slice(charset.length);
        }
      }
    },
  };
}

// The SIL OFL requires the license to travel with the font files
function fontLicenses() {
  const licenses = {
    "fonts/LICENSE-SpaceGrotesk.txt":
      "node_modules/@fontsource-variable/space-grotesk/LICENSE",
    "fonts/LICENSE-SpaceMono.txt":
      "node_modules/@fontsource/space-mono/LICENSE",
  };

  return {
    name: "lunarcss-font-licenses",
    apply: "build",
    generateBundle() {
      for (const [fileName, from] of Object.entries(licenses)) {
        this.emitFile({
          type: "asset",
          fileName,
          source: readFileSync(resolve(__dirname, from), "utf-8"),
        });
      }
    },
  };
}

// Adds the Cloudflare Web Analytics beacon to the built pages, only when
// CF_ANALYTICS_TOKEN is set: the Pages deploy sets it, so local builds, `pnpm
// dev` and the npm release stay clean. The token is public by design (it ends
// up in the page source). The stylesheets have no HTML, so they're untouched.
//
// With the beacon comes a line saying so, in place of the
// <!-- analytics-notice --> comment in each page's footer, so the notice shows
// exactly where the beacon does. Without a token the comment is just removed.
function analytics() {
  const token = process.env.CF_ANALYTICS_TOKEN;
  const marker = "<!-- analytics-notice -->";
  const notice =
    "<p><small>Visits are counted with Cloudflare Web Analytics: no cookies, no personal data.</small></p>";

  return {
    name: "lunarcss-analytics",
    apply: "build",
    transformIndexHtml(html) {
      if (!token) return html.replace(marker, "");

      // Written out rather than passed as a tag descriptor: Vite serializes
      // attribute values with JSON.stringify, which would backslash-escape the
      // JSON's quotes, and HTML has no backslash escapes. Single quotes around
      // the attribute leave the JSON intact, as in Cloudflare's own snippet.
      const beacon = `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${JSON.stringify({ token })}'></script>`;

      return html
        .replace(marker, notice)
        .replace("</body>", `${beacon}\n</body>`);
    },
  };
}

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    root: "src",
    // Relative asset URLs, so the fonts stylesheet finds fonts/ from any host or CDN path
    base: "./",
    plugins: [banner(), fontLicenses(), analytics(), demoSource()],
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
      // Never inline fonts as data URIs; keep them as separate, cacheable files
      assetsInlineLimit: 0,

      rollupOptions: {
        input: {
          // Main theme entry (production output)
          lunarcss: resolve(__dirname, "src/scss/main.scss"),
          // Optional self-hosted fonts
          "lunarcss-fonts": resolve(__dirname, "src/scss/fonts.scss"),
          // Optional page layout
          "lunarcss-layout": resolve(__dirname, "src/scss/layout.scss"),
          // Showcase page (for preview site)
          index: resolve(__dirname, "src/index.html"),
          // Acme demo: the theme used on a realistic page, no classes
          demo: resolve(__dirname, "src/demo.html"),
        },
        output: {
          assetFileNames: (assetInfo) => {
            // Output CSS with proper naming
            if (assetInfo.name?.endsWith(".css")) {
              // Name the main theme CSS appropriately
              // (Vite names it after the `lunarcss` input key, not the source file)
              if (
                assetInfo.name === "lunarcss.css" ||
                assetInfo.name === "lunarcss-fonts.css" ||
                assetInfo.name === "lunarcss-layout.css"
              ) {
                return isProduction ? "[name].min.css" : "[name].css";
              }
              return "[name].[ext]";
            }
            // Stable font names: the package version in the CDN URL busts caches
            if (/\.woff2?$/.test(assetInfo.name ?? "")) {
              return "fonts/[name][extname]";
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
