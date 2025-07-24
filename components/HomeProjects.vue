<template>
  <div class="home-projects" ref="homeProjects">
    <div ref="introductionContainer" class="home-projects-introduction">
      <prismic-rich-text :field="props?.home?.data?.introduction" />
    </div>

    <h3>Selected projects</h3>
    <div ref="projectTitle" class="home-project-title">
      <div class="home-project-title-text">
        <prismic-rich-text
          v-if="currentProjectTitle"
          :field="currentProjectTitle"
        />
        <span v-else>Title here</span>
      </div>
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
    <NuxtLink to="/work" class="view-all-projects">View all projects</NuxtLink>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { components } from "~/slices";
import { SliceZone } from "@prismicio/vue";

const introductionContainer = ref(null);
const projectTitle = ref(null);
const homeSlices = ref(null);
const homeProjects = ref(null);

// Reactive data for current project
const currentProjectTitle = ref(null);
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

  // Pin the project title when it hits the center, and keep it pinned through all projects
  const pinST = $ScrollTrigger.create({
    trigger: projectTitle.value,
    start: "center center",
    endTrigger: homeProjects.value,
    end: "bottom center",
    pin: projectTitle.value,
    pinSpacing: false,
    onUpdate: (self) => {
      updateCurrentProject();
    },
    onEnter: () => {
      projectTitle.value.classList.add("pinned");
    },
    onLeave: () => {
      projectTitle.value.classList.remove("pinned");
    },
    onEnterBack: () => {
      projectTitle.value.classList.add("pinned");
    },
    onLeaveBack: () => {
      projectTitle.value.classList.remove("pinned");
    },
  });

  // Additional ScrollTrigger for updating content
  const updateST = $ScrollTrigger.create({
    trigger: homeSlices.value,
    start: "top center",
    end: "bottom center-1px",
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
  let projectIndex = -1;

  projectSections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const distance = Math.abs(sectionCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      currentProject = section;
      projectIndex = index;
    }
  });

  if (currentProject && projectIndex >= 0) {
    // Get the slice data directly instead of using data attributes
    const sliceData = props?.home?.data?.slices2?.[projectIndex];

    if (sliceData?.primary) {
      // Set the rich text field for the title
      if (sliceData.primary.project_copy) {
        currentProjectTitle.value = sliceData.primary.project_copy;
      }

      // Set the link
      if (sliceData.primary.project_link) {
        currentProjectLink.value = sliceData.primary.project_link;
      } else {
        currentProjectLink.value = null;
      }
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
  padding-bottom: 20vh;
  position: relative;
  z-index: 11;
  background-color: var(--color-background);
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
  padding: 0;
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
  position: absolute;
  top: var(--gutter);
  left: var(--gutterPadding);
  opacity: 0;

  .pinned & {
    opacity: 1;
  }
  @include breakpoint(mobile) {
    width: 66.666%;
  }
}

.home-project-title-link {
  @include bodyType;
  @include foundersMedium;
  a {
    @include linkStyle;
  }
  position: absolute;
  top: var(--gutter);
  right: var(--gutterPadding);
  opacity: 0;

  .pinned & {
    opacity: 1;
  }
}

.home-projects-introduction {
  padding: 0 var(--gutterPadding);
}
.view-all-projects {
  @include bodyType;
  @include foundersMedium;

  color: var(--color-text);
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  text-align: center;
  padding-top: var(--gutter);
  @include linkStyle;
}
</style>
