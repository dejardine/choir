<template>
  <section
    class="small-gallery"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    :class="sectionClasses"
  >
    <client-only>
      <div class="swiper-container-wrapper">
        <swiper
          ref="swiperRef"
          :modules="[EffectFade, Autoplay, Navigation, Pagination]"
          :slides-per-view="1"
          :space-between="10"
          effect="fade"
          :fade-effect="{ crossFade: true }"
          :loop="true"
          :autoplay="swiperAutoplayOptions"
          :autoHeight="true"
          :navigation="slice.primary.images.length > 1"
          :pagination="paginationOptions"
          class="small-gallery-swiper"
          @mouseenter="startAutoplay"
          @mouseleave="stopAutoplay"
        >
          <swiper-slide
            v-for="(item, index) in slice.primary.images"
            :key="index"
          >
            <prismic-image :field="item.image" class="gallery-image" />
          </swiper-slide>
          <div class="swiper-pagination-custom"></div>
        </swiper>
      </div>
    </client-only>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper modules
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// Define props using defineProps
const props = defineProps({
  slice: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const sectionClasses = computed(() => {
  let alignClass = "small-gallery--left"; // default

  if (props.slice.primary.align_gallery) {
    // Convert dropdown value to valid CSS class name (lowercase, remove spaces)
    const alignValue = props.slice.primary.align_gallery
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/^align-/, ""); // Remove "align-" prefix if it exists
    alignClass = `small-gallery--${alignValue}`;
  }

  return {
    "small-gallery-slice": true,
    "has-bottom-margin": props.slice.primary.bottom_margin === true,
    [alignClass]: true,
  };
});

const swiperRef = ref(null);
let swiperInstance = null;

onMounted(() => {
  if (swiperRef.value) {
    swiperInstance = swiperRef.value.swiper;
    console.log("SmallGallery swiper instance:", swiperInstance);
    console.log("SmallGallery pagination options:", paginationOptions.value);

    // Manually update pagination if swiper is already initialized
    if (swiperInstance?.pagination) {
      swiperInstance.pagination.init();
      swiperInstance.pagination.render();
      swiperInstance.pagination.update();
    }
  }
});

const paginationOptions = computed(() => ({
  el: ".swiper-pagination-custom",
  type: "fraction",
  clickable: true,
  renderFraction: function (currentClass, totalClass) {
    return (
      '<span class="' +
      currentClass +
      '"></span>' +
      " of " +
      '<span class="' +
      totalClass +
      '"></span>'
    );
  },
}));

const swiperAutoplayOptions = ref({
  delay: 3000,
  disableOnInteraction: false,
  pauseOnMouseEnter: false, // Manual handling via start/stopAutoplay
  enabled: false, // Initially disabled
});

const startAutoplay = () => {
  if (
    swiperInstance &&
    swiperInstance.autoplay &&
    props.slice.primary.images.length > 1
  ) {
    swiperAutoplayOptions.value.enabled = true;
    // Ensure Swiper picks up the change if it doesn't automatically
    // For Swiper Element, changing the bound prop should be enough.
    // Then, explicitly start it.
    if (swiperRef.value && swiperRef.value.swiper) {
      swiperRef.value.swiper.autoplay.start();
    }
  }
};

const stopAutoplay = () => {
  if (swiperInstance && swiperInstance.autoplay) {
    swiperAutoplayOptions.value.enabled = false;
    if (swiperRef.value && swiperRef.value.swiper) {
      swiperRef.value.swiper.autoplay.stop();
    }
  }
};

// Ensure slice.primary.images is available and is an array
const images = computed(() => {
  return props.slice?.primary?.images || [];
});
</script>

<style lang="scss" scoped>
.small-gallery {
  width: 100%;
  padding: var(--gutter) var(--gutterPadding);
  padding-top: 0;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  &.has-bottom-margin {
    padding-bottom: var(--slide-padding);
  }
  &.small-gallery--left {
    grid-column: 1 / span 4;
    .swiper-container-wrapper {
      grid-column: 1 / span 4;
    }
  }
  &.small-gallery--center {
    grid-column: 5 / span 4;
    .swiper-container-wrapper {
      grid-column: 5 / span 4;
    }
  }
  &.small-gallery--right {
    grid-column: 9 / span 4;
    .swiper-container-wrapper {
      grid-column: 9 / span 4;
    }
  }
}

.swiper-container-wrapper {
  grid-column: 1 / span 4;
  width: 100%;
  position: relative; /* Needed for absolute positioning of custom pagination if required */
}

.small-gallery-swiper {
  width: 100%;
  /* Remove direct grid positioning from swiper, now handled by wrapper */

  // Ensure fade effect works properly
  .swiper-slide {
    opacity: 0;
    transition: opacity 0.3s ease;

    &.swiper-slide-active {
      opacity: 1;
    }
  }
}

.swiper-pagination-custom {
  text-align: left;
  padding-top: var(--gutter);
  @include smallType;
  @include heldaneTextItalic;
  color: var(--color-text);
  position: relative;
  bottom: auto;
  left: 0;
  width: 100%;

  .swiper-pagination-bullet {
    display: none; // Hide default bullets since we're using fraction
  }

  .swiper-pagination-fraction {
    @include smallType;
    @include heldaneTextItalic;
    color: var(--color-text);
  }
}

.gallery-image {
  display: block;
  width: 100%;
  height: auto; /* Let image maintain aspect ratio */
  object-fit: cover;
}
</style>
