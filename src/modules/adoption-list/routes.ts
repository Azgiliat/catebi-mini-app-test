import type { RouteRecordRaw } from "vue-router";

import AdoptionListView from "./AdoptionListView.vue";
import { ADOPTION_LIST_ROUTE_NAMES } from "./route-names";

export const adoptionListRoutes: RouteRecordRaw[] = [
  {
    path: "/adoption-list",
    name: ADOPTION_LIST_ROUTE_NAMES.ADOPTION_LIST,
    component: AdoptionListView,
  },
];
