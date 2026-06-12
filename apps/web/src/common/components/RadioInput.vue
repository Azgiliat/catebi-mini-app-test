<template>
  <label
    class="flex min-h-12 cursor-pointer items-center rounded-lg px-3 text-base leading-6 text-gray-900 transition-colors hover:bg-gray-50"
  >
    <span
      class="mr-3 grid size-5 place-items-center rounded-full border transition-colors"
      :class="checked ? 'border-catebi bg-catebi' : 'border-gray-300 bg-white'"
      aria-hidden="true"
    >
      <span
        v-if="checked"
        class="size-2 rounded-full bg-white"
      />
    </span>
    <input
      class="sr-only"
      type="radio"
      :name="name"
      :value="value"
      :checked="checked"
      @change="$emit('select')"
    />
    <span>{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  value: string;
  label: string;
  checked: boolean;
}>();

defineEmits<{
  select: [];
}>();
</script>
