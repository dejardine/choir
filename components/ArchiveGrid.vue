<template>
  <div class="archive-grid">
    <!-- Debug rulers -->

    <div class="archive-grid-header">
      <div class="label">Client</div>
      <div class="label">Industry</div>
    </div>
    <template
      v-for="(projectGroup, index) in page?.archive?.data?.projects"
      :key="`archive-item-${projectGroup.case_study?.id || index}`"
    >
      <div
        v-if="projectGroup.case_study && projectGroup.case_study.data"
        class="archive-grid-item animate-in"
        :class="{
          'is-open': openItemId === projectGroup.case_study.id,
          [`archive-grid-item-${index + 1}`]: true,
          'is-last': index === page?.archive?.data?.projects?.length - 1,
        }"
        @click="toggleItem(projectGroup.case_study.id)"
      >
        <div class="item-content">
          <div class="project-info">
            <div class="project-info-top">
              <div class="client-column">
                <div class="value">
                  <template
                    v-if="
                      projectGroup.case_study.data.client &&
                      projectGroup.case_study.data.client.length > 0
                    "
                  >
                    <span
                      v-for="(clientItem, clientIndex) in projectGroup
                        .case_study.data.client"
                      :key="`client-${projectGroup.case_study.id}-${clientIndex}`"
                      class="client-name"
                    >
                      <prismic-rich-text
                        v-if="
                          clientItem.client?.data?.client_name_new &&
                          typeof clientItem.client?.data?.client_name_new ===
                            'object'
                        "
                        :field="clientItem.client?.data?.client_name_new"
                      />
                      <span
                        v-if="
                          clientIndex <
                          projectGroup.case_study.data.client.length - 1
                        "
                        >,
                      </span>
                    </span>
                  </template>
                  <span v-else>No client specified</span>
                </div>
              </div>

              <!-- Industry Column -->
              <div class="industry-column">
                <div class="value">
                  <template
                    v-if="
                      projectGroup.case_study.data.industry &&
                      projectGroup.case_study.data.industry.length > 0
                    "
                  >
                    <span
                      v-for="(industryItem, industryIndex) in projectGroup
                        .case_study.data.industry"
                      :key="`industry-${projectGroup.case_study.id}-${industryIndex}`"
                    >
                      {{
                        industryItem.industry?.data?.industry_name ||
                        "Unknown Industry"
                      }}
                      <span
                        v-if="
                          industryIndex <
                          projectGroup.case_study.data.industry.length - 1
                        "
                        >,
                      </span>
                    </span>
                  </template>
                  <span v-else>No industry specified</span>
                </div>
              </div>
            </div>
            <div class="project-info-bottom">
              <div class="project-info-bottom-left">
                <div class="project-info-bottom-left-media">
                  <!-- Archive Media Display -->
                  <!-- Vimeo Loop Archive with Cover Image -->
                  <VimeoPlayerLoop
                    v-if="
                      projectGroup.case_study.data.vimeo_loop_archive &&
                      projectGroup.case_study.data.image_archive &&
                      projectGroup.case_study.data.image_archive.url
                    "
                    :video-id="projectGroup.case_study.data.vimeo_loop_archive"
                    :cover-image-url="
                      projectGroup.case_study.data.image_archive.url
                    "
                    :cover-image="projectGroup.case_study.data.image_archive"
                    :class="`archive-video ${getImageOrientationClass(projectGroup.case_study.data.image_archive)}`"
                  />

                  <!-- Archive Image (if no video) -->
                  <ImageHalf
                    v-else-if="
                      projectGroup.case_study.data.image_archive &&
                      projectGroup.case_study.data.image_archive.url
                    "
                    :imageField="projectGroup.case_study.data.image_archive"
                    :class="`archive-image ${getImageOrientationClass(projectGroup.case_study.data.image_archive)}`"
                  />

                  <!-- Archive Slideshow (using Swiper with autoplay) -->
                  <div
                    v-else-if="
                      projectGroup.case_study.data.gallery_archive &&
                      projectGroup.case_study.data.gallery_archive.length > 0
                    "
                    :class="`archive-slideshow ${getImageOrientationClass(projectGroup.case_study.data.gallery_archive[0]?.image)}`"
                  >
                    <client-only>
                      <swiper
                        :ref="(el) => setSwiperRef(el, `archive-${index}`)"
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
                        class="archive-swiper"
                      >
                        <swiper-slide
                          v-for="(item, slideIndex) in projectGroup.case_study
                            .data.gallery_archive"
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

                  <!-- Fallback if no archive media available -->
                  <div v-else class="no-archive-media">
                    <!-- No archive media available -->
                  </div>
                </div>
              </div>
              <div class="project-info-bottom-right">
                <div class="project-info-bottom-right-left">
                  <prismic-rich-text
                    v-if="projectGroup.case_study.data.scope"
                    :field="projectGroup.case_study.data.scope"
                  />

                  <p
                    v-if="projectGroup.case_study.data.year"
                    class="project-year"
                  >
                    {{ projectGroup.case_study.data.year }}
                  </p>

                  <p class="view-project-link">
                    <prismic-link :field="projectGroup.case_study">
                      View project
                    </prismic-link>
                  </p>
                </div>
                <div class="project-info-bottom-right-right">
                  <prismic-rich-text
                    v-if="projectGroup.case_study.data.header_paragraph"
                    :field="projectGroup.case_study.data.header_paragraph"
                  />
                  <blockquote v-if="projectGroup.case_study.data.quote">
                    <prismic-rich-text
                      :field="projectGroup.case_study.data.quote"
                    />
                    <cite>
                      <prismic-rich-text
                        :field="projectGroup.case_study.data.quote_cite"
                      />
                    </cite>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { defineProps, onMounted, onUnmounted, ref, nextTick } from "vue";
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

