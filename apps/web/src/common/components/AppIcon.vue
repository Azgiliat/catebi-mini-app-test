<template>
  <svg xmlns="http://www.w3.org/2000/svg">
    <use :href="href" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  name: string;
}>();

const href = computed(
  () => `${import.meta.env.BASE_URL}sprite.svg#icon-${props.name}`,
);
</script>
