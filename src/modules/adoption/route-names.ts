export const ADOPTION_ROUTE_NAMES = {
  ADOPTION: "adoption",
  CAT: "cat",
} as const;

export type AdoptionRouteName =
  (typeof ADOPTION_ROUTE_NAMES)[keyof typeof ADOPTION_ROUTE_NAMES];
