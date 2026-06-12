import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv, type Plugin } from "vite";
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

const webRoot = fileURLToPath(new URL(".", import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, webRoot, "");
  const firebaseFunctionsProjectId =
    env.VITE_FIREBASE_PROJECT_ID || "catebydemo";
  const firebaseFunctionsRegion =
    env.VITE_FIREBASE_FUNCTIONS_REGION || "us-central1";
  const firebaseFunctionsBasePath = `/${firebaseFunctionsProjectId}/${firebaseFunctionsRegion}`;
  const firebaseFunctionsRoutes: Record<string, string> = {
    "/api/auth/telegram": `${firebaseFunctionsBasePath}/telegramAuth`,
  };

  return {
    envDir: webRoot,
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
          target: "http://127.0.0.1:5001",
          changeOrigin: true,
          rewrite(path) {
            const [pathname, search] = path.split("?");
            const functionPath = firebaseFunctionsRoutes[pathname];

            if (!functionPath) {
              return path;
            }

            return search ? `${functionPath}?${search}` : functionPath;
          },
        },
      },
    },
  };
});
