<template>
  <div class="image-square-container" v-if="imageField?.url">
    <NuxtImg
      provider="imgix"
      crossorigin="anonymous"
      :src="imageField?.url"
      :alt="imageField?.alt || ''"
      :width="imageField?.dimensions?.width"
      :height="imageField?.dimensions?.height"
      sizes="sm:50vw md:50vw lg:50vw xl:50vw"
      loading="lazy"
      class="full-width-image"
      placeholder
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  imageField: Object,
});
</script>

<style scoped lang="scss">
.image-square-container {
  width: 100%;
  line-height: 0; /* Prevent extra space below image */
  :deep(img) {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
    object-fit: cover;
  }
}
</style>
