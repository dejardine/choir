<template>
  <div class="contact-grid">
    <div class="contact-grid-columns">
      <div class="contact-grid-column contact-grid-column-1">
        <div class="contact-grid-item contact-grid-item-mobile-only">
          &nbsp;
        </div>
        <div class="contact-grid-item contact-grid-item-split">
          <span class="animate-in"> You've come this far</span>
        </div>
        <div class="contact-grid-item contact-grid-item-split">
          <span class="animate-in">Might as well say hello</span>
        </div>
        <div class="contact-grid-item contact-grid-item-empty">&nbsp;</div>
        <div class="contact-grid-item contact-grid-item-blank">&nbsp;</div>
        <div class="contact-grid-item contact-grid-item-blank">&nbsp;</div>
      </div>
      <div class="contact-grid-column contact-grid-column-2">
        <div class="contact-grid-item">
          <span class="animate-in">Contact:</span>
        </div>
        <div class="contact-grid-item">
          <span class="animate-in">
            <prismic-link :field="globalData?.data?.email"></prismic-link>
          </span>
        </div>
        <div class="contact-grid-item">
          <span class="animate-in">
            <prismic-link :field="globalData?.data?.phone"></prismic-link>
          </span>
        </div>
        <div class="contact-grid-item">&nbsp;</div>
        <div class="contact-grid-item contact-grid-item-blank">&nbsp;</div>
      </div>
      <div class="contact-grid-column contact-grid-column-3">
        <div class="contact-grid-item">
          <span class="animate-in">Studio:</span>
        </div>
        <template v-if="addressLines?.length">
          <div
            v-for="(line, index) in addressLines"
            :key="index"
            class="contact-grid-item"
          >
            <span class="animate-in">{{ line }}</span>
          </div>
        </template>
      </div>
      <div class="contact-grid-column contact-grid-column-4">
        <div class="contact-grid-item contact-grid-item-mobile-only">
          &nbsp;
        </div>
        <div class="contact-grid-item">
          <span class="animate-in">Online:</span>
        </div>
        <div class="contact-grid-item">
          <span class="animate-in">
            <prismic-link :field="globalData?.data?.linkedin"></prismic-link>
          </span>
        </div>
        <div class="contact-grid-item">
          <span class="animate-in">
            <prismic-link :field="globalData?.data?.instagram"></prismic-link>
          </span>
        </div>
        <div class="contact-grid-item">&nbsp;</div>
        <div class="contact-grid-item contact-grid-item-blank">&nbsp;</div>
      </div>
      <div class="wipe-in"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"; // Add computed
import { usePrismic, useAsyncData } from "#imports"; // Import Prismic helpers

// Get Prismic data
const prismic = usePrismic();

const { data: globalData } = await useAsyncData("global", async () => {
  try {
    return await prismic.client.getSingle("global");
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return null; // Return null or handle error as needed
  }
});

// Compute address lines from rich text field
const addressLines = computed(() => {
  if (!globalData.value?.data?.address?.length) return [];

  return globalData.value.data.address
    .map((block) => block.text)
    .filter((text) => text.trim())
    .reduce((lines, text) => {
      // Split on both <br> tags and newlines
      const splitLines = text.split(/(?:<br\s*\/?>|\n)/);
      return [...lines, ...splitLines.filter((line) => line.trim())];
    }, []);
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/global.scss" as *;
@use "@/assets/scss/breakpoints.scss" as *;

.wipe-in {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-background);
}

.contact-grid {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.contact-grid-columns {
  @include gridSetup;
  grid-gap: 0;
  padding: 0;
  width: 100%;
  position: relative;
}

.contact-grid-column {
  grid-column: auto / span 3;
  border-top: 1px solid var(--color-border);
}

.contact-grid-item {
  border-bottom: 1px solid var(--color-border);
  padding: var(--gutter-quarter) var(--gutterPadding);
  width: 100%;
}

.contact-grid-column-1 {
  @include breakpoint(mobile) {
    grid-column: 1 / span 12;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
  }
  .contact-grid-item-blank {
    @include breakpoint(mobile) {
      display: none;
    }
  }
  .contact-grid-item-split {
    @include breakpoint(mobile) {
      grid-column: auto / span 6;
    }
  }
  .contact-grid-item-empty {
    @include breakpoint(mobile) {
      grid-column: auto / span 12;
      border-bottom: none;
    }
  }
  .contact-grid-item-mobile-only {
    display: none;
    @include breakpoint(mobile) {
      display: block;
      grid-column: auto / span 12;
    }
  }
}

.contact-grid-column-2 {
  @include breakpoint(mobile) {
    grid-column: 1 / span 6;
  }
  .contact-grid-item-empty {
    @include breakpoint(mobile) {
      grid-column: auto / span 12;
      border-bottom: none;
    }
  }
  .contact-grid-item-blank {
    @include breakpoint(mobile) {
      display: none;
    }
  }
}

.contact-grid-column-3 {
  @include breakpoint(mobile) {
    grid-column: 7 / span 6;
  }
  .contact-grid-item {
    &:last-of-type {
      @include breakpoint(mobile) {
        border-bottom: none;
      }
    }
  }
}

.contact-grid-column-4 {
  @include breakpoint(mobile) {
    grid-column: 1 / span 12;
  }
  .contact-grid-item-blank {
    @include breakpoint(mobile) {
      display: none;
    }
  }
  .contact-grid-item-mobile-only {
    display: none;
    @include breakpoint(mobile) {
      display: block;
    }
  }
}
</style>
