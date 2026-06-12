import type { RouteRecordRaw } from "vue-router";

import { SETTINGS_ROUTE_NAMES } from "./route-names";
import SettingsView from "./SettingsView.vue";

export const settingsRoutes: RouteRecordRaw[] = [
  {
    path: "/settings",
    name: SETTINGS_ROUTE_NAMES.SETTINGS,
    component: SettingsView,
  },
];
