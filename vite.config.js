import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import macrosPlugin from "vite-plugin-babel-macros";
import { viteExternalsPlugin } from "vite-plugin-externals";

const externals = {
  http: "http-browserify",
  https: "http-browserify",
  timers: "timers-browserify",
  electron: "electron",
  "electron-fetch": "electron-fetch",
};

const nodeShims = {
  util: "util",
};

/**
 * Externals:
 * - node externals are required because web3 are terribly bundled and some of them use commonjs libraries.  modern libs like ethers help with this.
 * - electron:  added due to ipfs-http-client.  it has very poor esm compatibility and a ton of dependency bugs. see: https://github.com/ipfs/js-ipfs/issues/3452
 */
const externalPlugin = viteExternalsPlugin({
  ...externals,
  ...(isDev ? { ...nodeShims } : {}),
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), macrosPlugin(), externalPlugin],
  build: {
    sourcemap: true,
    commonjsOptions: {
      include: /node_modules/,
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  esbuild: {
    jsxFactory: "jsx",
    jsxInject: `import {jsx, css} from '@emotion/react'`,
  },
  define: {},
  optimizeDeps: {
    exclude: excludeDeps,
  },
  resolve: {
    preserveSymlinks: true,
    mainFields: ["module", "main", "browser"],
    alias: {
      "~~": resolve(__dirname, "src"),
      ...externals,
      ...nodeShims,
      process: "process",
      stream: "stream-browserify",
    },
  },
  server: {
    watch: {
      followSymlinks: true,
    },
    fs: {
      // compatability for yarn workspaces
      allow: ["../../"],
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
