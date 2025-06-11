<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { getSliceComponentProps } from "@prismicio/vue";
import { computed } from "vue";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.ProjectSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

// Helper function to extract Vimeo ID
const getVimeoId = (url: string) => {
  if (!url) return null;
  const cleanedUrl = url.trim().replace(/["""]/g, "");
  const vimeoRegex =
    /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|event\/)?(\d+)/i;
  const match = cleanedUrl.match(vimeoRegex);
  if (match && match[1]) {
    const numericId = match[1].replace(/\D/g, "");
    return numericId ? parseInt(numericId, 10) : null;
  }
  return null;
};

// Get media data
const media1 = computed(() => props.slice.primary.media_1?.[0] || null);
const media2 = computed(() => props.slice.primary.media_2?.[0] || null);
const media3 = computed(() => props.slice.primary.media_3?.[0] || null);

// Helper functions
const isVideo = (media: any) => {
  return (
    media?.vimeo_video_link?.url &&
    media?.image?.url &&
    getVimeoId(media.vimeo_video_link.url)
  );
};

const isImage = (media: any) => {
  return media?.image?.url && !media?.vimeo_video_link?.url;
};
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="project-content">
      <!-- Project copy -->
      <div v-if="slice.primary.project_copy" class="project-copy">
        <prismic-rich-text :field="slice.primary.project_copy" />
      </div>

      <!-- Project link -->
      <div v-if="slice.primary.project_link" class="project-link">
        <prismic-link :field="slice.primary.project_link">
          View Project
        </prismic-link>
      </div>

      <!-- Media 1 -->
      <div v-if="media1" class="media-item">
        <VimeoPlayerLoop
          v-if="media1?.vimeo_video_link?.url"
          :video-id="getVimeoId(media1.vimeo_video_link.url)"
          :cover-image-url="media1.image.url"
          :cover-image="media1.image"
        />
        <ImageHalf
          v-if="media1?.image"
          :imageField="media1.image"
          sizes="(max-width: 1180px) 400px, (max-width: 1512px) 500px, (max-width: 2200px) 700px, 800px"
        />
      </div>

      <!-- Media 2 -->
      <div v-if="media2" class="media-item">
        <VimeoPlayerLoop
          v-if="media2?.vimeo_video_link?.url"
          :video-id="getVimeoId(media2.vimeo_video_link.url)"
          :cover-image-url="media2.image.url"
          :cover-image="media2.image"
        />
        <ImageHalf v-else-if="media2?.image" :imageField="media2.image" />
      </div>

      <!-- Media 3 -->
      <div v-if="media3" class="media-item">
        <VimeoPlayerLoop
          v-if="media3?.vimeo_video_link?.url"
          :video-id="getVimeoId(media3.vimeo_video_link.url)"
          :cover-image-url="media3.image.url"
          :cover-image="media3.image"
        />
        <ImageHalf v-else-if="media3?.image" :imageField="media3.image" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-content {
  padding: var(--gutterPadding);
}

.media-item {
  margin: var(--gutter) 0;
}

.project-copy {
  margin-bottom: 20px;
}

.project-link {
  margin-bottom: 20px;
}

.project-link a {
  text-decoration: underline;
}
</style>
