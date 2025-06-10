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
    console.log("MediaState: Stopping video player");
    if (
      videoPlayerInstance.value &&
      typeof videoPlayerInstance.value.pause === "function"
    ) {
      try {
        await videoPlayerInstance.value.pause();
        console.log("MediaState: Video player paused successfully");
      } catch (error) {
        console.warn("MediaState: Could not pause video player:", error);
        // If pause fails, we need to forcefully stop the video audio
        // by temporarily blanking the iframe and then restoring it
        try {
          const iframe = videoPlayerInstance.value.element;
          if (iframe && iframe.src) {
            console.log(
              "MediaState: Force stopping video via iframe manipulation"
            );
            const currentSrc = iframe.src;
            // Temporarily blank the iframe to stop all playback
            iframe.src = "about:blank";
            // Wait a moment, then restore the original src
            setTimeout(() => {
              if (iframe.parentNode) {
                iframe.src = currentSrc;
                console.log("MediaState: Video iframe restored");
              }
            }, 100);
          }
        } catch (iframeError) {
          console.warn("MediaState: Could not manipulate iframe:", iframeError);
        }

        // Reset the video player's visual state
        if (videoPlayerStateReset.value) {
          console.log("MediaState: Resetting video player state");
          videoPlayerStateReset.value();
        }
      }
    } else {
      console.warn("MediaState: Video player instance is not available");
    }
  };

  const onAudioPlay = async () => {
    console.log("MediaState: Audio started playing, stopping video if playing");
    if (currentPlayingMedia.value === "video") {
      await stopVideo();
    }
    setCurrentMedia("audio");
  };

  const onAudioPause = () => {
    console.log("MediaState: Audio paused");
    if (currentPlayingMedia.value === "audio") {
      setCurrentMedia(null);
    }
  };

  const onVideoPlay = () => {
    console.log("MediaState: Video started playing, stopping audio if playing");
    if (currentPlayingMedia.value === "audio") {
      stopAudio();
    }
    setCurrentMedia("video");
  };

  const onVideoPause = () => {
    console.log("MediaState: Video paused");
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
