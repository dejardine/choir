<template>
  <div class="news-grid-container">
    <!-- Top section with two most recent items -->
    <div
      class="news-grid news-grid-top"
      :class="{
        hidden: currentView === 'score' || screens.isMobile,
      }"
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
            <div
              class="score-item"
              :class="getAspectRatioClass(newsGroup.item)"
            >
              <div
                class="score-item-wrapper"
                v-if="
                  !(
                    newsGroup.item &&
                    !newsGroup.item.id &&
                    newsGroup.item.link_type === 'Document'
                  )
                "
                @click="handleItemClick(newsGroup.item, $event)"
              >
                <!-- Case 1: Link exists AND data is populated by graphQuery -->
                <template v-if="newsGroup.item && newsGroup.item.data">
                  <div class="item-content score-item-content">
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

                <!-- Inline Popup -->
                <div
                  v-for="popup in popupData.filter(
                    (p) => p.itemId === newsGroup.item?.id
                  )"
                  :key="popup.itemId"
                  class="inline-popup"
                  :style="{
                    left: popup.clickX + 'px',
                    top: popup.clickY + 'px',
                  }"
                  @click.stop
                >
                  <div class="inline-popup-body">
                    <!-- Heading -->
                    <div v-if="popup.heading" class="inline-popup-heading">
                      <prismic-rich-text :field="popup.heading" />
                    </div>

                    <!-- Paragraph -->
                    <div v-if="popup.paragraph" class="inline-popup-paragraph">
                      <prismic-rich-text :field="popup.paragraph" />
                    </div>

                    <!-- Link -->
                    <div v-if="popup.link" class="inline-popup-link">
                      <prismic-link :field="popup.link"></prismic-link>
                    </div>
                  </div>
                </div>
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
      :class="{
        hidden:
          currentView === 'score' ||
          (screens.isMobile && currentView === 'score'),
      }"
      :style="{ height: loadMoreContainerHeight }"
    >
      <button
        v-if="showLoadMoreButton"
        @click="loadMore"
        class="load-more-button"
      >
        Load more
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

// Import responsive composable
const { screens } = useResponsive();

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
  newsLandingPage: {
    type: Object,
    required: false,
  },
  footerHeight: {
    type: Number,
    default: 0,
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

// Popup state - now an array to handle multiple popups
const popupData = ref([]);

// Popup functions
const openPopup = (item, event) => {
  if (item && item.data) {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Check if popup already exists for this item
    const existingPopupIndex = popupData.value.findIndex(
      (popup) => popup.itemId === item.id
    );

    if (existingPopupIndex !== -1) {
      // Update existing popup position
      popupData.value[existingPopupIndex].clickX = clickX;
      popupData.value[existingPopupIndex].clickY = clickY;
    } else {
      // Add new popup to the array
      popupData.value.push({
        itemId: item.id,
        heading: item.data.heading,
        paragraph: item.data.paragraph,
        link: item.data.link,
        clickX: clickX,
        clickY: clickY,
      });
    }
  }
};

const handleItemClick = (item, event) => {
  // Check if the click target is inside a popup
  const clickedElement = event.target;
  const isInsidePopup = clickedElement.closest(".inline-popup");

  // Only open/update popup if not clicking inside a popup
  if (!isInsidePopup) {
    openPopup(item, event);
  }
};

const getAspectRatioClass = (item) => {
  if (!item || !item.data) return "square";

  // Check if there's an image thumbnail
  if (item.data.image_thumbnail && item.data.image_thumbnail.url) {
    const img = new Image();
    img.src = item.data.image_thumbnail.url;

    // If we can get dimensions from the image object
    if (item.data.image_thumbnail.dimensions) {
      const { width, height } = item.data.image_thumbnail.dimensions;
      const ratio = width / height;

      if (ratio > 1.2) return "landscape";
      if (ratio < 0.8) return "portrait";
      return "square";
    }

    // Fallback: try to determine from image URL or default to square
    return "square";
  }

  // If there's a video thumbnail but no image, default to landscape
  if (item.data.video_thumbnail) {
    return "landscape";
  }

  // Default fallback
  return "square";
};

const closePopup = (itemId) => {
  const index = popupData.value.findIndex((popup) => popup.itemId === itemId);
  if (index !== -1) {
    popupData.value.splice(index, 1);
  }
};

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
  // On mobile, return empty array to hide top section
  if (screens.value.isMobile) {
    return [];
  }
  return allNewsItems.value.slice(0, 2);
});

