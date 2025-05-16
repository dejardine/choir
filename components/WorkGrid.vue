<template>
  <div class="work-grid">
    <template
      v-for="(projectGroup, index) in page?.work?.data?.projects"
      :key="projectGroup.case_study?.id || `project-grid-item-${index}`"
    >
      <prismic-link
        :field="projectGroup.case_study"
        class="work-grid-item animate-in"
      >
        <div
          v-if="
            !(
              projectGroup.case_study &&
              !projectGroup.case_study.id &&
              projectGroup.case_study.link_type === 'Document'
            )
          "
        >
          <!-- Case 1: Link exists AND data is populated by graphQuery -->
          <template
            v-if="projectGroup.case_study && projectGroup.case_study.data"
          >
            <div class="item-content">
              <!-- Vimeo Player with Cover -->
              <VimeoPlayerLoop
                v-if="
                  projectGroup.case_study.data.video_thumbnail &&
                  projectGroup.case_study.data.video_thumbnail.url &&
                  projectGroup.case_study.data.image_thumbnail &&
                  projectGroup.case_study.data.image_thumbnail.url
                "
                :video-id="
                  getVimeoId(projectGroup.case_study.data.video_thumbnail.url)
                "
                :cover-image-url="
                  projectGroup.case_study.data.image_thumbnail.url
                "
                :cover-image="projectGroup.case_study.data.image_thumbnail"
                class="thumbnail-video"
              />

              <!-- Image Thumbnail (if no video with cover) -->
              <ImageHalf
                v-else-if="
                  projectGroup.case_study.data.image_thumbnail &&
                  projectGroup.case_study.data.image_thumbnail.url
                "
                :imageField="projectGroup.case_study.data.image_thumbnail"
                class="thumbnail-image"
              />

              <!-- Video Thumbnail (fallback if no cover image for VimeoPlayerLoop) -->
              <video
                v-else-if="
                  projectGroup.case_study.data.video_thumbnail &&
                  projectGroup.case_study.data.video_thumbnail.url
                "
                :src="projectGroup.case_study.data.video_thumbnail.url"
                autoplay
                loop
                muted
                playsinline
                class="thumbnail-video"
              ></video>

              <!-- Gallery Thumbnail (using ThumbnailGallery component) -->
              <ThumbnailGallery
                v-else-if="
                  projectGroup.case_study.data.gallery_thumbnail &&
                  projectGroup.case_study.data.gallery_thumbnail.length > 0
                "
                :images="
                  projectGroup.case_study.data.gallery_thumbnail.map(
                    (item) => ({
                      url: item.image.url,
                      alt: item.image.alt,
                      dimensions: item.image.dimensions,
                    }) // Pass dimensions
                  )
                "
              />

              <!-- Fallback if no media (but data object exists) -->
              <div v-else class="no-media">
                No media available for this case study.
              </div>

              <!-- Thumbnail Title -->
              <div
                v-if="projectGroup.case_study.data.thumbnail_title"
                class="thumbnail-title"
              >
                <prismic-rich-text
                  :field="projectGroup.case_study.data.thumbnail_title"
                />
              </div>
            </div>
          </template>

          <!-- Case 2: Link field exists, but data is NOT populated (broken link, unpublished, etc.) -->
          <template
            v-else-if="
              projectGroup.case_study &&
              projectGroup.case_study.id &&
              !projectGroup.case_study.data
            "
          >
            <div class="item-content error"></div>
          </template>

          <!-- Case 3 (was Case 4): projectGroup.case_study field itself is missing or not a valid link object -->
          <!-- This 'else' catches scenarios not covered by the above, assuming the parent v-if has filtered out empty links -->
          <template v-else>
            <div class="item-content error"></div>
          </template>
        </div>
      </prismic-link>
    </template>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import ImageHalf from "./ImageHalf.vue"; // Added ImageHalf import
import ThumbnailGallery from "./ThumbnailGallery.vue"; // Re-added ThumbnailGallery import
import VimeoPlayerLoop from "./VimeoPlayerLoop.vue";

// Helper function to extract Vimeo ID
const getVimeoId = (url) => {
  if (!url) return null;

  // Clean the URL: remove leading/trailing whitespace and quotes.
  const cleanedUrl = url.trim().replace(/["“”]/g, "");

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

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.work-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr); /* Two columns */
  gap: var(--gutter);
  padding: var(--gutterPadding);
}

.work-grid-item {
  grid-column: auto / span 6;
  .thumbnail-image,
  .thumbnail-video {
    :deep(img) {
      width: 100%;
      height: auto;
      aspect-ratio: 3/2;
      object-fit: cover;
      object-position: center bottom;
      margin-bottom: var(--gutter-half);
    }
  }

  .thumbnail-title {
    margin-top: var(--gutter-half);
    margin-bottom: var(--gutter-3);
    :deep(p) {
      margin: 0;
      @include bodyType;
      strong {
        @include foundersSemiBold;
        font-weight: normal;
      }
    }
  }
}
</style>
