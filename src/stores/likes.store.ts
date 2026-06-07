import { defineStore } from "pinia";
import { ref } from "vue";

export const useLikesStore = defineStore("likes", () => {
  const isLikesLoaded = ref(false);
  const likes = ref(new Set<string>([]));

  window.Telegram.WebApp.CloudStorage.getItem("likes", (error, cloudValue) => {
    if (!error && cloudValue) {
      likes.value = new Set(JSON.parse(cloudValue));
      isLikesLoaded.value = true;
    }
  });

  function syncLikes() {
    window.Telegram.WebApp.CloudStorage.setItem(
      "likes",
      JSON.stringify(Array.from(likes.value)),
    );
  }

  function likeCat(catId: string) {
    likes.value.add(catId);
    syncLikes();
  }

  function unlikeCat(catId: string) {
    likes.value.delete(catId);
    syncLikes();
  }

  return {
    likes,
    likeCat,
    unlikeCat,
  };
});
