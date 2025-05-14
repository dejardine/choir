<template>
  <div class="home-hero">
    <swiper
      v-if="props.home?.data?.slideshow?.length"
      :modules="[EffectFade, Autoplay, Navigation]"
      effect="fade"
      :loop="true"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :navigation="{
        nextEl: nextButton,
        prevEl: prevButton,
      }"
      class="home-hero-slider"
    >
      <swiper-slide
        v-for="(slide, index) in props?.home?.data?.slideshow"
        :key="`slide-${index}`"
      >
        <ImageFull :imageField="slide?.image" v-if="slide?.image?.url" />
        <video
          v-else-if="slide.video?.url"
          :src="slide?.video?.url"
          autoplay
          muted
          loop
          playsinline
        ></video>
        <div class="caption-controls">
          <prismic-rich-text :field="slide?.caption" />
          <div class="caption-controls-controls">
            <button ref="prevButton" class="swiper-button-prev">Prev</button>
            <span class="nav-separator">/</span>
            <button ref="nextButton" class="swiper-button-next">Next</button>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref } from "vue"; // <-- Import ref

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper modules
import { EffectFade, Autoplay, Navigation } from "swiper/modules"; // <-- Added Navigation

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
// Optionally import basic navigation styles (can be overridden)
// import 'swiper/css/navigation';

const props = defineProps({
  home: {
    type: Object,
    required: true,
  },
});

// Refs for custom navigation buttons
const prevButton = ref(null);
const nextButton = ref(null);
</script>

<style lang="scss" scoped>
@use "@/assets/scss/breakpoints.scss" as *;
@use "@/assets/scss/global.scss" as *;

.home-hero {
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  top: 0;
  left: 0;
}

.home-hero-slider {
  width: 100%;
  height: 100%;

  .swiper-slide {
    width: 100%;
    height: 100%;
    :deep(.image-full-container) {
      height: 100%;
      img,
      video {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .caption-controls {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 10;
      width: 100%;
      @include gridSetup;
      padding: var(--gutter);
      box-sizing: border-box;
      pointer-events: none;
      mix-blend-mode: exclusion;
      align-items: flex-end;
    }
    :deep(p) {
      grid-column: 1 / span 4;
      pointer-events: auto;
      line-height: 1;
    }
    .caption-controls-controls {
      grid-column: 9 / span 4;
      mix-blend-mode: exclusion;

      display: flex;
      justify-content: flex-start;
      gap: var(--gutter-quarter);
      pointer-events: auto;
      color: var(--color-reverse);
      .swiper-button-prev,
      .swiper-button-next {
        @include noButton;
        color: var(--color-reverse);
        &:hover {
          text-decoration: underline;
        }
      }
      line-height: 1;

      // Hide default Swiper arrows if they appear
      // Or remove the 'swiper/css/navigation' import
      &::after {
        display: none;
      }
    }
  }
}

// Basic fade effect styling
.swiper-fade .swiper-slide {
  pointer-events: none;
  transition-property: opacity;
}

.swiper-fade .swiper-slide-active {
  pointer-events: auto;
}

// Ensure custom buttons are clickable even when slide is not active (during transition)
// Note: This might need adjustment based on exact transition behaviour
.swiper-button-prev,
.swiper-button-next {
  z-index: 11; // Ensure buttons are above slides
  pointer-events: auto !important; // Force pointer events
}
</style>
