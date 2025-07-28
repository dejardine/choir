<template>
  <div>
    <!-- Thumbnail with play button -->
    <div
      ref="thumbnailContainer"
      class="fullscreen-video-thumbnail"
      @click="openFullscreen"
    >
      <img
        v-if="coverImageUrl"
        :src="coverImageUrl"
        class="thumbnail-image"
        alt="Video thumbnail"
      />
      <div class="play-button-overlay">
        <button class="play-button" aria-label="Play video">
          <span class="play-text">Play</span>
        </button>
      </div>
    </div>

    <!-- Caption below thumbnail -->
    <div v-if="caption" class="video-caption-thumbnail">
      <PrismicRichText :field="caption" />
    </div>

    <!-- Mobile video player - works exactly like VimeoPlayer -->
    <div
      v-if="isFullscreen && isMobile"
      ref="mobilePlayerContainer"
      class="mobile-vimeo-player-wrapper"
    >
      <!-- The Vimeo iframe will be injected here by the Player -->
    </div>

    <!-- Fullscreen overlay - only show on desktop -->
    <div
      v-if="isFullscreen && !isMobile"
      ref="fullscreenOverlay"
      class="fullscreen-overlay"
      @click="closeFullscreen"
    >
      <div ref="fullscreenContent" class="fullscreen-content" @click.stop>
        <!-- Close button -->
        <button
          class="close-button"
          @click="closeFullscreen"
          aria-label="Close video"
        >
          Close
        </button>

        <!-- Video player -->
        <div ref="videoContainer" class="video-container">
          <div ref="vimeoPlayer" class="vimeo-player"></div>
        </div>

        <!-- Custom controls -->
        <div
          v-if="showControls"
          ref="controlsContainer"
          class="video-controls"
          @click.stop
        >
          <!-- Progress bar -->
          <div class="progress-container">
            <div ref="progressBar" class="progress-bar" @click="seekTo">
              <div
                class="progress-fill"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
          </div>

          <!-- Time display -->
        </div>

        <!-- Caption -->
        <div class="video-caption-container">
          <!-- Play/Pause button -->
          <button
            class="control-button play-pause-btn"
            @click="togglePlay"
            :aria-label="isPlaying ? 'Pause video' : 'Play video'"
          >
            <span v-if="!isPlaying" class="play-text">Press <i>Play</i></span>
            <span v-else class="pause-text">Press <i>Pause</i></span>
          </button>

          <div v-if="caption" class="video-caption">
            <PrismicRichText :field="caption" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  computed,
} from "vue";
import Player from "@vimeo/player";
import { useResponsive } from "~/composables/useResponsive";

const props = defineProps({
  videoId: {
    type: [String, Number],
    required: true,
  },
  coverImageUrl: {
    type: String,
    required: true,
  },
  caption: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["ready", "play", "pause"]);

// GSAP
const { $gsap, $CustomEase } = useNuxtApp();

// Responsive
const { screens } = useResponsive();

// Refs
const thumbnailContainer = ref(null);
const fullscreenOverlay = ref(null);
const fullscreenContent = ref(null);
const videoContainer = ref(null);
const vimeoPlayer = ref(null);
const mobilePlayerContainer = ref(null);
const controlsContainer = ref(null);
const progressBar = ref(null);

// State
const isFullscreen = ref(false);
const isPlaying = ref(false);
const showControls = ref(true);
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);

// Computed
const isMobile = computed(() => screens.value.isMobile);

// Player instance
let player = null;
let controlsTimeout = null;
let progressInterval = null;

// Get player options based on device type
const getPlayerOptions = () => {
  if (isMobile.value) {
    return {
      id: props.videoId,
      controls: false,
      byline: false,
      portrait: false,
      title: false,
      background: false,
      responsive: true,
      dnt: true,
      muted: true, // Mute on mobile initially to allow programmatic play
      autoplay: false,
      preload: true,
      loop: false,
      transcript: false,
      pip: false,
      texttrack: false,
      color: "000000",
      fullscreen: false,
      playsinline: false, // Allow native mobile player
      unmute_button: true,
      interactive_markers: false,
    };
  } else {
    return {
      id: props.videoId,
      controls: false,
      byline: false,
      portrait: false,
      title: false,
      background: false,
      responsive: true,
      dnt: true,
      muted: false,
      autoplay: false,
      preload: true,
      loop: false,
      transcript: false,
      pip: false,
      texttrack: false,
      color: "000000",
      fullscreen: false,
      playsinline: true,
      unmute_button: true,
      interactive_markers: false,
    };
  }
};

