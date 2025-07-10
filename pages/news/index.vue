<template>
  <div class="page page-news" ref="pageRoot">
    <GlobalMainMenu />
    <PageHeader
      :heading="page?.newsLandingPage?.data?.heading"
      :subheading="page?.newsLandingPage?.data?.sub_heading"
      :paragraph="page?.newsLandingPage?.data?.paragraph"
    />
    <NewsGrid
      v-if="newsGridData?.newsLandingPageWithData?.data?.news_items"
      :page="newsGridData"
    />
    <GlobalFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watchEffect } from "vue";
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
