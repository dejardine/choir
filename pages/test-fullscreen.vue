<template>
  <div class="test-page">
    <h1>Fullscreen Video Player Test</h1>

    <div class="test-section">
      <h2>Fullscreen Video Player</h2>
      <FullscreenVideoPlayer
        video-id="824804225"
        cover-image-url="https://images.unsplash.com/photo-1547394765-185e1e68f34e"
        :caption="testCaption"
      />
    </div>

    <div class="test-section">
      <h2>Regular Video Player (for comparison)</h2>
      <VimeoPlayer
        video-id="824804225"
        cover-image-url="https://images.unsplash.com/photo-1547394765-185e1e68f34e"
      />
    </div>
  </div>
</template>

<script setup>
const testCaption = {
  value: [
    {
      type: "paragraph",
      content: {
        text: "This is a test caption for the fullscreen video player. It should appear below the video when in fullscreen mode.",
      },
    },
  ],
};
</script>

<style scoped lang="scss">
@use "@/assets/scss/breakpoints.scss" as *;

.test-page {
  padding: var(--gutterPadding);
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    @include heldaneHeading;
    margin-bottom: var(--gutter-4);
  }

  .test-section {
    margin-bottom: var(--gutter-6);

    h2 {
      @include smallHeading;
      margin-bottom: var(--gutter-2);
    }
  }
}
</style>
