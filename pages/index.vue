<template>
  <div class="page page-home" ref="pageRoot">
    <GlobalMainMenu />
    <div id="content">
      <HomeHero :home="page?.home" />
    </div>
    <GlobalFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount, watchEffect } from "vue";

import {
  useColorMode,
  useHead,
  useNuxtApp,
  usePrismic,
  useAsyncData,
} from "#imports";

// Page Transition
import { globalRouteTransition } from "~/utils/GlobalRouteTransition";

// Get the data
const prismic = usePrismic();

const { data: page } = await useAsyncData("homeData", async () => {
  try {
    // Remove menu fetch from here
    const [home] = await Promise.all([prismic.client.getSingle("home")]);

    return {
      home,
    };
  } catch (error) {
    console.error("Error fetching home page data:", error);
    // You might want to handle the error appropriately here
    // For example, redirect to an error page or show a notification
    throw error; // This will propagate the error to Nuxt's error handling
  }
});

// --- Theme Color Meta Tag Logic ---
const colorMode = useColorMode();
const currentThemeColor = ref(""); // Restore ref
const pageRoot = ref(null); // Restore pageRoot ref

// Restore updateThemeColor function (without logs)
const updateThemeColor = async () => {
  await nextTick();
  if (process.client && pageRoot.value) {
    const computedStyle = getComputedStyle(pageRoot.value);
    const bgColor = computedStyle.backgroundColor;
    if (bgColor && bgColor !== "rgba(0, 0, 0, 0)") {
      currentThemeColor.value = bgColor;
    } else {
      currentThemeColor.value =
        colorMode.value === "dark" ? "#000000" : "#ffffff";
    }
  }
};

// Restore watchEffect
watchEffect(async () => {
  await updateThemeColor();
});

// Restore onMounted with updateThemeColor call
onMounted(async () => {
  await updateThemeColor(); // Initial set on mount
});

// SEO and Theme Color
useHead({
  title: `Choir — ${page?.value?.home?.data?.page_title || ""}`,
  meta: [
    {
      name: "description",
      content: page?.value?.home?.data?.meta_description,
    },
    // Add the dynamic theme-color meta tag
    {
      name: "theme-color",
      content: currentThemeColor, // Ensure binding is correct
    },
  ],
});

// Page Transition
definePageMeta({
  pageTransition: globalRouteTransition,
});
</script>
