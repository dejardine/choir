<template>
  <div class="home-hero">
    <client-only>
      <swiper
        v-if="isMounted && props.home?.data?.slideshow?.length"
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
        @slideChange="handleSlideChange"
        @swiper="onSwiperInit"
      >
        <swiper-slide
          v-for="(slide, index) in props?.home?.data?.slideshow"
          :key="`slide-${index}`"
        >
          <VimeoPlayerLoopHero
            v-if="slide.vimeo_video_loop"
            :video-id="getVimeoId(slide.vimeo_video_loop)"
            :cover-image-url="slide.image?.url"
            :cover-image="slide.image"
            :ref="
              (el) => {
                if (el) videoPlayers[index] = el;
              }
            "
            :autoplay="false"
            :full-height="true"
            @ready="onVideoReady(index)"
          />
          <ImageHomeHero
            v-else-if="slide?.image?.url"
            :imageField="slide?.image"
            :imageFieldPortrait="slide?.image_portrait"
          />
          <div class="caption-controls">
            <prismic-rich-text :field="slide?.caption" />
            <div class="caption-controls-controls">
              <button ref="prevButton" class="swiper-button-prev">
                <span v-if="$screens.isMobile" class="nav-arrow">&lt;</span>
                <span v-else>Prev</span>
              </button>
              <span class="nav-separator" v-if="!$screens.isMobile">/</span>
              <button ref="nextButton" class="swiper-button-next">
                <span v-if="$screens.isMobile" class="nav-arrow">&gt;</span>
                <span v-else>Next</span>
              </button>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </client-only>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"; // <-- Import ref and onMounted

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper modules
import { EffectFade, Autoplay, Navigation } from "swiper/modules"; // <-- Added Navigation

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
// Optionally import basic navigation styles (can be overridden)
// import 'swiper/css/navigation';

// Get responsive screens
const { $screens } = useNuxtApp();

const props = defineProps({
  home: {
    type: Object,
    required: true,
  },
});

const isMounted = ref(false);

// Refs for custom navigation buttons
const prevButton = ref(null);
const nextButton = ref(null);

// Store references to video players
const videoPlayers = ref({});
const readyVideos = ref({});
let swiperInstance = null;

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

// Handle video ready event
const onVideoReady = (index) => {
  console.log("Video ready:", index);
  readyVideos.value[index] = true;

  // If this is the first video and swiper is initialized, play it
  if (swiperInstance && swiperInstance.activeIndex === index) {
    const player = videoPlayers.value[index];
    if (player?.play) {
      player.play();
    }
  }
};

// Handle swiper initialization
const onSwiperInit = (swiper) => {
  console.log("Swiper initialized");
  swiperInstance = swiper;

  // Play the first video if it's ready
  const firstIndex = swiper.activeIndex;
  if (readyVideos.value[firstIndex]) {
    const player = videoPlayers.value[firstIndex];
    if (player?.play) {
      player.play();
    }
  }
};

// Handle slide changes
const handleSlideChange = async (swiper) => {
  console.log("Slide changed to:", swiper.activeIndex);
  const currentIndex = swiper.activeIndex;

  // Pause all videos
  Object.entries(videoPlayers.value).forEach(([index, player]) => {
    if (player?.pause && index !== currentIndex.toString()) {
      player.pause();
    }
  });

  // Play the current video if it's ready
  if (readyVideos.value[currentIndex]) {
    const currentPlayer = videoPlayers.value[currentIndex];
    if (currentPlayer?.play) {
      try {
        await currentPlayer.play();
      } catch (error) {
        console.error("Error playing video:", error);
      }
    }
  }
};

onMounted(() => {
  isMounted.value = true;
});
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
  height: 100vh;

  .swiper-slide {
    width: 100%;
    height: 100vh;
    background-color: var(--palette-black);
    :deep(.image-home-hero-container) {
      height: 100vh;
      img {
        width: 100%;
        height: 100vh;
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
      @include breakpoint(mobile) {
        grid-column: auto / span 10;
      }
    }
    .caption-controls-controls {
      grid-column: 9 / span 4;
      mix-blend-mode: exclusion;

      display: flex;
      justify-content: flex-start;
      @include breakpoint(mobile) {
        justify-content: flex-end;
        grid-column: 11 / span 2;
      }
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
        .nav-arrow {
          padding: var(--gutter-half);
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
