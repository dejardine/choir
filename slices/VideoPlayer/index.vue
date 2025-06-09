<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { getSliceComponentProps } from "@prismicio/vue";
import { computed } from "vue";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.VideoPlayerSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const sectionClasses = computed(() => {
  return {
    "video-player-slice": true,
    "has-bottom-margin": props.slice.primary.bottom_margin === true,
  };
});

const vimeoVideoId = computed(() => {
  if (
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
  // Ensure video_placeholder_image exists and has a url
  return props.slice.primary.video_placeholder_image?.url;
});
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    :class="sectionClasses"
  >
    <VimeoPlayer
      v-if="vimeoVideoId && videoCoverImageUrl"
      :video-id="vimeoVideoId"
      :cover-image-url="videoCoverImageUrl"
    />
    <div v-else>
      <!-- VideoPlayer: Video ID or Cover Image URL is missing. -->
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/scss/breakpoints.scss" as *;

.video-player-slice {
  width: 100%;
  padding-left: var(--gutterPadding);
  padding-right: var(--gutterPadding);
  padding-bottom: var(--gutter);
  padding-top: 0;

  :deep(.vimeo-player-wrapper) {
    width: 100%;
    height: auto;
  }

  &.has-bottom-margin {
    padding-bottom: var(--slide-padding);
  }

  @include breakpoint(mobile) {
    padding-left: var(--gutterPadding);
    padding-right: var(--gutterPadding);
  }
}
</style>
