import { type DocumentData, onSnapshot, type Query } from "firebase/firestore";
import { onScopeDispose, readonly, Ref, ref } from "vue";

//TODO сделать query реактивным
export const useCollection = <T extends DocumentData>(query: Query<T>) => {
  const isLoaded = ref(false);
  const value: Ref<T[]> = ref([]);

  const unsub = onSnapshot(query, (snapshot) => {
    const newValue: T[] = [];

    snapshot.forEach((doc) => {
      newValue.push(doc.data() as T);
    });

    value.value = newValue;
    isLoaded.value = true;
  });

  onScopeDispose(unsub);

  return {
    value: readonly(value),
    isLoaded: readonly(isLoaded),
  };
};
