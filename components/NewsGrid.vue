<template>
  <div class="news-grid-container">
    <!-- Top section with two most recent items -->
    <div class="news-grid news-grid-top">
      <template
        v-for="(newsGroup, index) in topNewsItems"
        :key="newsGroup.item?.id || `news-grid-top-item-${index}`"
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
                <div
                  v-if="newsGroup.item.data.paragraph"
                  class="news-paragraph"
                >
                  <prismic-rich-text :field="newsGroup.item.data.paragraph" />
                </div>

                <!-- Link -->
                <div v-if="newsGroup.item.data.link" class="news-link">
                  <prismic-link
                    :field="newsGroup.item.data.link"
                  ></prismic-link>
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

    <!-- Bottom section with remaining items -->
    <div class="news-grid news-grid-bottom">
      <template
        v-for="(newsGroup, index) in bottomNewsItems"
        :key="newsGroup.item?.id || `news-grid-bottom-item-${index}`"
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
                <div
                  v-if="newsGroup.item.data.paragraph"
                  class="news-paragraph"
                >
                  <prismic-rich-text :field="newsGroup.item.data.paragraph" />
                </div>

                <!-- Link -->
                <div v-if="newsGroup.item.data.link" class="news-link">
                  <prismic-link
                    :field="newsGroup.item.data.link"
                  ></prismic-link>
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
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
import ImageHalf from "./ImageHalf.vue";
import VimeoPlayerLoop from "./VimeoPlayerLoop.vue";

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
});

// Computed properties to separate news items
const newsItems = computed(() => {
  return props.page?.newsLandingPageWithData?.data?.news_items || [];
});

const topNewsItems = computed(() => {
  return newsItems.value.slice(0, 2);
});

const bottomNewsItems = computed(() => {
  return newsItems.value.slice(2);
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
@import "@/assets/scss/global.scss";
@import "@/assets/scss/breakpoints.scss";

.news-grid-container {
  padding-bottom: 20vh;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
  padding: var(--gutterPadding);
}

.news-grid-top {
  .news-grid-item {
    &:nth-child(1) {
      grid-column: 7 / span 3;
      @include breakpoint(display) {
        grid-column: 9 / span 2;
      }
    }
    &:nth-child(2) {
      grid-column: 11 / span 2;
    }
  }
}

.news-grid-item {
  grid-column: auto / span 3;
  margin-bottom: var(--gutter-5);
  @include breakpoint(display) {
    grid-column: auto / span 2;
  }
  .thumbnail-image,
  .thumbnail-video {
    :deep(img) {
      width: 100%;
      height: auto;

      margin-bottom: var(--gutter-half);
    }
  }

  .news-heading {
    margin-top: var(--gutter-half);
    margin-bottom: var(--gutter-half);
    :deep(h2) {
      margin: 0;
      @include smallType;
      @include foundersMedium;
    }
  }

  .news-paragraph {
    margin-bottom: var(--gutter-half);
    :deep(p) {
      margin: 0;
      @include smallType;
      color: var(--color-border);
    }
  }

  .news-link {
    margin-bottom: var(--gutter-5);
    :deep(a) {
      @include smallType;
      @include linkStyle;
    }
  }

  &:nth-last-child(-n + 2) {
    .news-link {
      margin-bottom: 0;
    }
  }
}
</style>
