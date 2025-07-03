<template>
  <div
    class="thumbnail-gallery"
    @mouseenter="startAutoplay"
    @mouseleave="stopAutoplay"
  >
    <client-only>
      <swiper
        ref="swiperRef"
        :modules="[EffectFade, Autoplay]"
        :slides-per-view="1"
        :space-between="0"
        effect="fade"
        :fade-effect="{ crossFade: true }"
        :loop="true"
        :autoplay="swiperAutoplayOptions"
        class="thumbnail-swiper"
      >
        <swiper-slide v-for="(image, index) in images" :key="index">
          <ImageHalf :imageField="image" class="gallery-image" />
        </swiper-slide>
      </swiper>
    </client-only>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import ImageHalf from "./ImageHalf.vue";

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const swiperRef = ref(null);
let swiperInstance = null;

onMounted(() => {
  if (swiperRef.value) {
    swiperInstance = swiperRef.value.swiper;
  }
});

const swiperAutoplayOptions = ref({
  delay: 2500,
  disableOnInteraction: false,
  pauseOnMouseEnter: false, // We handle hover manually via start/stopAutoplay
  enabled: false, // Initially disabled
});

const startAutoplay = () => {
  if (swiperInstance && swiperInstance.autoplay) {
    swiperAutoplayOptions.value.enabled = true;
    // Ensure Swiper picks up the change if it doesn't automatically
    // For Swiper Element, changing the bound prop should be enough.
    // Then, explicitly start it.
    swiperInstance.autoplay.start();
  }
};

const stopAutoplay = () => {
  if (swiperInstance && swiperInstance.autoplay) {
    swiperAutoplayOptions.value.enabled = false;
    swiperInstance.autoplay.stop();
  }
};
</script>

<style lang="scss" scoped>
.thumbnail-gallery {
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  cursor: pointer; // Indicate interactivity
}

.thumbnail-swiper {
  width: 100%;
  height: 100%;
}

.gallery-image {
  :deep(img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 3 / 2;
  }
}
</style>
