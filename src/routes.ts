import type { RouteRecordRaw } from "vue-router";

import { favouritesRoutes } from "@/modules/favourites/routes";

import { ADOPTION_ROUTE_NAMES } from "./modules/adoption/route-names";
import { adoptionRoutes } from "./modules/adoption/routes";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: { name: ADOPTION_ROUTE_NAMES.ADOPTION },
  },
  ...adoptionRoutes,
  ...favouritesRoutes,
];
