import type { RouteHandler } from "../http.ts";
import { sendJson } from "../http.ts";

export const healthRoute: RouteHandler = (request, response, url) => {
  if (request.method !== "GET" || url.pathname !== "/health") {
    return false;
  }

  sendJson(response, 200, { status: "ok" });
  return true;
};
