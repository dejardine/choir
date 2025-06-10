<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { getSliceComponentProps } from "@prismicio/vue";
import { computed } from "vue";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.LargeMediaSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const sectionClasses = computed(() => {
  let alignClass = "medium-media--left"; // default

  if (props.slice.primary.align_media) {
    // Convert dropdown value to valid CSS class name (lowercase, remove spaces)
    const alignValue = props.slice.primary.align_media
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/^align-/, ""); // Remove "align-" prefix if it exists
    alignClass = `medium-media--${alignValue}`;
  }

  return {
    "medium-media-slice": true,
    "has-bottom-margin": props.slice.primary.bottom_margin === true,
    [alignClass]: true,
  };
});

const vimeoVideoId = computed(() => {
  if (
    props.slice.variation === "video" &&
    props.slice.primary.vimeo_video_link &&
    "url" in props.slice.primary.vimeo_video_link &&
    props.slice.primary.vimeo_video_link.url
  ) {
    const url = props.slice.primary.vimeo_video_link.url;
    const parts = url.split("/");
    let id = parts.pop(); // Get last part
    if (!id && parts.length > 0) {
      // If last part was empty (e.g. trailing slash)
      id = parts.pop();
    }
    if (id) {
      return id.split("?")[0]; // Remove query parameters
    }
  }
  return null;
});

const videoCoverImageUrl = computed(() => {
  if (props.slice.variation === "video") {
    // Ensure video_placeholder_image exists and has a url
    return props.slice.primary.video_placeholder_image?.url;
  }
  return null;
});
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    :class="sectionClasses"
  >
    <div class="medium-media-container">
      <template v-if="slice.variation === 'default'">
        <ImageFull
          v-if="slice.primary.image?.url"
          :image-field="slice.primary.image"
        />
        <div v-else>
          <!-- Default LargeMedia: Image data is missing. -->
        </div>
      </template>
      <template v-else-if="slice.variation === 'video'">
        <VimeoPlayerLoop
          v-if="vimeoVideoId && videoCoverImageUrl"
          :video-id="vimeoVideoId"
          :cover-image-url="videoCoverImageUrl"
        />
        <div v-else>
          <!-- Video LargeMedia: Video ID or Cover Image URL is missing. -->
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/scss/breakpoints.scss" as *;

.medium-media-slice {
  width: 100%;
  padding-left: var(--gutterPadding);
  padding-right: var(--gutterPadding);
  padding-bottom: var(--gutter);
  padding-top: 0;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);

  &.has-bottom-margin {
    padding-bottom: var(--slide-padding);
  }

  &.medium-media--left {
    .medium-media-container {
      grid-column: 1 / span 8;
    }
  }

  &.medium-media--center {
    .medium-media-container {
      grid-column: 3 / span 8;
    }
  }

  &.medium-media--right {
    .medium-media-container {
      grid-column: 5 / span 8;
    }
  }

  @include breakpoint(mobile) {
    grid-template-columns: 1fr;
    padding-left: var(--gutterPadding);
    padding-right: var(--gutterPadding);

    .medium-media-container {
      grid-column: 1;
    }
  }
}

.medium-media-container {
  width: 100%;

  :deep(.image-full-container) {
    width: 100%;
    height: auto;
  }

  :deep(img) {
    width: 100%;
    height: auto;
  }

  :deep(.vimeo-player-wrapper) {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
  }
}
</style>
