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
              <!-- Image Thumbnail -->
              <img
                v-if="
                  projectGroup.case_study.data.image_thumbnail &&
                  projectGroup.case_study.data.image_thumbnail.url
                "
                :src="projectGroup.case_study.data.image_thumbnail.url"
                :alt="
                  projectGroup.case_study.data.image_thumbnail.alt ||
                  'Case study thumbnail'
                "
                class="thumbnail-image"
              />

              <!-- Video Thumbnail -->
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
                    (item) => ({ url: item.image.url, alt: item.image.alt })
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
import ThumbnailGallery from "./ThumbnailGallery.vue";

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
  padding: var(--gutter);
}

.work-grid-item {
  grid-column: auto / span 6;
  .thumbnail-image,
  .thumbnail-video {
    width: 100%;
    height: auto;
    aspect-ratio: 3/2;
    object-fit: cover;
    object-position: center bottom;
    margin-bottom: var(--gutter-half);
  }

  .thumbnail-title {
    margin-top: var(--gutter-half);
    margin-bottom: var(--gutter-3);
    :deep(p) {
      margin: 0;
      @include smallType;
      strong {
        @include foundersSemiBold;
        font-weight: normal;
      }
    }
  }

  .no-media {
  }
  .error {
  }
}
</style>
