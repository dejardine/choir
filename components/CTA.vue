<template>
  <div class="call-to-action">
    <div class="call-to-action-inner">
      <prismic-rich-text :field="cta" />
      <prismic-link :field="ctaLink"></prismic-link>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  cta: {
    type: Object,
    required: true,
  },
  ctaLink: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.call-to-action {
  position: relative;
  z-index: 5;
  :deep(p) {
    text-align: center;
    @include ctaText;
    display: inline;
  }
  :deep(a) {
    display: inline;
    @include ctaText;
    @include heldaneTextItalic;
    text-decoration: underline;
    text-decoration-color: var(--color-border);
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }
}
</style>
