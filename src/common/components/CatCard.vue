<template>
  <article
    class="group overflow-hidden rounded-[10px] border border-gray-100 bg-white shadow-md transition-shadow duration-200 focus-within:shadow-lg hover:shadow-lg"
  >
    <router-link
      :to="{
        name: ADOPTION_ROUTE_NAMES.CAT,
        params: {
          cat: cat.name,
        },
      }"
      class="relative overflow-hidden bg-gray-100"
    >
      <img
        class="aspect-square w-full object-cover"
        :src="cat.image"
        :alt="cat.name"
        loading="lazy"
      />
    </router-link>
    <div class="p-3">
      <div class="flex items-center gap-2">
        <h2 class="truncate text-lg leading-7 font-normal text-gray-900">
          {{ cat.name }}
        </h2>
        <button
          class="ml-auto block size-5 min-w-5"
          type="button"
          :aria-label="
            isCatLiked
              ? t('catCard.removeFromLikedAriaLabel', { name: cat.name })
              : t('catCard.addToLikedAriaLabel', { name: cat.name })
          "
          @click="onLikeClick()"
        >
          <Icon
            class="size-full"
            :class="
              isCatLiked ? 'text-catebi fill-catebi' : 'fill-none text-gray-400'
            "
            name="heart"
            aria-hidden="true"
          />
        </button>
      </div>
      <p class="mt-1 flex items-center gap-2 text-sm leading-5 text-gray-600">
        <span>{{ t(`sex.${cat.sex}`) }}</span>
        <span class="text-base leading-none text-gray-400">&bull;</span>
        <span>{{ t(cat.age) }}</span>
      </p>
      <div class="mt-2">
        <span
          class="bg-catebi-light text-catebi inline-flex max-w-full rounded-full px-3 py-1 text-xs leading-4"
        >
          {{ t(cat.color) }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import { useI18n } from "vue-i18n";

import Icon from "@/common/components/Icon.vue";
import { ADOPTION_ROUTE_NAMES } from "@/modules/adoption/route-names.ts";
import { useLikesStore } from "@/stores/likes.store.js";

import type { Cat } from "../../modules/adoption/types";

const props = defineProps<{
  cat: Cat;
}>();

const { t } = useI18n();
const likesStore = useLikesStore();
const likes = toRef(() => likesStore.likes);

const isCatLiked = computed(() => likes.value.has(props.cat.name));

function onLikeClick() {
  if (isCatLiked.value) {
    likesStore.unlikeCat(props.cat.name);
  } else {
    likesStore.likeCat(props.cat.name);
  }
}
</script>
