<template>
  <div ref="playerContainer" class="vimeo-player-wrapper">
    <img
      v-if="coverImageUrl"
      :src="coverImageUrl"
      class="cover-image"
      :class="{ 'fade-out': isFadingOut }"
      alt="Video cover"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineEmits } from "vue";
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
    // This prop is passed from ProjectSlice, keep it for consistency
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["ready"]);

const playerContainer = ref(null);
let player = null;
const isFadingOut = ref(false);

onMounted(() => {
  console.log(
    "VimeoPlayerLoop: onMounted triggered. Props:",
    JSON.parse(JSON.stringify(props))
  );

  if (props.coverImageUrl) {
    const img = new Image();
    img.onload = () =>
      console.log(
        "VimeoPlayerLoop: Cover image preloaded",
        props.coverImageUrl
      );
    img.onerror = () =>
      console.error(
        "VimeoPlayerLoop: Error preloading cover image",
        props.coverImageUrl
      );
    img.src = props.coverImageUrl;
  } else {
    console.log("VimeoPlayerLoop: No coverImageUrl provided.");
  }

  if (!playerContainer.value) {
    console.error("VimeoPlayerLoop: playerContainer ref is not available.");
    return;
  }

  console.log(
    "VimeoPlayerLoop: Initializing Vimeo Player with videoId:",
    props.videoId
  );
  try {
    player = new Player(playerContainer.value, {
      id: props.videoId,
      controls: false,
      byline: false,
      portrait: false,
      title: false,
      background: true, // Restored for loop/background behavior
      responsive: true,
      dnt: true,
      muted: true,
      preload: true, // Usually good for background loops
    });

    player.on("error", (error) => {
      console.error(
        "VimeoPlayerLoop: Player error event:",
        error.name,
        error.message,
        error.method
      );
    });

    player
      .ready()
      .then(() => {
        console.log(
          "VimeoPlayerLoop: Player is ready for videoId:",
          props.videoId
        );
        player
          .play()
          .then(() => {
            console.log(
              "VimeoPlayerLoop: Playback started for videoId:",
              props.videoId
            );
            if (props.coverImageUrl) {
              // Only fade if there was a cover image
              isFadingOut.value = true;
            }
            emit("ready");
          })
          .catch((error) => {
            console.error(
              "VimeoPlayerLoop: Error starting playback for videoId:",
              props.videoId,
              error
            );
          });
      })
      .catch((error) => {
        console.error(
          "VimeoPlayerLoop: Error on player.ready() for videoId:",
          props.videoId,
          error
        );
      });
  } catch (error) {
    console.error(
      "VimeoPlayerLoop: Error initializing Vimeo Player instance for videoId:",
      props.videoId,
      error
    );
  }
});

onBeforeUnmount(() => {
  if (player) {
    console.log(
      "VimeoPlayerLoop: Destroying player for videoId:",
      props.videoId
    );
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
  pointer-events: none; /* Common for background videos */
  display: block;
  /* Ensure it takes up space, aspect ratio usually handled by player or parent */
  /* For example, if parent has aspect-ratio, this can be height: 100% */
  /* Or, define an aspect ratio here if it's always consistent */
}

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
  transition: opacity 0.5s ease-in-out;
  pointer-events: none;

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
</style>
