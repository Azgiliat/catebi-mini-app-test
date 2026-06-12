<template>
  <label class="space-y-2 text-sm text-gray-700">
    <span>{{ label }}</span>
    <input
      v-model="inputValue"
      class="focus:border-catebi focus:ring-catebi h-12 w-full rounded-lg border border-gray-300 px-3 text-base text-gray-900 outline-none focus:ring-1"
      type="number"
      inputmode="numeric"
      :min="min"
      :max="max"
      :placeholder="placeholder"
    >
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

const model = defineModel<number | null>({ required: true });

const props = withDefaults(
  defineProps<{
    label: string;
    min?: number;
    max?: number;
    placeholder?: string;
  }>(),
  {
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
    placeholder: undefined,
  },
);

const inputValue = computed({
  get: () => model.value ?? "",
  set: (inputValue: string) => {
    const parsedValue = Number(inputValue);

    model.value =
      inputValue === "" || !Number.isFinite(parsedValue)
        ? null
        : Math.min(Math.max(Math.trunc(parsedValue), props.min), props.max);
  },
});
</script>
