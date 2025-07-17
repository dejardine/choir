<template>
  <div class="page page-project" ref="pageRoot">
    <GlobalMainMenu />
    <div id="content">
      <ProjectHeader :project="page.project.data" />
      <ProjectInformation :project="page.project.data" />
      <div class="project-slices">
        <SliceZone
          :slices="page?.project?.data?.slices4 ?? []"
          :components="components"
        />
      </div>
    </div>
    <div class="footer-wrap">
      <CTA
        :cta="page.project.data.call_to_action"
        :ctaLink="page.project.data.call_to_action_link"
      />
      <ProjectNavigation
        :currentProjectUID="page?.project?.uid"
        :projectsGroup="page?.workPage?.data?.projects"
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
} from "#imports";

import { components } from "~/slices";

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

const { data: page } = await useAsyncData(
  `${route.params.uid}-workdata`,
  async () => {
    try {
      const projectPromise = prismic.client.getByUID(
        "case_study",
        route.params.uid
      );

      // GraphQuery to fetch thumbnail_title and alt_thumbnail from linked case_study documents
      // within the 'work' page's 'projects' group.
      const workPageGraphQuery = `{
        work {
          projects {
            case_study {
              ...on case_study {
                thumbnail_title
                alt_thumbnail
              }
            }
          }
        }
      }`;

      const workPagePromise = prismic.client.getSingle("work", {
        graphQuery: workPageGraphQuery,
      });

      const [project, workPage] = await Promise.all([
        projectPromise,
        workPagePromise,
      ]);

      if (!project) {
        throw createError({
          statusCode: 404,
          message: `Case study with UID ${route.params.uid} not found`,
        });
      }

      return {
        project,
        workPage,
      };
    } catch (error) {
      console.error("Error fetching project or work page data:", error);
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || "Internal Server Error",
        cause: error,
      });
    }
  }
);

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

<style scoped lang="scss">
.project-slices {
  background-color: var(--color-background);
  position: relative;
  z-index: 10;
  padding-bottom: 33.3333vh;
}

#content {
}
</style>
