import { computed, Ref, toRefs } from "vue";

import { useLikesStore } from "@/stores/likes.store.ts";

export const useLikeCat = (catId: Ref<string>) => {
  const likesStore = useLikesStore();
  const { likes } = toRefs(likesStore);

  const isCatLiked = computed(() => {
    return likes.value.has(catId.value);
  });

  function onLikeClick() {
    if (isCatLiked.value) {
      likesStore.unlikeCat(catId.value);
    } else {
      likesStore.likeCat(catId.value);
    }
  }

  return {
    isCatLiked,
    onLikeClick,
  };
};
