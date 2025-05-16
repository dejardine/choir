<template>
  <div class="contact-grid">
    <div class="contact-grid-columns">
      <div class="contact-grid-column animate-in">
        <div class="contact-grid-item">You've come this far.</div>
        <div class="contact-grid-item">Might as well say hello</div>
        <div class="contact-grid-item">&nbsp;</div>
        <div class="contact-grid-item">&nbsp;</div>
        <div class="contact-grid-item">&nbsp;</div>
      </div>
      <div class="contact-grid-column animate-in">
        <div class="contact-grid-item">Contact:</div>
        <div class="contact-grid-item">
          <prismic-link :field="globalData?.data?.email"></prismic-link>
        </div>
        <div class="contact-grid-item">
          <prismic-link :field="globalData?.data?.phone"></prismic-link>
        </div>
        <div class="contact-grid-item">&nbsp;</div>
        <div class="contact-grid-item">&nbsp;</div>
      </div>
      <div class="contact-grid-column animate-in">
        <div class="contact-grid-item">Studio:</div>
        <template v-if="addressLines?.length">
          <div
            v-for="(line, index) in addressLines"
            :key="index"
            class="contact-grid-item"
          >
            {{ line }}
          </div>
        </template>
      </div>
      <div class="contact-grid-column animate-in">
        <div class="contact-grid-item">Online:</div>
        <div class="contact-grid-item">
          <prismic-link :field="globalData?.data?.linkedin"></prismic-link>
        </div>
        <div class="contact-grid-item">
          <prismic-link :field="globalData?.data?.instagram"></prismic-link>
        </div>
        <div class="contact-grid-item">&nbsp;</div>
        <div class="contact-grid-item">&nbsp;</div>
      </div>
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
</style>
