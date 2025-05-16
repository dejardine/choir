<template>
  <header class="page-header">
    <prismic-rich-text :field="heading" />
    <div class="page-header-wrap animate-in">
      <div class="page-header-wrap-start">
        <prismic-rich-text v-if="subheading" :field="subheading" />
        <div class="micro-text">({{ heading[0].text }})</div>
      </div>
      <prismic-rich-text :field="paragraph" />
    </div>
  </header>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  heading: {
    type: Object,
    required: true,
  },
  subheading: {
    type: Object,
    required: false,
  },
  paragraph: {
    type: Object,
    required: false,
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/global.scss";
.page-header {
  padding: var(--gutterPadding);
  margin-top: 50vh;
  margin-bottom: 25vh;
  :deep(h1) {
    @include visually-hidden;
  }
  :deep(h2) {
    @include mediumType;
    @include foundersRegular;
    display: inline;
  }
  :deep(p) {
    @include mediumType;
    display: inline;
  }
  .micro-text {
    @include bodyType;
    vertical-align: top;
    display: inline;
  }
  border-top: 1px solid var(--color-border);
}

.page-header-wrap-start {
  width: calc(25% + var(--gutter));
  display: inline-block;
}
</style>
