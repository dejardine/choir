<template>
  <div class="project-information">
    <div class="project-information-header">
      <prismic-rich-text :field="project?.header_paragraph" />
    </div>
    <div class="project-information-content">
      <div class="project-information-content-left">
        <div v-for="(item, index) in project.client" :key="index">
          {{ item }}
        </div>
      </div>
      <div class="project-information-content-right"></div>
    </div>
  </div>
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
.project-information {
  margin-top: 80vh;
  position: relative;
  z-index: 10;
  background-color: var(--color-background);
}

.project-information-header {
  padding: var(--gutter);
  :deep(h2) {
    @include heldaneSubheading;
    padding-bottom: var(--gutter-5);
  }
  border-bottom: 1px solid var(--color-border);
}
</style>
