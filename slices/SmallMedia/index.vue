<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { getSliceComponentProps } from "@prismicio/vue";
import { computed } from "vue";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.SmallMediaSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const sectionClasses = computed(() => {
  let alignClass = "small-media--left"; // default

  if (props.slice.primary.align_image) {
    // Convert dropdown value to valid CSS class name (lowercase, remove spaces)
    const alignValue = props.slice.primary.align_image
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/^align-/, ""); // Remove "align-" prefix if it exists
    alignClass = `small-media--${alignValue}`;
  }

  return {
    "small-media-slice": true,
    "has-bottom-margin": props.slice.primary.margin_bottom === true,
    [alignClass]: true,
  };
});

const vimeoVideoId = computed(() => {
  if (
    props.slice.variation === "videoLoop" &&
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
  if (props.slice.variation === "videoLoop") {
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
    <div class="small-media-container">
      <template v-if="slice.variation === 'default'">
        <ImageFull
          v-if="slice.primary.image?.url"
          :image-field="slice.primary.image"
        />
        <div v-else>
          <!-- Default SmallMedia: Image data is missing. -->
        </div>
      </template>
      <template v-else-if="slice.variation === 'videoLoop'">
        <VimeoPlayerLoop
          v-if="vimeoVideoId && videoCoverImageUrl"
          :video-id="vimeoVideoId"
          :cover-image-url="videoCoverImageUrl"
        />
        <div v-else>
          <!-- Video SmallMedia: Video ID or Cover Image URL is missing. -->
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/scss/breakpoints.scss" as *;

.small-media-slice {
  width: 100%;
  padding: var(--gutter) var(--gutterPadding);
  padding-top: 0;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);

  &.has-bottom-margin {
    padding-bottom: var(--slide-padding);
  }

  &.small-media--left {
    .small-media-container {
      grid-column: 1 / span 4;
    }
  }

  &.small-media--center {
    .small-media-container {
      grid-column: 5 / span 4;
    }
  }

  &.small-media--right {
    .small-media-container {
      grid-column: 9 / span 4;
    }
  }

  @include breakpoint(mobile) {
    grid-template-columns: 1fr;
    padding-left: var(--gutterPadding);
    padding-right: var(--gutterPadding);

    .small-media-container {
      grid-column: 1;
    }
  }
}

.small-media-container {
  width: 100%;

  :deep(img) {
    width: 100%;
    height: auto;
  }

  :deep(.image-full-container) {
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
