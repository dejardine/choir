<template>
  <div class="archive-grid">
    <!-- Debug rulers -->

    <div class="archive-grid-header">
      <div class="label">Client</div>
      <div class="label">Industry</div>
    </div>
    <div class="archive-grid-image">
      <prismic-image v-if="currentThumbnail" :field="currentThumbnail" />
    </div>
    <template
      v-for="(projectGroup, index) in page?.archive?.data?.projects"
      :key="`archive-item-${projectGroup.case_study?.id || index}`"
    >
      <div
        v-if="projectGroup.case_study && projectGroup.case_study.data"
        class="archive-grid-item animate-in"
        :class="{
          'is-open': openItemId === projectGroup.case_study.id,
          [`archive-grid-item-${index + 1}`]: true,
        }"
        @click="toggleItem(projectGroup.case_study.id)"
      >
        <div class="item-content">
          <div class="project-info">
            <div class="project-info-top">
              <div class="client-column">
                <div class="value">
                  <template
                    v-if="
                      projectGroup.case_study.data.client &&
                      projectGroup.case_study.data.client.length > 0
                    "
                  >
                    <span
                      v-for="(clientItem, clientIndex) in projectGroup
                        .case_study.data.client"
                      :key="`client-${projectGroup.case_study.id}-${clientIndex}`"
                    >
                      {{
                        clientItem.client?.data?.client_name || "Unknown Client"
                      }}
                      <span
                        v-if="
                          clientIndex <
                          projectGroup.case_study.data.client.length - 1
                        "
                        >,
                      </span>
                    </span>
                  </template>
                  <span v-else>No client specified</span>
                </div>
              </div>

              <!-- Industry Column -->
              <div class="industry-column">
                <div class="value">
                  <template
                    v-if="
                      projectGroup.case_study.data.industry &&
                      projectGroup.case_study.data.industry.length > 0
                    "
                  >
                    <span
                      v-for="(industryItem, industryIndex) in projectGroup
                        .case_study.data.industry"
                      :key="`industry-${projectGroup.case_study.id}-${industryIndex}`"
                    >
                      {{
                        industryItem.industry?.data?.industry_name ||
                        "Unknown Industry"
                      }}
                      <span
                        v-if="
                          industryIndex <
                          projectGroup.case_study.data.industry.length - 1
                        "
                        >,
                      </span>
                    </span>
                  </template>
                  <span v-else>No industry specified</span>
                </div>
              </div>
            </div>
            <div class="project-info-bottom">
              <p v-if="projectGroup.case_study.data.scope" class="scope">
                {{ processScopeText(projectGroup.case_study.data.scope) }}
              </p>
              <prismic-rich-text
                v-if="projectGroup.case_study.data.header_paragraph"
                :field="projectGroup.case_study.data.header_paragraph"
              />

              <p v-if="projectGroup.case_study.data.year" class="project-year">
                {{ projectGroup.case_study.data.year }}
              </p>

              <p class="view-project-link">
                <prismic-link :field="projectGroup.case_study">
                  View project
                </prismic-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { defineProps, onMounted, onUnmounted, ref, nextTick } from "vue";

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
});

// State to track which archive item is open
const openItemId = ref(null);

// State to track current thumbnail
const currentThumbnail = ref(null);

// State to track current scroll position for debug
const currentScrollPosition = ref(0);

// ScrollTrigger instances for cleanup
let scrollTriggerInstances = [];

// Get GSAP and ScrollTrigger from Nuxt app
const { $gsap, $ScrollTrigger } = useNuxtApp();

// Method to toggle accordion items
const toggleItem = (itemId) => {
  if (openItemId.value === itemId) {
    // Close the item if it's already open
    openItemId.value = null;
  } else {
    // Open the clicked item and close any other open item
    openItemId.value = itemId;
  }
};

// Method to process scope text and replace line breaks with commas
const processScopeText = (scopeField) => {
  if (!scopeField || !scopeField.length) return "";

  // Convert the rich text field to plain text and replace line breaks with commas
  return scopeField
    .map((item) => item.text || "")
    .join(", ")
    .replace(/\s*\n\s*/g, ", ") // Replace line breaks (with any surrounding spaces) with ", "
    .replace(/,\s*,/g, ",") // Remove double commas
    .replace(/^,\s*/, "") // Remove leading comma
    .replace(/,\s*$/, ""); // Remove trailing comma
};

