<script setup lang="ts">
import { computed, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";

import PrimaryButton from "@/common/components/PrimaryButton.vue";
import CatProfile from "@/modules/adoption/components/CatProfile.vue";
import { ADOPTION_ROUTE_NAMES } from "@/modules/adoption/route-names.ts";
import { useCatsStore } from "@/stores/cats.store.ts";

const route = useRoute();
const router = useRouter();

const { cats } = toRefs(useCatsStore());

const cat = computed(() => {
  return cats.value.find((cat) => cat.id === route.params.catId);
});
</script>

<template>
  <CatProfile
    v-if="cat"
    :cat="cat"
  />
  <section
    v-else
    class="flex flex-col px-4 py-8 text-center text-gray-600"
  >
    <p>{{ $t("adoption.catNotFound") }}</p>
    <PrimaryButton
      class="mt-6 w-full"
      type="button"
      @click="router.push({ name: ADOPTION_ROUTE_NAMES.ADOPTION })"
    >
      {{ $t("adoption.backToCats") }}
    </PrimaryButton>
  </section>
</template>
