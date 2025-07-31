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
import { ref, onMounted, nextTick, watchEffect, watch } from "vue";
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

const { $ScrollTrigger } = useNuxtApp();

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
  setTimeout(() => {
    $ScrollTrigger.refresh();
  }, 1000);
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