// GSAP animations
const openFullscreen = () => {
  isFullscreen.value = true;

  if (isMobile.value) {
    // On mobile, directly initialize the player without overlay animation
    nextTick(() => {
      initializePlayer();
    });
  } else {
    // On desktop, use the overlay animation
    document.body.classList.add("fullscreen-video-open");

    // Wait for Vue to render the overlay before animating
    nextTick(() => {
      // Fade in overlay
      $gsap.fromTo(
        fullscreenOverlay.value,
        { y: "100%" },
        {
          y: "0%",
          duration: 0.6,
          ease: $CustomEase.create("custom", "M0,0 C1,0 0,1 1,1 "),
        }
      );

      // Initialize player after animation
      setTimeout(() => {
        initializePlayer();
      }, 400);
    });
  }
};

const closeFullscreen = () => {
  if (isMobile.value) {
    // On mobile, just close without animation
    isFullscreen.value = false;
    destroyPlayer();
  } else {
    // On desktop, animate overlay out
    $gsap.to(fullscreenOverlay.value, {
      y: "100%",
      duration: 0.6,
      ease: $CustomEase.create("custom", "M0,0 C1,0 0,1 1,1 "),
      onComplete: () => {
        isFullscreen.value = false;
        destroyPlayer();
        document.body.classList.remove("fullscreen-video-open");
      },
    });
  }
};

const initializePlayer = () => {
  const playerElement = isMobile.value
    ? mobilePlayerContainer.value
    : vimeoPlayer.value;
  if (!playerElement) return;

  player = new Player(playerElement, getPlayerOptions());

  player.ready().then(() => {
    // Get video duration
    player.getDuration().then((dur) => {
      duration.value = dur;
    });

    // Set up event listeners
    player.on("play", () => {
      isPlaying.value = true;
      showControls.value = true; // Keep controls visible
      emit("play");
    });

    player.on("pause", () => {
      isPlaying.value = false;
      showControls.value = true;
      emit("pause");
    });

    player.on("timeupdate", (data) => {
      currentTime.value = data.seconds;
      progress.value = (data.seconds / duration.value) * 100;
    });

    player.on("ended", () => {
      isPlaying.value = false;
      showControls.value = true;
    });

    emit("ready");
  });
};

const destroyPlayer = () => {
  if (player) {
    player.destroy();
    player = null;
  }

  // Clear intervals
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }

  // Reset state
  isPlaying.value = false;
  currentTime.value = 0;
  progress.value = 0;
  showControls.value = true;
};

const togglePlay = async () => {
  if (!player) return;

  try {
    if (isPlaying.value) {
      await player.pause();
    } else {
      // On mobile, we need to unmute before playing to satisfy browser restrictions
      if (isMobile.value) {
        await player.setMuted(false);
        await player.play();
      } else {
        await player.play();
      }
    }
  } catch (error) {
    console.error("Playback error:", error);
  }
};

const seekTo = (event) => {
  if (!player || !progressBar.value) return;

  const rect = progressBar.value.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percentage = clickX / rect.width;
  const seekTime = percentage * duration.value;

  player.setCurrentTime(seekTime);
};

