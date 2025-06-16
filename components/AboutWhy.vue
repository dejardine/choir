<template>
  <div class="about-why">
    <div class="about-why-number">
      <span>(1)</span>
    </div>
    <prismic-rich-text :field="about?.why_heading" />
    <div class="about-why-content">
      <prismic-rich-text :field="about?.why_paragraph" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  about: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.about-why {
  padding: var(--gutter) var(--gutterPadding);
  border-top: 1px solid var(--color-border);
  position: relative;
  :deep(h3) {
    @include smallType;
    text-transform: uppercase;
    @include smallType;

    @include foundersMedium;
    letter-spacing: 0.05rem;
    text-align: center;
    position: absolute;
    top: var(--gutter);
    left: 0;
    width: 100%;
    z-index: 1;
  }
  .about-why-number {
    text-transform: uppercase;
    @include smallType;

    @include foundersMedium;
    letter-spacing: 0.05rem;
    text-align: left;
    position: absolute;
    top: var(--gutter);
    left: var(--gutterPadding);
  }
  :deep(p) {
    @include smallHeading;
    text-align: center;
    em {
      @include heldaneTextItalic;
    }
    strong {
      margin: 0 3px;
    }
    max-width: 720px;
    margin: 0 auto;
  }
}

.about-why-content {
  padding-top: 20vh;
  padding-bottom: 20vh;
}
</style>
