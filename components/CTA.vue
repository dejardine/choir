<template>
  <div class="call-to-action">
    <div class="call-to-action-inner">
      <prismic-rich-text :field="cta" />
      <prismic-link
        :field="ctaLink"
        v-if="ctaLink.url"
        ref="ctaLinkRef"
      ></prismic-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";

const ctaLinkRef = ref(null);

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

onMounted(async () => {
  await nextTick();
  if (ctaLinkRef.value && ctaLinkRef.value.$el) {
    const element = ctaLinkRef.value.$el;
    if (element.innerHTML) {
      element.innerHTML = element.innerHTML.replace(
        /\(\*\)/g,
        '<span class="micro-text">(*)</span>'
      );
    }
  }
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
    em {
      @include heldaneTextItalic;
    }
    .micro-text {
      @include bodyType;
      vertical-align: top;
    }
  }
  :deep(a) {
    display: inline;
    @include ctaText;
    @include heldaneTextItalic;
    text-decoration: underline;
    text-decoration-color: var(--color-border);
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    .micro-text {
      @include bodyType;
      vertical-align: top;
    }
  }
}
</style>
