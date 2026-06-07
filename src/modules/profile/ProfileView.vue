<template>
  <section class="px-4 py-4">
    <h1 class="text-2xl leading-8 font-medium text-gray-800">Profile</h1>
    <div class="mt-4 rounded border border-gray-200 bg-white p-4">
      <div class="flex items-center gap-3">
        <div
          class="bg-catebi-light text-catebi grid size-14 place-items-center rounded-full text-xl font-semibold"
        >
          <img
            :src="imageUrl"
            :alt="name"
            class="size-full rounded-full"
          />
        </div>
        <div>
          <p class="text-lg leading-7 text-gray-900">
            {{ name }} {{ surname }}
          </p>
        </div>
      </div>
    </div>
    <div class="mt-4 rounded border border-gray-200 bg-white">
      <div
        v-for="item in profileItems"
        :key="item.label"
        class="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0"
      >
        <span class="text-sm leading-5 text-gray-700">{{ item.label }}</span>
        <span class="text-sm leading-5 text-gray-900">{{ item.value }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";

import { useLikesStore } from "@/stores/likes.store.ts";
import { useUserStore } from "@/stores/user.store.ts";

const { name, surname, imageUrl } = toRefs(useUserStore());
const { likes } = toRefs(useLikesStore());

const profileItems = computed(() => [
  { label: "Liked cats", value: Array.from(likes.value).join(", ") },
  { label: "Applications", value: "1 active" },
]);
</script>
