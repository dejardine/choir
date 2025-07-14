<template>
  <div class="news-grid-container">
    <!-- Top section with two most recent items -->
    <div
      class="news-grid news-grid-top"
      :class="{ hidden: currentView === 'score' }"
    >
      <div class="toggle-buttons animate-in">
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
      <!-- Fixed header for score view -->
      <div class="score-header">
        <PageHeader
          :heading="newsLandingPage?.data?.heading"
          :subheading="newsLandingPage?.data?.sub_heading"
          :paragraph="newsLandingPage?.data?.paragraph"
        />
      </div>

      <!-- Fixed toggle buttons for score view -->
      <div class="score-toggle-buttons">
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
        <div class="score-toggle-arrow">>></div>
      </div>
      <div class="score-container" ref="scoreContainer">
        <div class="score-items" ref="scoreItems">
          <!-- Start spacer -->
          <div class="score-spacer start-spacer"></div>

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
                    <!-- Link wrapper if link exists -->
                    <prismic-link
                      v-if="newsGroup.item.data.link"
                      :field="newsGroup.item.data.link"
                      class="score-link"
                    >
                      <!-- Video Thumbnail with Cover (only if both exist) -->
                      <VimeoPlayerLoop
                        v-if="
                          newsGroup.item.data.video_thumbnail &&
                          newsGroup.item.data.image_thumbnail?.url
                        "
                        :video-id="newsGroup.item.data.video_thumbnail"
                        :cover-image-url="
                          newsGroup.item.data.image_thumbnail.url
                        "
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
                    </prismic-link>

                    <!-- No link wrapper - just media -->
                    <template v-else>
                      <!-- Video Thumbnail with Cover (only if both exist) -->
                      <VimeoPlayerLoop
                        v-if="
                          newsGroup.item.data.video_thumbnail &&
                          newsGroup.item.data.image_thumbnail?.url
                        "
                        :video-id="newsGroup.item.data.video_thumbnail"
                        :cover-image-url="
                          newsGroup.item.data.image_thumbnail.url
                        "
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
                    </template>
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

          <!-- End spacer -->
          <div class="score-spacer end-spacer">
            <!-- Debug: End spacer rendered -->
          </div>
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
import PageHeader from "./PageHeader.vue";

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
  newsLandingPage: {
    type: Object,
    required: false,
  },
});

// Load GSAP libraries we need
const { $gsap, $ScrollTrigger, $ScrollToPlugin, $Draggable } = useNuxtApp();

// Reactive state for load more functionality
const itemsToShow = ref(13); // Start with 13 items (2 top + 11 bottom)

// View state management
const currentView = ref("grid");
const scoreContainer = ref(null);
const scoreItems = ref(null);
let scrollTriggerInstance = null;
let draggableInstance = null;

