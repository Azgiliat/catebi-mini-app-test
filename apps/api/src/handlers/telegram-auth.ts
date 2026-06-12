import { createHmac, timingSafeEqual } from "node:crypto";

import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth, type UserRecord } from "firebase-admin/auth";

import { sendJson } from "../server/http.js";
import type { ApiHandler } from "./types.js";

type TelegramUser = {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
};

type TelegramInitData = {
  authDate: string | null;
  hash: string | null;
  queryId: string | null;
  user: TelegramUser | null;
};

type TelegramAuthHandlerOptions = {
  adminUids: string | undefined;
  botToken: string | undefined;
};

const getFirebaseAuth = () => {
  if (!getApps().length) {
    initializeApp();
  }

  return getAuth();
};

const getOrCreateUser = async (auth: Auth, uid: string) => {
  try {
    return await auth.getUser(uid);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "auth/user-not-found"
    ) {
      return auth.createUser({ uid });
    }

    throw error;
  }
};

const parseAdminUids = (value: string) => {
  return new Set(
    value
      .split(",")
      .map((uid) => uid.trim())
      .filter(Boolean),
  );
};

const syncAdminClaim = async (
  auth: Auth,
  user: UserRecord,
  adminUids: Set<string>,
) => {
  const shouldBeAdmin = adminUids.has(user.uid);
  const isAdmin = user.customClaims?.isAdmin === true;

  if (shouldBeAdmin === isAdmin) {
    return;
  }

  const { isAdmin: _isAdmin, ...customClaims } = user.customClaims ?? {};

  await auth.setCustomUserClaims(user.uid, {
    ...customClaims,
    ...(shouldBeAdmin && { isAdmin: true }),
  });
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

const parseTelegramUser = (value: string | null): TelegramUser | null => {
  if (!value) {
    return null;
  }

  const user: unknown = JSON.parse(value);

  if (
    !user ||
    typeof user !== "object" ||
    typeof (user as TelegramUser).id !== "number" ||
    typeof (user as TelegramUser).first_name !== "string"
  ) {
    return null;
  }

  return user as TelegramUser;
};

const parseInitData = (initData: string): TelegramInitData => {
  const params = new URLSearchParams(initData);

  return {
    authDate: params.get("auth_date"),
    hash: params.get("hash"),
    queryId: params.get("query_id"),
    user: parseTelegramUser(params.get("user")),
  };
};

export const createTelegramAuthHandler = ({
  adminUids,
  botToken,
}: TelegramAuthHandlerOptions): ApiHandler => {
  const normalizedBotToken = botToken?.trim();

  return async (request, response) => {
    try {
      if (request.method !== "POST") {
        sendJson(response, 405, { message: "Method not allowed" });
        return;
      }

      if (!normalizedBotToken) {
        sendJson(response, 500, {
          message: "TELEGRAM_BOT_TOKEN_SECRET is not set",
        });
        return;
      }

      if (!adminUids) {
        sendJson(response, 500, {
          message: "ADMIN_UIDS_SECRET is not set",
        });
        return;
      }

      const {
        body: { initData },
      } = request;

      if (typeof initData !== "string" || !initData) {
        sendJson(response, 400, { message: "initData is required" });
        return;
      }

      const parsedInitData = parseInitData(initData);

      if (
        !validateTelegramInitData(initData, normalizedBotToken) ||
        !parsedInitData.user
      ) {
        sendJson(response, 401, { message: "Invalid Telegram initData" });
        return;
      }

      const uid = String(parsedInitData.user.id);
      const auth = getFirebaseAuth();
      const user = await getOrCreateUser(auth, uid);

      await syncAdminClaim(auth, user, parseAdminUids(adminUids));

      const token = await auth.createCustomToken(uid, {
        telegram_id: uid,
      });

      sendJson(response, 200, {
        token,
        user: parsedInitData.user,
      });
    } catch (error) {
      console.error("Telegram authentication failed", error);

      sendJson(response, 500, {
        message: "Telegram authentication failed",
      });
    }
  };
};
