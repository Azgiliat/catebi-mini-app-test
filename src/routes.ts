import type { RouteRecordRaw } from "vue-router";

import { ADOPTION_LIST_ROUTE_NAMES } from "./modules/adoption-list/route-names";
import { adoptionListRoutes } from "./modules/adoption-list/routes";
import { profileRoutes } from "./modules/profile/routes";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: { name: ADOPTION_LIST_ROUTE_NAMES.ADOPTION_LIST },
  },
  ...adoptionListRoutes,
  ...profileRoutes,
];
