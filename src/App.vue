<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <div
      class="mx-auto flex min-h-screen w-full max-w-xl min-w-xs flex-col bg-white shadow-sm"
    >
      <header
        class="bg-catebi sticky top-0 z-20 flex items-center justify-center p-4"
      >
        <RouterLink
          class="flex items-center gap-2 text-white"
          :to="{ name: ADOPTION_ROUTE_NAMES.ADOPTION }"
          :aria-label="t('app.homeAriaLabel')"
        >
          <Icon
            class="text-catebi size-8"
            name="catebi-logo"
            aria-hidden="true"
          />

          <span class="text-sm font-extrabold tracking-wide">CATEBI</span>
        </RouterLink>
      </header>
      <main class="flex-1 pb-3">
        <RouterView />
      </main>
      <nav
        class="sticky bottom-0 z-20 grid h-[69px] grid-cols-2 border-t border-gray-200 bg-white"
      >
        <RouterLink
          v-for="item in navigation"
          :key="item.routeName"
          :to="item.to"
          class="flex flex-col items-center justify-center gap-1 text-xs transition-colors"
          :class="isActive(item.routeName) ? 'text-catebi' : 'text-gray-600'"
        >
          <Icon
            class="size-6 fill-current stroke-current"
            :name="item.icon"
            aria-hidden="true"
          />
          <span>{{ t(item.labelKey) }}</span>
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink, RouterView, useRoute } from "vue-router";

import {
  FAVOURITES_ROUTE_NAMES,
  type FavouritesRouteName,
} from "@/modules/favourites/route-names";
import { useCatsStore } from "@/stores/cats.store.ts";

import Icon from "./common/components/Icon.vue";
import {
  ADOPTION_ROUTE_NAMES,
  type AdoptionRouteName,
} from "./modules/adoption/route-names";

const route = useRoute();
const { t } = useI18n();

const catsStore = useCatsStore();

type RouteName = AdoptionRouteName | FavouritesRouteName;

interface NavigationItem {
  routeName: RouteName;
  to: {
    name: RouteName;
  };
  labelKey: string;
  icon: "cats" | "heart";
}

const navigation: NavigationItem[] = [
  {
    routeName: ADOPTION_ROUTE_NAMES.ADOPTION,
    to: { name: ADOPTION_ROUTE_NAMES.ADOPTION },
    labelKey: "app.navigation.cats",
    icon: "cats",
  },
  {
    routeName: FAVOURITES_ROUTE_NAMES.FAVOURITES,
    to: { name: FAVOURITES_ROUTE_NAMES.FAVOURITES },
    labelKey: "favourites.title",
    icon: "heart",
  },
];

function isActive(routeName: RouteName) {
  return route.name === routeName;
}

onMounted(catsStore.load);
</script>
