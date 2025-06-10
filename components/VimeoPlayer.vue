<template>
  <div
    ref="playerContainer"
    class="vimeo-player-wrapper"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @click="onContainerClick"
  >
    <!-- Cover Image -->
    <img
      v-if="showCoverImage && coverImageUrl"
      :src="coverImageUrl"
      class="cover-image"
      alt="Video cover"
      @click="togglePlay($event)"
    />

    <!-- Play/Pause Button -->
    <button
      class="play-pause-button"
      :class="{
        'is-playing': isPlaying,
        'show-controls': showControls,
      }"
      @click="togglePlay($event)"
      @mousedown.stop
      :aria-label="isPlaying ? 'Pause video' : 'Play video'"
    >
      <span v-if="!isPlaying" class="play-text">Play</span>
      <span v-else class="pause-text">Pause</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Player from "@vimeo/player";
import { useMediaState } from "@/composables/useMediaState";

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

const emit = defineEmits(["ready", "play", "pause"]);

// Media state management
const { registerVideoPlayer, onVideoPlay, onVideoPause } = useMediaState();

const playerContainer = ref(null);
let player = null;
const isPlaying = ref(false);
const showCoverImage = ref(true);
const showControls = ref(true);
let hideControlsTimeout = null;
let mouseMoveThrottle = null;

// Auto-hide controls after 3 seconds of inactivity when playing
const HIDE_CONTROLS_DELAY = 3000;

const hideControls = () => {
  if (isPlaying.value) {
    showControls.value = false;
  }
};

const showControlsTemporarily = () => {
  showControls.value = true;

  // Clear existing timeout
  if (hideControlsTimeout) {
    clearTimeout(hideControlsTimeout);
  }

  // Set new timeout to hide controls if playing
  if (isPlaying.value) {
    hideControlsTimeout = setTimeout(hideControls, HIDE_CONTROLS_DELAY);
  }
};

const onMouseMove = () => {
  // Throttle mouse move events to avoid excessive firing
  if (mouseMoveThrottle) return;

  showControlsTemporarily();

  mouseMoveThrottle = setTimeout(() => {
    mouseMoveThrottle = null;
  }, 100);
};

const onMouseLeave = () => {
  if (isPlaying.value) {
    // Hide controls immediately when mouse leaves if playing
    if (hideControlsTimeout) {
      clearTimeout(hideControlsTimeout);
    }
    hideControlsTimeout = setTimeout(hideControls, 500); // Short delay
  }
};

const onContainerClick = (event) => {
  // Don't handle clicks on the button itself (it has its own handler)
  if (event.target.closest(".play-pause-button")) {
    return;
  }

  togglePlay(event);
};

// Watch isPlaying to manage control visibility
watch(isPlaying, (playing) => {
  if (playing) {
    // When video starts playing, show controls briefly then hide
    showControlsTemporarily();
  } else {
    // When video is paused, always show controls
    showControls.value = true;
    if (hideControlsTimeout) {
      clearTimeout(hideControlsTimeout);
    }
  }
});

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
      background: false,
      responsive: true,
      dnt: true,
      muted: false, // Enable sound
      preload: true,
      autoplay: false, // Don't autoplay
      loop: true, // Loop forever once playing
    });

    player.ready().then(() => {
      // Create a state reset function
      const resetPlayerState = () => {
        isPlaying.value = false;
        showCoverImage.value = true;
        showControls.value = true;
        if (hideControlsTimeout) {
          clearTimeout(hideControlsTimeout);
        }

        // Recreate the player to ensure it's in a clean state
        if (player) {
          try {
            player.destroy();
          } catch (destroyError) {
            // Silently handle destroy errors
          }

          // Create new player instance
          setTimeout(() => {
            if (playerContainer.value) {
              player = new Player(playerContainer.value, {
                id: props.videoId,
                controls: false,
                byline: false,
                portrait: false,
                title: false,
                background: false,
                responsive: true,
                dnt: true,
                muted: false,
                preload: true,
                autoplay: false,
                loop: true,
              });

              // Re-register event listeners
              player.on("play", () => {
                isPlaying.value = true;
                showCoverImage.value = false;
                onVideoPlay();
                emit("play");
              });

              player.on("pause", () => {
                isPlaying.value = false;
                onVideoPause();
                emit("pause");
              });

              player.on("ended", () => {
                isPlaying.value = true;
              });
            }
          }, 150);
        }
      };

      // Register this video player instance with the media state manager
      registerVideoPlayer(player, resetPlayerState);
      emit("ready");
    });

    // Listen for play/pause events from the player
    player.on("play", () => {
      isPlaying.value = true;
      showCoverImage.value = false;
      onVideoPlay(); // Notify media state manager
      emit("play");
    });

    player.on("pause", () => {
      isPlaying.value = false;
      onVideoPause(); // Notify media state manager
      emit("pause");
    });

    player.on("ended", () => {
      // With loop enabled, this shouldn't fire, but handle it just in case
      // Don't show cover image since we want continuous looping
      isPlaying.value = true; // Keep playing state
    });
  }
});

onBeforeUnmount(() => {
  // Clean up timeouts
  if (hideControlsTimeout) {
    clearTimeout(hideControlsTimeout);
  }
  if (mouseMoveThrottle) {
    clearTimeout(mouseMoveThrottle);
  }

  if (player) {
    player.destroy();
    player = null;
  }
});

const togglePlay = async (event) => {
  // Prevent event bubbling to avoid conflicts with mouse events
  if (event) {
    event.stopPropagation();
  }

  if (!player) return;

  try {
    if (isPlaying.value) {
      await player.pause();
    } else {
      await player.play();
    }
  } catch (error) {
    // Silently handle playback errors
  }
};
</script>

<style scoped lang="scss">
@use "@/assets/scss/breakpoints.scss" as *;
@use "@/assets/scss/global.scss" as *;

.vimeo-player-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  display: block;
  aspect-ratio: 16/9;
  background: black;
  cursor: pointer;

  .cover-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    display: block;
    object-fit: cover;
    cursor: pointer;
  }

  .play-pause-button {
    @include noButton;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    @include noButton;

    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--palette-white);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--palette-black);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    opacity: 1;
    pointer-events: auto;

    @include breakpoint(mobile) {
      width: 60px;
      height: 60px;
      font-size: 18px;
    }

    &:hover {
      transform: translate(-50%, -50%) scale(1.1);
    }

    // When playing, hide by default
    &.is-playing {
      background: var(--palette-white);
      color: var(--palette-black);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    // Show controls when explicitly requested (mouse movement, etc.)
    &.is-playing.show-controls {
      opacity: 1;
      pointer-events: auto;
    }

    .play-text,
    .pause-text {
      @include smallType;
      @include heldaneTextItalic;

      @include breakpoint(mobile) {
        font-size: 12px;
        letter-spacing: 0.3px;
      }
    }
  }

  :deep(iframe) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
    z-index: 1;
    pointer-events: none; // Prevent iframe from capturing clicks
  }
}
</style>
