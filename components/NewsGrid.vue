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

    <!-- Load More Button -->
    <div class="load-more-container">
      <button
        v-if="showLoadMoreButton"
        @click="loadMore"
        class="load-more-button"
      >
        Load More
      </button>
      <button @click="scrollToTop" class="back-to-top-button">
        From the start
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref } from "vue";
import ImageHalf from "./ImageHalf.vue";
import VimeoPlayerLoop from "./VimeoPlayerLoop.vue";

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
});

// Load GSAP libraries we need
const { $gsap, $ScrollTrigger, $ScrollToPlugin } = useNuxtApp();

// Reactive state for load more functionality
const itemsToShow = ref(13); // Start with 13 items (2 top + 11 bottom)

// Computed properties to separate news items
const allNewsItems = computed(() => {
  const originalItems =
    props.page?.newsLandingPageWithData?.data?.news_items || [];
  // Multiply the array by 5 for test data
  const multipliedItems = [];
  for (let i = 0; i < 5; i++) {
    originalItems.forEach((item, index) => {
      // Create a deep copy of the item with a unique key
      const clonedItem = JSON.parse(JSON.stringify(item));
      // Add a suffix to make each item unique
      if (clonedItem.item?.id) {
        clonedItem.item.id = `${clonedItem.item.id}-copy-${i + 1}`;
      }
      multipliedItems.push(clonedItem);
    });
  }
  return originalItems;
});

const topNewsItems = computed(() => {
  return allNewsItems.value.slice(0, 2);
});

const bottomNewsItems = computed(() => {
  return allNewsItems.value.slice(2, itemsToShow.value);
});

const showLoadMoreButton = computed(() => {
  return itemsToShow.value < allNewsItems.value.length;
});

const loadMore = () => {
  itemsToShow.value += 11;
};

const scrollToTop = () => {
  if ($ScrollToPlugin) {
    $gsap.to(window, {
      duration: 1,
      scrollTo: { y: 0, autoKill: true },
      ease: "power2.inOut",
    });
  } else {
    console.warn("ScrollToPlugin is not available.");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Fallback
  }
};

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
      grid-column: 10 / span 3;
      @include breakpoint(display) {
        grid-column: 11 / span 2;
      }
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

.load-more-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border-top: 1px solid var(--color-border);
  padding-top: var(--gutter);
  height: 50vh;
  position: relative;
}

.load-more-button {
  @include smallType;
  @include foundersMedium;
  @include noButton;
  color: var(--color-text);
  cursor: pointer;
  @include linkStyle;
}

.back-to-top-button {
  position: absolute;
  right: var(--gutterPadding);
  top: var(--gutter);
  padding: 0;

  cursor: pointer;

  @include noButton;
  @include smallType;
  @include foundersMedium;
  @include linkStyle;
  color: var(--color-text);
}
</style>
