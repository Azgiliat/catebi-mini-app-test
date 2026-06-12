import { defineStore } from "pinia";
import { computed } from "vue";

import { useCatsCollection } from "@/common/composables/firestore/useCatsCollection.ts";

export const useCatsStore = defineStore("cats", () => {
  const { cats } = useCatsCollection();

  const availableColors = computed(
    () => new Set(cats.value.map((cat) => cat.color)),
  );

  return {
    cats,
    availableColors,
  };
});
