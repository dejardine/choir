<template>
  <div class="news-grid-container">
    <!-- Top section with two most recent items -->
    <div
      class="news-grid news-grid-top"
      :class="{ hidden: currentView === 'score' }"
    >
      <div class="toggle-buttons">
        <button
          @click="setView('grid')"
          :class="{ active: currentView === 'grid' }"
        >
          Grid
        </button>
        /
        <button
          @click="setView('score')"
          :class="{ active: currentView === 'score' }"
        >
          Score
        </button>
      </div>
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
                <!-- Video Thumbnail with Cover (only if both exist) -->
                <VimeoPlayerLoop
                  v-if="
                    newsGroup.item.data.video_thumbnail &&
                    newsGroup.item.data.image_thumbnail?.url
                  "
                  :video-id="newsGroup.item.data.video_thumbnail"
                  :cover-image-url="newsGroup.item.data.image_thumbnail.url"
                  :cover-image="newsGroup.item.data.image_thumbnail"
                  class="thumbnail-video"
                />
                <!-- Image Thumbnail (if no video, but image exists) -->
                <ImageHalf
                  v-else-if="
                    newsGroup.item.data.image_thumbnail &&
                    newsGroup.item.data.image_thumbnail.url
                  "
                  :imageField="newsGroup.item.data.image_thumbnail"
                  class="thumbnail-image"
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
    <div
      class="news-grid news-grid-bottom"
      :class="{ hidden: currentView === 'score' }"
    >
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
                <!-- Video Thumbnail with Cover (only if both exist) -->
                <VimeoPlayerLoop
                  v-if="
                    newsGroup.item.data.video_thumbnail &&
                    newsGroup.item.data.image_thumbnail?.url
                  "
                  :video-id="newsGroup.item.data.video_thumbnail"
                  :cover-image-url="newsGroup.item.data.image_thumbnail.url"
                  :cover-image="newsGroup.item.data.image_thumbnail"
                  class="thumbnail-video"
                />
                <!-- Image Thumbnail (if no video, but image exists) -->
                <ImageHalf
                  v-else-if="
                    newsGroup.item.data.image_thumbnail &&
                    newsGroup.item.data.image_thumbnail.url
                  "
                  :imageField="newsGroup.item.data.image_thumbnail"
                  class="thumbnail-image"
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

    <!-- Score View -->
    <div class="score-view" :class="{ hidden: currentView === 'grid' }">
      <div class="score-container" ref="scoreContainer">
        <div class="score-items" ref="scoreItems">
          <template
            v-for="(newsGroup, index) in allNewsItems"
            :key="newsGroup.item?.id || `score-item-${index}`"
          >
            <div class="score-item">
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
                    <!-- Video Thumbnail with Cover (only if both exist) -->
                    <VimeoPlayerLoop
                      v-if="
                        newsGroup.item.data.video_thumbnail &&
                        newsGroup.item.data.image_thumbnail?.url
                      "
                      :video-id="newsGroup.item.data.video_thumbnail"
                      :cover-image-url="newsGroup.item.data.image_thumbnail.url"
                      :cover-image="newsGroup.item.data.image_thumbnail"
                      class="thumbnail-video"
                    />
                    <!-- Image Thumbnail (if no video, but image exists) -->
                    <ImageHalf
                      v-else-if="
                        newsGroup.item.data.image_thumbnail &&
                        newsGroup.item.data.image_thumbnail.url
                      "
                      :imageField="newsGroup.item.data.image_thumbnail"
                      class="thumbnail-image"
                    />

                    <!-- Fallback if no media (but data object exists) -->
                    <div v-else class="no-media"></div>

                    <!-- Heading -->
                    <div
                      v-if="newsGroup.item.data.heading"
                      class="news-heading"
                    >
                      <prismic-rich-text :field="newsGroup.item.data.heading" />
                    </div>

                    <!-- Paragraph -->
                    <div
                      v-if="newsGroup.item.data.paragraph"
                      class="news-paragraph"
                    >
                      <prismic-rich-text
                        :field="newsGroup.item.data.paragraph"
                      />
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
    </div>

    <!-- Load More Button -->
    <div
      class="load-more-container"
      :class="{ hidden: currentView === 'score' }"
    >
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
import {
  defineProps,
  computed,
  ref,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
} from "vue";
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

// View state management
const currentView = ref("grid");
const scoreContainer = ref(null);
const scoreItems = ref(null);
let scrollTriggerInstance = null;

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

