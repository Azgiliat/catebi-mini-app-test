export const FAVOURITES_ROUTE_NAMES = {
  FAVOURITES: "favourites",
} as const;

export type FavouritesRouteName =
  (typeof FAVOURITES_ROUTE_NAMES)[keyof typeof FAVOURITES_ROUTE_NAMES];
