<template>
  <div class="project-information" ref="projectInformationContainerEl">
    <div
      class="project-information-header animate-in"
      ref="projectInformationHeaderEl"
    >
      <prismic-rich-text :field="project?.header_paragraph" />
    </div>
    <div
      class="project-information-content animate-in"
      ref="projectInformationEl"
    >
      <div class="project-information-content-left">
        <div v-for="(item, index) in project.client" :key="index">
          {{ clientNames[item.client.uid] || "" }}
        </div>
      </div>
      <div class="project-information-content-right">
        <div class="project-information-content-right-left">
          <button
            class="more-info-button"
            @click="toggleInfo"
            ref="moreInfoButtonEl"
          >
            {{ buttonText }}
          </button>
          <div class="project-information-reveal" ref="revealLeftEl">
            <prismic-rich-text :field="project?.scope" />
            <p class="year">{{ project?.year }}</p>
            <prismic-link :field="project?.link" class="link"></prismic-link>
          </div>
        </div>
        <div class="project-information-content-right-right">
          <div class="project-information-reveal" ref="revealRightEl">
            <prismic-rich-text :field="project?.information" />
            <blockquote v-if="project?.quote[0]">
              <prismic-rich-text :field="project?.quote" />
              <cite>
                <prismic-rich-text :field="project?.quote_cite" />
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  watchEffect,
  onMounted,
  computed,
  watch,
  nextTick,
  onBeforeUnmount,
} from "vue";
import { usePrismic } from "@prismicio/vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

// GSAP and Prismic instances
const { $gsap, $ScrollTrigger, $ScrollToPlugin } = useNuxtApp();
const { client: prismicClient } = usePrismic();

// --- Component State & Data ---
const clientNames = ref({}); // Stores fetched client names
const isInfoVisible = ref(false); // Controls visibility of detailed project info

// --- Template Refs ---
// Main layout elements
const projectInformationContainerEl = ref(null); // The main container div for margin adjustment
const projectInformationHeaderEl = ref(null); // The header div, its height is used for calculations
const projectInformationEl = ref(null); // Ref for the .project-information-content div

// Elements for "More Info" toggle animation
const moreInfoButtonEl = ref(null);
const revealLeftEl = ref(null); // Left column content to reveal
const revealRightEl = ref(null); // Right column content to reveal

// --- Observers ---
let headerObserver = null; // MutationObserver to detect header height changes

// --- Computed Properties ---
// Dynamically sets the text for the "More Info" / "Less Info" button
const buttonText = computed(() => {
  return isInfoVisible.value ? "Less info" : "More info";
});

// --- Methods ---

// Handles the animation for showing/hiding detailed project information
const toggleInfo = () => {
  isInfoVisible.value = !isInfoVisible.value;
  const revealElements = [revealLeftEl.value, revealRightEl.value].filter(
    Boolean
  );

  if (revealElements.length === 0) return;

  const tl = $gsap.timeline();
  const childrenToAnimate = revealElements.flatMap((el) =>
    Array.from(el.children)
  );

  if (isInfoVisible.value) {
    // Animate open
    tl.to(revealElements, {
      height: "auto",
      duration: 0.6,
      ease: "expo.inOut",
      onComplete: () => {
        revealElements.forEach((el) => $gsap.set(el, { overflow: "visible" }));
      },
    }).to(
      childrenToAnimate,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "expo.out",
      },
      "-=0.3" // Start fading in content slightly before height animation finishes
    );
  } else {
    // Animate close
    // Set overflow to hidden before starting the close animation
    revealElements.forEach((el) => $gsap.set(el, { overflow: "hidden" }));
    tl.to(childrenToAnimate, {
      opacity: 0,
      y: "10px", // Slight upward movement before disappearing
      duration: 0.4,
      stagger: 0.03,
      ease: "expo.in",
    }).to(
      revealElements,
      {
        height: 0,
        duration: 0.5,
        ease: "expo.inOut",
      },
      "-=0.2" // Start height animation slightly before children fully faded
    );
  }
};

// Dynamically calculates and sets the top margin of the component
// to position it 100vh below the bottom of its header, plus an offset.
const MARGIN_TOP_OFFSET = 48; // Additional offset in pixels

const calculateMarginTop = async () => {
  // Ensure Vue has processed DOM updates before measurement
  await nextTick();

  // Defer measurement to the next browser paint cycle for accuracy
  requestAnimationFrame(() => {
    if (
      projectInformationContainerEl.value &&
      projectInformationHeaderEl.value
    ) {
      const headerHeight = projectInformationHeaderEl.value.offsetHeight;
      if (typeof headerHeight === "number" && headerHeight >= 0) {
        projectInformationContainerEl.value.style.marginTop = `calc(100vh - (${headerHeight}px + ${MARGIN_TOP_OFFSET}px))`;
      } else {
        // console.warn("ProjectInformationHeader: Could not determine valid header height on RAF.");
      }
    }
  });
};

