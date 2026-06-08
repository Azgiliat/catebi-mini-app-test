import http from "node:http";

import { corsHeaders, sendJson } from "./http.ts";
import { telegramAuthRoute } from "./routes/auth.ts";
import { catsRoute } from "./routes/cats.ts";
import { healthRoute } from "./routes/health.ts";

const host = process.env.MOCK_API_HOST ?? "127.0.0.1";
const port = Number(process.env.MOCK_API_PORT ?? 3000);

const routes = [healthRoute, catsRoute, telegramAuthRoute];

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders);
    response.end();
    return;
  }

  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  for (const route of routes) {
    if (await route(request, response, url)) {
      return;
    }
  }

  sendJson(response, 404, { message: "Not found" });
});

server.listen(port, host, () => {
  process.stdout.write(`Mock API listening on http://${host}:${port}\n`);
});
