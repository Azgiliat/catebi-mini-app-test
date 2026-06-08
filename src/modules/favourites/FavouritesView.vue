<template>
  <section class="px-4 pt-4 pb-20">
    <div>
      <div class="flex items-center gap-3">
        <Icon
          class="fill-catebi text-catebi aspect-square w-7 shrink-0"
          name="heart"
          aria-hidden="true"
        />
        <h1 class="text-2xl leading-8 font-normal text-gray-900">
          {{ t("favourites.title") }}
        </h1>
      </div>
      <p class="mt-2 text-base leading-6 text-gray-600">
        {{ t("favourites.subtitle") }}
      </p>
    </div>

    <p class="mt-6 text-sm leading-5 text-gray-600">
      {{ t("favourites.catsInFavourites", { count: likedCats.length }) }}
    </p>

    <div
      v-if="likedCats.length > 0"
      class="mt-3 grid grid-cols-2 gap-x-4 gap-y-4"
    >
      <CatCard
        v-for="cat in likedCats"
        :key="cat.name"
        :cat="cat"
      />
    </div>

    <div
      v-else
      class="mt-3 rounded-[10px] border border-gray-100 bg-white p-4 text-sm leading-5 text-gray-600 shadow-md"
    >
      {{ t("favourites.empty") }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import { useI18n } from "vue-i18n";

import CatCard from "@/common/components/CatCard.vue";
import Icon from "@/common/components/Icon.vue";
import { useCatsStore } from "@/stores/cats.store.ts";
import { useLikesStore } from "@/stores/likes.store.ts";

const { t } = useI18n();
const catsStore = useCatsStore();
const { likes } = toRefs(useLikesStore());

const likedCats = computed(() =>
  catsStore.cats.filter((cat) => likes.value.has(cat.name)),
);
</script>
