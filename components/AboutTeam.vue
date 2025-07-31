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
        <prismic-rich-text :field="currentTeamMember.alternative_title_rich" />
      </div>
    </div>
    <div ref="teamPeople" class="about-team-people">
      <div
        class="about-team-people-item"
        v-for="item in tripledTeamList"
        :key="item.id"
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

const setupScrollTrigger = () => {
  if (!$gsap || !$ScrollTrigger || !teamTitle.value || !teamPeople.value) {
    return;
  }

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
      teamTitle.value.classList.add("pinned");
    },
    onLeave: () => {
      teamTitle.value.classList.remove("pinned");
    },
    onEnterBack: () => {
      teamTitle.value.classList.add("pinned");
    },
    onLeaveBack: () => {
      teamTitle.value.classList.remove("pinned");
    },
  });

  scrollTriggerInstances.push(pinST);
};

onMounted(() => {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    setupScrollTrigger();
    updateCurrentTeamMember();
  }, 1000);
});

onUnmounted(() => {
  // Clean up ScrollTrigger instances
  if (scrollTriggerInstances.length > 0) {
    scrollTriggerInstances.forEach((st) => st.kill());
    scrollTriggerInstances = [];
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
  border-top: 1px solid var(--color-border);
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

  .about-team-title-text {
    position: absolute;
    z-index: 100;
    top: var(--gutter);
    left: var(--gutterPadding);
    opacity: 0;
    transition: opacity 0.3s ease;

    .pinned & {
      opacity: 1;
    }
  }
}

.about-team-title-alt {
  :deep(p) {
    margin-bottom: var(--gutter);
    text-align: right;
    position: absolute;
    top: 0;
    right: 0;
    width: 50vw;
  }
  position: absolute;
  z-index: 100;
  top: var(--gutter);
  right: var(--gutterPadding);
  opacity: 0;
  transition: opacity 0.3s ease;

  .pinned & {
    opacity: 1;
  }
}
</style>
