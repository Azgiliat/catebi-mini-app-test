export const PROFILE_ROUTE_NAMES = {
  PROFILE: "profile",
} as const;

export type ProfileRouteName =
  (typeof PROFILE_ROUTE_NAMES)[keyof typeof PROFILE_ROUTE_NAMES];
