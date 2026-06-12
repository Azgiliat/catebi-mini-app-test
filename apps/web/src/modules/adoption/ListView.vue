<template>
  <section class="px-4 py-4">
    <div class="flex items-center justify-between gap-4">
      <h1 class="text-2xl leading-8 font-medium text-gray-800">
        {{ t("adoption.title") }}
      </h1>
      <MobileModal :title="t('adoption.filtersTitle')">
        <template #anchor>
          <button
            class="relative grid size-10 place-items-center rounded-full text-gray-800 transition-colors hover:bg-gray-100"
            type="button"
            :aria-label="t('adoption.openFiltersAriaLabel')"
          >
            <AppIcon
              class="size-6"
              name="filter"
              aria-hidden="true"
            />
            <span
              v-if="activeFilterCount > 0"
              class="bg-catebi absolute -top-1 -right-1 grid size-5 place-items-center rounded-full text-xs leading-none font-medium text-white"
              aria-hidden="true"
            >
              {{ activeFilterCount }}
            </span>
          </button>
        </template>
        <template #modal>
          <FilterPanel
            :filters="filters"
            :selected-filters="draftFilters"
            @apply="applyFilters"
            @clear="clearDraftFilters"
            @select="selectDraftFilter"
          />
        </template>
      </MobileModal>
    </div>

    <p class="mt-3 pt-1 text-sm leading-5 text-gray-700">
      {{ t("adoption.catsFound", { count: filteredCats.length }) }}
    </p>
    <div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
      <CatCard
        v-for="cat in filteredCats"
        :key="cat.id"
        :cat="cat"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, type Ref, ref } from "vue";
import { useI18n } from "vue-i18n";

import AppIcon from "@/common/components/AppIcon.vue";
import MobileModal from "@/common/components/MobileModal.vue";
import { getAgeInMonths } from "@/common/utils/getAgeInMonths.ts";
import { useCatsStore } from "@/stores/cats.store.ts";

import CatCard from "../../common/components/CatCard.vue";
import FilterPanel from "./components/FilterPanel.vue";
import type { Cat, FilterGroup, FilterSelection, FilterValue } from "./types";

const { t } = useI18n();

const catsStore = useCatsStore();
const filters: Ref<FilterGroup[]> = computed(() => [
  {
    key: "sex",
    labelKey: "sex.label",
    optionLabelPrefix: "sex",
    options: ["m", "f"],
  },
  {
    key: "birthDate",
    labelKey: "age.label",
    type: "age",
    options: [],
  },
  {
    key: "color",
    labelKey: "color.label",
    options: Array.from(catsStore.availableColors),
  },
]);

const cats = computed(() => catsStore.cats);
const isFilterPanelOpen = ref(false);
const appliedFilters = ref(createEmptyFilters());
const draftFilters = ref(createEmptyFilters());

const activeFilterCount = computed(
  () => Object.values(appliedFilters.value).filter(isActiveFilter).length,
);

const filteredCats = computed(() => {
  const currentDate = new Date();

  return cats.value.filter((cat) => {
    return filters.value.every((filter) => {
      const selectedValue = appliedFilters.value[filter.labelKey];

      return (
        !isActiveFilter(selectedValue) ||
        matchesFilter(cat, filter, selectedValue, currentDate)
      );
    });
  });
});

function matchesFilter(
  cat: Cat,
  filter: FilterGroup,
  selectedValue: FilterValue,
  currentDate: Date,
) {
  if (filter.type === "age" && typeof selectedValue !== "string") {
    if (selectedValue === null) {
      return true;
    }

    const selectedAgeInMonths =
      (selectedValue.years ?? 0) * 12 + (selectedValue.months ?? 0);
    const catAgeInMonths = getAgeInMonths(cat.birthDate.toDate(), currentDate);

    return selectedValue.direction === "older"
      ? catAgeInMonths > selectedAgeInMonths
      : catAgeInMonths < selectedAgeInMonths;
  }

  return typeof selectedValue === "string" && cat[filter.key] === selectedValue;
}

function isActiveFilter(value: FilterValue) {
  if (!value) {
    return false;
  }

  return (
    typeof value === "string" || value.years !== null || value.months !== null
  );
}

function createEmptyFilters(): FilterSelection {
  return Object.fromEntries(
    filters.value.map((filter) => [filter.labelKey, null]),
  );
}

function closeFilters() {
  isFilterPanelOpen.value = false;
}

function applyFilters() {
  appliedFilters.value = { ...draftFilters.value };
  closeFilters();
}

function clearDraftFilters() {
  draftFilters.value = createEmptyFilters();
}

function selectDraftFilter(groupLabel: string, value: FilterValue) {
  draftFilters.value = {
    ...draftFilters.value,
    [groupLabel]: value,
  };
}
</script>
