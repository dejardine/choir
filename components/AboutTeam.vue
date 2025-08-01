<template>
  <div class="about-team">
    <div class="about-team-number">
      <span>(3)</span>
    </div>
    <prismic-rich-text :field="about?.team_heading" />
    <div class="about-team-content">
      <prismic-rich-text :field="about?.team_paragraph" />
    </div>
    <div ref="teamTitle" class="about-team-title">
      <div class="about-team-title-text">
        <strong>{{ currentTeamMember.name }} </strong>
        <span v-if="currentTeamMember.job_title">{{
          currentTeamMember.job_title
        }}</span>
      </div>
      <div class="about-team-title-alt">
        <div
          v-if="
            currentTeamMember.alternative_title_rich &&
            currentTeamMember.alternative_title_rich[currentAltTextIndex]
          "
          class="alt-text-paragraph"
        >
          {{
            currentTeamMember.alternative_title_rich[currentAltTextIndex].text
          }}
        </div>
        <!-- Debug info -->
        <div
          v-if="false"
          style="
            position: fixed;
            top: 10px;
            right: 10px;
            background: red;
            color: white;
            padding: 10px;
            z-index: 9999;
          "
        >
          Index: {{ currentAltTextIndex }}<br />
          Total: {{ currentTeamMember.alternative_title_rich?.length }}<br />
          Current:
          {{
            currentTeamMember.alternative_title_rich?.[currentAltTextIndex]
              ?.text
          }}
        </div>
      </div>
    </div>
    <div ref="teamPeople" class="about-team-people">
      <div
        class="about-team-people-item"
        v-for="item in tripledTeamList"
        :key="item.id"
        :class="{ 'has-parallax': item.parallax_enabled }"
        :data-parallax-speed="item.parallax_enabled ? 1.3 : null"
      >
        <ImageSquare :imageField="item.image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from "vue";

const { $gsap, $ScrollTrigger } = useNuxtApp();

const props = defineProps({
  about: {
    type: Object,
    required: true,
  },
});

const teamTitle = ref(null);
const teamPeople = ref(null);

// ScrollTrigger instances for cleanup
let scrollTriggerInstances = [];
let parallaxScrollTriggerInstances = [];

// Parallax setup
const setupParallax = async () => {
  await nextTick();

  const { $gsap, $ScrollTrigger } = useNuxtApp();
  if (!$gsap || !$ScrollTrigger || !teamPeople.value) return;

  // Kill existing parallax instances
  parallaxScrollTriggerInstances.forEach((st) => st.kill());
  parallaxScrollTriggerInstances = [];

  // Find all team people items with parallax enabled
  const parallaxItems = teamPeople.value.querySelectorAll(
    ".about-team-people-item.has-parallax"
  );

  console.log(`Found ${parallaxItems.length} parallax items`);

  parallaxItems.forEach((item, index) => {
    const speed = parseFloat(item.dataset.parallaxSpeed) || 1.3;

    // Calculate the parallax percentage (negative for upward movement)
    const parallaxPercent = -(speed - 1) * 100;

    console.log(
      `Setting up parallax for item ${index + 1}: speed=${speed}, percent=${parallaxPercent}%, element:`,
      item
    );

    // Apply parallax to the image inside, not the container
    const imageElement = item.querySelector("img");
    if (!imageElement) {
      console.log(`No image found in item ${index + 1}`);
      return;
    }

    // Use a simpler approach with direct ScrollTrigger
    const st = $ScrollTrigger.create({
      trigger: item,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const maxY = parallaxPercent * (item.offsetHeight / 100);
        const currentY = progress * maxY;

        console.log(
          `Progress: ${progress.toFixed(2)}, Y: ${currentY.toFixed(2)}`
        );

        $gsap.set(imageElement, {
          y: currentY,
          force3D: true,
        });
      },
    });

    parallaxScrollTriggerInstances.push(st);
    console.log(`Created ScrollTrigger for item ${index + 1}:`, st);
  });

  console.log(
    `Created ${parallaxScrollTriggerInstances.length} parallax ScrollTrigger instances`
  );
};

const tripledTeamList = computed(() => {
  if (!props.about?.team_list) return [];
  return [...props.about.team_list, ...props.about.team_list];
});

// Track the current team member in view
const currentTeamMember = ref({
  name: "",
  job_title: "",
  alternative_title_rich: null,
});

// Track current alt text paragraph for cycling
const currentAltTextIndex = ref(0);
const altTextInterval = ref(null);

