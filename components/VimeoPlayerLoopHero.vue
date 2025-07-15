<template>
  <div
    ref="playerContainer"
    class="vimeo-player-wrapper"
    :class="{ 'full-height': fullHeight }"
  >
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
import {
  ref,
  onMounted,
  onBeforeUnmount,
  defineEmits,
  defineExpose,
  nextTick,
} from "vue";
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
  autoplay: {
    type: Boolean,
    default: true,
  },
  fullHeight: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["ready"]);

const playerContainer = ref(null);
let player = null;
const isFadingOut = ref(false);
let resizeObserver = null;
let iframeResizeInterval = null;
let mutationObserver = null;

// Function to calculate optimal iframe dimensions
const calculateIframeDimensions = () => {
  if (!playerContainer.value || !props.fullHeight) return;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Always use 100vw x 100vh for object-fit: cover behavior
  return {
    width: viewportWidth,
    height: viewportHeight,
  };
};

// Function to apply iframe sizing
const applyIframeSizing = () => {
  if (!playerContainer.value || !props.fullHeight) return;

  const iframe = playerContainer.value.querySelector("iframe");
  if (!iframe) return;

  const dimensions = calculateIframeDimensions();
  if (!dimensions) return;

  // Apply styles directly to iframe for object-fit: cover behavior
  iframe.style.position = "absolute";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.style.width = "100vw";
  iframe.style.height = "100vh";
  iframe.style.objectFit = "cover";
  iframe.style.border = "none";
  iframe.style.padding = "0";
  iframe.style.margin = "0";

  // Use aggressive scaling to eliminate letterboxing
  // This makes the video content larger than the iframe to ensure full coverage
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const viewportRatio = viewportWidth / viewportHeight;

  // You can adjust this based on your actual video aspect ratio
  // Common ratios: 16:9 (1.778), 4:3 (1.333), 21:9 (2.333), 1:1 (1.0)
  const videoAspectRatio = 16 / 9; // Adjust this to match your video's aspect ratio
  const videoWidthRatio = videoAspectRatio;
  const videoHeightRatio = 1 / videoAspectRatio;

  console.log("VimeoPlayerLoopHero: Scaling calculation:", {
    viewportWidth,
    viewportHeight,
    viewportRatio,
    videoAspectRatio,
    videoWidthRatio,
    videoHeightRatio,
  });

  // Calculate scale to ensure video covers the full area
  let scale = 1.25; // Start with a smaller scale

  if (viewportRatio > videoAspectRatio) {
    // Wide viewport - need more horizontal coverage
    scale = Math.max(
      1.25,
      (viewportWidth / (viewportHeight * videoWidthRatio)) * 1.2
    );
  } else {
    // Tall viewport - need more vertical coverage
    scale = Math.max(
      1.25,
      (viewportHeight / (viewportWidth * videoHeightRatio)) * 1.2
    );
  }

  console.log("VimeoPlayerLoopHero: Calculated scale:", scale);

  // Apply transform to make video fill the iframe completely
  iframe.style.transform = `scale(${scale})`;
  iframe.style.transformOrigin = "center center";

  // Also ensure the container div has proper sizing
  const containerDiv = playerContainer.value.querySelector("div");
  if (containerDiv) {
    containerDiv.style.height = "100vh";
    containerDiv.style.paddingTop = "0";
    containerDiv.style.position = "relative";
    containerDiv.style.overflow = "hidden";
  }

  console.log(
    "VimeoPlayerLoopHero: Applied iframe sizing - width: 100vw, height: 100vh"
  );
};

// Function to handle resize events
const handleResize = () => {
  if (props.fullHeight) {
    applyIframeSizing();
  }
};

// Function to continuously monitor iframe (Vimeo can override styles)
const monitorIframe = () => {
  if (!props.fullHeight) return;

  iframeResizeInterval = setInterval(() => {
    const iframe = playerContainer.value?.querySelector("iframe");
    if (iframe) {
      const currentWidth = iframe.style.width;
      const currentHeight = iframe.style.height;
      const computedWidth = window.getComputedStyle(iframe).width;
      const computedHeight = window.getComputedStyle(iframe).height;

      console.log("VimeoPlayerLoopHero: Current iframe styles:", {
        width: currentWidth,
        height: currentHeight,
        computedWidth,
        computedHeight,
      });

      if (currentWidth !== "100vw" || currentHeight !== "100vh") {
        console.log("VimeoPlayerLoopHero: Iframe size changed, reapplying...");
        applyIframeSizing();
      }
    }
  }, 50); // Check every 50ms for more aggressive monitoring
};

