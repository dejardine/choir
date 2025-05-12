<template>
  <div class="page page-about" ref="pageRoot">
    <GlobalMainMenu />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watchEffect } from "vue";

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

const { data: page } = await useAsyncData("aboutData", async () => {
  try {
    const [aboutPage] = await Promise.all([prismic.client.getSingle("about")]);

    return {
      aboutPage,
    };
  } catch (error) {
    console.error("Error fetching about page data:", error);
    // You might want to handle the error appropriately here
    // For example, redirect to an error page or show a notification
    throw error; // This will propagate the error to Nuxt's error handling
  }
});

// --- Theme Color Meta Tag Logic ---
const colorMode = useColorMode();
const currentThemeColor = ref("");
const pageRoot = ref(null);

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

watchEffect(async () => {
  await updateThemeColor();
});

onMounted(async () => {
  await updateThemeColor(); // Initial set on mount
});

// SEO and Theme Color
useHead({
  title: `Choir — ${page?.value?.aboutPage?.data?.page_title || ""}`,
  meta: [
    {
      name: "description",
      content: page?.value?.aboutPage?.data?.meta_description,
    },
    // Add the dynamic theme-color meta tag
    {
      name: "theme-color",
      content: currentThemeColor,
    },
  ],
});

// Page Transition
definePageMeta({
  pageTransition: globalRouteTransition,
});
</script>
