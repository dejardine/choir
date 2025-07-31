<template>
  <div class="page page-about" ref="pageRoot">
    <GlobalMainMenu />
    <GlobalMobileMenu />

    <PageHeader
      :heading="page?.about?.data?.heading"
      :subheading="page?.about?.data?.sub_heading"
      :paragraph="page?.about?.data?.paragraph"
    />
    <AboutHeroMedia :slideshow="page?.about?.data?.slideshow" />
    <AboutWhy :about="page?.about?.data" />
    <AboutWhat :about="page?.about?.data" />
    <AboutTeam :about="page?.about?.data" />
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

<style scoped lang="scss">
.page-about {
  .footer-wrap {
    border-top: none;
  }
}
</style>
