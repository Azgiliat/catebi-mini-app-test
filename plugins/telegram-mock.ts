import { LOCAL_TELEGRAM_DEV_BOT_TOKEN } from "../mock/shared/telegram-dev-auth";

type WebAppUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
};

type TelegramWebApp = {
  initData: string;
  initDataUnsafe: {
    auth_date: number;
    hash: string;
    query_id: string;
    user: WebAppUser;
  };
  ready: () => void;
  expand: () => void;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

const mockUser: WebAppUser = {
  id: 123456789,
  first_name: "Local",
  last_name: "User",
  username: "local_catebi_user",
  language_code: "ru",
  photo_url: "https://t.me/i/userpic/320/local_catebi_user.jpg",
};

const toHex = (buffer: ArrayBuffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const signHmacSha256 = async (key: BufferSource, data: string) => {
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    key,
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );

  return window.crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(data),
  );
};

const createDataCheckString = (params: URLSearchParams) => {
  return Array.from(params.entries())
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
};

const createTelegramHash = async (params: URLSearchParams) => {
  const secretKey = await signHmacSha256(
    new TextEncoder().encode("WebAppData"),
    LOCAL_TELEGRAM_DEV_BOT_TOKEN,
  );
  const hash = await signHmacSha256(secretKey, createDataCheckString(params));

  return toHex(hash);
};

const createMockInitData = async () => {
  const authDate = Math.floor(Date.now() / 1000);
  const params = new URLSearchParams({
    query_id: "local-query-id",
    user: JSON.stringify(mockUser),
    auth_date: String(authDate),
  });
  const hash = await createTelegramHash(params);

  params.set("hash", hash);

  return {
    authDate,
    hash,
    initData: params.toString(),
  };
};

export const installTelegramMock = async () => {
  if (window.Telegram?.WebApp) {
    return;
  }

  const { authDate, hash, initData } = await createMockInitData();

  window.Telegram = {
    WebApp: {
      initData,
      initDataUnsafe: {
        auth_date: authDate,
        hash,
        query_id: "local-query-id",
        user: mockUser,
      },
      ready: () => undefined,
      expand: () => undefined,
    },
  };
};
