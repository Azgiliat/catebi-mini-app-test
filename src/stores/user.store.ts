import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const name = window.Telegram.WebApp.initDataUnsafe.user.first_name;
  const surname = window.Telegram.WebApp.initDataUnsafe.user.last_name;
  const imageUrl = window.Telegram.WebApp.initDataUnsafe.user.photo_url;

  const language = ref(
    window.Telegram.WebApp.initDataUnsafe.user.language_code,
  );

  return {
    name,
    surname,
    imageUrl,
    language,
  };
});
