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
    class="project-section"
    :data-title="slice.primary.project_copy"
    :data-link="slice.primary.project_link"
  >
    <div class="project-content">
      <!-- Media 1 -->
      <div v-if="media1" class="media-item">
        <prismic-link
          v-if="slice.primary.project_link"
          :field="slice.primary.project_link"
          class="media-item-link"
        >
          <template v-if="isVideo(media1) && videoId1">
            <VimeoPlayerLoop
              :video-id="getVimeoId(media1.vimeo_video_link.url)"
              :cover-image-url="media1.image.url"
              :cover-image="media1.image"
            />
          </template>
          <ImageHalf v-else-if="isImage(media1)" :imageField="media1.image" />
        </prismic-link>
        <template v-else>
          <div class="media-item-link">
            <template v-if="isVideo(media1) && videoId1">
              <VimeoPlayerLoop
                :video-id="getVimeoId(media1.vimeo_video_link.url)"
                :cover-image-url="media1.image.url"
                :cover-image="media1.image"
              />
            </template>
            <ImageHalf v-else-if="isImage(media1)" :imageField="media1.image" />
          </div>
        </template>
      </div>

      <!-- Media 2 -->
      <div v-if="media2" class="media-item">
        <prismic-link
          v-if="slice.primary.project_link"
          :field="slice.primary.project_link"
          class="media-item-link"
        >
          <template v-if="isVideo(media2) && videoId2">
            <VimeoPlayerLoop
              :video-id="getVimeoId(media2.vimeo_video_link.url)"
              :cover-image-url="media2.image.url"
              :cover-image="media2.image"
            />
          </template>
          <ImageHalf v-else-if="isImage(media2)" :imageField="media2.image" />
        </prismic-link>
        <template v-else>
          <div class="media-item-link">
            <template v-if="isVideo(media2) && videoId2">
              <VimeoPlayerLoop
                :video-id="getVimeoId(media2.vimeo_video_link.url)"
                :cover-image-url="media2.image.url"
                :cover-image="media2.image"
              />
            </template>
            <ImageHalf v-else-if="isImage(media2)" :imageField="media2.image" />
          </div>
        </template>
      </div>

      <!-- Media 3 -->
      <div v-if="media3" class="media-item">
        <prismic-link
          v-if="slice.primary.project_link"
          :field="slice.primary.project_link"
          class="media-item-link"
        >
          <template v-if="isVideo(media3) && videoId3">
            <VimeoPlayerLoop
              :video-id="getVimeoId(media3.vimeo_video_link.url)"
              :cover-image-url="media3.image.url"
              :cover-image="media3.image"
            />
          </template>
          <ImageHalf v-else-if="isImage(media3)" :imageField="media3.image" />
        </prismic-link>
        <template v-else>
          <div class="media-item-link">
            <template v-if="isVideo(media3) && videoId3">
              <VimeoPlayerLoop
                :video-id="getVimeoId(media3.vimeo_video_link.url)"
                :cover-image-url="media3.image.url"
                :cover-image="media3.image"
              />
            </template>
            <ImageHalf v-else-if="isImage(media3)" :imageField="media3.image" />
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.project-content {
}

.media-item {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
}

.project-copy {
  margin-bottom: 20px;
}

.project-section {
  &:nth-of-type(3n + 1) {
    .media-item {
      &:nth-of-type(1) {
        .media-item-link {
          grid-column: 3 / span 8;
        }
      }
      &:nth-of-type(2) {
        padding-top: 25vh;
        .media-item-link {
          grid-column: 5 / span 2;
        }
      }
      &:nth-of-type(3) {
        .media-item-link {
          grid-column: 8 / span 4;
        }
      }
    }
  }
  &:nth-of-type(3n + 2) {
    .media-item {
      &:nth-of-type(1) {
        padding-top: 25vh;
        .media-item-link {
          grid-column: 1 / span 3;
        }
      }
      &:nth-of-type(2) {
        .media-item-link {
          grid-column: 5 / span 8;
        }
      }
      &:nth-of-type(3) {
        .media-item-link {
          grid-column: 2 / span 8;
        }
      }
    }
  }
  &:nth-of-type(3n + 3) {
    .media-item {
      &:nth-of-type(1) {
        padding-top: 25vh;
        .media-item-link {
          grid-column: 3 / span 4;
        }
      }
      &:nth-of-type(2) {
        .media-item-link {
          grid-column: 10 / span 3;
        }
      }
      &:nth-of-type(3) {
        padding-top: 25vh;
        .media-item-link {
          grid-column: 2 / span 8;
        }
      }
    }
  }
}
</style>