// --- Lifecycle Hooks & Watchers ---

onMounted(() => {
  // Set initial state for GSAP-animated "reveal" elements
  const revealElements = [revealLeftEl.value, revealRightEl.value].filter(
    Boolean
  );
  if (revealElements.length > 0) {
    const childrenToAnimate = revealElements.flatMap((el) =>
      Array.from(el.children)
    );
    $gsap.set(childrenToAnimate, { opacity: 0, y: "10px" });
  }

  // Initial margin calculation
  calculateMarginTop();

  // Recalculate margin on window resize
  window.addEventListener("resize", calculateMarginTop);

  // Observe the header for content/size changes to recalculate margin
  if (projectInformationHeaderEl.value) {
    headerObserver = new MutationObserver(async () => {
      await calculateMarginTop();
    });
    const observerConfig = {
      childList: true, // Detect direct children changes
      subtree: true, // Detect changes in all descendants
      characterData: true, // Detect text content changes
    };
    headerObserver.observe(projectInformationHeaderEl.value, observerConfig);
  }
});

onBeforeUnmount(() => {
  // Clean up listeners and observers to prevent memory leaks
  window.removeEventListener("resize", calculateMarginTop);
  if (headerObserver) {
    headerObserver.disconnect();
  }
});

// Recalculate margin if the project data changes (e.g., on route navigation)
watch(
  () => props.project,
  () => {
    calculateMarginTop();
  },
  { deep: true } // Watch for nested changes within the project object
);

// Fetches and stores client names when project data is available or changes
watchEffect(async () => {
  if (
    props.project &&
    props.project.client &&
    props.project.client.length > 0
  ) {
    for (const groupItem of props.project.client) {
      const clientLink = groupItem.client;
      if (clientLink && clientLink.uid && !clientNames.value[clientLink.uid]) {
        try {
          // Initialize with a loading state or skip if already fetching
          if (!clientNames.value[clientLink.uid]) {
            clientNames.value[clientLink.uid] = "Fetching..."; // Placeholder
          }

          const fetchedClient = await prismicClient.getByUID(
            "client",
            clientLink.uid
          );
          if (
            fetchedClient &&
            fetchedClient.data &&
            fetchedClient.data.client_name
          ) {
            clientNames.value[clientLink.uid] = fetchedClient.data.client_name;
          } else {
            clientNames.value[clientLink.uid] = "Client name not found";
          }
        } catch (error) {
          console.error(`Error fetching client ${clientLink.uid}:`, error);
          clientNames.value[clientLink.uid] = "Error fetching name";
        }
      }
    }
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/global.scss";

.project-information {
  position: relative;
  z-index: 10;
  background-color: var(--color-background);
}

.project-information-header {
  padding: var(--gutter);
  :deep(h2) {
    @include heldaneSubheading;
    padding-bottom: var(--gutter-5);
  }
  border-bottom: 1px solid var(--color-border);
}

.project-information-content {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: var(--gutter);
  padding: var(--gutterPadding);
  padding-bottom: 25vh;
  display: grid;
}

.project-information-content-left {
  grid-column: 1 / span 4;
  :deep(div) {
    @include foundersMedium;
  }
}

.project-information-content-right {
  grid-column: 5 / span 8;
}
.more-info-button {
  @include noButton;
  color: var(--color-text);
  @include foundersMedium;
  position: absolute;
  top: 0;
  left: 0;
  @include linkStyle;
}

.project-information-content-right {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: var(--gutter);
}

.project-information-content-right-left {
  position: relative;
  padding-top: var(--gutter-8);
  grid-column: 1 / span 2;
  :deep(p) {
    @include foundersMedium;
  }
  :deep(a) {
    @include foundersMedium;
    margin-top: var(--gutter);
    display: block;
    @include linkStyle;
  }
  .year {
    margin-top: var(--gutter);
    display: block;
  }
}

.project-information-content-right-right {
  padding-top: var(--gutter-8);
  grid-column: 3 / span 6;
  :deep(p) {
    @include largeBodyType;
    margin-bottom: var(--gutter);
    max-width: 460px;
  }
  blockquote {
    margin-top: var(--gutter-5);
    position: relative;
    cite {
      :deep(p) {
        @include smallType;
        @include foundersMedium;
        text-transform: uppercase;
        letter-spacing: 0.05rem;
      }
    }
    &:before {
      content: "“";
      font-size: 2rem;
      color: var(--color-text);
      @include largeBodyType;
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(calc(-100% - 1px));
    }
  }
}

.project-information-reveal {
  height: 0px;
  overflow: hidden;
}
</style>
