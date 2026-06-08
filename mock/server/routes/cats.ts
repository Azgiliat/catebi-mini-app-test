import type { RouteHandler } from "../http.ts";
import { sendJson } from "../http.ts";
import { cats } from "./cats.mock.ts";

export const catsRoute: RouteHandler = (request, response, url) => {
  if (request.method !== "GET" || url.pathname !== "/api/cats") {
    return false;
  }

  sendJson(response, 200, cats);
  return true;
};
