import type { RouteRecordRaw } from "vue-router";

import ProfileView from "./ProfileView.vue";
import { PROFILE_ROUTE_NAMES } from "./route-names";

export const profileRoutes: RouteRecordRaw[] = [
  {
    path: "/profile",
    name: PROFILE_ROUTE_NAMES.PROFILE,
    component: ProfileView,
  },
];
