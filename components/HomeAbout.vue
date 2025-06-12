<template>
  <div class="home-about">
    <div class="home-about-copy">
      <prismic-rich-text :field="props?.home?.data?.about_copy" />
      <prismic-link
        v-if="props?.home?.data?.about_link"
        :field="props?.home?.data?.about_link"
        class="home-about-link"
      >
        {{ props?.home?.data?.about_link?.text || "Read More" }}
      </prismic-link>
    </div>
    <div class="about-slideshow">
      <client-only>
        <swiper-container
          ref="swiperRef"
          :slides-per-view="1"
          :space-between="0"
          effect="fade"
          :fade-effect="{ crossFade: true }"
          :loop="true"
          :autoplay="swiperAutoplayOptions"
          class="about-slideshow-swiper"
        >
          <swiper-slide
            v-for="(image, index) in props?.home?.data?.about_slideshow"
            :key="index"
          >
            <ImageHalf :imageField="image" class="slideshow-image" />
          </swiper-slide>
        </swiper-container>
      </client-only>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { register } from "swiper/element/bundle";
import ImageHalf from "./ImageHalf.vue";

const props = defineProps({
  home: {
    type: Object,
    required: true,
  },
});

const swiperRef = ref(null);
let swiperInstance = null;

onMounted(() => {
  // Register Swiper custom elements only on the client side
  register();

  if (swiperRef.value) {
    const swiperEl = swiperRef.value;
    const assignSwiperInstance = () => {
      if (swiperEl && swiperEl.swiper) {
        swiperInstance = swiperEl.swiper;
        // Start autoplay immediately
        if (swiperInstance.autoplay) {
          swiperInstance.autoplay.start();
        }
      } else if (swiperEl) {
        swiperEl.addEventListener("init", assignSwiperInstance, { once: true });
      }
    };
    assignSwiperInstance();
  }
});

// Fast autoplay - changes quickly as requested
const swiperAutoplayOptions = ref({
  delay: 1500, // Faster than ThumbnailGallery (2500ms)
  disableOnInteraction: false,
  enabled: true, // Start immediately
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/breakpoints.scss" as *;
@use "@/assets/scss/global.scss" as *;
// No styling as requested

.home-about {
  position: relative;
  z-index: 10;
  background-color: var(--color-background);
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: var(--gutter);
  padding: var(--gutterPadding);
  width: 100%;
  .home-about-copy {
    grid-column: 2 / span 10;
    grid-row: 1 / span 1;
  }
  :deep(p) {
    @include mediumType;
    text-align: center;
  }
  padding-bottom: 33.333vh;
  .about-slideshow {
    grid-row: 2 / span 1;
    grid-column: 1 / span 12;
  }
}
.home-about-link {
  @include linkStyle;
}
</style>
