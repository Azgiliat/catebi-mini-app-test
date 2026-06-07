<template>
  <section class="px-4 py-4">
    <h1 class="text-2xl leading-8 font-medium text-gray-800">
      Profile
    </h1>
    <div class="mt-4 rounded border border-gray-200 bg-white p-4">
      <div class="flex items-center gap-3">
        <div
          class="bg-catebi-light text-catebi grid size-14 place-items-center rounded-full text-xl font-semibold"
        >
          AS
        </div>
        <div>
          <p class="text-lg leading-7 text-gray-900">
            Anton Sapovalov
          </p>
          <p class="text-sm leading-5 text-gray-600">
            Adoption applicant
          </p>
        </div>
      </div>
    </div>
    <div class="mt-4 rounded border border-gray-200 bg-white">
      <div
        v-for="item in profileItems"
        :key="item.label"
        class="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0"
      >
        <span class="text-sm leading-5 text-gray-700">{{ item.label }}</span>
        <span class="text-sm leading-5 text-gray-900">{{ item.value }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const profileItems = [
  { label: "Saved cats", value: "3" },
  { label: "Applications", value: "1 active" },
  { label: "Location", value: "Tbilisi" },
];
</script>