// Computed properties to separate news items
const allNewsItems = computed(() => {
  const originalItems =
    props.page?.newsLandingPageWithData?.data?.news_items || [];
  // Multiply the array by 3 for more content
  const multipliedItems = [];
  for (let i = 0; i < 3; i++) {
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
  return multipliedItems;
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
  const startSpacerWidth = window.innerWidth * 0.333333; // 33.3333vw
  const endSpacerWidth = window.innerWidth * 0.25; // 25vw
  const totalWidth =
    startSpacerWidth + // Start spacer
    allNewsItems.value.length * itemWidth + // All items
    (allNewsItems.value.length - 1) * gap + // Gaps between items
    endSpacerWidth; // End spacer

  // Set the container width
  scoreItems.value.style.width = `${totalWidth}px`;

  // Set page height based on score items width for proper scroll distance
  document.body.style.minHeight = `${totalWidth}px`;

  // Debug: Log the actual DOM structure
  console.log("Score items container:", scoreItems.value);
  console.log("Container width set to:", totalWidth);
  console.log("Number of child elements:", scoreItems.value.children.length);

  // Create a dummy trigger element that spans the scroll distance
  const scrollDistance = totalWidth - window.innerWidth;
  const triggerElement = document.createElement("div");
  triggerElement.style.height = `${scrollDistance}px`;
  triggerElement.style.width = "1px";
  triggerElement.style.position = "absolute";
  triggerElement.style.top = "0";
  triggerElement.style.left = "0";
  triggerElement.style.pointerEvents = "none";
  triggerElement.style.opacity = "0";
  document.body.appendChild(triggerElement);

  // Get all score items for individual animations
  const scoreItemElements = scoreItems.value.querySelectorAll(".score-item");

  // Define speed patterns for all items
  const fastMovementMultiplier = 0.4; // Fast items speed
  const slowMovementMultiplier = 0.4; // Slow items speed
  const normalMovementMultiplier = 0.4; // Normal items speed

  // Create arrays for each speed group based on patterns
  const fastMovingItems = [];
  const slowMovingItems = [];
  const normalMovingItems = [];

  // Pattern: Every 3rd item gets a different speed
  // You can change this pattern by modifying the conditions
  for (let i = 0; i < scoreItemElements.length; i++) {
    if (i % 3 === 0) {
      // Every 3rd item (0, 3, 6, 9, 12...) - fast
      fastMovingItems.push(i);
    } else if (i % 3 === 1) {
      // Every 3rd item + 1 (1, 4, 7, 10, 13...) - slow
      slowMovingItems.push(i);
    } else {
      // Every 3rd item + 2 (2, 5, 8, 11, 14...) - normal
      normalMovingItems.push(i);
    }
  }

  // Create individual animations for fast-moving items
  const fastItemAnimations = [];
  fastMovingItems.forEach((itemIndex) => {
    if (scoreItemElements[itemIndex]) {
      const animation = $gsap.to(scoreItemElements[itemIndex], {
        x: -scrollDistance * fastMovementMultiplier,
        ease: "none",
      });
      fastItemAnimations.push(animation);
    }
  });

  // Create individual animations for slow-moving items
  const slowItemAnimations = [];
  slowMovingItems.forEach((itemIndex) => {
    if (scoreItemElements[itemIndex]) {
      const animation = $gsap.to(scoreItemElements[itemIndex], {
        x: -scrollDistance * slowMovementMultiplier,
        ease: "none",
      });
      slowItemAnimations.push(animation);
    }
  });

  // Create individual animations for normal-moving items
  const normalItemAnimations = [];
  normalMovingItems.forEach((itemIndex) => {
    if (scoreItemElements[itemIndex]) {
      const animation = $gsap.to(scoreItemElements[itemIndex], {
        x: -scrollDistance * normalMovementMultiplier,
        ease: "none",
      });
      normalItemAnimations.push(animation);
    }
  });

  // Create the main container animation (background movement)
  const mainAnimation = $gsap.to(scoreItems.value, {
    x: -scrollDistance,
    ease: "none",
  });

  // Create horizontal scroll with ScrollTrigger
  scrollTriggerInstance = $ScrollTrigger.create({
    trigger: triggerElement,
    start: "top top",
    end: "bottom top",
    scrub: 1,
    animation: $gsap
      .timeline()
      .add(mainAnimation)
      .add(fastItemAnimations, 0) // Start fast animations at the same time
      .add(slowItemAnimations, 0) // Start slow animations at the same time
      .add(normalItemAnimations, 0), // Start normal animations at the same time
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

  // Store animations for cleanup
  scrollTriggerInstance.fastItemAnimations = fastItemAnimations;
  scrollTriggerInstance.slowItemAnimations = slowItemAnimations;
  scrollTriggerInstance.normalItemAnimations = normalItemAnimations;
  scrollTriggerInstance.mainAnimation = mainAnimation;

  // Draggable functionality disabled for score view
  // if ($Draggable && scoreItems.value) {
  //   const maxDrag = totalWidth - window.innerWidth;
  //
  //   draggableInstance = $Draggable.create(scoreItems.value, {
  //     type: "x",
  //     bounds: {
  //       minX: -maxDrag,
  //       maxX: 0,
  //     },
  //     inertia: true,
  //     onDrag: function () {
  //       // Update ScrollTrigger progress based on drag position
  //       const progress = Math.abs(this.x) / maxDrag;
  //       if (scrollTriggerInstance) {
  //         scrollTriggerInstance.progress = progress;
  //       }
  //     },
  //     onDragEnd: function () {
  //       // Optional: Add snap-to-item functionality
  //       console.log("Drag ended at position:", this.x);
  //     },
  //   })[0];
  // }

  console.log("ScrollTrigger initialized with:", {
    totalWidth,
    windowWidth: window.innerWidth,
    scrollDistance,
    startSpacerWidth,
    endSpacerWidth,
    itemCount: allNewsItems.value.length,
    itemWidth,
    gap,
    fastMovingItems,
    fastMovementMultiplier,
    slowMovingItems,
    slowMovementMultiplier,
    normalMovingItems,
    normalMovementMultiplier,
  });
};

const destroyScrollTrigger = () => {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    // Clean up the trigger element
    if (scrollTriggerInstance.triggerElement) {
      document.body.removeChild(scrollTriggerInstance.triggerElement);
    }

    // Clean up individual animations
    if (scrollTriggerInstance.fastItemAnimations) {
      scrollTriggerInstance.fastItemAnimations.forEach((animation) => {
        animation.kill();
      });
    }
    if (scrollTriggerInstance.slowItemAnimations) {
      scrollTriggerInstance.slowItemAnimations.forEach((animation) => {
        animation.kill();
      });
    }
    if (scrollTriggerInstance.normalItemAnimations) {
      scrollTriggerInstance.normalItemAnimations.forEach((animation) => {
        animation.kill();
      });
    }
    if (scrollTriggerInstance.mainAnimation) {
      scrollTriggerInstance.mainAnimation.kill();
    }

    scrollTriggerInstance = null;
  }

  // Clean up draggable instance
  if (draggableInstance) {
    draggableInstance.kill();
    draggableInstance = null;
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
    document.body.style.minHeight = ""; // Reset to default
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

.news-grid-item {
  grid-column: auto / span 3;
  margin-bottom: var(--gutter-5);
  @include breakpoint(display) {
    grid-column: auto / span 2;
  }
  .thumbnail-image,
  .thumbnail-video {
    width: 100%;
    height: auto; // Auto height for natural aspect ratio

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

.score-header {
  position: fixed;
  top: calc(50vh);
  left: 0;
  width: 100%;
  z-index: 1002;
  transform: translateY(-50%);
  pointer-events: none;
  :deep(.page-header) {
    margin-top: 0;
  }
}

.score-toggle-buttons {
  position: fixed;
  bottom: var(--gutterPadding);
  left: var(--gutterPadding);
  z-index: 1006;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: var(--gutter-half);

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

  .score-toggle-arrow {
    @include smallType;
    @include foundersMedium;
    position: fixed;
    bottom: var(--gutterPadding);
    right: var(--gutterPadding);
    z-index: 1006;
  }
}

.score-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  padding: var(--gutterPadding);
  padding-top: calc(var(--gutter));
  position: relative;
  z-index: 1003;
}

.score-items {
  display: flex;
  gap: 40px;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
}

.score-spacer {
  flex-shrink: 0;
  height: 100%;
}

.start-spacer {
  width: 33.3333vw; // Start gap
  display: block;
}

.end-spacer {
  width: 33.333vw; // End gap
  display: block;
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

  .score-link {
    display: block;
    width: 400px;
    height: 100%;
    text-decoration: none;
  }

  // Score view specific styling for videos
  .score-view .score-link {
    height: 300px; // Only in score view
  }
}

// Ensure VimeoPlayerLoop gets proper dimensions in score view
.score-item :deep(.vimeo-player-wrapper) {
  width: 100% !important;
  height: 300px !important;
}

.thumbnail-image,
.thumbnail-video {
  width: 100%;
  height: auto; // Auto height for natural aspect ratio
  display: block; // Ensure proper block display

  :deep(img) {
    width: 100%;
    height: auto;
  }

  :deep(.vimeo-player-wrapper) {
    width: 100%;
    height: 100%;
  }

  :deep(iframe) {
    width: 100%;
    height: 100%;
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
