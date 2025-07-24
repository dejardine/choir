<template>
  <div class="image-home-hero-container" v-if="imageField?.url">
    <NuxtImg
      provider="imgix"
      crossorigin="anonymous"
      :src="imageField?.url"
      :alt="imageField?.alt || ''"
      :width="imageField?.dimensions?.width"
      :height="imageField?.dimensions?.height"
      sizes="sm:100vw md:100vw lg:100vw xl:100vw"
      loading="lazy"
      class="full-width-image"
      placeholder
    />
  </div>
</template>

<script setup lang="ts">
// import { computed } from "vue"; // No longer needed

const props = defineProps({
  imageField: Object,
  imageFieldPortrait: Object,
});

// const cleanImageUrl = computed(() => { // Removed
//   if (props.imageField?.url) {
//     return props.imageField.url.split("?")[0];
//   }
//   return undefined;
// });
</script>

<style scoped lang="scss">
.image-home-hero-container {
  width: 100%;
  line-height: 0; /* Prevent extra space below image */
  :deep(img) {
    width: 100%;
    height: auto;
  }
}
</style>
