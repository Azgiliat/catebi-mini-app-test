import { createHmac, timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import http from "node:http";

import { LOCAL_TELEGRAM_DEV_BOT_TOKEN } from "../shared/telegram-dev-auth.ts";

const host = process.env.MOCK_API_HOST ?? "127.0.0.1";
const port = Number(process.env.MOCK_API_PORT ?? 3000);

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

const sendJson = (
  response: ServerResponse,
  statusCode: number,
  payload: unknown,
) => {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
};

const readJsonBody = async (
  request: IncomingMessage,
): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody);
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

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Origin": "*",
    });
    response.end();
    return;
  }

  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (request.method !== "POST" || url.pathname !== "/api/auth/telegram") {
    sendJson(response, 404, { message: "Not found" });
    return;
  }

  try {
    const { initData } = await readJsonBody(request);

    if (typeof initData !== "string" || !initData) {
      sendJson(response, 400, { message: "initData is required" });
      return;
    }

    const parsedInitData = parseInitData(initData);

    if (
      !validateTelegramInitData(initData, LOCAL_TELEGRAM_DEV_BOT_TOKEN) ||
      !parsedInitData.user
    ) {
      sendJson(response, 401, { message: "Invalid local initData" });
      return;
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
});

server.listen(port, host, () => {
  process.stdout.write(`Mock API listening on http://${host}:${port}\n`);
});
