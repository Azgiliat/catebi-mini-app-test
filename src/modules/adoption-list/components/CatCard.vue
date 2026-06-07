<template>
  <article
    class="group overflow-hidden rounded-[10px] border border-gray-100 bg-white shadow-md transition-shadow duration-200 focus-within:shadow-lg hover:shadow-lg"
  >
    <div class="relative overflow-hidden bg-gray-100">
      <img
        class="aspect-square w-full object-cover"
        :src="cat.image"
        :alt="cat.name"
        loading="lazy"
      >
      <button
        class="absolute top-2 right-2 grid size-10 place-items-center rounded-full bg-white/90 text-gray-900 opacity-0 shadow-lg backdrop-blur transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
        type="button"
        :aria-label="
          cat.isLiked
            ? `Remove ${cat.name} from liked cats`
            : `Add ${cat.name} to liked cats`
        "
      >
        <Icon
          class="size-5"
          :class="
            cat.isLiked ? 'text-catebi fill-current' : 'fill-none text-gray-900'
          "
          name="heart"
          aria-hidden="true"
        />
      </button>
    </div>
    <div class="p-3">
      <h2 class="truncate text-lg leading-7 font-normal text-gray-900">
        {{ cat.name }}
      </h2>
      <p class="mt-1 flex items-center gap-2 text-sm leading-5 text-gray-600">
        <span>{{ cat.sex }}</span>
        <span class="text-base leading-none text-gray-400">&bull;</span>
        <span>{{ cat.age }}</span>
      </p>
      <div class="mt-2">
        <span
          class="bg-catebi-light text-catebi inline-flex max-w-full rounded-full px-3 py-1 text-xs leading-4"
        >
          {{ cat.color }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import Icon from "@/common/components/Icon.vue";

import type { Cat } from "../types";

defineProps<{
  cat: Cat;
}>();
</script>
