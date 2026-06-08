import type { RouteRecordRaw } from "vue-router";

import { favouritesRoutes } from "@/modules/favourites/routes";

import { ADOPTION_LIST_ROUTE_NAMES } from "./modules/adoption-list/route-names";
import { adoptionListRoutes } from "./modules/adoption-list/routes";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: { name: ADOPTION_LIST_ROUTE_NAMES.ADOPTION_LIST },
  },
  ...adoptionListRoutes,
  ...favouritesRoutes,
];
