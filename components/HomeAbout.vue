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
    <div
      class="about-slideshow"
      v-if="props?.home?.data?.about_slideshow?.length"
    >
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
            v-for="(item, index) in props?.home?.data?.about_slideshow"
            :key="index"
            class="about-slideshow-slide"
          >
            <ImageSquare :imageField="item.image" class="slideshow-image" />
          </swiper-slide>
        </swiper-container>
      </client-only>
      <prismic-link
        v-if="props?.home?.data?.news_link"
        :field="props?.home?.data?.news_link"
        class="home-news-link"
      >
        {{ props?.home?.data?.news_link?.text || "Read More" }}
      </prismic-link>
    </div>
    <div v-else class="about-slideshow-debug">
      <p>
        No slideshow data available. about_slideshow length:
        {{ props?.home?.data?.about_slideshow?.length || 0 }}
      </p>
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

  // Debug: Log the about_slideshow data
  console.log("HomeAbout props:", props.home?.data);
  console.log("HomeAbout about_slideshow:", props.home?.data?.about_slideshow);

  if (props.home?.data?.about_slideshow) {
    props.home.data.about_slideshow.forEach((item, index) => {
      console.log(`HomeAbout slide ${index}:`, item);
    });
  }

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
  padding-bottom: 20vh;
  padding-top: 20vh;
  .about-slideshow {
    grid-row: 2 / span 1;
    grid-column: 5 / span 4;
    margin-top: 20vh;
    aspect-ratio: 1/1;
    display: block;
  }
}

.about-slideshow-swiper {
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1;
  display: block;
}

.about-slideshow-slide {
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1;
  display: block;
}

.swiper-slide-next {
  aspect-ratio: 1/1;
  display: block;
}

.slideshow-image {
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1;

  :deep(.image-square-container) {
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      aspect-ratio: 1/1;
    }
  }
}

.home-about-link {
  @include linkStyle;
  @include bodyType;
  @include foundersMedium;
  color: var(--color-text);
  display: block;
  text-align: center;
  margin-top: var(--gutter);
}

.home-news-link {
  @include bodyType;
  color: var(--color-text);
  display: block;
  text-align: left;
  margin-top: var(--gutter);
}
</style>