onMounted(() => {
  console.log(
    "VimeoPlayerLoopHero: onMounted triggered. Props:",
    JSON.parse(JSON.stringify(props))
  );

  if (props.coverImageUrl) {
    const img = new Image();
    img.onload = () =>
      console.log(
        "VimeoPlayerLoopHero: Cover image preloaded",
        props.coverImageUrl
      );
    img.onerror = () =>
      console.error(
        "VimeoPlayerLoopHero: Error preloading cover image",
        props.coverImageUrl
      );
    img.src = props.coverImageUrl;
  } else {
    console.log("VimeoPlayerLoopHero: No coverImageUrl provided.");
  }

  if (!playerContainer.value) {
    console.error("VimeoPlayerLoopHero: playerContainer ref is not available.");
    return;
  }

  console.log(
    "VimeoPlayerLoopHero: Initializing Vimeo Player with videoId:",
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
      autoplay: props.autoplay,
    });

    player.on("error", (error) => {
      console.error(
        "VimeoPlayerLoopHero: Player error event:",
        error.name,
        error.message,
        error.method
      );
    });

    player
      .ready()
      .then(() => {
        console.log(
          "VimeoPlayerLoopHero: Player is ready for videoId:",
          props.videoId
        );

        // Apply iframe sizing after player is ready
        if (props.fullHeight) {
          nextTick(() => {
            applyIframeSizing();
            // Start monitoring for iframe changes
            monitorIframe();

            // Also apply immediately and after a short delay to catch any late iframe creation
            setTimeout(() => {
              applyIframeSizing();
            }, 100);

            setTimeout(() => {
              applyIframeSizing();
            }, 500);
          });
        }

        if (props.autoplay) {
          player
            .play()
            .then(() => {
              console.log(
                "VimeoPlayerLoopHero: Playback started for videoId:",
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
                "VimeoPlayerLoopHero: Error starting playback for videoId:",
                props.videoId,
                error
              );
            });
        } else {
          emit("ready");
        }
      })
      .catch((error) => {
        console.error(
          "VimeoPlayerLoopHero: Error on player.ready() for videoId:",
          props.videoId,
          error
        );
      });
  } catch (error) {
    console.error(
      "VimeoPlayerLoopHero: Error initializing Vimeo Player instance for videoId:",
      props.videoId,
      error
    );
  }

  // Set up resize observer for viewport changes
  if (props.fullHeight) {
    resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(playerContainer.value);

    // Also listen for window resize events
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Watch for iframe creation
    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.tagName === "IFRAME"
          ) {
            console.log(
              "VimeoPlayerLoopHero: Iframe created, applying sizing..."
            );
            setTimeout(() => applyIframeSizing(), 10);
          }
        });
      });
    });

    mutationObserver.observe(playerContainer.value, {
      childList: true,
      subtree: true,
    });
  }
});

// Expose the player instance and methods
defineExpose({
  player,
  play: async () => {
    if (player) {
      try {
        await player.play();
        if (props.coverImageUrl) {
          isFadingOut.value = true;
        }
      } catch (error) {
        console.error("Error playing video:", error);
      }
    }
  },
  pause: async () => {
    if (player) {
      try {
        await player.pause();
      } catch (error) {
        console.error("Error pausing video:", error);
      }
    }
  },
  applyIframeSizing, // Expose for manual calls if needed
});

onBeforeUnmount(() => {
  // Clean up observers and intervals
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  if (iframeResizeInterval) {
    clearInterval(iframeResizeInterval);
    iframeResizeInterval = null;
  }

  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }

  // Remove event listeners
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("orientationchange", handleResize);

  if (player) {
    console.log(
      "VimeoPlayerLoopHero: Destroying player for videoId:",
      props.videoId
    );
    player.destroy();
    player = null;
  }
});
</script>

<style scoped lang="scss">
@use "@/assets/scss/breakpoints.scss" as *;
@use "@/assets/scss/global.scss" as *;

.vimeo-player-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  pointer-events: none; /* Common for background videos */
  display: block;

  &.full-height {
    height: 100vh;

    // Ensure container maintains full height
    :deep(div) {
      height: 100vh !important;
      padding-top: 0 !important;
      position: relative !important;
      overflow: hidden !important;
    }

    // Base iframe styles (will be overridden by JavaScript)
    :deep(iframe) {
      display: block !important;
      object-fit: cover !important;
      position: absolute !important;
      padding: 0 !important;
      margin: 0 !important;
      border: none !important;
      width: 100vw !important;
      height: 100vh !important;
      top: 0 !important;
      left: 0 !important;
      min-width: 100vw !important;
      min-height: 100vh !important;
      max-width: 100vw !important;
      max-height: 100vh !important;
      aspect-ratio: unset !important;
      /* transform will be set by JavaScript for proper scaling */

      /* Ensure iframe content scales properly */
      :deep(iframe) {
        object-fit: cover !important;
        object-position: center !important;
      }
    }
  }
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

// Fallback iframe styles (when fullHeight is false)
:deep(iframe) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
