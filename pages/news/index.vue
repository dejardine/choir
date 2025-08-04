<template>
  <div class="page page-news" ref="pageRoot">
    <client-only>
      <GlobalMainMenu />
      <GlobalMobileMenu />
    </client-only>
    <PageHeader
      :heading="page?.newsLandingPage?.data?.heading"
      :subheading="page?.newsLandingPage?.data?.sub_heading"
      :paragraph="page?.newsLandingPage?.data?.paragraph"
    />
    <NewsGrid
      v-if="newsGridData?.newsLandingPageWithData?.data?.news_items"
      :page="newsGridData"
      :newsLandingPage="page?.newsLandingPage"
      :footer-height="footerHeight"
    />
    <GlobalFooter ref="globalFooter" />
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watchEffect,
  watch,
  computed,
} from "vue";
import NewsGrid from "~/components/NewsGrid.vue";

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

// Get basic data for PageHeader
const { data: page } = await useAsyncData("newsLandingData", async () => {
  try {
    const [newsLandingPage] = await Promise.all([
      prismic.client.getSingle("news_landing"),
    ]);

    return {
      newsLandingPage,
    };
  } catch (error) {
    console.error("Error fetching news landing page data:", error);
    throw error;
  }
});

// Get detailed data for NewsGrid
const { data: newsGridData } = await useAsyncData("newsGridData", async () => {
  try {
    const graphQuery = `{
      news_landing {
        news_items {
          item {
            ...on news {
              image_thumbnail
              video_thumbnail
              heading
              paragraph
              link
            }
          }
        }
      }
    }`;

    const [newsLandingPageWithData] = await Promise.all([
      prismic.client.getSingle("news_landing", { graphQuery }),
    ]);

    return {
      newsLandingPageWithData,
    };
  } catch (error) {
    console.error("Error fetching news grid data:", error);
    return { newsLandingPageWithData: null };
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

  // Update footer height on mount
  await nextTick();
  updateFooterHeight();

  // Add resize listener to update footer height
  window.addEventListener("resize", updateFooterHeight);
});

// Clean up resize listener
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateFooterHeight);
});

// Footer height tracking
const globalFooter = ref(null);
const footerHeight = ref(0);

// Computed property to get footer height
const updateFooterHeight = () => {
  if (globalFooter.value) {
    footerHeight.value = globalFooter.value.$el?.offsetHeight || 0;
  }
};

// SEO and Theme Color
useHead({
  title: `Choir — ${page?.value?.newsLandingPage?.data?.page_title || ""}`,
  meta: [
    {
      name: "description",
      content: page?.value?.newsLandingPage?.data?.meta_description,
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

<style lang="scss" scoped>
.page-news {
  :deep(.page-header) {
    margin-bottom: 0;
    padding: 0;
    position: relative;
    .page-header-wrap {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1;
      padding: var(--gutter) var(--gutterPadding);
    }
  }
}
</style>
