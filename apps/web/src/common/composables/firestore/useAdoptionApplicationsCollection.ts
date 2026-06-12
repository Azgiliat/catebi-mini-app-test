import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
  where,
  type WithFieldValue,
} from "firebase/firestore";
import { toRefs } from "vue";

import { useCollection } from "@/common/composables/firestore/useCollection.ts";
import { firestore } from "@/firebase.ts";
import {
  type AdoptionApplication,
  AdoptionRequest,
  AdoptionRequestStatus,
} from "@/modules/adoption/types.ts";
import { useUserStore } from "@/stores/user.store.ts";

export const useAdoptionApplicationsCollection = () => {
  const { user, isAdmin } = toRefs(useUserStore());
  const adoptionApplicationsCollection = collection(
    firestore,
    "adoptionApplications",
  );
  const source = isAdmin.value
    ? query(adoptionApplicationsCollection, orderBy("createdAt", "desc"))
    : query(
        adoptionApplicationsCollection,
        where("userId", "==", user.value?.uid),
        orderBy("createdAt", "desc"),
      );

  const { value: adoptionApplications, isLoaded } = useCollection(source);

  async function submitAdoptionApplication(adoptionRequest: AdoptionRequest) {
    if (!user.value) {
      throw new Error("User not authenticated");
    }

    const adoptionApplication = {
      userId: user.value.uid,
      catId: adoptionRequest.catId,
      comment: adoptionRequest.comment || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: AdoptionRequestStatus.PENDING,
    } satisfies WithFieldValue<AdoptionApplication>;

    await addDoc(adoptionApplicationsCollection, adoptionApplication);
  }

  return {
    adoptionApplications,
    isLoaded,
    submitAdoptionApplication,
  };
};
