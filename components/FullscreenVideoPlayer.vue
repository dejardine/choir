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

    <!-- Fullscreen overlay -->
    <div
      v-if="isFullscreen"
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              fill="currentColor"
            />
          </svg>
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
          <!-- Play/Pause button -->
          <button
            class="control-button play-pause-btn"
            @click="togglePlay"
            :aria-label="isPlaying ? 'Pause video' : 'Play video'"
          >
            <svg
              v-if="!isPlaying"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor" />
            </svg>
          </button>

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
          <div class="time-display">
            <span class="current-time">{{ formatTime(currentTime) }}</span>
            <span class="duration">{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Caption -->
        <div v-if="caption" class="video-caption">
          <PrismicRichText :field="caption" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Player from "@vimeo/player";
import { gsap } from "gsap";

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

// Refs
const thumbnailContainer = ref(null);
const fullscreenOverlay = ref(null);
const fullscreenContent = ref(null);
const videoContainer = ref(null);
const vimeoPlayer = ref(null);
const controlsContainer = ref(null);
const progressBar = ref(null);

// State
const isFullscreen = ref(false);
const isPlaying = ref(false);
const showControls = ref(true);
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);

// Player instance
let player = null;
let controlsTimeout = null;
let progressInterval = null;

// GSAP animations
const openFullscreen = () => {
  isFullscreen.value = true;

  // Add class to body
  document.body.classList.add("fullscreen-video-open");

  // Fade in overlay
  gsap.fromTo(
    fullscreenOverlay.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: "power2.out" }
  );

  // Scale in content
  gsap.fromTo(
    fullscreenContent.value,
    { scale: 0.9, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
  );

  // Initialize player after animation
  setTimeout(() => {
    initializePlayer();
  }, 400);
};

const closeFullscreen = () => {
  // Remove class from body
  document.body.classList.remove("fullscreen-video-open");

  // Fade out animations
  gsap.to(fullscreenContent.value, {
    scale: 0.9,
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
  });

  gsap.to(fullscreenOverlay.value, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      isFullscreen.value = false;
      destroyPlayer();
    },
  });
};

const initializePlayer = () => {
  if (!vimeoPlayer.value) return;

  player = new Player(vimeoPlayer.value, {
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
    loop: false,
  });

  player.ready().then(() => {
    // Get video duration
    player.getDuration().then((dur) => {
      duration.value = dur;
    });

    // Set up event listeners
    player.on("play", () => {
      isPlaying.value = true;
      showControlsTemporarily();
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

  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
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
      await player.play();
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
  showControls.value = true;

  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
  }

  controlsTimeout = setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false;
    }
  }, 3000);
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Mouse movement to show controls
const onMouseMove = () => {
  if (isFullscreen.value && isPlaying.value) {
    showControlsTemporarily();
  }
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
  if (isFullscreen.value) {
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

  &:hover {
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

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--palette-black);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  .fullscreen-content {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: var(--palette-black);
    overflow: hidden;

    .close-button {
      @include noButton;
      position: absolute;
      top: var(--gutter);
      right: var(--gutter);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      color: var(--palette-white);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: background 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    .video-container {
      position: relative;
      width: 100%;
      height: 100%;

      .vimeo-player {
        width: 100%;
        height: 100%;

        :deep(iframe) {
          width: 100%;
          height: 100%;
          border: 0;
        }
      }
    }

    .video-controls {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
      padding: var(--gutter-2);
      display: flex;
      align-items: center;
      gap: var(--gutter);
      transition: opacity 0.3s ease;

      .control-button {
        @include noButton;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        color: var(--palette-white);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      .progress-container {
        flex: 1;

        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          cursor: pointer;
          position: relative;

          .progress-fill {
            height: 100%;
            background: var(--palette-white);
            border-radius: 2px;
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

    .video-caption {
      position: absolute;
      bottom: 80px;
      left: var(--gutter-2);
      right: var(--gutter-2);
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
