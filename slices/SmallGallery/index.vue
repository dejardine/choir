<template>
  <section
    class="small-gallery"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <client-only>
      <swiper-container
        ref="swiperRef"
        :slides-per-view="1"
        :space-between="10"
        effect="fade"
        :fade-effect="{ crossFade: true }"
        :loop="true"
        :autoplay="swiperAutoplayOptions"
        :navigation="slice.primary.images.length > 1"
        :pagination="{ clickable: true }"
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
      </swiper-container>
    </client-only>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { register } from "swiper/element/bundle";

// Define props using defineProps
const props = defineProps({
  slice: {
    type: Object,
    required: true,
    default: () => ({}),
  },
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
      } else if (swiperEl) {
        swiperEl.addEventListener("init", assignSwiperInstance, { once: true });
      }
    };
    assignSwiperInstance();
  }
});

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
  max-width: 600px; // Example max-width, adjust as needed
  margin: 0 auto; // Center the gallery
  padding: 2rem 0; // Add some vertical spacing
}

.small-gallery-swiper {
  width: 100%;
  aspect-ratio: 4 / 3; // Adjust aspect ratio as needed
  overflow: hidden;

  // Basic Swiper navigation and pagination styles
  // You might need to import Swiper's CSS or define these more thoroughly
  &::part(button-next),
  &::part(button-prev) {
    color: #fff; // Example color
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    &::after {
      font-size: 16px;
    }
  }

  &::part(pagination) {
    bottom: 10px;
  }
  &::part(bullet) {
    background-color: rgba(255, 255, 255, 0.5);
    opacity: 1;
  }
  &::part(bullet-active) {
    background-color: #fff;
  }
}

.gallery-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
