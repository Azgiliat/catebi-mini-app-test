import type { ServerResponse } from "node:http";
import type { Request } from "firebase-functions/https";

export type ApiHandler = (
  request: Request,
  response: ServerResponse,
) => Promise<void> | void;
