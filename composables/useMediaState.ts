import { ref, readonly } from "vue";

// Global state for media players
const currentPlayingMedia = ref<"audio" | "video" | null>(null);
const audioPlayerInstance = ref<any>(null);
const videoPlayerInstance = ref<any>(null);
const videoPlayerStateReset = ref<(() => void) | null>(null);

export const useMediaState = () => {
  const setCurrentMedia = (mediaType: "audio" | "video" | null) => {
    currentPlayingMedia.value = mediaType;
  };

  const registerAudioPlayer = (playerInstance: any) => {
    audioPlayerInstance.value = playerInstance;
  };

  const registerVideoPlayer = (
    playerInstance: any,
    stateResetFn?: () => void
  ) => {
    videoPlayerInstance.value = playerInstance;
    videoPlayerStateReset.value = stateResetFn || null;
  };

  const stopAudio = () => {
    if (audioPlayerInstance.value && audioPlayerInstance.value.pause) {
      audioPlayerInstance.value.pause();
    }
  };

  const stopVideo = async () => {
    if (
      videoPlayerInstance.value &&
      typeof videoPlayerInstance.value.pause === "function"
    ) {
      try {
        await videoPlayerInstance.value.pause();
      } catch (error) {
        // If pause fails, we need to forcefully stop the video audio
        // by temporarily blanking the iframe and then restoring it
        try {
          const iframe = videoPlayerInstance.value.element;
          if (iframe && iframe.src) {
            const currentSrc = iframe.src;
            // Temporarily blank the iframe to stop all playback
            iframe.src = "about:blank";
            // Wait a moment, then restore the original src
            setTimeout(() => {
              if (iframe.parentNode) {
                iframe.src = currentSrc;
              }
            }, 100);
          }
        } catch (iframeError) {
          // Silently handle iframe manipulation errors
        }

        // Reset the video player's visual state
        if (videoPlayerStateReset.value) {
          videoPlayerStateReset.value();
        }
      }
    }
  };

  const onAudioPlay = async () => {
    if (currentPlayingMedia.value === "video") {
      await stopVideo();
    }
    setCurrentMedia("audio");
  };

  const onAudioPause = () => {
    if (currentPlayingMedia.value === "audio") {
      setCurrentMedia(null);
    }
  };

  const onVideoPlay = () => {
    if (currentPlayingMedia.value === "audio") {
      stopAudio();
    }
    setCurrentMedia("video");
  };

  const onVideoPause = () => {
    if (currentPlayingMedia.value === "video") {
      setCurrentMedia(null);
    }
  };

  return {
    currentPlayingMedia: readonly(currentPlayingMedia),
    registerAudioPlayer,
    registerVideoPlayer,
    onAudioPlay,
    onAudioPause,
    onVideoPlay,
    onVideoPause,
    stopAudio,
    stopVideo,
  };
};
