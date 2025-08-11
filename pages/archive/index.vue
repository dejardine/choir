<template>
  <div class="page page-archive" ref="pageRoot">
    <client-only>
      <GlobalMainMenu />
      <GlobalMobileMenu />
    </client-only>
    <ArchiveGrid :page="page" />
    <div class="footer-wrap">
      <CTATop :cta="page?.archive?.data?.call_to_action" />
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

const { $ScrollTrigger } = useNuxtApp();

// Get the data
const prismic = usePrismic();

const graphQuery = `{
  archive {
    projects {
      case_study {
        ...on case_study {
          client {
            client {
              ...on client {
                client_name
              }
            }
          }
          industry {
            industry {
              ...on industry {
                industry_name
              }
            }
          }
          header_paragraph
          scope
          year
          alt_thumbnail
          quote
          quote_cite
          image_archive
          gallery_archive {
            image
          }
          vimeo_loop_archive
        }
      }
    }
    page_title
    meta_description
    call_to_action
  }
}`;

const { data: page } = await useAsyncData("archiveData", async () => {
  try {
    const [archive] = await Promise.all([
      prismic.client.getSingle("archive", { graphQuery }),
    ]);

    return {
      archive,
    };
  } catch (error) {
    console.error("Error fetching archive page data:", error);
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
  title: `Choir — ${page?.value?.archive?.data?.page_title || ""}`,
  meta: [
    {
      name: "description",
      content: page?.value?.archive?.data?.meta_description,
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
@import "~/assets/scss/global.scss";

.page-archive {
  .footer-wrap {
    border-top: 0;
  }
  :deep(.call-to-action-top) {
    .call-to-action-inner {
      text-align: left;
      justify-content: flex-start;
    }
    p {
      text-align: left;
      a {
        @include linkStyle;
      }
    }
  }
}
</style>
