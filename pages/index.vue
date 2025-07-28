<template>
  <div class="page page-home" ref="pageRoot">
    <GlobalMainMenu />
    <GlobalMobileMenu />
    <div id="content">
      <HomeHero :home="page?.home" />
      <HomeProjects :home="page?.home" class="animate-in" />
      <HomeAbout :home="page?.home" class="animate-in" />
    </div>
    <div class="footer-wrap">
      <CTA
        :cta="page.home.data.call_to_action"
        :ctaLink="page.home.data.call_to_action_link"
        class="animate-in"
      />
      <GlobalFooter />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  nextTick,
  onBeforeUnmount,
  watchEffect,
  watch,
} from "vue";

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

const { $ScrollTrigger } = useNuxtApp();

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

// Restore watchEffect
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

// Restore onMounted with updateThemeColor call
onMounted(async () => {
  await updateThemeColor(); // Initial set on mount
  setTimeout(() => {
    $ScrollTrigger.refresh();
  }, 1000);
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
