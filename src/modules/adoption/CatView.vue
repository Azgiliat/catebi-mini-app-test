<script setup lang="ts">
import { computed, toRefs } from "vue";
import { useRoute } from "vue-router";

import { useCatsStore } from "@/stores/cats.store.ts";

const route = useRoute();
const { cats } = toRefs(useCatsStore());

const cat = computed(() => {
  return cats.value.find((cat) => cat.name === route.params.cat);
});
</script>

<template>
  <section v-if="cat">
    <div
      class="bg-catebi-light flex max-h-96 flex-col items-center justify-center"
    >
      <img
        class="block min-h-0"
        :alt="cat.name"
        :src="cat.image"
      />
    </div>
    <div class="p-4">
      <h2 class="mb-4 text-3xl font-light text-gray-900">
        {{ cat.name }}
      </h2>
      <div class="mb-4 flex justify-between gap-3">
        <div class="grow rounded-l bg-gray-50 p-3">
          <h3>{{ $t("sex.label") }}</h3>
          {{ $t(`sex.${cat.sex}`) }}
        </div>
        <div class="grow rounded-l bg-gray-50 p-3">
          <h3>{{ $t("age.label") }}</h3>
          {{ $t(cat.age) }}
        </div>
      </div>
      <div class="">
        <h3 class="text-xl font-normal text-gray-900">
          {{ $t("adoption.about") }}
        </h3>
        <p>
          {{ cat.about }}
        </p>
      </div>
    </div>
  </section>
</template>
