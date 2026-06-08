import { createHmac, timingSafeEqual } from "node:crypto";

import { LOCAL_TELEGRAM_DEV_BOT_TOKEN } from "../../shared/telegram-dev-auth.ts";
import type { RouteHandler } from "../http.ts";
import { readJsonBody, sendJson } from "../http.ts";

type TelegramInitData = {
  authDate: string | null;
  hash: string | null;
  queryId: string | null;
  user: unknown;
};

const createDataCheckString = (params: URLSearchParams) => {
  params.delete("hash");

  return Array.from(params.entries())
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
};

const validateTelegramInitData = (initData: string, botToken: string) => {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");

  if (!hash) {
    return false;
  }

  const dataCheckString = createDataCheckString(params);
  const secretKey = createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();
  const calculatedHash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const hashBuffer = Buffer.from(hash, "hex");
  const calculatedHashBuffer = Buffer.from(calculatedHash, "hex");

  return (
    hashBuffer.length === calculatedHashBuffer.length &&
    timingSafeEqual(hashBuffer, calculatedHashBuffer)
  );
};

const parseInitData = (initData: string): TelegramInitData => {
  const params = new URLSearchParams(initData);
  const user = params.get("user");

  return {
    authDate: params.get("auth_date"),
    hash: params.get("hash"),
    queryId: params.get("query_id"),
    user: user ? JSON.parse(user) : null,
  };
};

export const telegramAuthRoute: RouteHandler = async (
  request,
  response,
  url,
) => {
  if (request.method !== "POST" || url.pathname !== "/api/auth/telegram") {
    return false;
  }

  try {
    const { initData } = await readJsonBody(request);

    if (typeof initData !== "string" || !initData) {
      sendJson(response, 400, { message: "initData is required" });
      return true;
    }

    const parsedInitData = parseInitData(initData);

    if (
      !validateTelegramInitData(initData, LOCAL_TELEGRAM_DEV_BOT_TOKEN) ||
      !parsedInitData.user
    ) {
      sendJson(response, 401, { message: "Invalid local initData" });
      return true;
    }

    sendJson(response, 200, {
      token: "local-dev-token",
      user: parsedInitData.user,
    });
  } catch (error) {
    sendJson(response, 400, {
      message: "Invalid request body",
      details: error instanceof Error ? error.message : String(error),
    });
  }

  return true;
};
