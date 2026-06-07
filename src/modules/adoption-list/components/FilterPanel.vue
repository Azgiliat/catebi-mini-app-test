<template>
  <div
    class="grid min-h-0 flex-1 grid-cols-[157px_1fr] border-b border-gray-200"
  >
    <nav
      class="border-r border-gray-200 bg-white"
      aria-label="Filter groups"
    >
      <button
        v-for="(group, index) in filters"
        :key="group.label"
        class="relative flex h-[57px] w-full items-center border-b border-gray-100 px-4 text-left text-base leading-6 transition-colors"
        :class="
          activeGroupIndex === index
            ? 'bg-catebi-light text-catebi'
            : 'text-gray-900 hover:bg-gray-50'
        "
        type="button"
        @click="activeGroupIndex = index"
      >
        <span
          v-if="activeGroupIndex === index"
          class="bg-catebi absolute inset-y-0 left-0 w-1"
          aria-hidden="true"
        />
        <span>{{ group.label }}</span>
      </button>
    </nav>
    <div class="overflow-y-auto px-4 py-4">
      <h3
        class="text-sm leading-5 font-medium tracking-wide text-gray-600 uppercase"
      >
        {{ activeGroup.label }}
      </h3>
      <div class="mt-4 space-y-3">
        <label
          v-for="option in visibleOptions"
          :key="option"
          class="flex min-h-12 cursor-pointer items-center rounded-lg px-3 text-base leading-6 text-gray-900 transition-colors hover:bg-gray-50"
        >
          <span
            class="mr-3 grid size-5 place-items-center rounded-full border transition-colors"
            :class="
              isSelected(option)
                ? 'border-catebi bg-catebi'
                : 'border-gray-300 bg-white'
            "
            aria-hidden="true"
          >
            <span
              v-if="isSelected(option)"
              class="size-2 rounded-full bg-white"
            />
          </span>
          <input
            class="sr-only"
            type="radio"
            :name="activeGroup.label"
            :value="option"
            :checked="isSelected(option)"
            @change="selectOption(option)"
          />
          <span>{{ option }}</span>
        </label>
      </div>
    </div>
  </div>
  <footer class="grid h-20 grid-cols-2 gap-3 px-4 py-4">
    <button
      class="text-catebi h-12 rounded-lg bg-white text-base leading-6 transition-colors hover:bg-gray-50"
      type="button"
      @click="$emit('clear')"
    >
      Clear Filters
    </button>
    <button
      class="bg-catebi hover:bg-catebi-dark h-12 rounded-lg text-base leading-6 text-white transition-colors"
      type="button"
      @click="apply"
    >
      Apply
    </button>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { FilterGroup, FilterSelection } from "../types";

const ANY_OPTION = "Any";

const props = defineProps<{
  filters: FilterGroup[];
  selectedFilters: FilterSelection;
}>();

const emit = defineEmits<{
  "close-modal": [];
  apply: [];
  clear: [];
  select: [groupLabel: string, option: string | null];
}>();

const activeGroupIndex = ref(0);

const activeGroup = computed(() => props.filters[activeGroupIndex.value]);
const visibleOptions = computed(() => [
  ...activeGroup.value.options,
  ANY_OPTION,
]);

function isSelected(option: string) {
  const value = props.selectedFilters[activeGroup.value.label];

  return option === ANY_OPTION ? !value : value === option;
}

function selectOption(option: string) {
  emit(
    "select",
    activeGroup.value.label,
    option === ANY_OPTION ? null : option,
  );
}

function apply() {
  emit("apply");
  emit("close-modal");
}
</script>
