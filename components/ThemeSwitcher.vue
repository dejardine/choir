<!-- components/ThemeSwitcher.vue -->
<script setup lang="ts">
import { useColorMode } from "#imports";

const colorMode = useColorMode();
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

// Function to toggle between light and dark mode directly
function toggleMode() {
  // If current mode is dark, switch to light, otherwise switch to dark
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
  >
    <span class="knob"></span>
  </button>
</template>

<style scoped lang="scss">
@use "@/assets/scss/breakpoints" as *;

.theme-switcher {
  // Add some basic styling
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 5px 10px;
  width: 48px; // Wider for the track
  height: 24px; // Height of the track
  cursor: pointer;
  border-radius: 13px; // Rounded ends for the track
  padding: 0;
  position: absolute;
  top: 15px;
  right: 0;
  transition: background-color 0.3s ease; // Smooth background transition

  .knob {
    position: absolute;
    top: 2px; // Position knob within the track
    left: 2px; // Start position (light mode)
    width: 18px; // Knob width
    height: 18px; // Knob height
    background-color: var(--color-text); // Knob color (opposite of track)
    border-radius: 50%; // Circular knob
    transform: translateX(0); // Explicit initial state
    transition: transform 0.3s ease; // Smooth sliding transition
    will-change: transform; // Hint for browser optimization
  }

  &:hover {
    opacity: 0.8;
    text-decoration: none; // Override global link hover if needed
  }

  // Apply transform when the button has the 'is-dark' class
  &.is-dark .knob {
    transform: translateX(23px); // Move knob to the right
  }
  @include breakpoint(laptop) {
    top: 13px;
  }
}
</style>
