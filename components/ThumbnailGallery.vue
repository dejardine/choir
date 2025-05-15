<template>
  <div
    class="thumbnail-gallery"
    @mouseenter="startAutoplay"
    @mouseleave="stopAutoplay"
  >
    <swiper-container
      ref="swiperRef"
      :slides-per-view="1"
      :space-between="0"
      effect="fade"
      :fade-effect="{ crossFade: true }"
      :loop="true"
      :autoplay="{
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false, // We handle this manually
      }"
      class="thumbnail-swiper"
    >
      <swiper-slide v-for="(image, index) in images" :key="index">
        <img :src="image.url" class="gallery-image" />
      </swiper-slide>
    </swiper-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { register } from "swiper/element/bundle";
// Autoplay and EffectFade are part of the bundle when using swiper/element/bundle

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
  // Register Swiper custom elements only on the client side
  register();

  if (swiperRef.value) {
    // It's good practice to ensure the swiper instance is ready.
    // swiper/element emits an 'init' event, or we can wait for the swiper property.
    const swiperEl = swiperRef.value;
    const assignSwiperInstance = () => {
      if (swiperEl && swiperEl.swiper) {
        swiperInstance = swiperEl.swiper;
        // Initially stop autoplay until hover
        if (swiperInstance && swiperInstance.autoplay) {
          swiperInstance.autoplay.stop();
        }
      } else if (swiperEl) {
        // If swiper instance not immediately available, listen for init
        swiperEl.addEventListener("init", assignSwiperInstance, { once: true });
      }
    };
    assignSwiperInstance();
  }
});

const startAutoplay = () => {
  if (
    swiperInstance &&
    swiperInstance.autoplay &&
    !swiperInstance.autoplay.running
  ) {
    swiperInstance.autoplay.start();
  }
};

const stopAutoplay = () => {
  if (
    swiperInstance &&
    swiperInstance.autoplay &&
    swiperInstance.autoplay.running
  ) {
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
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 3 / 2;
}
</style>
