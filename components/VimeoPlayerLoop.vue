<template>
  <div ref="playerContainer" class="vimeo-player-wrapper">
    <img
      :src="coverImageUrl"
      class="cover-image"
      :class="{ 'fade-out': isFadingOut }"
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
      responsive: true, // Re-enable player's responsive handling
      dnt: true,
      muted: true,
      preload: true,
    });

    player.ready().then(() => {
      // Play the video immediately when ready
      player
        .play()
        .then(() => {
          isFadingOut.value = true; // Start fading the image
          emit("ready"); // Emit the ready event
        })
        .catch((error) => {
          // Silently handle playback errors
          // Optionally emit ready even on failure, or handle differently
          // emit('ready');
        });
    });
  }
});

onBeforeUnmount(() => {
  if (player) {
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
  pointer-events: none;
  display: block;
  width: 100%;
  /* height: 100%; Removed to allow aspect-ratio to control height */
  /* aspect-ratio: 3/2; Removed as player's inner div will handle this */
  .cover-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
