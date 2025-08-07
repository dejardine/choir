<template>
  <header class="project-hero" :style="heroHeightStyle">
    <VimeoPlayerLoop
      v-if="vimeoVideoId && headerImageUrl"
      :video-id="vimeoVideoId"
      :cover-image-url="headerImageUrl"
      :cover-image="project?.header_image"
    />
    <ImageFull
      :imageField="project?.header_image"
      v-else-if="project?.header_image"
    />
    <h1>{{ project.page_title }}</h1>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

// GSAP instance and responsive screens
const { $gsap, $screens } = useNuxtApp();

// State for header height
const projectInformationHeaderHeight = ref(0);

// Helper function to extract Vimeo ID (same pattern as used in WorkGrid.vue)
const getVimeoId = (url) => {
  if (!url) return null;

  // Clean the URL: remove leading/trailing whitespace and quotes.
  const cleanedUrl = url.trim().replace(/["""]/g, "");

  // Regex to capture Vimeo ID from various URL formats, including /event/
  const vimeoRegex =
    /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|event\/)?(\d+)/i;
  const match = cleanedUrl.match(vimeoRegex);

  if (match && match[1]) {
    // Ensure the extracted ID is purely numeric and parse it
    const numericId = match[1].replace(/\D/g, ""); // Remove any non-digit characters just in case
    return numericId ? parseInt(numericId, 10) : null;
  }
  return null;
};

const vimeoVideoId = computed(() => {
  if (props.project?.header_vimeo_video_link) {
    return getVimeoId(props.project.header_vimeo_video_link);
  }
  return null;
});

const headerImageUrl = computed(() => {
  // Use header_image as the cover image for the video player
  return props.project?.header_image?.url;
});

// Calculate hero height based on project-information-header height
const heroHeightStyle = computed(() => {
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const isMobile =
    $screens.value?.isMobile || (windowWidth > 0 && windowWidth <= 812);

  // During SSR or when header height is 0, use default height
  if (projectInformationHeaderHeight.value === 0) {
    return { height: "66.666vh" };
  }

  if (isMobile) {
    return { height: "66.666vh" }; // Default height for mobile
  }

  const calculatedHeight = `calc(100vh - ${projectInformationHeaderHeight.value}px + 48px)`;
  return { height: calculatedHeight };
});

// Function to update header height
const updateHeaderHeight = () => {
  const headerElements = document.querySelectorAll(
    ".project-information-header"
  );

  if (headerElements.length > 0) {
    // Use the first one if there are multiple
    const headerElement = headerElements[0];
    const height = headerElement.offsetHeight;
    projectInformationHeaderHeight.value = height;
  }
};

// Function to update image container height
const updateImageContainerHeight = () => {
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const isMobile =
    $screens.value?.isMobile || (windowWidth > 0 && windowWidth <= 812);

  if (isMobile) return;

  const imageContainer = document.querySelector(
    ".project-hero .image-full-container"
  );
  if (imageContainer) {
    const calculatedHeight = `calc(100vh - ${projectInformationHeaderHeight.value}px + 48px)`;
    imageContainer.style.height = calculatedHeight;
  }
};

onMounted(() => {
  // Initial calculation
  updateHeaderHeight();
  updateImageContainerHeight();

  // Create resize handler function
  const handleResize = () => {
    updateHeaderHeight();
    updateImageContainerHeight();
  };

  // Set up resize listener
  window.addEventListener("resize", handleResize);

  // Set up mutation observer to watch for changes in the project-information-header
  const headerObserver = new MutationObserver(() => {
    updateHeaderHeight();
    updateImageContainerHeight();
  });

  const headerElement = document.querySelector(".project-information-header");
  if (headerElement) {
    headerObserver.observe(headerElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  // Clean up observer and event listeners on unmount
  onBeforeUnmount(() => {
    headerObserver.disconnect();
    window.removeEventListener("resize", handleResize);
  });
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/global.scss" as *;
@use "@/assets/scss/breakpoints.scss" as *;

.project-hero {
  :deep(img) {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  .image-full-container {
    height: 66.666vh; // Default height for mobile
    @include breakpoint(mobile) {
      height: 66.666vh; // Keep default height on mobile
    }
  }
  position: fixed;
  width: 100%;
  height: 66.666vh; // Default height
  overflow: hidden;
  top: 0;
  left: 0;
  h1 {
    @include visually-hidden;
    @include breakpoint(display) {
      max-width: 2000px;
    }
  }
}
</style>
