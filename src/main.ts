import "../theme.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import { createAppI18n } from "./i18n";
import { router } from "./router";

if (import.meta.env.DEV) {
  const { installTelegramMock } = await import("../plugins/telegram-mock");

  await installTelegramMock();
}

createApp(App)
  .use(createPinia())
  .use(createAppI18n())
  .use(router)
  .mount("#app");
