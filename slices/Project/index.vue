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
const getVimeoId = (url: string | undefined | null) => {
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

// Get media data from Group fields
const media1 = props.slice.primary.media_1?.[0] || null;
const media2 = props.slice.primary.media_2?.[0] || null;
const media3 = props.slice.primary.media_3?.[0] || null;

// Computed properties for media item 1
const videoId1 = computed(() =>
  media1 ? getVimeoId(media1.vimeo_video_link?.url) : null
);
const coverImageUrl1 = computed(() => media1?.image?.url || null);
const coverImage1 = computed(() => media1?.image || null);

// Computed properties for media item 2
const videoId2 = computed(() =>
  media2 ? getVimeoId(media2.vimeo_video_link?.url) : null
);
const coverImageUrl2 = computed(() => media2?.image?.url || null);
const coverImage2 = computed(() => media2?.image || null);

// Computed properties for media item 3
const videoId3 = computed(() =>
  media3 ? getVimeoId(media3.vimeo_video_link?.url) : null
);
const coverImageUrl3 = computed(() => media3?.image?.url || null);
const coverImage3 = computed(() => media3?.image || null);

// Helper functions to check media type
const isVideo = (media: any) => {
  if (!media) return false;
  const hasVimeoLink = !!media.vimeo_video_link?.url;
  const hasCoverImage = !!media.image?.url;
  const vimeoId = hasVimeoLink ? getVimeoId(media.vimeo_video_link.url) : null;
  return hasVimeoLink && hasCoverImage && !!vimeoId;
};

const isImage = (media: any) => {
  return (
    media?.image?.url &&
    media?.image?.dimensions?.width &&
    media?.image?.dimensions?.height &&
    !media?.vimeo_video_link?.url
  );
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
        <template v-if="isVideo(media1) && videoId1">
          <div
            style="
              padding: 56.25% 0 0 0;
              position: relative;
              background-color: #111;
            "
          >
            <iframe
              :src="`https://player.vimeo.com/video/${videoId1}?muted=1&autoplay=1&loop=1&background=1&dnt=1`"
              style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              "
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
              title="Vimeo Video Player (Manual Embed)"
            ></iframe>
          </div>
        </template>
        <ImageHalf v-else-if="isImage(media1)" :imageField="media1.image" />
      </div>

      <!-- Media 2 -->
      <div v-if="media2" class="media-item">
        <template v-if="isVideo(media2) && videoId2">
          <div
            style="
              padding: 56.25% 0 0 0;
              position: relative;
              background-color: #111;
            "
          >
            <!-- Basic responsive wrapper & visible background -->
            <iframe
              :src="`https://player.vimeo.com/video/${videoId2}?muted=1&autoplay=1&loop=1&background=1&dnt=1`"
              style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              "
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
              title="Vimeo Video Player (Manual Embed)"
            ></iframe>
          </div>
        </template>
        <ImageHalf v-else-if="isImage(media2)" :imageField="media2.image" />
      </div>

      <!-- Media 3 -->
      <div v-if="media3" class="media-item">
        <template v-if="isVideo(media3) && videoId3">
          <div
            style="
              padding: 56.25% 0 0 0;
              position: relative;
              background-color: #111;
            "
          >
            <iframe
              :src="`https://player.vimeo.com/video/${videoId3}?muted=1&autoplay=1&loop=1&background=1&dnt=1`"
              style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              "
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
              title="Vimeo Video Player (Manual Embed)"
            ></iframe>
          </div>
        </template>
        <ImageHalf v-else-if="isImage(media3)" :imageField="media3.image" />
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
