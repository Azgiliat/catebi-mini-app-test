import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { loadCats } from "@/api/loadCats.ts";
import type { Cat } from "@/modules/adoption/types.ts";

export const useCatsStore = defineStore("cats", () => {
  const cats = ref<Cat[]>([]);

  const availableColors = computed(
    () => new Set(cats.value.map((cat) => cat.color)),
  );

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
    availableColors,
  };
});
