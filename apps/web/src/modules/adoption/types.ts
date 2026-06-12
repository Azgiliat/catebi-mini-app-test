import { Timestamp } from "firebase/firestore";

export interface FilterGroup {
  key: keyof Pick<Cat, "sex" | "birthDate" | "color">;
  labelKey: string;
  type?: "options" | "age";
  optionLabelPrefix?: string;
  options: string[];
}

export type AgeFilterDirection = "older" | "younger";

export interface AgeFilterValue {
  direction: AgeFilterDirection;
  years: number | null;
  months: number | null;
}

export type FilterValue = string | AgeFilterValue | null;

export type FilterSelection = Record<string, FilterValue>;

export type CatSex = "m" | "f";

export interface Cat {
  id: string;
  name: string;
  sex: CatSex;
  birthDate: Timestamp;
  color: string;
  image: string;
  about: string;
  isLiked?: boolean;
}

export type AdoptionRequest = {
  catId: string;
  comment?: string;
};

export const enum AdoptionRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export type AdoptionApplication = {
  userId: string;
  catId: string;
  comment: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: AdoptionRequestStatus;
};
