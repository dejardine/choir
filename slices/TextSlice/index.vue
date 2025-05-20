<script setup lang="ts">
import type { Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.TextSliceSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="text_slice"
  >
    <prismic-rich-text :field="slice.primary.text" />
  </section>
</template>

<style scoped lang="scss">
.text_slice {
  padding-left: var(--gutterPadding);
  padding-right: var(--gutterPadding);
  :deep(p) {
    @include heldaneSubheading;
  }
}
</style>
