<template>
  <div class="about-team">
    <div class="about-team-number">
      <span>(3)</span>
    </div>
    <prismic-rich-text :field="about?.team_heading" />
    <div class="about-team-content">
      <prismic-rich-text :field="about?.team_paragraph" />
    </div>
    <div class="about-team-people">
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
import { computed } from "vue";

const props = defineProps({
  about: {
    type: Object,
    required: true,
  },
});

const tripledTeamList = computed(() => {
  if (!props.about?.team_list) return [];
  return [
    ...props.about.team_list,
    ...props.about.team_list,
    ...props.about.team_list,
    ...props.about.team_list,
    ...props.about.team_list,
    ...props.about.team_list,
  ];
});
</script>

<style lang="scss" scoped>
.about-team {
  padding: var(--gutter) var(--gutterPadding);
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
    padding-bottom: 20vh;
    text-align: center;
    :deep(p) {
      @include smallHeading;
      text-align: center;
      em {
        @include heldaneTextItalic;
      }
      max-width: 720px;
      margin: 0 auto;
      margin-bottom: var(--gutter-2);
    }
  }
}

.about-team-people {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
  .about-team-people-item {
    position: relative;
    margin-bottom: 20vh;
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
  }
}
</style>
