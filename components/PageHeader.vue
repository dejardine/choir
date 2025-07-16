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
  padding-bottom: 0;
  margin-top: 50vh;
  margin-bottom: 20vh;
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
    em {
      @include heldaneTextItalic;
    }
  }
  :deep(.micro-text) {
    @include bodyType;
    vertical-align: top;
    display: inline;
    margin-left: var(--gutter-half);
  }
  border-top: 1px solid var(--color-border);
}

.page-header-wrap-start {
  width: calc(25% + var(--gutter));
  display: inline-block;
}

.page-header-wrap {
  max-width: 1600px;
}
</style>
