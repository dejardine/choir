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
  <button
    v-if="isMounted"
    @click="toggleMode"
    class="theme-switcher"
    :aria-label="`Switch to ${colorMode.value === 'dark' ? 'light' : 'dark'} mode`"
    :class="{ 'is-dark': colorMode.value === 'dark' }"
  ></button>
</template>

<style scoped lang="scss">
@use "@/assets/scss/breakpoints" as *;

.theme-switcher {
  background-color: var(--color-text);
  color: var(--color-background);
  border: 1px solid var(--color-text);
  width: var(--gutter-half);
  height: var(--gutter-half);
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
  &:hover {
    opacity: 0.8;
    text-decoration: none;
  }
}
</style>
