<template>
  <div class="news-grid">
    <template
      v-for="(newsGroup, index) in page?.newsLandingPageWithData?.data
        ?.news_items"
      :key="newsGroup.item?.id || `news-grid-item-${index}`"
    >
      <div class="news-grid-item animate-in">
        <div
          v-if="
            !(
              newsGroup.item &&
              !newsGroup.item.id &&
              newsGroup.item.link_type === 'Document'
            )
          "
        >
          <!-- Case 1: Link exists AND data is populated by graphQuery -->
          <template v-if="newsGroup.item && newsGroup.item.data">
            <div class="item-content">
              <!-- Image Thumbnail -->
              <ImageHalf
                v-if="
                  newsGroup.item.data.image_thumbnail &&
                  newsGroup.item.data.image_thumbnail.url
                "
                :imageField="newsGroup.item.data.image_thumbnail"
                class="thumbnail-image"
              />

              <!-- Video Thumbnail -->
              <VimeoPlayerLoop
                v-else-if="
                  newsGroup.item.data.video_thumbnail &&
                  newsGroup.item.data.image_thumbnail?.url
                "
                :video-id="newsGroup.item.data.video_thumbnail"
                :cover-image-url="newsGroup.item.data.image_thumbnail.url"
                :cover-image="newsGroup.item.data.image_thumbnail"
                class="thumbnail-video"
              />

              <!-- Fallback if no media (but data object exists) -->
              <div v-else class="no-media"></div>

              <!-- Heading -->
              <div v-if="newsGroup.item.data.heading" class="news-heading">
                <prismic-rich-text :field="newsGroup.item.data.heading" />
              </div>

              <!-- Paragraph -->
              <div v-if="newsGroup.item.data.paragraph" class="news-paragraph">
                <prismic-rich-text :field="newsGroup.item.data.paragraph" />
              </div>

              <!-- Link -->
              <div v-if="newsGroup.item.data.link" class="news-link">
                <prismic-link :field="newsGroup.item.data.link"></prismic-link>
              </div>
            </div>
          </template>

          <!-- Case 2: Link field exists, but data is NOT populated (broken link, unpublished, etc.) -->
          <template
            v-else-if="
              newsGroup.item && newsGroup.item.id && !newsGroup.item.data
            "
          >
            <div class="item-content error"></div>
          </template>

          <!-- Case 3: newsGroup.item field itself is missing or not a valid link object -->
          <template v-else>
            <div class="item-content error"></div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import ImageHalf from "./ImageHalf.vue";
import VimeoPlayerLoop from "./VimeoPlayerLoop.vue";

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
});

new Promise((resolve) => {
  const script = document.createElement("script");
  script.src = "https://player.vimeo.com/api/player.js";
  script.onload = () => resolve("Vimeo API loaded");
  script.onerror = () => resolve("Vimeo API failed to load");
  document.head.appendChild(script);
}).then(console.log);
</script>

<style lang="scss" scoped>
.news-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
  padding: var(--gutterPadding);
}

.news-grid-item {
  grid-column: auto / span 3;

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

  .news-heading {
    margin-top: var(--gutter-half);
    margin-bottom: var(--gutter-half);
    :deep(p) {
      margin: 0;
      @include bodyType;
      strong {
        @include foundersMedium;
        font-weight: normal;
      }
    }
  }

  .news-paragraph {
    margin-bottom: var(--gutter-half);
    :deep(p) {
      margin: 0;
      @include bodyType;
    }
  }

  .news-link {
    margin-bottom: var(--gutter-5);
    :deep(a) {
      @include bodyType;
      text-decoration: underline;
    }
  }

  &:nth-last-child(-n + 2) {
    .news-link {
      margin-bottom: 0;
    }
  }
}
</style>
