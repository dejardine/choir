<template>
  <div class="call-to-action-top">
    <div class="call-to-action-inner">
      <prismic-rich-text :field="cta" />
      <button @click="scrollToTop" class="back-to-top-button">
        From the start
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  cta: {
    type: Object,
    required: true,
  },
});

// Load GSAP libraries we need
const { $gsap, $ScrollTrigger, $ScrollToPlugin } = useNuxtApp();

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
</script>

<style lang="scss" scoped>
@use "@/assets/scss/global.scss" as *;
@use "@/assets/scss/breakpoints.scss" as *;

.call-to-action-top {
  position: relative;
  z-index: 5;
  width: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  :deep(p) {
    text-align: center;
    @include bodyType;
    display: inline;
    @include breakpoint(mobile) {
      justify-self: flex-start;
      margin-right: auto;
    }
  }
}

.call-to-action-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--color-border);
  width: 100%;
  padding: var(--gutter);
  :deep(a) {
    @include linkStyle;
  }
}

.back-to-top-button {
  position: absolute;
  right: var(--gutterPadding);
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
  background-color: transparent;
  color: inherit; // Inherit color from parent
  border: none;
  border-radius: 0;
  cursor: pointer;
  font-size: inherit; // Inherit font size from parent
  line-height: inherit; // Inherit line height from parent
  text-decoration: underline; // Optional: make it look more like a link
  @include noButton;
  &:hover {
    opacity: 0.7; // Slight visual feedback on hover
  }
  // float: right; // Removed
}
</style>
