<template>
  <div class="page page-work" ref="pageRoot">
    <GlobalMainMenu />
    <GlobalMobileMenu />
    <PageHeader
      :heading="page?.work?.data?.heading"
      :subheading="page?.work?.data?.sub_heading"
      :paragraph="page?.work?.data?.paragraph"
    />

    <WorkGrid v-if="page?.work?.data?.projects" :page="page" />
    <div class="footer-wrap">
      <CTATop :cta="page?.work?.data?.call_to_action" />
      <GlobalFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watchEffect } from "vue";
import WorkGrid from "~/components/WorkGrid.vue";

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

const graphQuery = `{
  work {
    projects {
      case_study {
        ...on case_study {
          image_thumbnail
          alt_thumbnail
          thumbnail_title
          vimeo_loop_thumbnail
          gallery_thumbnail {
            image
          }
        }
      }

    }
      heading
      sub_heading
      paragraph
      call_to_action
      page_title
      meta_description
  }
}`;

const { data: page } = await useAsyncData("workData", async () => {
  try {
    const [work] = await Promise.all([
      prismic.client.getSingle("work", { graphQuery }),
    ]);

    return {
      work,
    };
  } catch (error) {
    console.error("Error fetching work page data:", error);
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
  title: `Choir — ${page?.value?.work?.data?.page_title || ""}`,
  meta: [
    {
      name: "description",
      content: page?.value?.work?.data?.meta_description,
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
.page-work {
  .footer-wrap {
    border-top: 0;
  }
}
</style>
