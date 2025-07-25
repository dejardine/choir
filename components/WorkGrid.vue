<template>
  <div class="work-grid">
    <template
      v-for="(projectGroup, index) in page?.work?.data?.projects"
      :key="projectGroup.case_study?.id || `project-grid-item-${index}`"
    >
      <prismic-link
        :field="projectGroup.case_study"
        class="work-grid-item animate-in"
      >
        <div
          v-if="
            !(
              projectGroup.case_study &&
              !projectGroup.case_study.id &&
              projectGroup.case_study.link_type === 'Document'
            )
          "
        >
          <!-- Case 1: Link exists AND data is populated by graphQuery -->
          <template
            v-if="projectGroup.case_study && projectGroup.case_study.data"
          >
            <div class="item-content">
              <!-- Vimeo Player with Cover -->
              <VimeoPlayerLoop
                v-if="
                  projectGroup.case_study.data.vimeo_loop_thumbnail &&
                  projectGroup.case_study.data.image_thumbnail &&
                  projectGroup.case_study.data.image_thumbnail.url
                "
                :video-id="projectGroup.case_study.data.vimeo_loop_thumbnail"
                :cover-image-url="
                  projectGroup.case_study.data.image_thumbnail.url
                "
                :cover-image="projectGroup.case_study.data.image_thumbnail"
                class="thumbnail-video"
              />

              <!-- Image Thumbnail (if no video with cover) -->
              <ImageHalf
                v-else-if="
                  projectGroup.case_study.data.image_thumbnail &&
                  projectGroup.case_study.data.image_thumbnail.url
                "
                :imageField="projectGroup.case_study.data.image_thumbnail"
                class="thumbnail-image"
              />

              <!-- Slideshow Thumbnail (using Swiper with autoplay) -->
              <div
                v-else-if="
                  projectGroup.case_study.data.gallery_thumbnail &&
                  projectGroup.case_study.data.gallery_thumbnail.length > 0
                "
                class="thumbnail-slideshow"
              >
                <client-only>
                  <swiper
                    :ref="(el) => setSwiperRef(el, index)"
                    :modules="[EffectFade, Autoplay]"
                    :slides-per-view="1"
                    :space-between="0"
                    effect="fade"
                    :fade-effect="{ crossFade: true }"
                    :loop="true"
                    :autoplay="{
                      delay: 2500,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: false,
                    }"
                    class="work-grid-swiper"
                  >
                    <swiper-slide
                      v-for="(item, slideIndex) in projectGroup.case_study.data
                        .gallery_thumbnail"
                      :key="slideIndex"
                    >
                      <ImageHalf
                        :imageField="item.image"
                        class="slideshow-image"
                      />
                    </swiper-slide>
                  </swiper>
                </client-only>
              </div>

              <!-- Fallback if no media (but data object exists) -->
              <div v-else class="no-media">
                No media available for this case study.
              </div>

              <!-- Thumbnail Title -->
              <div
                v-if="projectGroup.case_study.data.thumbnail_title"
                class="thumbnail-title"
              >
                <prismic-rich-text
                  :field="projectGroup.case_study.data.thumbnail_title"
                />
              </div>
            </div>
          </template>

          <!-- Case 2: Link field exists, but data is NOT populated (broken link, unpublished, etc.) -->
          <template
            v-else-if="
              projectGroup.case_study &&
              projectGroup.case_study.id &&
              !projectGroup.case_study.data
            "
          >
            <div class="item-content error"></div>
          </template>

          <!-- Case 3 (was Case 4): projectGroup.case_study field itself is missing or not a valid link object -->
          <!-- This 'else' catches scenarios not covered by the above, assuming the parent v-if has filtered out empty links -->
          <template v-else>
            <div class="item-content error"></div>
          </template>
        </div>
      </prismic-link>
    </template>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import ImageHalf from "./ImageHalf.vue";
import VimeoPlayerLoop from "./VimeoPlayerLoop.vue";

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
});

const swiperInstances = ref({});

const setSwiperRef = (el, index) => {
  if (el) {
    swiperInstances.value[index] = el.swiper;
  }
};

const startAutoplay = (index) => {
  const swiperInstance = swiperInstances.value[index];
  if (swiperInstance && swiperInstance.autoplay) {
    swiperInstance.autoplay.start();
  }
};

const stopAutoplay = (index) => {
  const swiperInstance = swiperInstances.value[index];
  if (swiperInstance && swiperInstance.autoplay) {
    swiperInstance.autoplay.stop();
  }
};

// Only load Vimeo script on client side
if (process.client) {
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.onload = () => resolve("Vimeo API loaded");
    script.onerror = () => resolve("Vimeo API failed to load");
    document.head.appendChild(script);
  }).then(console.log);
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/breakpoints.scss";

.work-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr); /* Two columns */
  gap: var(--gutter);
  padding: var(--gutterPadding);
}

.work-grid-item {
  grid-column: auto / span 6;
  .thumbnail-image,
  .thumbnail-video,
  .thumbnail-slideshow {
    :deep(img) {
      width: 100%;
      height: auto;
      aspect-ratio: 3/2;
      object-fit: cover;
      object-position: center bottom;
      transition: all 1s;
      transform-origin: center center;
    }
    :deep(iframe) {
      transition: all 1s;
      transform-origin: center center;
    }
    overflow: hidden;
  }

  .thumbnail-slideshow {
    width: 100%;
    aspect-ratio: 3/2;
    overflow: hidden;
    cursor: pointer; // Indicate interactivity
  }

  .work-grid-swiper {
    width: 100%;
    height: 100%;
  }

  .slideshow-image {
    :deep(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      aspect-ratio: 3/2;
    }
  }

  .thumbnail-title {
    margin-top: var(--gutter-half);
    margin-bottom: var(--gutter-5);
    :deep(p) {
      margin: 0;
      @include bodyType;
      strong {
        @include foundersMedium;
        font-weight: normal;
      }
    }
  }

  &:nth-last-child(-n + 2) {
    .thumbnail-title {
      margin-bottom: 0;
    }
  }
  &:hover {
    .thumbnail-image,
    .thumbnail-video,
    .thumbnail-slideshow {
      :deep(img) {
        transform: scale(1.05);
      }
      :deep(iframe) {
        transform: scale(1.05);
      }
    }
  }
  @include breakpoint(mobile) {
    grid-column: auto / span 12;
  }
}
</style>
