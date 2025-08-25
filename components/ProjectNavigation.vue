<template>
  <div class="project-navigation" v-if="nextProject">
    <nuxt-link to="/work/" class="back-to-work"> Back to all work </nuxt-link>
    <nuxt-link
      :to="nextProjectLink"
      class="next-project-link"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      Another Project
    </nuxt-link>
    <button @click="scrollToTop" class="back-to-top-button">
      From the start
    </button>
    <div
      v-if="isHovering && nextProjectAltThumbnail"
      ref="hoverImageRef"
      class="hover-image"
      :class="`hover-image--${imageOrientation}`"
    >
      <img
        :src="nextProjectAltThumbnail.url"
        :alt="nextProjectAltThumbnail.alt || 'Next project thumbnail'"
        width="150"
        height="auto"
        style="display: none"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, nextTick } from "vue";
import { PrismicText } from "@prismicio/vue";

// Load GSAP libraries we need
const { $gsap, $ScrollToPlugin } = useNuxtApp();

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

// Hover image functionality
const isHovering = ref(false);
const hoverImageRef = ref(null);

const handleMouseEnter = async () => {
  isHovering.value = true;

  // Wait for the DOM to update since we're using v-if
  await nextTick();

  // Animate image in with GSAP
  if (hoverImageRef.value && $gsap) {
    const img = hoverImageRef.value.querySelector("img");
    if (img) {
      $gsap.set(img, { scaleY: 0, display: "block" });
      $gsap.to(img, {
        scaleY: 1,
        duration: 0.4,
        ease: "power4.inOut",
        alpha: 1,
      });
    }
  }
};

const handleMouseLeave = () => {
  // Animate image out with GSAP
  if (hoverImageRef.value && $gsap) {
    const img = hoverImageRef.value.querySelector("img");
    if (img) {
      $gsap.to(img, {
        alpha: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          // Hide the element after animation completes
          isHovering.value = false;
        },
      });
    } else {
      // Fallback if no image found
      setTimeout(() => {
        isHovering.value = false;
      }, 100);
    }
  } else {
    // Fallback if GSAP not available
    setTimeout(() => {
      isHovering.value = false;
    }, 100);
  }
};

const props = defineProps({
  currentProjectUID: {
    type: String,
    required: true,
  },
  projectsGroup: {
    type: Array,
    default: () => [],
  },
});

const nextProject = computed(() => {
  if (!props.projectsGroup || props.projectsGroup.length === 0) {
    return null;
  }

  const currentIndex = props.projectsGroup.findIndex(
    (item) => item.case_study && item.case_study.uid === props.currentProjectUID
  );

  if (currentIndex === -1 || currentIndex === props.projectsGroup.length - 1) {
    return null; // Current project not found or is the last project
  }

  // Ensure the next item and its case_study link exist
  const nextItem = props.projectsGroup[currentIndex + 1];
  if (nextItem && nextItem.case_study && nextItem.case_study.uid) {
    return nextItem.case_study;
  }
  return null;
});

// Get the alt_thumbnail for the next project
const nextProjectAltThumbnail = computed(() => {
  const altThumbnail = nextProject.value?.data?.alt_thumbnail;

  // Check if alt_thumbnail has the required properties
  if (!altThumbnail?.url || !altThumbnail?.dimensions) {
    return null;
  }

  return altThumbnail;
});

// Determine image orientation and size class
const imageOrientation = computed(() => {
  if (
    !nextProjectAltThumbnail.value ||
    !nextProjectAltThumbnail.value.dimensions
  ) {
    return "square"; // Default fallback
  }

  const { width, height } = nextProjectAltThumbnail.value.dimensions;
  const ratio = width / height;

  if (ratio > 1.2) {
    return "landscape";
  } else if (ratio < 0.8) {
    return "portrait";
  } else {
    return "square";
  }
});

const nextProjectLink = computed(() => {
  if (nextProject.value) {
    return `/work/${nextProject.value.uid}`;
  }
  return "#"; // Fallback, though v-if should prevent rendering
});
</script>

<style scoped lang="scss">
@use "@/assets/scss/global.scss" as *;
@use "@/assets/scss/breakpoints.scss" as *;

.project-navigation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: var(--gutter) var(--gutterPadding);
  text-align: center;
  z-index: 10;
  @include bodyType;
  @include foundersMedium;
  .next-project-link {
    color: var(--color-text);
    @include linkStyle;
  }
}

.back-to-work {
  position: absolute;
  left: var(--gutterPadding);
  top: var(--gutter);
  padding: 0;
  cursor: pointer;
  @include linkStyle;
}

.back-to-top-button {
  position: absolute;
  right: var(--gutterPadding);
  top: var(--gutter);
  padding: 0;
  background-color: transparent;
  color: inherit; // Inherit color from parent
  border: none;
  border-radius: 0;
  cursor: pointer;

  @include noButton;
  @include linkStyle;
}

.hover-image {
  position: absolute;
  top: 0;
  left: 66.6666%;
  transform: translate(-25%, calc(-50%));
  pointer-events: none;
  z-index: 2000;
  transition: opacity 0.3s ease;

  img {
    width: 150px;
    height: auto;
    transform-origin: center;
  }

  // Landscape images - wider
  &--landscape {
    img {
      width: 300px;
      height: auto;
      @include breakpoint(mobile) {
        width: 175px;
      }
    }
  }

  // Portrait images - taller
  &--portrait {
    img {
      width: 200px;
      height: auto;
      @include breakpoint(mobile) {
        width: 125px;
      }
    }
  }

  // Square images - default size
  &--square {
    img {
      width: 150px;
      height: auto;
    }
  }
}
</style>
