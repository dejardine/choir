<template>
  <header class="project-hero">
    <ImageFull
      :imageField="project?.header_image"
      v-if="project?.header_image"
    />
    <h1>{{ project.page_title }}</h1>
  </header>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/global.scss" as *;

.project-hero {
  :deep(img) {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  .image-full-container {
    height: 90vh;
  }
  position: fixed;
  width: 100%;
  height: 90vh;
  overflow: hidden;
  top: 0;
  left: 0;
  h1 {
    @include visually-hidden;
  }
}
</style>
