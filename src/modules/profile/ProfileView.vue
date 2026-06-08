<template>
  <section class="p-4">
    <div class="bg-catebi rounded-2xl border border-gray-200 p-6">
      <div class="flex items-center gap-3">
        <div
          v-if="imageUrl"
          class="size-14 rounded-full bg-white/30"
        >
          <img
            :src="imageUrl"
            :alt="fullName"
            class="object-cover"
          />
        </div>
        <div
          v-else
          class="bg-catebi-light grid size-14 place-items-center rounded-full text-xl font-semibold text-white"
        >
          {{ initials }}
        </div>
        <div>
          <p class="text-lg leading-7 text-gray-900">
            {{ fullName }}
          </p>
        </div>
      </div>
    </div>
    <div class="mt-4 rounded border border-gray-200 bg-white">
      <div
        v-for="item in profileItems"
        :key="item.labelKey"
        class="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0"
      >
        <span class="text-sm leading-5 text-gray-700">
          {{ item.labelKey }}
        </span>
        <span class="text-sm leading-5 text-gray-900">{{ item.value }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import { useI18n } from "vue-i18n";

import { useLikesStore } from "@/stores/likes.store.ts";
import { useUserStore } from "@/stores/user.store.ts";

const { t } = useI18n();
const { name, surname, imageUrl } = toRefs(useUserStore());
const { likes } = toRefs(useLikesStore());

const isNonEmptyString = (value: string | undefined): value is string => {
  return Boolean(value);
};

const fullName = computed(() =>
  [name.value, surname.value].filter(isNonEmptyString).join(" "),
);
const initials = computed(() =>
  [name.value, surname.value]
    .filter(isNonEmptyString)
    .map((part) => part[0])
    .join("")
    .toUpperCase(),
);
const likedCats = computed(() => Array.from(likes.value).join(", "));
const profileItems = computed(() => [
  {
    labelKey: t("profile.items.likedCats"),
    value: likedCats.value || t("profile.values.none"),
  },
  {
    labelKey: t("profile.items.applications"),
    value: t("profile.values.applicationsActive"),
  },
]);
</script>