// Setup ScrollTrigger for thumbnail updates
const setupScrollTrigger = () => {
  console.log("Setting up ScrollTrigger...");

  // Kill existing ScrollTrigger instances
  if (scrollTriggerInstances.length > 0) {
    scrollTriggerInstances.forEach((st) => st.kill());
    scrollTriggerInstances = [];
  }

  // Create ScrollTrigger for fade out effect when archive-grid reaches top
  const archiveGrid = document.querySelector(".archive-grid");
  const archiveHeader = document.querySelector(".archive-grid-header");
  const imageElement = document.querySelector(".archive-grid-image");

  if (archiveHeader && imageElement) {
    // First ScrollTrigger: Fade out archive-grid-image
    const imageTl = $gsap.timeline().to(imageElement, {
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: archiveHeader,
        start: "top top",
        end: "+=100",
        markers: false,
        scrub: true,
      },
    });

    scrollTriggerInstances.push(imageTl.scrollTrigger);
  } else {
    console.warn("Archive header or image element not found for fade effect");
  }

  // Second ScrollTrigger: Image swapping functionality
  const items = document.querySelectorAll(".archive-grid-item");

  items.forEach((item, index) => {
    const projectGroup = props.page?.archive?.data?.projects[index];
    if (!projectGroup?.case_study?.data?.image_thumbnail) return;

    const st = $ScrollTrigger.create({
      trigger: item,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        console.log(`Entering item ${index}`);
        currentThumbnail.value = projectGroup.case_study.data.image_thumbnail;
      },
      onLeave: () => {
        console.log(`Leaving item ${index}`);
        // Only clear if we're not entering another item
        setTimeout(() => {
          const isAnyItemActive = Array.from(items).some(
            (otherItem, otherIndex) => {
              if (otherIndex === index) return false;
              const otherRect = otherItem.getBoundingClientRect();
              const imageElement = document.querySelector(
                ".archive-grid-image"
              );
              if (!imageElement) return false;
              const imageRect = imageElement.getBoundingClientRect();

              return !(
                imageRect.right < otherRect.left ||
                imageRect.left > otherRect.right ||
                imageRect.bottom < otherRect.top ||
                imageRect.top > otherRect.bottom
              );
            }
          );

          if (!isAnyItemActive) {
            currentThumbnail.value = null;
            console.log("No items active, clearing image");
          }
        }, 50);
      },
      onEnterBack: () => {
        console.log(`Entering back item ${index}`);
        currentThumbnail.value = projectGroup.case_study.data.image_thumbnail;
      },
      onLeaveBack: () => {
        console.log(`Leaving back item ${index}`);
        // Only clear if we're not entering another item
        setTimeout(() => {
          const isAnyItemActive = Array.from(items).some(
            (otherItem, otherIndex) => {
              if (otherIndex === index) return false;
              const otherRect = otherItem.getBoundingClientRect();
              const imageElement = document.querySelector(
                ".archive-grid-image"
              );
              if (!imageElement) return false;
              const imageRect = imageElement.getBoundingClientRect();

              return !(
                imageRect.right < otherRect.left ||
                imageRect.left > otherRect.right ||
                imageRect.bottom < otherRect.top ||
                imageRect.top > otherRect.bottom
              );
            }
          );

          if (!isAnyItemActive) {
            currentThumbnail.value = null;
            console.log("No items active, clearing image");
          }
        }, 50);
      },
    });

    scrollTriggerInstances.push(st);
  });
};

// Debug logging to understand the data structure
onMounted(async () => {
  if (process.client) {
    console.log("Archive Grid mounted");
    console.log("Archive Grid Data:", props.page?.archive?.data?.projects);
    console.log(
      "Number of projects:",
      props.page?.archive?.data?.projects?.length
    );

    // Wait for DOM to be ready
    await nextTick();
    console.log("After nextTick");

    // Longer delay to ensure all elements are rendered
    setTimeout(() => {
      console.log("Setting up ScrollTrigger after delay");
      console.log(
        "Archive grid element exists:",
        !!document.querySelector(".archive-grid")
      );
      console.log(
        "Archive header element exists:",
        !!document.querySelector(".archive-grid-header")
      );
      console.log(
        "Image element exists:",
        !!document.querySelector(".archive-grid-image")
      );
      setupScrollTrigger();
    }, 500); // Increased from 100ms to 500ms

    // Add resize handler
    const resizeHandler = () => {
      // Debounce resize events
      clearTimeout(resizeHandler.timeout);
      resizeHandler.timeout = setTimeout(() => {
        console.log("Resize detected, re-setting up ScrollTrigger");
        setupScrollTrigger();
      }, 250);
    };

    window.addEventListener("resize", resizeHandler);
  }
});

