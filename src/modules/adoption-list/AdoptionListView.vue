<template>
  <section class="px-4 py-4">
    <div class="flex items-center justify-between gap-4">
      <h1 class="text-2xl leading-8 font-medium text-gray-800">
        Available for Adoption
      </h1>
      <MobileModal title="Filters">
        <template #anchor>
          <button
            class="relative grid size-10 place-items-center rounded-full text-gray-800 transition-colors hover:bg-gray-100"
            type="button"
            aria-label="Open filters"
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
      {{ filteredCats.length }} cats found
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
import { computed, ref } from "vue";

import Icon from "@/common/components/Icon.vue";
import MobileModal from "@/common/components/MobileModal.vue";

import CatCard from "./components/CatCard.vue";
import FilterPanel from "./components/FilterPanel.vue";
import type { Cat, FilterGroup, FilterSelection } from "./types";

const filters: FilterGroup[] = [
  {
    label: "Sex",
    options: ["Male", "Female"],
  },
  {
    label: "Age",
    options: [
      "6 months",
      "3 months",
      "2 years",
      "4 months",
      "5 months",
      "1 year",
    ],
  },
  {
    label: "Color",
    options: [
      "Brown Tabby",
      "Orange Tabby",
      "Calico",
      "White with Black Patches",
      "Silver Tabby",
      "Black and Brown Mix",
    ],
  },
];

const cats: Cat[] = [
  {
    name: "Luna",
    sex: "Female",
    age: "6 months",
    color: "Brown Tabby",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=480&q=80",
  },
  {
    name: "Oliver",
    sex: "Male",
    age: "3 months",
    color: "Orange Tabby",
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=480&q=80",
  },
  {
    name: "Mittens",
    sex: "Female",
    age: "2 years",
    color: "Calico",
    image:
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=480&q=80",
  },
  {
    name: "Max",
    sex: "Male",
    age: "4 months",
    color: "White with Black Patches",
    image:
      "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=480&q=80",
  },
  {
    name: "Whiskers",
    sex: "Male",
    age: "5 months",
    color: "Brown Tabby",
    image:
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=480&q=80",
  },
  {
    name: "Bella & Milo",
    sex: "Female",
    age: "4 months",
    color: "Silver Tabby",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=480&q=80",
  },
  {
    name: "Shadow",
    sex: "Male",
    age: "1 year",
    color: "Black and Brown Mix",
    image:
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=480&q=80",
  },
  {
    name: "Ginger",
    sex: "Female",
    age: "3 months",
    color: "Brown Tabby",
    image:
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=480&q=80",
  },
];

const isFilterPanelOpen = ref(false);
const appliedFilters = ref(createEmptyFilters());
const draftFilters = ref(createEmptyFilters());

const activeFilterCount = computed(
  () => Object.values(appliedFilters.value).filter(Boolean).length,
);

const filteredCats = computed(() =>
  cats.filter((cat) =>
    filters.every((filter) => {
      const value = appliedFilters.value[filter.label];

      return !value || cat[toCatKey(filter.label)] === value;
    }),
  ),
);

function createEmptyFilters(): FilterSelection {
  return Object.fromEntries(filters.map((filter) => [filter.label, null]));
}

function toCatKey(label: string) {
  return label.toLowerCase() as keyof Pick<Cat, "sex" | "age" | "color">;
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
</script>
