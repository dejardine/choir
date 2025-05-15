<template>
  <div class="page page-project" ref="pageRoot">
    <GlobalMainMenu />

    <div class="footer-wrap">
      <CTA
        :cta="page.project.data.call_to_action"
        :ctaLink="page.project.data.call_to_action_link"
      />
      <GlobalFooter />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  nextTick,
  onBeforeUnmount,
  watchEffect,
} from "vue";

import {
  useColorMode,
  useHead,
  useNuxtApp,
  useRoute,
  usePrismic,
  useAsyncData,
  createError,
} from "#imports"; // Added imports

// Page Transition
import { globalRouteTransition } from "~/utils/GlobalRouteTransition";

import { useRouter } from "vue-router";

// Add router
const router = useRouter();

// Load GSAP libraries we need
const { $gsap, $ScrollTrigger } = useNuxtApp();

// Get the data
const prismic = usePrismic();
const route = useRoute();

const { data: page } = await useAsyncData(route.params.uid, async () => {
  try {
    // Remove menu fetch from here
    const [project] = await Promise.all([
      prismic.client.getByUID("case_study", route.params.uid),
    ]);

    return {
      project,
      // menu, // Removed
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message || "Internal Server Error",
      cause: error,
    });
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

useHead({
  title: `Choir — ${page?.value?.project?.data?.page_title || ""}`,
  meta: [
    // Standard Meta
    {
      name: "description",
      content: page?.value?.project?.data?.meta_description,
    },
  ],
});

// Page Transition
definePageMeta({
  pageTransition: globalRouteTransition,
});

onBeforeUnmount(() => {
  console.log("project before unmounted");
});
</script>

<style scoped lang="scss"></style>
