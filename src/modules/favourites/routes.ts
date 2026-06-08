import type { RouteRecordRaw } from "vue-router";

import FavouritesView from "./FavouritesView.vue";
import { FAVOURITES_ROUTE_NAMES } from "./route-names";

export const favouritesRoutes: RouteRecordRaw[] = [
  {
    path: "/favourites",
    name: FAVOURITES_ROUTE_NAMES.FAVOURITES,
    component: FavouritesView,
  },
];
