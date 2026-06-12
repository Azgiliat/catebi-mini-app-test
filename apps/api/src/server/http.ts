import type { IncomingMessage, ServerResponse } from "node:http";
import type { Request } from "firebase-functions/https";

export type RouteHandler = (
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) => Promise<boolean> | boolean;

export const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

export const sendJson = (
  response: ServerResponse,
  statusCode: number,
  payload: unknown,
) => {
  response.writeHead(statusCode, {
    ...corsHeaders,
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
};

export const readJsonBody = async (
  request: Request,
): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];

  if (request.body) {
    return request.body;
  }

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody);
};
