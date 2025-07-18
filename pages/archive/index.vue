<template>
  <div class="page page-archive" ref="pageRoot">
    <GlobalMainMenu />
    <ArchiveGrid :page="page" />
    <div class="footer-wrap">
      <CTATop :cta="page?.archive?.data?.call_to_action" />
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
