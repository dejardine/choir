<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { getSliceComponentProps } from "@prismicio/vue";
import { computed } from "vue";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.DoubleMediaSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const sectionClasses = computed(() => {
  let alignClass = "double-media--align-left"; // default

  if (props.slice.primary.align_media) {
    // Convert dropdown value to valid CSS class name (lowercase, remove spaces)
    const alignValue = props.slice.primary.align_media
      .toLowerCase()
      .replace(/\s+/g, "-");
    alignClass = `double-media--align-${alignValue.replace(/^align-/, "")}`;
  }

  return {
    "double-media-slice": true,
    "has-bottom-margin": props.slice.primary.bottom_margin === true,
    [alignClass]: true,
  };
});

const leftVimeoVideoId = computed(() => {
  if (props.slice.primary.left_vimeo_video_link) {
    const url = props.slice.primary.left_vimeo_video_link;
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

const rightVimeoVideoId = computed(() => {
  if (props.slice.primary.right_vimeo_video_link) {
    const url = props.slice.primary.right_vimeo_video_link;
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
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    :class="sectionClasses"
  >
    <div class="double-media-container">
      <!-- Left Media -->
      <div class="double-media-item double-media-left">
        <template v-if="leftVimeoVideoId">
          <VimeoPlayerLoop
            :video-id="leftVimeoVideoId"
            :cover-image-url="slice.primary.left_image?.url"
          />
        </template>
        <template v-else-if="slice.primary.left_image?.url">
          <ImageFull :image-field="slice.primary.left_image" />
        </template>
        <template v-else>
          <div class="placeholder">Left media missing</div>
        </template>

        <!-- Left Caption -->
        <div v-if="slice.primary.left_caption" class="caption left-caption">
          <PrismicRichText :field="slice.primary.left_caption" />
        </div>
      </div>

      <!-- Right Media -->
      <div class="double-media-item double-media-right">
        <template v-if="rightVimeoVideoId">
          <VimeoPlayerLoop
            :video-id="rightVimeoVideoId"
            :cover-image-url="slice.primary.right_image?.url"
          />
        </template>
        <template v-else-if="slice.primary.right_image?.url">
          <ImageFull :image-field="slice.primary.right_image" />
        </template>
        <template v-else>
          <div class="placeholder">Right media missing</div>
        </template>

        <!-- Right Caption -->
        <div v-if="slice.primary.right_caption" class="caption right-caption">
          <PrismicRichText :field="slice.primary.right_caption" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/scss/breakpoints.scss" as *;

.double-media-slice {
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

  &.double-media--align-left {
    .double-media-container {
      grid-column: 1 / span 8;
    }
  }

  &.double-media--align-center {
    .double-media-container {
      grid-column: 3 / span 8;
    }
  }

  &.double-media--align-right {
    .double-media-container {
      grid-column: 5 / span 8;
    }
  }
}

.double-media-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: var(--gutter);
}

.double-media-item {
  width: 100%;
  display: flex;
  flex-direction: column;

  &.double-media-left {
    grid-column: 1 / span 4;
  }

  &.double-media-right {
    grid-column: 6 / span 3;
  }

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

.placeholder {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  @include smallType;
  border: 1px dashed #ccc;
}

.caption {
  :deep(p) {
    margin: 0;
    @include smallType;
    @include heldaneText;
    em {
      @include heldaneTextItalic;
    }
    color: var(--color-text);
    margin-top: var(--gutter);
  }

  :deep(a) {
    color: inherit;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
}
</style>
