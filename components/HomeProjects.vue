<template>
  <div class="home-projects">
    <div ref="introductionContainer" class="home-projects-introduction">
      <prismic-rich-text :field="props?.home?.data?.introduction" />
    </div>

    <h3>Selected projects</h3>
    <div ref="projectTitle" class="home-project-title">
      <div class="home-project-title-text">{{ currentProjectTitle }}</div>
      <div class="home-project-title-link">
        <prismic-link v-if="currentProjectLink" :field="currentProjectLink">
          View Project
        </prismic-link>
        <span v-else>View Project</span>
      </div>
    </div>
    <div ref="homeSlices" class="home-slices">
      <SliceZone
        :slices="props?.home?.data?.slices2 ?? []"
        :components="components"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { components } from "~/slices";
import { SliceZone } from "@prismicio/vue";

const introductionContainer = ref(null);
const projectTitle = ref(null);
const homeSlices = ref(null);

// Reactive data for current project
const currentProjectTitle = ref("Title here");
const currentProjectLink = ref(null);

// ScrollTrigger instances for cleanup
let scrollTriggerInstances = [];
let resizeHandler = null;

const props = defineProps({
  home: {
    type: Object,
    required: true,
  },
});

const setupScrollTrigger = () => {
  // Get GSAP instances
  const { $gsap, $ScrollTrigger } = useNuxtApp();

  if (!$gsap || !$ScrollTrigger || !projectTitle.value || !homeSlices.value) {
    return;
  }

  // Kill existing ScrollTrigger instances
  if (scrollTriggerInstances.length > 0) {
    scrollTriggerInstances.forEach((st) => st.kill());
    scrollTriggerInstances = [];
  }

  // Refresh ScrollTrigger to recalculate positions
  $ScrollTrigger.refresh();

  // Only enable ScrollTrigger on non-mobile devices
  const isMobile = window.innerWidth <= 812;

  if (isMobile) {
    // On mobile, just update the current project without pinning
    const mobileST = $ScrollTrigger.create({
      trigger: homeSlices.value,
      start: "top center",
      end: "bottom center",
      onUpdate: (self) => {
        updateCurrentProject();
      },
    });
    scrollTriggerInstances.push(mobileST);
    return;
  }

  // Pin the project title when it hits the center, and keep it pinned through all projects
  const pinST = $ScrollTrigger.create({
    trigger: projectTitle.value,
    start: "center center",
    endTrigger: homeSlices.value,
    end: "bottom bottom",
    pin: projectTitle.value,
    pinSpacing: false,
    onUpdate: (self) => {
      updateCurrentProject();
    },
  });

  // Additional ScrollTrigger for updating content
  const updateST = $ScrollTrigger.create({
    trigger: homeSlices.value,
    start: "top center",
    end: "bottom center",
    onUpdate: (self) => {
      updateCurrentProject();
    },
  });

  scrollTriggerInstances.push(pinST, updateST);
};

const updateCurrentProject = () => {
  // Find all project sections
  const projectSections = document.querySelectorAll(".project-section");

  if (projectSections.length === 0) return;

  // Find which project is currently in the center of the viewport
  const viewportCenter = window.innerHeight / 2;
  let currentProject = null;
  let closestDistance = Infinity;

  projectSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const distance = Math.abs(sectionCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      currentProject = section;
    }
  });

  if (currentProject) {
    // Update title and link
    const title = currentProject.getAttribute("data-title");
    const linkData = currentProject.getAttribute("data-link");

    if (title) {
      currentProjectTitle.value = title;
    }

    // Handle the link data - it's already a Prismic link object, not JSON string
    if (linkData && linkData !== "null" && linkData !== "[object Object]") {
      // The data-link attribute might contain serialized link data
      // We need to get the actual link from the slice data instead
      // For now, let's try to find the corresponding slice data
      const sliceIndex = Array.from(projectSections).indexOf(currentProject);
      const sliceData = props?.home?.data?.slices2?.[sliceIndex];

      if (sliceData?.primary?.project_link) {
        currentProjectLink.value = sliceData.primary.project_link;
      } else {
        currentProjectLink.value = null;
      }
    } else {
      currentProjectLink.value = null;
    }
  }
};

onMounted(async () => {
  if (introductionContainer.value) {
    const currentHTML = introductionContainer.value.innerHTML;
    const modifiedHTML = currentHTML.replace(
      /——/g,
      '<div class="em-dash-wrapper">——</div>'
    );
    introductionContainer.value.innerHTML = modifiedHTML;
  }

  // Wait for SliceZone to render
  await nextTick();

  // Small delay to ensure all slices are rendered
  setTimeout(() => {
    setupScrollTrigger();
  }, 100);

  // Add resize handler
  resizeHandler = () => {
    // Debounce resize events
    clearTimeout(resizeHandler.timeout);
    resizeHandler.timeout = setTimeout(() => {
      setupScrollTrigger();
    }, 250);
  };

  window.addEventListener("resize", resizeHandler);
});

onUnmounted(() => {
  // Clean up ScrollTrigger instances
  if (scrollTriggerInstances.length > 0) {
    scrollTriggerInstances.forEach((st) => st.kill());
    scrollTriggerInstances = [];
  }

  // Clean up resize handler
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
    clearTimeout(resizeHandler.timeout);
  }
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/breakpoints.scss" as *;
@use "@/assets/scss/global.scss" as *;

.home-projects {
  margin-top: 100vh;
  padding: var(--gutterPadding) 0;
  padding-bottom: 33.333vh;

  position: relative;
  z-index: 10;
  background-color: var(--color-background);
  min-height: 150vh;
  :deep(h2) {
    @include heldaneHeading;
    em {
      @include heldaneHeadingItalic;
    }
  }
  // Optional: Add styling for the wrapper if needed
  :deep(.em-dash-wrapper) {
    display: inline; //
    letter-spacing: -0.16em;
  }
  h3 {
    @include smallType;
    text-transform: uppercase;
    @include foundersMedium;
    letter-spacing: 0.05rem;
    margin-top: 33.333vh;
    padding: var(--gutter) var(--gutterPadding);
  }
}

.home-project-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: 1px solid var(--color-border);
  padding: var(--gutter) var(--gutterPadding);
  background-color: var(--color-background);
  z-index: 100;

  &.pinned {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
  }
}

.home-project-title-text {
  transition: opacity 0.3s ease;
}

.home-project-title-link {
  transition: opacity 0.3s ease;

  a {
    text-decoration: none;
    color: inherit;

    &:hover {
      opacity: 0.7;
    }
  }

  @include breakpoint(mobile) {
    align-self: flex-end;
  }
}

.home-projects-introduction {
  padding: 0 var(--gutterPadding);
}
</style>