// State to track which archive item is open
const openItemId = ref(null);

// Swiper instances for archive slideshows
const swiperInstances = ref({});

const setSwiperRef = (el, index) => {
  if (el) {
    swiperInstances.value[index] = el.swiper;
  }
};

// Function to determine image orientation and return appropriate class
const getImageOrientationClass = (imageField) => {
  if (!imageField || !imageField.dimensions) {
    return "square"; // Default fallback
  }

  const { width, height } = imageField.dimensions;
  const ratio = width / height;

  if (ratio > 1.2) {
    return "landscape";
  } else if (ratio < 0.8) {
    return "portrait";
  } else {
    return "square";
  }
};

// Method to toggle accordion items
const toggleItem = (itemId) => {
  if (openItemId.value === itemId) {
    // Close the item if it's already open
    openItemId.value = null;
  } else {
    // Open the clicked item and close any other open item
    openItemId.value = itemId;
  }
};

// Debug logging to understand the data structure
onMounted(async () => {
  if (process.client) {
    console.log("Archive Grid mounted");
    console.log("Archive Grid Data:", props.page?.archive?.data?.projects);
    console.log(
      "Number of projects:",
      props.page?.archive?.data?.projects?.length
    );
  }
});

onUnmounted(() => {
  if (process.client) {
    console.log("ArchiveGrid cleanup completed");
  }
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/global" as *;
@use "@/assets/scss/breakpoints.scss" as *;

.archive-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
  padding: 0;
  padding-top: calc(50vh - 1px);
  position: relative;
  z-index: 20;
}

.archive-grid-header {
  display: grid;
  grid-template-columns: 4fr 8fr;
  grid-column: 1 / span 12;
  gap: var(--gutter);
  width: 100%;
  @include breakpoint(mobile) {
    grid-template-columns: 6fr 6fr;
  }
  .label {
    @include smallType;
    @include foundersMedium;
    letter-spacing: 0.05rem;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }
  padding: 0 var(--gutterPadding);

  padding-bottom: calc(var(--gutter-2));
  position: absolute;
  top: 50vh;
  left: 0;
  transform: translateY(-50%);
  pointer-events: none;
}

.project-info-bottom {
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: var(--gutter);

  max-height: 0px;
  overflow: hidden;
  transition: max-height 0.6s ease-in-out;

  @include breakpoint(mobile) {
    grid-template-columns: 6fr 6fr;
  }
  :deep(h2) {
    @include bodyType;
    color: var(--color-text-secondary);
    margin-bottom: var(--gutter);
    strong {
      @include foundersRegular;
    }
    padding-top: var(--gutter-3);
  }

  .project-info-bottom-left {
    max-width: 480px;
    width: 100%;
    display: block;
  }
  .project-info-bottom-left-media {
    width: 100%;
    display: block;
    max-width: 480px;

    // Archive media styling
    .archive-video,
    .archive-image,
    .archive-slideshow {
      width: 100%;
      padding-top: var(--gutter-3);
      overflow: hidden;

      // Orientation-based styling
      &.portrait {
        max-width: 140px;
        @include breakpoint(mobile) {
          max-width: 100%;
          padding-right: var(--gutter);
        }
      }

      &.landscape {
        max-width: 20vw;
        @include breakpoint(mobile) {
          max-width: calc(50vw - calc(var(--gutterPadding) * 2));
          padding-right: 0;
        }
      }

      &.square {
        max-width: 240px;
        @include breakpoint(mobile) {
          max-width: 100%;
        }
      }

      :deep(img) {
        width: 100%;
        height: auto;
        max-width: 300px;
        @include breakpoint(mobile) {
          max-width: 100%;
        }
      }

      :deep(iframe) {
        transition: all 1s;
        transform-origin: center center;
        max-width: 300px;
        @include breakpoint(mobile) {
          max-width: 100%;
        }
      }
    }

    .archive-slideshow {
      cursor: pointer;

      .archive-swiper {
        width: 100%;
        height: 100%;
      }

      .slideshow-image {
        :deep(img) {
          display: block;
          width: 100%;
          height: auto;
        }
      }
    }

    .no-archive-media {
    }
  }
  .project-info-bottom-right {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    gap: var(--gutter-2);
    padding-bottom: var(--gutter-2);
    @include breakpoint(mobile) {
      display: block;
    }
  }
  .project-info-bottom-right-left {
    width: auto;
    display: block;
  }
  .project-info-bottom-right-right {
    max-width: 480px;
    width: 100%;
    display: block;
  }
  blockquote {
    position: relative;
    margin-top: var(--gutter-3);
    cite {
      :deep(p) {
        @include smallType;
        @include foundersMedium;
        text-transform: uppercase;
        letter-spacing: 0.05rem;
      }
    }
    :deep(p) {
      padding-top: 0;
    }
    &:before {
      content: "“";
      font-size: 2rem;
      color: var(--color-text);
      @include largeBodyType;
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(calc(-100% - 1px));
    }
  }
  .project-year {
    @include bodyType;
    color: var(--color-text-secondary);
    display: block;
    margin-bottom: var(--gutter);
    padding-top: 0;
  }
  .view-project-link {
    @include bodyType;
    color: var(--color-text-secondary);
    padding-bottom: var(--gutter-3);
    padding-top: 0;

    a {
      @include linkStyle;
    }
    @include breakpoint(mobile) {
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }

  :deep(p) {
    @include bodyType;
    @include foundersMedium;
    color: var(--color-text-secondary);
    padding-top: var(--gutter-3);

    margin-bottom: var(--gutter);
  }
}

.archive-grid-item {
  grid-column: auto / span 12;
  padding: var(--gutter) var(--gutterPadding) 0 var(--gutterPadding);

  .item-content {
  }

  .project-info-top {
    display: grid;
    grid-template-columns: 4fr 8fr;
    gap: var(--gutter);
    @include breakpoint(mobile) {
      grid-template-columns: 6fr 6fr;
    }
  }
  .client-column {
    .client-name {
      @include foundersRegular;
      display: inline-block;
      :deep(p) {
        display: inline-block;
      }
      span {
        display: inline-block;
        white-space: pre;
      }
    }
    span {
      @include foundersRegular;
      display: inline-block;
    }
  }

  .client-column,
  .industry-column {
    @include breakpoint(mobile) {
      grid-column: auto / span 1;
    }
  }

  // Accordion functionality
  &.is-open {
    .project-info-bottom {
      max-height: 500px; // Adjust this value based on your content
      @include breakpoint(mobile) {
        max-height: 800px;
      }
    }
  }

  // Add cursor pointer to indicate clickable
  cursor: pointer;

  border-top: 1px solid var(--color-border);
  &.is-last {
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--gutter);
  }
}
</style>
