declare global {
  interface Window {
    __CATEBI_AUTH_EMULATOR_CONNECTED__?: boolean;
    __CATEBI_FIRESTORE_EMULATOR_CONNECTED__?: boolean;
  }
}

export {};
