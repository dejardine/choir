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
        </swiper>
        <div class="swiper-pagination-custom"></div>
      </div>
    </client-only>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { register } from "swiper/element/bundle";
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper modules
import { EffectFade, Autoplay, Navigation } from "swiper/modules"; // <-- Added Navigation

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
// Optionally import basic navigation styles (can be overridden)
// import 'swiper/css/navigation';

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
  register(); // Register Swiper custom elements

  if (swiperRef.value) {
    const swiperEl = swiperRef.value;
    const assignSwiperInstance = () => {
      if (swiperEl && swiperEl.swiper) {
        swiperInstance = swiperEl.swiper;
        // Manually update pagination if swiper is already initialized
        if (swiperInstance.pagination) {
          swiperInstance.pagination.init();
          swiperInstance.pagination.render();
          swiperInstance.pagination.update();
        }
      } else if (swiperEl) {
        swiperEl.addEventListener("init", assignSwiperInstance, { once: true });
      }
    };
    assignSwiperInstance();
  }
});

const paginationOptions = computed(() => ({
  el: ".swiper-pagination-custom",
  type: "fraction",
  clickable: true, // Keep clickable if you want to allow clicking on the fraction (though it's less common for fraction)
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
}

.swiper-pagination-custom {
  text-align: left;
  padding-top: var(--gutter);
  @include smallType;
  @include heldaneTextItalic;
  color: var(--text);
  position: relative; // Or static, depending on layout needs
  bottom: auto; // Reset any inherited bottom positioning
  left: 0;
  width: 100%;
}

.gallery-image {
  display: block;
  width: 100%;
  height: auto; /* Let image maintain aspect ratio */
  object-fit: cover;
}
</style>