const bottomNewsItems = computed(() => {
  // On mobile, show all items from the beginning
  if (screens.value.isMobile) {
    return allNewsItems.value.slice(0, itemsToShow.value);
  }
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
      scrollTo: { y: 0 },
      ease: "power2.inOut",
    });
  } else {
    console.warn("ScrollToPlugin is not available.");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Fallback
  }
};

const scrollToTopFast = () => {
  if ($ScrollToPlugin) {
    $gsap.to(window, {
      duration: 0.2,
      scrollTo: { y: 0 },
      ease: "power2.inOut",
    });
  } else {
    console.warn("ScrollToPlugin is not available.");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Fallback
  }
};

// Computed property to calculate load-more-container height
const loadMoreContainerHeight = computed(() => {
  if (!props.footerHeight) return "50vh"; // Fallback to original height

  // Get the original container height (50vh on desktop, 30vh on mobile)
  const originalHeightVh = screens.value.isMobile ? 30 : 50;
  const originalHeightPx = (originalHeightVh / 100) * window.innerHeight;

  // Calculate new height: original height minus footer height
  const newHeightPx = Math.max(0, originalHeightPx - props.footerHeight);

  // Convert back to viewport units
  const newHeightVh = (newHeightPx / window.innerHeight) * 100;

  return `${newHeightVh}vh`;
});

