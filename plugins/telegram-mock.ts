import { LOCAL_TELEGRAM_DEV_BOT_TOKEN } from "../mock/shared/telegram-dev-auth";

type WebAppUser = {
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

type CloudStorageCallback<T> = (error: string | null, result: T) => void;

type TelegramCloudStorage = {
  setItem: (
    key: string,
    value: string,
    callback?: CloudStorageCallback<boolean>,
  ) => TelegramCloudStorage;
  getItem: (
    key: string,
    callback: CloudStorageCallback<string>,
  ) => TelegramCloudStorage;
  getItems: (
    keys: string[],
    callback: CloudStorageCallback<Record<string, string>>,
  ) => TelegramCloudStorage;
  removeItem: (
    key: string,
    callback?: CloudStorageCallback<boolean>,
  ) => TelegramCloudStorage;
  removeItems: (
    keys: string[],
    callback?: CloudStorageCallback<boolean>,
  ) => TelegramCloudStorage;
  getKeys: (callback: CloudStorageCallback<string[]>) => TelegramCloudStorage;
};

type TelegramWebApp = {
  initData: string;
  initDataUnsafe: {
    auth_date: number;
    hash: string;
    query_id: string;
    user: WebAppUser;
  };
  CloudStorage: TelegramCloudStorage;
  ready: () => void;
  expand: () => void;
};

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

const mockUser: WebAppUser = {
  id: 987654321,
  is_bot: false,
  first_name: "Anton",
  last_name: "Sapovalov",
  username: "anton_sapovalov",
  language_code: "ru",
  is_premium: true,
  added_to_attachment_menu: false,
  allows_write_to_pm: true,
  photo_url: "https://t.me/i/userpic/320/anton_sapovalov.jpg",
};

const CLOUD_STORAGE_LOCAL_STORAGE_KEY = "catebi:telegram-cloud-storage";
const CLOUD_STORAGE_KEY_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const CLOUD_STORAGE_MAX_ITEMS = 1024;
const CLOUD_STORAGE_MAX_VALUE_LENGTH = 4096;

const readCloudStorage = () => {
  const value = window.localStorage.getItem(CLOUD_STORAGE_LOCAL_STORAGE_KEY);

  if (!value) {
    return {};
  }

  try {
    const parsedValue: unknown = JSON.parse(value);

    if (!parsedValue || typeof parsedValue !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsedValue).filter(
        ([key, storageValue]) =>
          CLOUD_STORAGE_KEY_PATTERN.test(key) &&
          typeof storageValue === "string",
      ),
    );
  } catch {
    return {};
  }
};

const writeCloudStorage = (storage: Record<string, string>) => {
  window.localStorage.setItem(
    CLOUD_STORAGE_LOCAL_STORAGE_KEY,
    JSON.stringify(storage),
  );
};

const validateCloudStorageKey = (key: string) => {
  if (!CLOUD_STORAGE_KEY_PATTERN.test(key)) {
    return "Invalid key";
  }

  return null;
};

const validateCloudStorageKeys = (keys: string[]) => {
  const invalidKey = keys.find((key) => validateCloudStorageKey(key));

  if (invalidKey) {
    return validateCloudStorageKey(invalidKey);
  }

  return null;
};

const createTelegramCloudStorageMock = (): TelegramCloudStorage => {
  const cloudStorage: TelegramCloudStorage = {
    setItem: (key, value, callback) => {
      const keyError = validateCloudStorageKey(key);

      if (keyError) {
        callback?.(keyError, false);

        return cloudStorage;
      }

      if (value.length > CLOUD_STORAGE_MAX_VALUE_LENGTH) {
        callback?.("Value is too long", false);

        return cloudStorage;
      }

      const storage = readCloudStorage();
      const isNewKey = !(key in storage);

      if (isNewKey && Object.keys(storage).length >= CLOUD_STORAGE_MAX_ITEMS) {
        callback?.("Storage limit exceeded", false);

        return cloudStorage;
      }

      storage[key] = value;
      writeCloudStorage(storage);
      callback?.(null, true);

      return cloudStorage;
    },
    getItem: (key, callback) => {
      const keyError = validateCloudStorageKey(key);

      if (keyError) {
        callback(keyError, "");

        return cloudStorage;
      }

      callback(null, readCloudStorage()[key] ?? "");

      return cloudStorage;
    },
    getItems: (keys, callback) => {
      const keyError = validateCloudStorageKeys(keys);

      if (keyError) {
        callback(keyError, {});

        return cloudStorage;
      }

      const storage = readCloudStorage();

      callback(
        null,
        Object.fromEntries(keys.map((key) => [key, storage[key] ?? ""])),
      );

      return cloudStorage;
    },
    removeItem: (key, callback) => {
      const keyError = validateCloudStorageKey(key);

      if (keyError) {
        callback?.(keyError, false);

        return cloudStorage;
      }

      const storage = readCloudStorage();

      delete storage[key];
      writeCloudStorage(storage);
      callback?.(null, true);

      return cloudStorage;
    },
    removeItems: (keys, callback) => {
      const keyError = validateCloudStorageKeys(keys);

      if (keyError) {
        callback?.(keyError, false);

        return cloudStorage;
      }

      const storage = readCloudStorage();

      keys.forEach((key) => {
        delete storage[key];
      });
      writeCloudStorage(storage);
      callback?.(null, true);

      return cloudStorage;
    },
    getKeys: (callback) => {
      callback(null, Object.keys(readCloudStorage()));

      return cloudStorage;
    },
  };

  return cloudStorage;
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
      CloudStorage: createTelegramCloudStorageMock(),
      ready: () => undefined,
      expand: () => undefined,
    },
  };
};
