<!-- components/ThemeSwitcher.vue -->
<script setup lang="ts">
import { useColorMode } from "#imports";

const colorMode = useColorMode();
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

function toggleMode() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <div
    v-if="isMounted"
    class="theme-switcher-container"
    @click="toggleMode"
    :aria-label="`Switch to ${colorMode.value === 'dark' ? 'light' : 'dark'} mode`"
    role="button"
    tabindex="0"
    @keydown.enter="toggleMode"
    @keydown.space="toggleMode"
  >
    <div
      class="theme-switcher"
      :class="{ 'is-dark': colorMode.value === 'dark' }"
    ></div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/breakpoints" as *;

.theme-switcher-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--gutter-2));
  height: 100%;
  cursor: pointer;
  grid-column: 9 / span 1;
}

.theme-switcher {
  background-color: var(--color-reverse);
  color: var(--color-reverse);
  border: 1px solid var(--color-reverse);
  width: var(--gutter-half);
  height: var(--gutter-half);
  border-radius: 50%;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}

.theme-switcher-container:hover .theme-switcher {
  opacity: 0.8;
}
</style>
