<template>
  <div class="project-navigation" v-if="nextProject">
    <nuxt-link to="/work/" class="back-to-work"> Back to all work </nuxt-link>
    <nuxt-link :to="nextProjectLink" class="next-project-link">
      Another Project
    </nuxt-link>
    <button @click="scrollToTop" class="back-to-top-button">
      From the start
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
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

const nextProjectLink = computed(() => {
  if (nextProject.value) {
    return `/work/${nextProject.value.uid}`;
  }
  return "#"; // Fallback, though v-if should prevent rendering
});
</script>

<style scoped lang="scss">
@use "@/assets/scss/global.scss" as *;
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
</style>
