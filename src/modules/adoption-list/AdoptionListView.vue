<template>
  <section class="px-4 py-4">
    <div class="flex items-center justify-between gap-4">
      <h1 class="text-2xl leading-8 font-medium text-gray-800">
        {{ t("adoptionList.title") }}
      </h1>
      <MobileModal :title="t('adoptionList.filtersTitle')">
        <template #anchor>
          <button
            class="relative grid size-10 place-items-center rounded-full text-gray-800 transition-colors hover:bg-gray-100"
            type="button"
            :aria-label="t('adoptionList.openFiltersAriaLabel')"
          >
            <Icon
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
      {{ t("adoptionList.catsFound", { count: filteredCats.length }) }}
    </p>
    <div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
      <CatCard
        v-for="cat in filteredCats"
        :key="cat.name"
        :cat="cat"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import Icon from "@/common/components/Icon.vue";
import MobileModal from "@/common/components/MobileModal.vue";
import { useCatsStore } from "@/stores/cats.store.ts";

import CatCard from "./components/CatCard.vue";
import FilterPanel from "./components/FilterPanel.vue";
import type { FilterGroup, FilterSelection } from "./types";

const { t } = useI18n();

const filters: FilterGroup[] = [
  {
    key: "sex",
    labelKey: "adoptionList.filterGroups.sex",
    options: ["adoptionList.values.sex.male", "adoptionList.values.sex.female"],
  },
  {
    key: "age",
    labelKey: "adoptionList.filterGroups.age",
    options: [
      "adoptionList.values.age.sixMonths",
      "adoptionList.values.age.threeMonths",
      "adoptionList.values.age.twoYears",
      "adoptionList.values.age.fourMonths",
      "adoptionList.values.age.fiveMonths",
      "adoptionList.values.age.oneYear",
    ],
  },
  {
    key: "color",
    labelKey: "adoptionList.filterGroups.color",
    options: [
      "adoptionList.values.color.brownTabby",
      "adoptionList.values.color.orangeTabby",
      "adoptionList.values.color.calico",
      "adoptionList.values.color.whiteWithBlackPatches",
      "adoptionList.values.color.silverTabby",
      "adoptionList.values.color.blackAndBrownMix",
    ],
  },
];
const catsStore = useCatsStore();

const cats = computed(() => catsStore.cats);
const isFilterPanelOpen = ref(false);
const appliedFilters = ref(createEmptyFilters());
const draftFilters = ref(createEmptyFilters());

const activeFilterCount = computed(
  () => Object.values(appliedFilters.value).filter(Boolean).length,
);

const filteredCats = computed(() =>
  cats.value.filter((cat) =>
    filters.every((filter) => {
      const value = appliedFilters.value[filter.labelKey];

      return !value || cat[filter.key] === value;
    }),
  ),
);

function createEmptyFilters(): FilterSelection {
  return Object.fromEntries(filters.map((filter) => [filter.labelKey, null]));
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

function selectDraftFilter(groupLabel: string, option: string | null) {
  draftFilters.value = {
    ...draftFilters.value,
    [groupLabel]: option,
  };
}

onMounted(catsStore.load);
</script>
