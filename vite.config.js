import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    root: 'src',
    publicDir: '../public',

    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },

    build: {
      outDir: '../dist',
      emptyOutDir: true,
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,

      rollupOptions: {
        input: {
          // Main theme entry (production output)
          lunarcss: resolve(__dirname, 'src/scss/main.scss'),
          // Showcase page (for preview site)
          index: resolve(__dirname, 'src/index.html'),
        },
        output: {
          assetFileNames: (assetInfo) => {
            // Output CSS with proper naming
            if (assetInfo.name?.endsWith('.css')) {
              // Name the main theme CSS appropriately
              if (assetInfo.name === 'main.css') {
                return isProduction ? 'lunarcss.min.css' : 'lunarcss.css';
              }
              return '[name].[ext]';
            }
            return 'assets/[name]-[hash][extname]';
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
