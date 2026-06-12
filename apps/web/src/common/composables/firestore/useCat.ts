import { doc } from "@firebase/firestore";
import { computed, markRaw, Ref } from "vue";

import { catConverter } from "@/common/composables/firestore/useCatsCollection.ts";
import { useDoc } from "@/common/composables/firestore/useDoc.ts";
import { firestore } from "@/firebase.ts";

export const useCat = (catId: Ref<string>) => {
  const docRef = computed(() => {
    if (!catId.value) {
      return null;
    }

    return markRaw(
      doc(firestore, "cats", catId.value).withConverter(catConverter),
    );
  });

  const { value: cat } = useDoc(docRef);

  return {
    cat,
  };
};
