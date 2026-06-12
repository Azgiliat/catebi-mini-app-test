<script setup lang="ts">
import { toRef } from "vue";
import { useRouter } from "vue-router";

import AppIcon from "@/common/components/AppIcon.vue";
import PrimaryButton from "@/common/components/PrimaryButton.vue";
import { useAdoptionApplicationsCollection } from "@/common/composables/firestore/useAdoptionApplicationsCollection.ts";
import { useLikeCat } from "@/common/composables/useLikeCat.ts";
import { useFormattedCatAge } from "@/modules/adoption/composables/useFormattedCatAge.ts";
import type { Cat } from "@/modules/adoption/types.ts";

const props = defineProps<{
  cat: Cat;
}>();

const router = useRouter();
const catId = toRef(() => props.cat.id);

const { formattedAge } = useFormattedCatAge(() => props.cat.birthDate);
const { isCatLiked, onLikeClick } = useLikeCat(catId);
const { submitAdoptionApplication, adoptionApplications } =
  useAdoptionApplicationsCollection();

function adoptCat() {
  submitAdoptionApplication({
    catId: catId.value,
  });
}
</script>

<template>
  <section>
    {{ adoptionApplications }}
    <div
      class="bg-catebi-light relative flex max-h-96 min-h-40 flex-col items-center justify-center"
    >
      <button
        type="button"
        class="absolute top-4 left-4 rounded-full bg-white/90 p-2"
        @click="router.back()"
      >
        <AppIcon
          class="size-6 stroke-gray-900"
          name="arrow"
        />
      </button>
      <button
        type="button"
        class="absolute top-4 right-4 rounded-full bg-white/90 p-2"
        @click="onLikeClick()"
      >
        <AppIcon
          class="size-6"
          :class="
            isCatLiked ? 'text-catebi fill-catebi' : 'fill-none text-gray-400'
          "
          name="heart"
        />
      </button>
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
          {{ formattedAge }}
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
      <PrimaryButton
        class="mt-6 w-full"
        type="button"
        @click="adoptCat"
      >
        {{ $t("adoption.adopt", { name: cat.name }) }}
      </PrimaryButton>
    </div>
  </section>
</template>
