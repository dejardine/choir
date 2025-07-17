<template>
  <div class="project-navigation" v-if="nextProject">
    <nuxt-link to="/work/" class="back-to-work"> Back to all work </nuxt-link>
    <nuxt-link
      :to="nextProjectLink"
      class="next-project-link"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousemove="handleMouseMove"
    >
      Another Project
    </nuxt-link>
    <button @click="scrollToTop" class="back-to-top-button">
      From the start
    </button>
  </div>

  <!-- Floating hover image -->
  <div
    v-if="isHovering && nextProjectAltThumbnail && nextProjectAltThumbnail.url"
    class="hover-image"
    :style="{
      left: mousePosition.x + 'px',
      top: mousePosition.y + 'px',
    }"
  >
    <img
      :src="nextProjectAltThumbnail.url"
      :alt="nextProjectAltThumbnail.alt || 'Next project thumbnail'"
      width="150"
      height="auto"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { PrismicText } from "@prismicio/vue";

// Load GSAP libraries we need
const { $gsap, $ScrollToPlugin } = useNuxtApp();

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

// Hover image functionality
const isHovering = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
const hoverImage = ref(null);

const handleMouseMove = (event) => {
  mousePosition.value = { x: event.clientX, y: event.clientY };
};

const handleMouseEnter = () => {
  isHovering.value = true;
};

const handleMouseLeave = () => {
  // Add a small delay to prevent flickering when moving between elements
  setTimeout(() => {
    isHovering.value = false;
  }, 100);
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
  if (!nextProject.value || !nextProject.value.data) {
    return null;
  }
  return nextProject.value.data.alt_thumbnail;
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
  position: fixed;
  pointer-events: none;
  z-index: 2000;
  transform: translate(-50%, -50%);
  transition:
    opacity 0.3s ease,
    transform 0.1s ease;

  img {
    width: 150px;
    height: auto;
  }
}
</style>
