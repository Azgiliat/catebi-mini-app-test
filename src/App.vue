<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <div
      class="mx-auto flex min-h-screen w-full max-w-xl min-w-xs flex-col bg-white shadow-sm"
    >
      <header
        class="bg-catebi pt-tg-safe-top sticky top-0 z-20 flex h-16 items-center justify-center px-4"
      >
        <RouterLink
          class="flex items-center gap-2 text-white"
          :to="{ name: ADOPTION_LIST_ROUTE_NAMES.ADOPTION_LIST }"
          :aria-label="t('app.homeAriaLabel')"
        >
          <span class="text-catebi grid size-8 place-items-center rounded-full">
            <Icon
              class="size-5"
              name="catebi-logo"
              aria-hidden="true"
            />
          </span>
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
            class="size-6"
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
import { useI18n } from "vue-i18n";
import { RouterLink, RouterView, useRoute } from "vue-router";

import Icon from "./common/components/Icon.vue";
import {
  ADOPTION_LIST_ROUTE_NAMES,
  type AdoptionListRouteName,
} from "./modules/adoption-list/route-names";
import {
  PROFILE_ROUTE_NAMES,
  type ProfileRouteName,
} from "./modules/profile/route-names";

const route = useRoute();
const { t } = useI18n();

type RouteName = AdoptionListRouteName | ProfileRouteName;

interface NavigationItem {
  routeName: RouteName;
  to: {
    name: RouteName;
  };
  labelKey: string;
  icon: "cats" | "profile";
}

const navigation: NavigationItem[] = [
  {
    routeName: ADOPTION_LIST_ROUTE_NAMES.ADOPTION_LIST,
    to: { name: ADOPTION_LIST_ROUTE_NAMES.ADOPTION_LIST },
    labelKey: "app.navigation.cats",
    icon: "cats",
  },
  {
    routeName: PROFILE_ROUTE_NAMES.PROFILE,
    to: { name: PROFILE_ROUTE_NAMES.PROFILE },
    labelKey: "app.navigation.profile",
    icon: "profile",
  },
];

function isActive(routeName: RouteName) {
  return route.name === routeName;
}
</script>