// View management functions
const setView = async (view) => {
  if (view === currentView.value) return;

  // Hide current view
  if (currentView.value === "score") {
    destroyScrollTrigger();
  }

  currentView.value = view;

  // Wait for DOM update
  await nextTick();

  // Initialize new view
  if (view === "score") {
    await nextTick();
    initializeScrollTrigger();
  }
};

const initializeScrollTrigger = () => {
  if (!scoreContainer.value || !scoreItems.value || !$ScrollTrigger) return;

  // Calculate the total width needed for horizontal scroll
  const itemWidth = 400; // Width of each score item
  const gap = 40; // Gap between items
  const totalWidth =
    allNewsItems.value.length * itemWidth +
    (allNewsItems.value.length - 1) * gap;

  // Set the container width
  scoreItems.value.style.width = `${totalWidth}px`;

  // Create a dummy trigger element that spans the scroll distance
  const triggerElement = document.createElement("div");
  triggerElement.style.height = `${totalWidth - window.innerWidth}px`;
  triggerElement.style.width = "1px";
  triggerElement.style.position = "absolute";
  triggerElement.style.top = "0";
  triggerElement.style.left = "0";
  triggerElement.style.pointerEvents = "none";
  triggerElement.style.opacity = "0";
  document.body.appendChild(triggerElement);

  // Create horizontal scroll with ScrollTrigger
  scrollTriggerInstance = $ScrollTrigger.create({
    trigger: triggerElement,
    start: "top top",
    end: "bottom top",
    scrub: 1,
    animation: $gsap.to(scoreItems.value, {
      x: -(totalWidth - window.innerWidth),
      ease: "none",
    }),
    onUpdate: (self) => {
      // Debug logging
      console.log("ScrollTrigger progress:", self.progress);
    },
    onRefresh: () => {
      console.log("ScrollTrigger refreshed");
    },
    onRefreshInit: () => {
      console.log("ScrollTrigger refresh init");
    },
  });

  // Store the trigger element for cleanup
  scrollTriggerInstance.triggerElement = triggerElement;

  console.log("ScrollTrigger initialized with:", {
    totalWidth,
    windowWidth: window.innerWidth,
    scrollDistance: totalWidth - window.innerWidth,
  });
};

const destroyScrollTrigger = () => {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    // Clean up the trigger element
    if (scrollTriggerInstance.triggerElement) {
      document.body.removeChild(scrollTriggerInstance.triggerElement);
    }
    scrollTriggerInstance = null;
  }
};

// Cleanup on component unmount
onUnmounted(() => {
  destroyScrollTrigger();
});

// Watch for view changes
watch(currentView, (newView) => {
  if (newView === "score") {
    // Don't hide body overflow - let scrolling work for ScrollTrigger
    console.log("Switched to score view");
  } else {
    // Restore normal scrolling
    console.log("Switched to grid view");
  }
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

.news-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
  padding: var(--gutterPadding);
  transition: opacity 0.3s ease;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.news-grid-top {
  position: relative;

  .toggle-buttons {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--gutter-half);
    grid-column: 1 / 2;
    grid-row: 1;

    button {
      @include noButton;
      @include smallType;
      @include foundersMedium;
      @include linkStyle;
      color: var(--color-text);
      transition: opacity 0.3s ease;

      &.active {
        opacity: 1;
      }

      &:not(.active) {
        opacity: 0.5;
      }
    }
  }

  .news-grid-item {
    &:nth-child(2) {
      grid-column: 7 / span 3;
      grid-row: 1;
      @include breakpoint(display) {
        grid-column: 9 / span 2;
      }
    }
    &:nth-child(3) {
      grid-column: 10 / span 3;
      grid-row: 1;
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

// Score View Styles
.score-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--color-background);
  z-index: 1000;
  opacity: 1;
  transition: opacity 0.3s ease;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.score-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  padding: var(--gutterPadding);
  padding-top: calc(var(--gutterPadding) + 60px); // Account for toggle buttons
  position: relative;
}

.score-items {
  display: flex;
  gap: 40px;
  height: 100%;
  align-items: center;
}

.score-item {
  flex-shrink: 0;
  width: 400px;
  height: 100%;
  display: flex;
  align-items: center;

  .item-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .thumbnail-image,
  .thumbnail-video {
    width: 100%;
    height: auto;
    margin-bottom: var(--gutter);

    :deep(img) {
      width: 100%;
      height: auto;
    }
  }

  .news-heading {
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
    :deep(a) {
      @include smallType;
      @include linkStyle;
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
  transition: opacity 0.3s ease;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
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