const updateCurrentTeamMember = () => {
  // Find all team people items
  const peopleItems = teamPeople.value?.querySelectorAll(
    ".about-team-people-item"
  );
  if (!peopleItems || peopleItems.length === 0) return;

  // Find which item is currently in the center of the viewport
  const viewportCenter = window.innerHeight / 2;
  let closestDistance = Infinity;
  let currentIndex = -1;

  peopleItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(itemCenter - viewportCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      currentIndex = index;
    }
  });

  if (currentIndex >= 0 && tripledTeamList.value[currentIndex]) {
    currentTeamMember.value = {
      name: tripledTeamList.value[currentIndex].name || "",
      job_title: tripledTeamList.value[currentIndex].job_title || "",
      alternative_title_rich:
        tripledTeamList.value[currentIndex].alternative_title_rich || null,
    };
  }
};

const startAltTextCycle = () => {
  console.log("Starting alt text cycle, data:", {
    alternative_title_rich: currentTeamMember.value.alternative_title_rich,
    length: currentTeamMember.value.alternative_title_rich?.length,
  });

  if (!currentTeamMember.value.alternative_title_rich?.length) {
    console.log("No alt text data to cycle");
    return;
  }

  // Clear existing interval
  if (altTextInterval.value) {
    clearInterval(altTextInterval.value);
  }

  // Start cycling through paragraphs
  altTextInterval.value = setInterval(() => {
    if (currentTeamMember.value.alternative_title_rich?.length) {
      currentAltTextIndex.value =
        (currentAltTextIndex.value + 1) %
        currentTeamMember.value.alternative_title_rich.length;
      console.log("Cycling to index:", currentAltTextIndex.value);
    }
  }, 1000); // Change every 3 seconds

  console.log("Alt text cycle started with interval:", altTextInterval.value);
};

const stopAltTextCycle = () => {
  console.log("Stopping alt text cycle");
  if (altTextInterval.value) {
    clearInterval(altTextInterval.value);
    altTextInterval.value = null;
  }
  // Don't reset the index - preserve the current position
  console.log(
    "Alt text cycle stopped, keeping index at:",
    currentAltTextIndex.value
  );
};

const setupScrollTrigger = () => {
  if (!$gsap || !$ScrollTrigger || !teamTitle.value || !teamPeople.value) {
    console.log("Missing required elements or GSAP:", {
      gsap: !!$gsap,
      scrollTrigger: !!$ScrollTrigger,
      teamTitle: !!teamTitle.value,
      teamPeople: !!teamPeople.value,
    });
    return;
  }

  console.log("Setting up ScrollTrigger for team title");

  // Kill existing ScrollTrigger instances
  if (scrollTriggerInstances.length > 0) {
    scrollTriggerInstances.forEach((st) => st.kill());
    scrollTriggerInstances = [];
  }

  // Refresh ScrollTrigger to recalculate positions
  $ScrollTrigger.refresh();

  // Pin the team title when it hits the center, and keep it pinned through the team section
  const pinST = $ScrollTrigger.create({
    trigger: teamTitle.value,
    start: "center center",
    endTrigger: teamPeople.value,
    end: "bottom center",
    pin: teamTitle.value,
    pinSpacing: false,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      // Update the current team member in view
      updateCurrentTeamMember();
    },
    onEnter: () => {
      console.log("Team title entering pinned state (FORWARD scroll)");
      teamTitle.value.classList.add("pinned");
      startAltTextCycle();
    },
    onLeave: () => {
      console.log("Team title leaving pinned state (FORWARD scroll)");
      teamTitle.value.classList.remove("pinned");
      stopAltTextCycle();
    },
    onEnterBack: () => {
      console.log("Team title entering pinned state (BACKWARD scroll)");
      teamTitle.value.classList.add("pinned");
      startAltTextCycle();
    },
    onLeaveBack: () => {
      console.log("Team title leaving pinned state (BACKWARD scroll)");
      teamTitle.value.classList.remove("pinned");
      stopAltTextCycle();
    },
  });

  scrollTriggerInstances.push(pinST);
  console.log("ScrollTrigger created:", pinST);
};

onMounted(() => {
  console.log("AboutTeam mounted, setting up ScrollTrigger");

  // Small delay to ensure DOM is ready
  setTimeout(() => {
    console.log("AboutTeam setup timeout, elements:", {
      teamTitle: !!teamTitle.value,
      teamPeople: !!teamPeople.value,
    });
    setupScrollTrigger();
    setupParallax();
    updateCurrentTeamMember();
  }, 2000); // Increased delay to ensure everything is loaded
});

