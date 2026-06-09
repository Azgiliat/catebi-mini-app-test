import type { RouteRecordRaw } from "vue-router";

import CatView from "@/modules/adoption/CatView.vue";

import ListView from "./ListView.vue";
import { ADOPTION_ROUTE_NAMES } from "./route-names";

export const adoptionRoutes: RouteRecordRaw[] = [
  {
    path: "/adoption",
    children: [
      {
        path: "",
        name: ADOPTION_ROUTE_NAMES.ADOPTION,
        component: ListView,
      },
      {
        path: "cat/:cat",
        name: ADOPTION_ROUTE_NAMES.CAT,
        component: CatView,
      },
    ],
  },
];
