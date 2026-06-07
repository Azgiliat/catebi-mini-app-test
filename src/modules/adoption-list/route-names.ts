export const ADOPTION_LIST_ROUTE_NAMES = {
  ADOPTION_LIST: "adoption-list",
} as const;

export type AdoptionListRouteName =
  (typeof ADOPTION_LIST_ROUTE_NAMES)[keyof typeof ADOPTION_LIST_ROUTE_NAMES];
