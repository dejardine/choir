<template>
  <footer>
    <div class="row row-1">
      <div class="row-item">Choir</div>
      <div class="row-item">
        <prismic-link :field="globalData?.data?.email"></prismic-link>
      </div>
      <div class="row-item">
        <prismic-link :field="globalData?.data?.linkedin"></prismic-link>
      </div>
    </div>
    <div class="row row-2">
      <div class="row-item">
        <prismic-link :field="globalData?.data?.phone"></prismic-link>
      </div>
      <div class="row-item">
        <prismic-link :field="globalData?.data?.instagram"></prismic-link>
      </div>
    </div>
    <div class="row row-3">
      <div class="row-item">
        <div class="row-item">C.1985—{{ currentYear }}</div>
      </div>
      <div class="row-item">Ōtautahi CHC</div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"; // Add computed
import { usePrismic, useAsyncData } from "#imports"; // Import Prismic helpers

// Get Prismic data
const prismic = usePrismic();
const currentYear = computed(() => new Date().getFullYear());

const { data: globalData } = await useAsyncData("global", async () => {
  try {
    return await prismic.client.getSingle("global");
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return null; // Return null or handle error as needed
  }
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/global.scss" as *;
@import "@/assets/scss/breakpoints.scss";

footer {
  position: relative;
  z-index: 5;
  padding-bottom: var(--gutterPadding-2);
}
.row {
  @include gridSetup;
  padding-bottom: var(--gutter-quarter);
  padding-top: var(--gutter-quarter);

  border-bottom: 1px solid var(--color-border);
}

.row-1 {
  .row-item {
    &:nth-of-type(1) {
      grid-column: 1 / span 3;
      @include breakpoint(mobile) {
        grid-column: auto / span 4;
      }
    }
    &:nth-of-type(2) {
      grid-column: 4 / span 8;
      @include breakpoint(mobile) {
        grid-column: 6 / span 6;
        text-align: left;
      }
    }
    &:nth-of-type(3) {
      grid-column: 12 / span 1;
      text-align: right;
      @include breakpoint(mobile) {
        display: none;
      }
    }
  }
  border-top: 1px solid var(--color-border);
}

.row-2 {
  .row-item {
    &:nth-of-type(1) {
      grid-column: 5 / span 5;
      @include breakpoint(mobile) {
        grid-column: 4 / span 9;
        text-align: left;
      }
    }
    &:nth-of-type(2) {
      grid-column: 11 / span 2;
      @include breakpoint(mobile) {
        display: none;
      }
    }
  }
}

.row-3 {
  .row-item {
    &:nth-of-type(1) {
      grid-column: 1 / span 5;
      @include breakpoint(mobile) {
        grid-column: auto / span 6;
      }
    }
    &:nth-of-type(2) {
      grid-column: 6 / span 2;
      text-align: center;
      @include breakpoint(mobile) {
        grid-column: 9 / span 3;
        text-align: left;
      }
    }
  }
}
</style>