onUnmounted(() => {
  if (process.client) {
    try {
      // Clean up ScrollTrigger instances
      if (scrollTriggerInstances.length > 0) {
        scrollTriggerInstances.forEach((st) => {
          if (st && typeof st.kill === "function") {
            st.kill();
          }
        });
        scrollTriggerInstances = [];
      }
    } catch (error) {
      console.warn("Error during ScrollTrigger cleanup:", error);
    }
  }
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/global" as *;
.archive-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
  padding: 0;
  padding-top: calc(50vh - 1px);
  position: relative;
  z-index: 20;
}

.archive-grid-image {
  position: fixed;
  top: 50vh;
  transform: translateY(-50%);
  left: 0;
  height: calc(var(--gutter) + var(--gutter-half));
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  overflow: visible;
  width: 100%;
  :deep(img) {
    height: auto;
    aspect-ratio: 1/1;
    object-fit: cover;
    position: absolute;
    top: 50%;
    left: calc((7 / 12 * 100vw) + var(--gutterPadding) + (7 * var(--gutter)));
    transform: translateY(-50%);
    width: calc((2.5 / 12 * 100vw) + (1.5 * var(--gutter)));
  }

  &:after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background: var(--color-border);
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
}

.archive-grid-header {
  display: grid;
  grid-template-columns: 4fr 8fr;
  grid-column: 1 / span 12;
  gap: var(--gutter);
  width: 100%;
  .label {
    @include smallType;
    @include foundersMedium;
    letter-spacing: 0.05rem;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }
  padding: 0 var(--gutterPadding);

  padding-bottom: calc(var(--gutter-2));
  position: absolute;
  top: 50vh;
  left: 0;
  transform: translateY(-50%);
  pointer-events: none;
}

.project-info-bottom {
  max-width: 480px;
  max-height: 0px;
  overflow: hidden;
  transition: max-height 0.6s ease-in-out;
  :deep(h2) {
    @include bodyType;
    color: var(--color-text-secondary);
    margin-bottom: var(--gutter);
    strong {
      @include foundersRegular;
    }
  }
  .project-year {
    @include bodyType;
    color: var(--color-text-secondary);
    display: block;
    margin-bottom: var(--gutter);
  }
  .view-project-link {
    @include bodyType;
    color: var(--color-text-secondary);
    padding-bottom: var(--gutter-3);

    a {
      @include linkStyle;
    }
  }

  .scope {
    @include bodyType;
    color: var(--color-text-secondary);
    padding-top: var(--gutter-3);

    margin-bottom: var(--gutter);
  }
}

.archive-grid-item {
  grid-column: auto / span 12;
  padding: 0 var(--gutterPadding);
  &.archive-grid-item-1 {
    padding-top: var(--gutter);
  }
  .item-content {
  }

  .project-info-top {
    display: grid;
    grid-template-columns: 4fr 8fr;
    gap: var(--gutter);
  }

  .client-column,
  .industry-column {
  }

  &:nth-last-child(-n + 2) {
    .item-content {
      margin-bottom: 0;
    }
  }

  // Accordion functionality
  &.is-open {
    .project-info-bottom {
      max-height: 500px; // Adjust this value based on your content
    }
    border-bottom: 1px solid var(--color-border);
    border-top: 1px solid var(--color-border);
    padding-top: var(--gutter);
  }

  // Add cursor pointer to indicate clickable
  cursor: pointer;

  // Optional: Add hover effect
  &:hover {
    .project-info-top {
      opacity: 0.8;
    }
  }
  border-bottom: 1px solid transparent;
  border-top: 1px solid transparent;
}
</style>
