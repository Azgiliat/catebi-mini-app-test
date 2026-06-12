<template>
  <div
    class="global-loader"
    role="status"
    aria-label="Loading"
  >
    <div class="global-loader__indicator">
      <span
        class="global-loader__ring"
        aria-hidden="true"
      />
      <span
        class="global-loader__ring global-loader__ring--delayed"
        aria-hidden="true"
      />

      <AppIcon
        class="global-loader__logo"
        name="catebi-logo"
        aria-hidden="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppIcon from "./AppIcon.vue";
</script>

<style scoped>
.global-loader {
  position: fixed;
  z-index: 50;
  inset: 0;
  display: grid;
  min-height: 100dvh;
  place-items: center;
  overflow: hidden;
  background: linear-gradient(114.748deg, #ff5d03 0%, #e55302 100%);
}

.global-loader__indicator {
  --ring-max-scale: 1.9;
  --logo-size: min(128px, calc(50vw - 8px));

  position: relative;
  display: grid;
  width: var(--logo-size);
  height: var(--logo-size);
  place-items: center;
}

.global-loader__logo {
  position: relative;
  z-index: 1;
  width: var(--logo-size);
  height: var(--logo-size);
  animation: loader-logo 1.8s ease-in-out infinite alternate;
}

.global-loader__ring {
  position: absolute;
  width: var(--logo-size);
  height: var(--logo-size);
  border: 2px solid rgb(255 255 255 / 30%);
  border-radius: 50%;
  opacity: 0;
  transform: scale(1.25);
  animation:
    loader-ring-enter 0.35s ease-out forwards,
    loader-ring 2.4s 0.35s ease-in-out infinite alternate;
}

.global-loader__ring--delayed {
  animation-delay: 1.2s, 1.55s;
}

@keyframes loader-ring {
  from {
    transform: scale(1.25);
  }

  to {
    transform: scale(var(--ring-max-scale));
  }
}

@keyframes loader-ring-enter {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.45;
  }
}

@keyframes loader-logo {
  from {
    opacity: 0.5;
  }

  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .global-loader__logo {
    opacity: 0.61;
    animation: none;
  }

  .global-loader__ring {
    opacity: 0.4;
    transform: scale(1.6);
    animation: none;
  }

  .global-loader__ring--delayed {
    opacity: 0.14;
    transform: scale(var(--ring-max-scale));
  }
}
</style>
