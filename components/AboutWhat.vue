<template>
  <div class="about-what">
    <div class="about-what-number">
      <span>(2)</span>
    </div>
    <prismic-rich-text :field="about?.what_heading" />
    <div class="about-what-content">
      <div
        v-for="item in about?.what_we_do"
        :key="item.id"
        class="about-what-item"
      >
        <prismic-rich-text :field="item.heading" />
        <prismic-rich-text :field="item.paragraph" />
      </div>
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
.about-what {
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
}
.about-what-number {
  text-transform: uppercase;
  @include smallType;

  @include foundersMedium;
  letter-spacing: 0.05rem;
  text-align: left;
  position: absolute;
  top: var(--gutter);
  left: var(--gutterPadding);
}
.about-what-content {
  padding-top: 20vh;
  padding-bottom: 20vh;
  text-align: center;
}
.about-what-item {
  :deep(h4) {
    @include smallType;
    text-transform: uppercase;
    @include smallType;

    @include foundersMedium;
    letter-spacing: 0.05rem;
    text-align: center;
    margin-bottom: var(--gutter);
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
    max-width: 620px;
    margin: 0 auto;
  }
  margin-bottom: 10vh;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
