import {
  getIdTokenResult,
  onIdTokenChanged,
  type ParsedToken,
  signInWithCustomToken,
  type User,
} from "firebase/auth";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { checkTelegramUser } from "@/api/checkTelegramUser.ts";
import { firebaseAuth } from "@/firebase.ts";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(firebaseAuth.currentUser);
  const tokenClaims = ref<ParsedToken | null>(null);
  const isTelegramVerified = ref(false);
  const isAuthenticated = computed(() => user.value !== null);
  const isAdmin = computed(() => tokenClaims.value?.isAdmin === true);

  async function syncUser(currentUser: User | null) {
    user.value = currentUser;
    tokenClaims.value = null;

    if (!currentUser) {
      return;
    }

    const idTokenResult = await getIdTokenResult(currentUser);

    if (firebaseAuth.currentUser?.uid === currentUser.uid) {
      tokenClaims.value = idTokenResult.claims;
    }
  }

  onIdTokenChanged(firebaseAuth, syncUser);

  async function verifyUser() {
    isTelegramVerified.value = false;

    try {
      const { token } = await checkTelegramUser(
        window.Telegram.WebApp.initData,
      );

      isTelegramVerified.value = true;

      await signInWithCustomToken(firebaseAuth, token);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    verifyUser,
    user,
    isTelegramVerified,
    isAuthenticated,
    isAdmin,
  };
});
