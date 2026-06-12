import type { Timestamp } from "firebase/firestore";

import { getAgeInMonths } from "./getAgeInMonths.ts";

export interface AgeInYearsAndMonths {
  years: number;
  months: number;
}

export function getAgeFromBirthDate(
  birthDate: Timestamp,
  currentDate = new Date(),
): AgeInYearsAndMonths {
  const ageInMonths = getAgeInMonths(birthDate.toDate(), currentDate);

  return {
    years: Math.floor(ageInMonths / 12),
    months: ageInMonths % 12,
  };
}
