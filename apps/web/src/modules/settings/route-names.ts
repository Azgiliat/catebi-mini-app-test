export const SETTINGS_ROUTE_NAMES = {
  SETTINGS: "settings",
} as const;

export type SettingsRouteName =
  (typeof SETTINGS_ROUTE_NAMES)[keyof typeof SETTINGS_ROUTE_NAMES];
