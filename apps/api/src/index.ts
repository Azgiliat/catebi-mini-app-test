import type { ServerResponse } from "node:http";
import type { Request } from "firebase-functions/https";

import { defineSecret } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";

import { createTelegramAuthHandler } from "./handlers/telegram-auth.js";
import type { ApiHandler } from "./handlers/types.js";
import { corsHeaders } from "./server/http.js";

const telegramBotTokenSecret = defineSecret("TELEGRAM_BOT_TOKEN_SECRET");
const adminUidsSecret = defineSecret("ADMIN_UIDS_SECRET");

const createFirebaseRequestHandler = (handler: ApiHandler) => {
  return async (request: Request, response: ServerResponse) => {
    if (request.method === "OPTIONS") {
      response.writeHead(204, corsHeaders);
      response.end();
      return;
    }

    await handler(request, response);
  };
};

export const telegramAuth = onRequest(
  { secrets: [telegramBotTokenSecret, adminUidsSecret] },
  async (request, response) => {
    const handler = createFirebaseRequestHandler(
      createTelegramAuthHandler({
        adminUids: adminUidsSecret.value(),
        botToken: telegramBotTokenSecret.value(),
      }),
    );

    await handler(
      request,
      response as unknown as ServerResponse,
    );
  },
);
