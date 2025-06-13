<template>
  <div class="about-hero-media">
    <client-only>
      <swiper
        v-if="hasSlides"
        ref="swiperRef"
        :modules="[EffectFade, Autoplay]"
        :slides-per-view="1"
        :space-between="0"
        effect="fade"
        :fade-effect="{ crossFade: true }"
        :loop="true"
        :autoplay="swiperAutoplayOptions"
        class="about-hero-swiper"
      >
        <swiper-slide v-for="(slide, index) in slides" :key="index">
          <VimeoPlayerLoop
            v-if="slide.vimeo_video_loop"
            :video-id="getVimeoId(slide.vimeo_video_loop)"
            :cover-image-url="slide.image?.url"
            :cover-image="slide.image"
          />
          <ImageFull v-else-if="slide.image?.url" :image-field="slide.image" />
        </swiper-slide>
      </swiper>
    </client-only>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const props = defineProps({
  slideshow: {
    type: Array,
    required: false,
    default: () => [],
  },
  headerImage: {
    type: Object,
    required: false,
  },
  headerVideo: {
    type: String,
    required: false,
  },
});

// Helper function to extract Vimeo ID
const getVimeoId = (url) => {
  if (!url) return null;

  // Clean the URL: remove leading/trailing whitespace and quotes
  const cleanedUrl = url.trim().replace(/["""]/g, "");

  // Regex to capture Vimeo ID from various URL formats
  const vimeoRegex =
    /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|event\/)?(\d+)/i;
  const match = cleanedUrl.match(vimeoRegex);

  if (match && match[1]) {
    // Ensure the extracted ID is purely numeric and parse it
    const numericId = match[1].replace(/\D/g, ""); // Remove any non-digit characters just in case
    return numericId ? parseInt(numericId, 10) : null;
  }
  return null;
};

// Compute slides array from either slideshow or legacy props
const slides = computed(() => {
  if (props.slideshow && props.slideshow.length > 0) {
    return props.slideshow;
  }

  // Legacy support for single image/video
  const slide = {};
  if (props.headerImage) {
    slide.image = props.headerImage;
  }
  if (props.headerVideo) {
    slide.vimeo_video_loop = props.headerVideo;
  }
  return Object.keys(slide).length > 0 ? [slide] : [];
});

const hasSlides = computed(() => slides.value.length > 0);

const swiperRef = ref(null);
let swiperInstance = null;

onMounted(() => {
  // Debug logging

  if (swiperRef.value) {
    swiperInstance = swiperRef.value.swiper;
    // Start autoplay immediately
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.start();
    }
  }
});

const swiperAutoplayOptions = ref({
  delay: 5000,
  disableOnInteraction: false,
  enabled: true, // Start immediately
});
</script>

<style lang="scss" scoped>
.about-hero-media {
  position: relative;
  z-index: 10;
  width: 100%;
  padding: 0 var(--gutterPadding);
  padding-bottom: 20vh;

  .about-hero-swiper {
    width: 100%;
    height: auto;
  }

  :deep(.image-full-container),
  :deep(.vimeo-player-wrapper) {
    width: 100%;
    height: auto;
    filter: grayscale(100%);
  }
}
</style>
