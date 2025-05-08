<template>
  <div class="container">
    <NuxtPage />

    <client-only>
      <GlobalRouteTransition />
      <GlobalPreloader />
    </client-only>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "#imports"; // Simplified imports

onMounted(() => {
  console.log(
    `%c
░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░▄▀▀▄░░░░░░░░░░░░░
░░░░░░▄▀▒▒▒▒▀▄░░░░░░░░░░░
░░░░░░░▀▌▒▒▐▀░░░░░░░░░░░░
░▄███▀░◐░░░▌░░░░░░░░░░░░░░
░░░▐▀▌░░░░░▐░░░░░░░░░░▄▀▀▀▄▄
░░▐░░▐░░░░░▐░░░░░░░░░█░▄█▀
░░▐▄▄▌░░░░░▐▄▄░░░░░░█░░▄▄▀▀▀▀▄
░░░░░░▌░░░░▄▀▒▒▀▀▀▀▄▀░▄▀░▄▄▄▀▀
░░░░▐░░░░▐▒▒▒▒▒▒▒▒▀▀▄░░▀▄▄▄░▄
░░░░▐░░░░▐▄▒▒▒▒▒▒▒▒▒▒▀▄░▄▄▀▀
░░░░░▀▄░░░░▀▄▒▒▒▒▒▒▒▒▒▒▀▄
░░░░░░░▀▄▄░░░█▄▄▄▄▄▄▄▄▄▄▄▀▄
░░░░░░░░░░▀▀▄▄▄▄▄▄▄▄▀▀░
░░░░░░░░░░░░▌▌░▌▌░░░
░░░░░░░░░░▄▄▌▌▄▌▌░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░`,
    "color:red;"
  );
  console.log(
    "%cThis website was made by %c%s",
    "color:red;",
    "color:red; text-decoration:underline; cursor:pointer;",
    "http://grafik.nz"
  );
});

onUnmounted(() => {});
</script>

<style lang="scss"></style>
