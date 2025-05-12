<template>
  <div class="global-route-transition"></div>
</template>

<script setup>
const props = defineProps({});
</script>

<style lang="scss">
.global-route-transition {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2000;
  opacity: 0;
  display: none;
  background-color: var(--color-background);
}
</style>