const showControlsTemporarily = () => {
  // For fullscreen variant, controls should always remain visible
  showControls.value = true;
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Mouse movement to show controls
const onMouseMove = () => {
  // For fullscreen variant, controls are always visible
  // No need to show/hide based on mouse movement
};

// Keyboard shortcuts
const onKeyDown = (event) => {
  if (!isFullscreen.value) return;

  switch (event.code) {
    case "Space":
      event.preventDefault();
      togglePlay();
      break;
    case "Escape":
      closeFullscreen();
      break;
    case "ArrowLeft":
      event.preventDefault();
      if (player) {
        player.setCurrentTime(Math.max(0, currentTime.value - 10));
      }
      break;
    case "ArrowRight":
      event.preventDefault();
      if (player) {
        player.setCurrentTime(Math.min(duration.value, currentTime.value + 10));
      }
      break;
  }
};

onMounted(() => {
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("keydown", onKeyDown);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("keydown", onKeyDown);

  // Clean up body class if component is unmounted while fullscreen is open
  if (isFullscreen.value && !isMobile.value) {
    document.body.classList.remove("fullscreen-video-open");
  }

  destroyPlayer();
});
</script>

<style scoped lang="scss">
@use "@/assets/scss/breakpoints.scss" as *;
@use "@/assets/scss/global.scss" as *;

.fullscreen-video-thumbnail {
  position: relative;
  width: 100%;
  cursor: pointer;
  overflow: hidden;

  .thumbnail-image {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease;
  }

  .play-button-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .play-button {
    @include noButton;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--palette-white);
    color: var(--palette-black);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: none;
    cursor: pointer;

    @include breakpoint(mobile) {
      width: 60px;
      height: 60px;
    }

    &:hover {
      transform: scale(1.1);
    }

    .play-text {
      @include smallType;
      @include heldaneTextItalic;

      @include breakpoint(mobile) {
        font-size: 12px;
        letter-spacing: 0.3px;
      }
    }
  }

  .video-caption-thumbnail {
    :deep(p) {
      @include smallType;
      @include heldaneText;
      em {
        @include heldaneTextItalic;
      }
      color: var(--color-text);
      margin-top: var(--gutter);
    }
  }
}

// Mobile video player - works exactly like VimeoPlayer
.mobile-vimeo-player-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  display: block;
  aspect-ratio: 16/9;
  background: black;
  cursor: pointer;

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

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--palette-black);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gutterPadding);
  @include breakpoint(mobile) {
    height: 100dvh;
  }
  .fullscreen-content {
    position: relative;
    width: 100vw;
    height: 100vh;
    @include breakpoint(mobile) {
      height: 100dvh;
    }
    background: var(--palette-black);
    overflow: hidden;

    .close-button {
      @include noButton;
      position: absolute;
      top: var(--gutter);
      right: 0;

      color: var(--palette-white);
      display: flex;

      z-index: 10;
      @include bodyType;
      @include foundersMedium;
      @include linkStyle;
    }

    .video-container {
      position: relative;
      width: 100%;
      height: 100vh;
      @include breakpoint(mobile) {
        height: 100dvh;
      }
      display: flex;
      align-items: center;

      .vimeo-player {
        width: 100%;
        height: auto;

        :deep(iframe) {
          width: 100%;
          height: 100%;
          border: 0;
        }
      }
    }

    .video-controls {
      position: absolute;
      bottom: var(--gutter-7);
      left: 0;
      right: 0;
      padding: 0;
      display: flex;
      align-items: center;
      gap: var(--gutter);
      transition: opacity 0.3s ease;
      z-index: 10;

      .progress-container {
        flex: 1;
        height: var(--gutter-half);
        position: relative;
        &:after {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--palette-white);
          transform: translateY(-50%);
        }

        .progress-bar {
          width: 100%;
          height: var(--gutter-half);
          background: transparent;
          border-radius: 0;
          cursor: pointer;
          position: relative;

          .progress-fill {
            height: 100%;
            background: var(--palette-white);
            border-radius: 0;
            transition: width 0.1s ease;
          }

          &:hover {
            .progress-fill {
              background: var(--palette-white);
            }
          }
        }
      }

      .time-display {
        @include smallType;
        color: var(--palette-white);
        display: flex;
        gap: var(--gutter);
        min-width: 120px;
        justify-content: flex-end;
      }
    }

    .video-caption-container {
      position: absolute;
      bottom: 0;
      padding-bottom: var(--gutter-2);
      padding-top: var(--gutter);
      left: 0;
      right: 0;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      width: 100%;
      background: var(--palette-black);

      :deep(.control-button) {
        @include noButton;

        color: var(--palette-white);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        @include bodyType;
        @include foundersRegular;
        @include linkStyle;

        .play-text,
        .pause-text {
          @include bodyType;
          @include linkStyle;
          i {
            @include heldaneTextItalic;
          }
        }
      }
    }
    .video-caption {
      color: var(--palette-white);

      :deep(p) {
        @include smallType;
        @include heldaneText;
        color: var(--palette-white);
        margin: 0;

        em {
          @include heldaneTextItalic;
        }
      }
    }
  }
}
</style>