onUnmounted(() => {
  // Clean up ScrollTrigger instances
  if (scrollTriggerInstances.length > 0) {
    scrollTriggerInstances.forEach((st) => st.kill());
    scrollTriggerInstances = [];
  }

  // Clean up parallax ScrollTrigger instances
  if (parallaxScrollTriggerInstances.length > 0) {
    parallaxScrollTriggerInstances.forEach((st) => st.kill());
    parallaxScrollTriggerInstances = [];
  }

  // Clean up alt text interval
  if (altTextInterval.value) {
    clearInterval(altTextInterval.value);
    altTextInterval.value = null;
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/breakpoints.scss";

.about-team-number {
  text-transform: uppercase;
  @include smallType;

  @include foundersMedium;
  letter-spacing: 0.05rem;
  text-align: left;
  position: absolute;
  top: var(--gutter);
  left: var(--gutterPadding);
}
.about-team {
  padding: var(--gutter) 0;
  border-top: 1px solid var(--color-border);
  position: relative;
  :deep(h3) {
    @include smallType;
    text-transform: uppercase;
    @include foundersMedium;
    letter-spacing: 0.05rem;
    text-align: center;
    position: absolute;
    top: var(--gutter);
    left: 0;
    width: 100%;
    z-index: 1;
  }
  .about-team-content {
    padding-top: 20vh;
    padding-bottom: 30vh;
    text-align: center;
    :deep(p) {
      @include smallHeading;
      text-align: center;
      em {
        @include heldaneTextItalic;
      }
      max-width: 885px;
      width: 65vw;
      margin: 0 auto;
      margin-bottom: var(--gutter-2);
      @include breakpoint(mobile) {
        width: 100%;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    @include breakpoint(mobile) {
      padding-left: var(--gutterPadding);
      padding-right: var(--gutterPadding);
    }
  }
}

.about-team-people {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
  padding-bottom: 30vh;

  .about-team-people-item {
    position: relative;
    margin-bottom: 30vh;
    &:nth-child(6n + 1) {
      grid-column: 6 / span 3;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translateX(calc(-8.33vw / 2));
      :deep(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    &:nth-child(6n + 2) {
      grid-column: 3 / span 3;
    }
    &:nth-child(6n + 3) {
      grid-column: 8 / span 3;
    }
    &:nth-child(6n + 4) {
      grid-column: 4 / span 3;
    }
    &:nth-child(6n + 5) {
      grid-column: 8 / span 3;
    }
    &:nth-child(6n + 6) {
      grid-column: 3 / span 3;
    }
    @for $i from 1 through 100 {
      &:nth-child(#{$i}) {
        grid-row: #{$i};
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    &:first-child {
      margin-top: 20vh;
    }
  }
}

.about-team-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  border-top: 1px solid var(--color-reverse);
  padding: 0;
  z-index: 100;
  @include bodyType;
  strong {
    margin-right: var(--gutter-half);
  }
  position: relative;

  &.pinned {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
  }
}

.about-team-title-text {
  position: absolute;
  z-index: 100;
  top: var(--gutter);
  left: var(--gutterPadding);
  opacity: 0;
  transition: opacity 0.3s ease;
  color: var(--color-reverse);
  .about-team-title.pinned & {
    opacity: 1;
  }
}

// Target the GSAP-created pin-spacer wrapper
:deep(.pin-spacer) {
  mix-blend-mode: exclusion;
}

.about-team-title-alt {
  :deep(p) {
    margin-bottom: var(--gutter);
    text-align: right;
    position: absolute;
    top: 0;
    right: 0;
    width: 50vw;
    color: var(--color-reverse);
  }
  position: absolute;
  z-index: 100;
  top: var(--gutter);
  right: var(--gutterPadding);
  opacity: 0;
  transition: opacity 0.3s ease;

  .about-team-title.pinned & {
    opacity: 1;
  }

  // Add transition for paragraph changes
  :deep(p) {
    transition: opacity 0.5s ease-in-out;
  }

  .alt-text-paragraph {
    margin-bottom: var(--gutter);
    text-align: right;
    position: absolute;
    top: 0;
    right: 0;
    width: 50vw;
    transition: opacity 0.5s ease-in-out;
    color: var(--color-reverse);
  }
}
</style>
