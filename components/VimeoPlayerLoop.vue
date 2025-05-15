<template>
  <div
    ref="playerContainer"
    class="vimeo-player-wrapper"
    :style="{
      aspectRatio:
        coverImage?.dimensions?.width / coverImage?.dimensions?.height,
    }"
  >
    <img
      :src="coverImageUrl"
      class="cover-image"
      :class="{ 'fade-out': isFadingOut }"
      :style="{
        aspectRatio:
          coverImage?.dimensions?.width / coverImage?.dimensions?.height,
      }"
      alt="Video cover"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineEmits } from "vue"; // Removed computed as it wasn't used effectively
import Player from "@vimeo/player";

const props = defineProps({
  videoId: {
    type: [String, Number],
    required: true,
  },
  coverImageUrl: {
    type: String,
    default: null,
  },
  coverImage: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["ready"]); // Define the 'ready' event

const playerContainer = ref(null);
let player = null;
const isFadingOut = ref(false); // New state for controlling fade

// Preload the cover image
onMounted(() => {
  if (props.coverImageUrl) {
    const img = new Image();
    img.src = props.coverImageUrl;
  }

  if (playerContainer.value) {
    player = new Player(playerContainer.value, {
      id: props.videoId,
      controls: false,
      byline: false,
      portrait: false,
      title: false,
      background: true,
      responsive: true,
      dnt: true,
      muted: true,
      preload: true,
    });

    player.ready().then(() => {
      // Play the video immediately when ready
      player
        .play()
        .then(() => {
          console.log(
            "VimeoPlayer: Playback started, starting fade out, emitting ready event"
          );
          isFadingOut.value = true; // Start fading the image
          emit("ready"); // Emit the ready event
        })
        .catch((error) => {
          console.error("VimeoPlayer: Playback failed", error);
          // Optionally emit ready even on failure, or handle differently
          // emit('ready');
        });
    });
  }
});

onBeforeUnmount(() => {
  if (player) {
    console.log("VimeoPlayer: Cleaning up player");
    player.destroy();
    player = null;
  }
});
</script>

<style scoped lang="scss">
.vimeo-player-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: var(
    --color-background
  ); // Use background color for placeholder
  border-radius: var(--border-radius);
  pointer-events: none;
  display: block;
  width: 100%;
  height: 100%;

  .cover-image {
    position: absolute; // Position over the iframe initially
    top: 0;
    left: 0;
    width: 100%;
    height: 100%; // Ensure it covers the container
    z-index: 1;
    display: block;
    object-fit: cover;
    opacity: 1;
    transition: opacity 0.5s ease-in-out; // Adjust duration/easing as needed
    pointer-events: none; // Prevent interaction when faded

    &.fade-out {
      opacity: 0;
    }
  }

  :deep(iframe) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
}
</style>
