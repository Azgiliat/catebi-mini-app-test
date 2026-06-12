<template>
  <article
    class="relative overflow-hidden rounded-[10px] border border-gray-100 bg-white shadow-md transition-shadow duration-200 focus-within:shadow-lg hover:shadow-lg"
  >
    <router-link
      :to="{
        name: ADOPTION_ROUTE_NAMES.CAT,
        params: {
          catId: cat.id,
        },
      }"
      class="absolute inset-0 z-10 rounded-[10px]"
      :aria-label="cat.name"
    />
    <div class="overflow-hidden bg-gray-100">
      <img
        class="aspect-square w-full object-cover"
        :src="cat.image"
        :alt="cat.name"
        loading="lazy"
      />
    </div>
    <div class="p-3">
      <div class="flex items-center gap-2">
        <h2 class="truncate text-lg leading-7 font-normal text-gray-900">
          {{ cat.name }}
        </h2>
        <button
          class="relative z-20 ml-auto block size-5 min-w-5"
          type="button"
          :aria-label="
            isCatLiked
              ? t('catCard.removeFromLikedAriaLabel', { name: cat.name })
              : t('catCard.addToLikedAriaLabel', { name: cat.name })
          "
          @click="onLikeClick()"
        >
          <AppIcon
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
        <span>{{ formattedAge }}</span>
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
import { toRef } from "vue";
import { useI18n } from "vue-i18n";

import AppIcon from "@/common/components/AppIcon.vue";
import { useLikeCat } from "@/common/composables/useLikeCat.ts";
import { useFormattedCatAge } from "@/modules/adoption/composables/useFormattedCatAge.ts";
import { ADOPTION_ROUTE_NAMES } from "@/modules/adoption/route-names.ts";
import type { Cat } from "@/modules/adoption/types.ts";

const props = defineProps<{
  cat: Cat;
}>();

const { t } = useI18n();

const { formattedAge } = useFormattedCatAge(() => props.cat.birthDate);
const { isCatLiked, onLikeClick } = useLikeCat(toRef(() => props.cat.id));
</script>
