<template>
  <section class="p-4">
    <div class="flex items-center gap-3">
      <AppIcon
        class="text-catebi size-7"
        name="settings"
        aria-hidden="true"
      />
      <h1 class="text-2xl leading-8 font-normal text-gray-900">
        {{ t("settings.title") }}
      </h1>
    </div>

    <p class="text-base leading-8 text-gray-600">
      {{ t("settings.description") }}
    </p>

    <div
      class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white"
    >
      <div
        class="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-4"
      >
        <AppIcon
          class="text-catebi size-5"
          name="globe"
          aria-hidden="true"
        />
        <h2 class="text-lg leading-7 font-normal text-gray-900">
          {{ t("settings.language") }}
        </h2>
      </div>

      <button
        v-for="language in languages"
        :key="language.locale"
        class="flex w-full items-center justify-between border-b border-gray-200 p-4 text-left last:border-b-0 hover:bg-gray-50"
        type="button"
        :aria-pressed="locale === language.locale"
        @click="selectLanguage(language.locale)"
      >
        <span class="flex items-center gap-3">
          <span
            class="text-2xl leading-8"
            aria-hidden="true"
          >
            {{ language.flag }}
          </span>
          <span class="text-base leading-6 text-gray-900">
            {{ language.label }}
          </span>
        </span>

        <span
          v-if="locale === language.locale"
          class="bg-catebi flex size-5 items-center justify-center rounded-full text-white"
        >
          <AppIcon
            class="size-3"
            name="check"
            aria-hidden="true"
          />
        </span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

import AppIcon from "@/common/components/AppIcon.vue";
import type { SupportedLocale } from "@/i18n";

const { t, locale } = useI18n();

const languages: Array<{
  locale: SupportedLocale;
  flag: string;
  label: string;
}> = [
  { locale: "en", flag: "🇬🇧", label: "English" },
  { locale: "ru", flag: "🇷🇺", label: "Русский" },
  { locale: "ka", flag: "🇬🇪", label: "ქართული" },
];

function selectLanguage(selectedLocale: SupportedLocale) {
  locale.value = selectedLocale;
}
</script>
