import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig, type Plugin } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

import { svgSpritePlugin } from "./plugins/svg-sprite.ts";

const telegramWebAppScriptPlugin = (): Plugin => ({
  name: "telegram-web-app-script",
  transformIndexHtml(html) {
    return html.replace(
      "</head>",
      '    <script src="https://telegram.org/js/telegram-web-app.js"></script>\n  </head>',
    );
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: process.env.GITHUB_PAGES === "true" ? "/catebi-mini-app-test/" : "/",
  plugins: [
    mode === "production" && telegramWebAppScriptPlugin(),
    svgSpritePlugin(),
    tailwindcss(),
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
    },
  },
}));
