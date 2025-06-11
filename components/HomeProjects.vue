<template>
  <div class="home-projects" ref="introductionContainer">
    <prismic-rich-text :field="props?.home?.data?.introduction" />
    <h3>Selected projects</h3>
    <div class="home-slices">
      <SliceZone
        :slices="props?.home?.data?.slices2 ?? []"
        :components="components"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { components } from "~/slices";
import { SliceZone } from "@prismicio/vue";

const introductionContainer = ref(null);

const props = defineProps({
  home: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  if (introductionContainer.value) {
    // Wait for potential nested rendering if needed (e.g., if prismic-rich-text is async)
    // Using requestAnimationFrame or nextTick might be more robust in complex cases
    // but for simple text replacement, this should often suffice.
    const currentHTML = introductionContainer.value.innerHTML;
    // Wrap the double em dash in a div. Using a span might be semantically better
    // depending on styling needs, but div was requested.
    const modifiedHTML = currentHTML.replace(
      /——/g,
      '<div class="em-dash-wrapper">——</div>'
    );
    introductionContainer.value.innerHTML = modifiedHTML;
  }
});
</script>

<style lang="scss" scoped>
.home-projects {
  margin-top: 100vh;
  padding: var(--gutterPadding);
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
  }
}
</style>
