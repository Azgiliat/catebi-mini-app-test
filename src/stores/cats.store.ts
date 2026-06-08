import { defineStore } from "pinia";
import { ref } from "vue";

import { loadCats } from "@/api/loadCats.ts";
import type { Cat } from "@/modules/adoption-list/types.ts";

export const useCatsStore = defineStore("cats", () => {
  const cats = ref<Cat[]>([]);

  async function load() {
    try {
      cats.value = await loadCats();
    } catch {
      cats.value = [];
    }
  }

  return {
    load,
    cats,
  };
});
