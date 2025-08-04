<template>
  <header class="project-hero">
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
import { computed } from "vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

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
    height: 90vh;
  }
  position: fixed;
  width: 100%;
  height: 90vh;
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
