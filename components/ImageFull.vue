<template>
  <div class="image-full-container" v-if="imageField?.url">
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
const props = defineProps({
  imageField: Object,
});
</script>

<style scoped lang="scss">
.image-full-container {
  width: 100%;
  line-height: 0; /* Prevent extra space below image */
  :deep(img) {
    width: 100%;
    height: auto;
  }
}
</style>
