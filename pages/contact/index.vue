<template>
  <div class="page page-contact" ref="pageRoot">
    <client-only>
      <GlobalMainMenu />
      <GlobalMobileMenu />
    </client-only>
    <ContactGrid />
    <ContactFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watchEffect, watch } from "vue";

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

const { data: page } = await useAsyncData("contactData", async () => {
  try {
    const [contactPage] = await Promise.all([
      prismic.client.getSingle("contact"),
    ]);

    return {
      contactPage,
    };
  } catch (error) {
    console.error("Error fetching contact page data:", error);
    // You might want to handle the error appropriately here
    // For example, redirect to an error page or show a notification
    throw error; // This will propagate the error to Nuxt's error handling
  }
});

// --- Theme Color Meta Tag Logic ---
const colorMode = useColorMode();
const currentThemeColor = ref("");
const pageRoot = ref(null);

// Updated updateThemeColor function to use --color-background CSS variable
const updateThemeColor = async () => {
  await nextTick();
  if (process.client) {
    const computedStyle = getComputedStyle(document.documentElement);
    const bgColor = computedStyle.getPropertyValue("--color-background").trim();

    // Convert CSS variable to actual color value
    let themeColor = bgColor;
    if (bgColor.startsWith("var(--")) {
      // If it's still a CSS variable, get the computed value
      const tempEl = document.createElement("div");
      tempEl.style.backgroundColor = bgColor;
      document.body.appendChild(tempEl);
      themeColor = getComputedStyle(tempEl).backgroundColor;
      document.body.removeChild(tempEl);
    }

    currentThemeColor.value = themeColor;
  }
};

watchEffect(async () => {
  await updateThemeColor();
});

// Add watch for color mode changes
watch(
  () => colorMode.value,
  async () => {
    await updateThemeColor();
  }
);

onMounted(async () => {
  await updateThemeColor(); // Initial set on mount
});

// SEO and Theme Color
useHead({
  title: `Choir — ${page?.value?.contactPage?.data?.page_title || ""}`,
  meta: [
    {
      name: "description",
      content: page?.value?.contactPage?.data?.meta_description,
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
