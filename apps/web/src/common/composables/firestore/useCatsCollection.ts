import {
  collection,
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from "firebase/firestore";

import { useCollection } from "@/common/composables/firestore/useCollection.ts";
import { firestore } from "@/firebase.ts";
import type { Cat } from "@/modules/adoption/types.ts";

export const catConverter: FirestoreDataConverter<Cat> = {
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions,
  ): Cat {
    return {
      ...(snapshot.data(options) as Omit<Cat, "id">),
      id: snapshot.id,
    };
  },
  toFirestore(modelObject: Cat): DocumentData {
    const { id, ...cat } = modelObject;

    return cat;
  },
};

export const useCatsCollection = () => {
  const collectionRef = collection(firestore, "cats");

  const { value: cats, isLoaded } = useCollection(
    collectionRef.withConverter(catConverter),
  );

  return {
    cats,
    isLoaded,
  };
};
