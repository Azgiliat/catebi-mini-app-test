import type { Timestamp } from "firebase/firestore";
import type { MaybeRefOrGetter } from "vue";
import { computed, toValue } from "vue";
import { useI18n } from "vue-i18n";

import { getAgeFromBirthDate } from "@/common/utils/getAgeFromBirthDate.ts";

export function useFormattedCatAge(
  birthDate: MaybeRefOrGetter<Timestamp | undefined>,
) {
  const { locale, t } = useI18n();

  const formattedAge = computed(() => {
    const birthDateValue = toValue(birthDate);

    if (birthDateValue === undefined) {
      return "";
    }

    const { years, months } = getAgeFromBirthDate(birthDateValue);
    const ageParts = [];

    if (years > 0) {
      ageParts.push(
        t(`age.years.${getPluralCategory(years)}`, { count: years }),
      );
    }

    if (months > 0) {
      ageParts.push(
        t(`age.months.${getPluralCategory(months)}`, { count: months }),
      );
    }

    return ageParts.length > 0 ? ageParts.join(" ") : t("age.lessThanMonth");
  });

  function getPluralCategory(value: number) {
    return new Intl.PluralRules(locale.value).select(value);
  }

  return {
    formattedAge,
  };
}
