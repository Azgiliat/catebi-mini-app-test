<script setup lang="ts">
import { cloneVNode, h, ref, type VNode } from "vue";
import { useI18n } from "vue-i18n";

import AppIcon from "@/common/components/AppIcon.vue";

defineProps<{
  title: string;
}>();

const slots = defineSlots<{
  anchor(): VNode[];
  modal(): VNode[];
}>();

const { t } = useI18n();
const isOpen = ref(false);
const toggleModalState = () => {
  isOpen.value = !isOpen.value;
};

const AnchorWithClick = () =>
  h(cloneVNode(slots.anchor()[0], { onClick: toggleModalState }), null);
const ModalWithClose = () =>
  h(
    cloneVNode(slots.modal()[0], {
      onCloseModal: () => {
        isOpen.value = false;
      },
    }),
    null,
  );
</script>

<template>
  <AnchorWithClick />
  <Teleport to="#mobile-modal">
    <template v-if="isOpen">
      <section
        class="fixed inset-0 z-30 mx-auto flex min-h-screen w-full max-w-xl min-w-xs flex-col bg-white text-gray-900 shadow-xl"
        aria-modal="true"
        role="dialog"
        aria-labelledby="filter-title"
      >
        <header
          class="pt-tg-safe-top flex items-center justify-between border-b border-gray-200 p-4"
        >
          <h2
            id="filter-title"
            class="text-xl leading-7 font-normal text-gray-900"
          >
            {{ title }}
          </h2>
          <button
            class="flex place-items-center rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100"
            type="button"
            :aria-label="t('common.closeFiltersAriaLabel')"
            @click="isOpen = false"
          >
            <AppIcon
              class="size-6"
              name="x"
              aria-hidden="true"
            />
          </button>
        </header>
        <ModalWithClose />
      </section>
    </template>
  </Teleport>
</template>