// View management functions
const setView = async (view) => {
  if (view === currentView.value) return;

  // Hide current view
  if (currentView.value === "score") {
    destroyScrollTrigger();
  }

  currentView.value = view;

  // Close all popups when switching to grid view
  if (view === "grid") {
    popupData.value = [];
  }

  // Wait for DOM update
  await nextTick();

  // Initialize new view
  if (view === "score") {
    await nextTick();
    initializeScrollTrigger();
    // Scroll to top when switching to score view
    scrollToTopFast();
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

  // Create horizontal scroll with ScrollTrigger
  scrollTriggerInstance = $ScrollTrigger.create({
    trigger: triggerElement,
    start: "top top",
    end: "bottom top",
    scrub: 1,
    animation: $gsap.to(scoreItems.value, {
      x: -scrollDistance, // Use original scroll distance (already includes end spacer)
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
    scrollDistance,
    startSpacerWidth,
    endSpacerWidth,
    itemCount: allNewsItems.value.length,
    itemWidth,
    gap,
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
  padding-bottom: 20vh;
  transition: opacity 0.3s ease;

  @include breakpoint(mobile) {
    grid-template-columns: repeat(6, 1fr);
    gap: var(--gutter);
    padding: var(--gutter);
    padding-top: 30vh;
  }

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
    align-items: flex-start;
    gap: var(--gutter-half);
    grid-column: 1 / 2;
    grid-row: 1;
    position: absolute;
    top: calc(50vh - var(--gutter-5));
    left: 0;
    @include breakpoint(mobile) {
      display: none;
    }
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

  @include breakpoint(mobile) {
    display: none;
  }
}

.news-grid-item {
  &:nth-child(2) {
    grid-column: 7 / span 3;
    grid-row: 1;
    @include breakpoint(display) {
      grid-column: 9 / span 2;
    }
    @include breakpoint(mobile) {
      grid-column: auto / span 6;
      grid-row: auto;
    }
  }
  &:nth-child(3) {
    grid-column: 10 / span 3;
    grid-row: 1;
    @include breakpoint(display) {
      grid-column: 11 / span 2;
    }
    @include breakpoint(mobile) {
      grid-column: auto / span 6;
      grid-row: auto;
    }
  }
}

.news-grid-item {
  grid-column: auto / span 3;
  margin-bottom: var(--gutter-5);
  @include breakpoint(display) {
    grid-column: auto / span 2;
  }
  @include breakpoint(mobile) {
    grid-column: auto / span 6;
    margin-bottom: var(--gutter-5);
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
    @include breakpoint(mobile) {
      margin-bottom: 0;
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
  gap: 0vw;
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

  &:hover {
    z-index: 2000;
    position: relative;
  }
  .score-item-wrapper {
    width: 400px;
    cursor: pointer;
    transition: opacity 0.3s ease;
    position: relative;
  }

  .item-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  // Score view specific styling for videos
  .score-item-wrapper {
    width: 400px;
  }
  &:nth-child(10n + 2) {
    width: 360px;
    .item-content {
      width: 400px;
    }
    &.landscape {
      width: 360px;
      .item-content {
        width: 400px;
      }
    }
    &.portrait {
      width: 280px;
      .item-content {
        width: 320px;
      }
    }
    &.square {
      width: 260px;
      .item-content {
        width: 300px;
      }
    }
  }
  &:nth-child(10n + 3) {
    width: 360px;
    .item-content {
      transform: translateY(-33.333%);
      width: 400px;
    }
    &.landscape {
      width: 360px;
      .item-content {
        width: 400px;
      }
    }
    &.portrait {
      width: 280px;
      .item-content {
        width: 320px;
      }
    }

    &.square {
      width: 260px;
      .item-content {
        width: 300px;
      }
    }
  }
  &:nth-child(10n + 4) {
    .item-content {
      transform: translateY(33.33333%);
    }
    &.square {
      width: 260px;
      .item-content {
        width: 300px;
      }
    }
    &.portrait {
      width: 280px;
      .item-content {
        width: 320px;
      }
    }
  }
  &:nth-child(10n + 5) {
    width: 360px;
    margin-left: 160px;
    .score-item-wrapper {
      width: 400px;
    }
    .item-content {
      width: 400px;
    }
    &.square {
      width: 260px;
      .item-content {
        width: 300px;
      }
    }
    &.portrait {
      width: 280px;
      .item-content {
        width: 320px;
      }
    }
  }
  &:nth-child(10n + 6) {
    position: relative;
    z-index: 10;
    width: 360px;

    .item-content {
      transform: translateY(33.33333%);
      width: 400px;
    }
    &.square {
      width: 260px;
      .item-content {
        width: 300px;
      }
    }
    &.portrait {
      width: 280px;
      .item-content {
        width: 320px;
      }
    }
  }
  &:nth-child(10n + 7) {
    margin-left: 240px;
    margin-right: 200px;
    &.square {
      width: 260px;
      .item-content {
        width: 300px;
      }
    }
    &.portrait {
      width: 280px;
      .item-content {
        width: 320px;
      }
    }
  }
  &:nth-child(10n + 8) {
    width: 360px;
    .item-content {
      transform: translateY(-33.33333%);
      width: 400px;
    }
    &.square {
      width: 260px;
      .item-content {
        width: 300px;
      }
    }
    &.portrait {
      width: 280px;
      .item-content {
        width: 320px;
      }
    }
  }
  &:nth-child(10n + 9) {
    width: 360px;
    .item-content {
      transform: translateY(33.33333%);
      width: 400px;
    }
    &.square {
      width: 260px;
      .item-content {
        width: 300px;
      }
    }
    &.portrait {
      width: 280px;
      .item-content {
        width: 320px;
      }
    }
  }
  &:nth-child(10n + 10) {
    .item-content {
      transform: translateY(-33.33333%);
    }
    &.square {
      width: 260px;
      .item-content {
        width: 300px;
      }
    }
    &.portrait {
      width: 280px;
      .item-content {
        width: 320px;
      }
    }
  }
  &:nth-child(10n + 11) {
    margin-left: 240px;
    margin-right: 200px;
    .item-content {
      transform: translateY(-33.33333%);
    }
    &.square {
      width: 260px;
      .item-content {
        width: 300px;
      }
    }
    &.portrait {
      width: 280px;
      .item-content {
        width: 320px;
      }
    }
  }
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
  height: 50vh; /* Fallback height */
  position: relative;
  transition: opacity 0.3s ease;

  @include breakpoint(mobile) {
    height: 30vh; /* Fallback height for mobile */
    padding-top: var(--gutter);
    justify-content: flex-start;
    padding-left: var(--gutter);
  }

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

  @include breakpoint(mobile) {
    right: var(--gutter);
    top: var(--gutter);
  }
}

// Inline Popup Styles
.inline-popup {
  position: absolute;
  width: 300px;
  background: var(--color-background);
  border: 1px solid var(--color-border);

  z-index: 1000;
  transform: translate(-50%, -50%);
}

.inline-popup-close {
  position: absolute;
  top: var(--gutter-half);
  right: var(--gutter-half);
  background: var(--color-border);
  color: var(--color-text);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  z-index: 1001;
  transition: background 0.3s ease;

  &:hover {
    background: var(--color-primary);
  }
}

.inline-popup-body {
  padding: var(--gutter);
  max-height: 300px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.inline-popup-heading {
  margin-bottom: 0;
  :deep(h2) {
    margin: 0;
    @include smallType;
    @include foundersMedium;
  }
}

.inline-popup-paragraph {
  margin-bottom: 0;
  :deep(p) {
    margin: 0;
    @include smallType;
    color: var(--color-border);
  }
}

.inline-popup-link {
  margin-top: 0;
  :deep(a) {
    @include smallType;
    @include linkStyle;
  }
}
</style>
