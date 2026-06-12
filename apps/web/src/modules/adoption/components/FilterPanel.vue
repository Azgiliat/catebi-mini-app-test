<template>
  <div
    class="grid min-h-0 flex-1 grid-cols-[minmax(25%,max-content)_1fr] border-b border-gray-200"
  >
    <nav
      class="max-w-40 border-r border-gray-200 bg-white"
      :aria-label="t('adoption.filterPanel.groupsAriaLabel')"
    >
      <button
        v-for="(group, index) in filters"
        :key="group.labelKey"
        class="relative flex w-full items-center border-b border-gray-100 px-4 py-4 text-left text-base leading-6 transition-colors"
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
        <span>{{ t(group.labelKey) }}</span>
      </button>
    </nav>
    <div class="overflow-y-auto px-4 py-4">
      <div
        v-if="activeGroup.type === 'age'"
        class="mt-4 space-y-5"
      >
        <fieldset class="space-y-3">
          <legend class="sr-only">
            {{ t("adoption.filterPanel.age.direction") }}
          </legend>
          <RadioInput
            v-for="direction in ageDirections"
            :key="direction"
            name="age-direction"
            :value="direction"
            :label="t(`adoption.filterPanel.age.${direction}`)"
            :checked="selectedAgeFilter.direction === direction"
            @select="updateAgeFilter({ direction })"
          />
        </fieldset>

        <div class="grid grid-cols-2 gap-3">
          <NumberInput
            :model-value="selectedAgeFilter.years"
            :label="t('adoption.filterPanel.age.years')"
            :placeholder="t('adoption.filterPanel.age.yearsPlaceholder')"
            @update:model-value="updateAgeFilter({ years: $event })"
          />
          <NumberInput
            :model-value="selectedAgeFilter.months"
            :label="t('adoption.filterPanel.age.months')"
            :placeholder="t('adoption.filterPanel.age.monthsPlaceholder')"
            :max="11"
            @update:model-value="updateAgeFilter({ months: $event })"
          />
        </div>
      </div>
      <div
        v-else
        class="mt-4 space-y-3"
      >
        <RadioInput
          v-for="option in visibleOptions"
          :key="option"
          :name="activeGroup.labelKey"
          :value="option"
          :label="getOptionLabel(option)"
          :checked="isSelected(option)"
          @select="selectOption(option)"
        />
      </div>
    </div>
  </div>
  <footer class="grid h-20 grid-cols-2 gap-3 px-4 py-4">
    <button
      class="text-catebi h-12 rounded-lg bg-white text-base leading-6 transition-colors hover:bg-gray-50"
      type="button"
      @click="$emit('clear')"
    >
      {{ t("adoption.filterPanel.clear") }}
    </button>
    <PrimaryButton
      type="button"
      @click="apply"
    >
      {{ t("adoption.filterPanel.apply") }}
    </PrimaryButton>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import NumberInput from "@/common/components/NumberInput.vue";
import PrimaryButton from "@/common/components/PrimaryButton.vue";
import RadioInput from "@/common/components/RadioInput.vue";

import type {
  AgeFilterDirection,
  AgeFilterValue,
  FilterGroup,
  FilterSelection,
  FilterValue,
} from "../types";

const ANY_OPTION = "__any__";
const ageDirections: AgeFilterDirection[] = ["younger", "older"];

const { t } = useI18n();

const props = defineProps<{
  filters: FilterGroup[];
  selectedFilters: FilterSelection;
}>();

const emit = defineEmits<{
  "close-modal": [];
  apply: [];
  clear: [];
  select: [groupLabel: string, value: FilterValue];
}>();

const activeGroupIndex = ref(0);

const activeGroup = computed(() => props.filters[activeGroupIndex.value]);
const visibleOptions = computed(() => [
  ...activeGroup.value.options,
  ANY_OPTION,
]);
const selectedAgeFilter = computed<AgeFilterValue>(() => {
  const value = props.selectedFilters[activeGroup.value.labelKey];

  return typeof value === "object" && value !== null
    ? value
    : { direction: "younger", years: null, months: null };
});

function isSelected(option: string) {
  const value = props.selectedFilters[activeGroup.value.labelKey];

  return option === ANY_OPTION ? typeof value !== "string" : value === option;
}

function getOptionLabel(option: string) {
  if (option === ANY_OPTION) {
    return t("adoption.filterPanel.any");
  }

  return t(
    activeGroup.value.optionLabelPrefix
      ? `${activeGroup.value.optionLabelPrefix}.${option}`
      : option,
  );
}

function selectOption(option: string) {
  emit(
    "select",
    activeGroup.value.labelKey,
    option === ANY_OPTION ? null : option,
  );
}

function updateAgeFilter(update: Partial<AgeFilterValue>) {
  emit("select", activeGroup.value.labelKey, {
    ...selectedAgeFilter.value,
    ...update,
  });
}

function apply() {
  emit("apply");
  emit("close-modal");
}
</script>
