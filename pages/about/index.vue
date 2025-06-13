<template>
  <div class="page page-about" ref="pageRoot">
    <GlobalMainMenu />

    <PageHeader
      :heading="page?.about?.data?.heading"
      :subheading="page?.about?.data?.sub_heading"
      :paragraph="page?.about?.data?.paragraph"
    />
    <AboutHeroMedia :slideshow="page?.about?.data?.slideshow" />

    <div class="footer-wrap">
      <CTA
        :cta="page.about.data.call_to_action"
        :ctaLink="page.about.data.call_to_action_link"
      />
      <GlobalFooter />
    </div>
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
    const [about] = await Promise.all([prismic.client.getSingle("about")]);

    return {
      about,
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
  title: `Choir — ${page?.value?.about?.data?.page_title || ""}`,
  meta: [
    {
      name: "description",
      content: page?.value?.about?.data?.meta_description,
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
