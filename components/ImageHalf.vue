<template>
  <div class="image-half-container" v-if="imageField?.url">
    <NuxtImg
      provider="imgix"
      crossorigin="anonymous"
      :src="imageField?.url"
      :alt="imageField?.alt || ''"
      :width="imageField?.dimensions?.width"
      :height="imageField?.dimensions?.height"
      sizes="sm:400px md:500px lg:700px xl:800px"
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

<style scoped>
.image-half-container {
  width: 100%;
  line-height: 0; /* Prevent extra space below image */
}
</style>
