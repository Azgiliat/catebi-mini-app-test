import {
  DocumentData,
  type DocumentReference,
  type FirestoreError,
  onSnapshot,
} from "firebase/firestore";
import { onWatcherCleanup, readonly, Ref, shallowRef, watch } from "vue";

export const useDoc = <T extends DocumentData>(
  doc: Ref<DocumentReference<T> | null>,
) => {
  const value = shallowRef<T | null>(null);
  const error = shallowRef<FirestoreError | null>(null);

  watch(
    doc,
    (newDoc) => {
      if (!newDoc) {
        return;
      }

      const unsub = onSnapshot(
        newDoc,
        (snapshot) => {
          value.value = snapshot.data();
        },
        (err) => {
          error.value = err;
        },
      );

      onWatcherCleanup(unsub);
    },
    {
      immediate: true,
    },
  );

  return {
    value: readonly(value),
    error: readonly(error),
  };
};
