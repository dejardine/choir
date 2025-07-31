<template>
  <div class="about-what">
    <div class="about-what-number">
      <span>(2)</span>
    </div>
    <prismic-rich-text :field="about?.what_heading" />
    <div class="about-what-content">
      <div
        v-for="item in about?.what_we_do"
        :key="item.id"
        class="about-what-item"
      >
        <prismic-rich-text :field="item.heading" />
        <prismic-rich-text :field="item.paragraph" />
      </div>
    </div>
    <div class="about-what-slider">
      <div class="about-what-slider-inner">
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
            class="about-what-swiper"
          >
            <swiper-slide
              v-for="(slide, index) in about?.what_slideshow"
              :key="index"
            >
              <ImageHalf :imageField="slide.image" class="slideshow-image" />
            </swiper-slide>
          </swiper>
        </client-only>
        <div v-if="about?.what_slideshow_text" class="about-what-slider-text">
          <prismic-rich-text :field="about?.what_slideshow_text" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import ImageHalf from "./ImageHalf.vue";

const props = defineProps({
  about: {
    type: Object,
    required: true,
  },
});

const swiperRef = ref(null);
let swiperInstance = null;

const hasSlides = computed(() => {
  return props.about?.what_slideshow && props.about.what_slideshow.length > 0;
});

onMounted(() => {
  if (swiperRef.value) {
    swiperInstance = swiperRef.value.swiper;
    // Start autoplay immediately
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.start();
    }
  }
});

const swiperAutoplayOptions = ref({
  delay: 3000,
  disableOnInteraction: false,
  enabled: true, // Start immediately
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/breakpoints.scss";

.about-what {
  padding: var(--gutter) var(--gutterPadding);
  border-top: 1px solid var(--color-border);
  position: relative;
  :deep(h3) {
    @include smallType;
    text-transform: uppercase;
    @include smallType;

    @include foundersMedium;
    letter-spacing: 0.05rem;
    text-align: center;
    position: absolute;
    top: var(--gutter);
    left: 0;
    width: 100%;
    z-index: 1;
  }
}
.about-what-number {
  text-transform: uppercase;
  @include smallType;

  @include foundersMedium;
  letter-spacing: 0.05rem;
  text-align: left;
  position: absolute;
  top: var(--gutter);
  left: var(--gutterPadding);
}
.about-what-content {
  padding-top: 20vh;
  padding-bottom: 30vh;
  text-align: center;
}
.about-what-item {
  :deep(h4) {
    @include smallType;
    text-transform: uppercase;
    @include smallType;

    @include foundersMedium;
    letter-spacing: 0.05rem;
    text-align: center;
    margin-bottom: var(--gutter);
  }
  :deep(p) {
    @include smallHeading;
    text-align: center;
    em {
      @include heldaneTextItalic;
    }
    strong {
      margin: 0 3px;
    }
    max-width: 885px;
    width: 65vw;
    margin: 0 auto;
    @include breakpoint(mobile) {
      width: 100%;
    }
  }
  margin-bottom: 10vh;
  &:last-child {
    margin-bottom: 0;
  }
}

.about-what-slider {
  margin-bottom: 20vh;
  text-align: center;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
  padding: 0 0 var(--gutter) 0;
  :deep(p) {
    @include bodyType;
    text-align: center;
    margin-top: var(--gutter);
  }
}

.about-what-slider-inner {
  grid-column: 6 / span 2;
  @include breakpoint(mobile) {
    grid-column: 1 / span 12;
  }
}
.about-what-swiper {
  width: 100%;
  margin: 0 auto;
  display: block;
}

.slideshow-image {
  width: 100%;
  height: 100%;
}

.about-what-slider-text {
  margin-top: var(--gutter);
  :deep(p) {
    @include smallType;
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>
