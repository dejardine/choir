<template>
  <div class="image-half-container" v-if="imageField?.url">
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

// const cleanImageUrl = computed(() => { // Removed
//   if (props.imageField?.url) {
//     return props.imageField.url.split("?")[0];
//   }
//   return undefined;
// });

// watchEffect(() => { // Removed
//   console.log(
//     "ImageHalf received imageField:",
//     JSON.parse(JSON.stringify(props.imageField))
//   );
//   console.log("ImageHalf cleanImageUrl:", cleanImageUrl.value);
// });
</script>

<style scoped lang="scss">
.image-half-container {
  width: 100%;
  line-height: 0; /* Prevent extra space below image */
  :deep(img) {
    width: 100%;
    height: auto;
  }
}
</style>
