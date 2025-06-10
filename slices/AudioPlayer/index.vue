<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { getSliceComponentProps } from "@prismicio/vue";
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from "vue";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.AudioPlayerSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const audioRef = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const isDragging = ref(false);

const audioSrc = computed(() => {
  return props.slice.primary.audio_file?.url || "";
});

const audioTitle = computed(() => {
  return props.slice.primary.audio_title || "";
});

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const togglePlay = () => {
  if (!audioRef.value) return;

  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play();
  }
};

const handleTimeUpdate = () => {
  if (!audioRef.value || isDragging.value) return;
  console.log(
    "AudioPlayer: Time update - currentTime:",
    audioRef.value.currentTime
  );
  currentTime.value = audioRef.value.currentTime;
};

const handleLoadedMetadata = () => {
  if (!audioRef.value) return;
  console.log(
    "AudioPlayer: Metadata loaded - duration:",
    audioRef.value.duration
  );
  duration.value = audioRef.value.duration;
};

const handlePlayPause = () => {
  isPlaying.value = !audioRef.value?.paused;
};

const handleProgressClick = (event: MouseEvent) => {
  if (!audioRef.value) return;

  const progressBar = event.currentTarget as HTMLElement;
  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const progressWidth = rect.width;
  const newTime = (clickX / progressWidth) * duration.value;

  audioRef.value.currentTime = newTime;
  currentTime.value = newTime;
};

const handleProgressDrag = (event: MouseEvent) => {
  if (!isDragging.value || !audioRef.value) return;

  const progressBar = event.currentTarget as HTMLElement;
  const rect = progressBar.getBoundingClientRect();
  const dragX = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
  const progressWidth = rect.width;
  const newTime = (dragX / progressWidth) * duration.value;

  audioRef.value.currentTime = newTime;
  currentTime.value = newTime;
};

const startDrag = () => {
  isDragging.value = true;
};

const stopDrag = () => {
  isDragging.value = false;
};

onMounted(() => {
  // Use nextTick to ensure the audio element is properly rendered
  nextTick(() => {
    if (audioRef.value) {
      console.log("AudioPlayer: Adding event listeners to audio element");
      audioRef.value.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.value.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.value.addEventListener("play", handlePlayPause);
      audioRef.value.addEventListener("pause", handlePlayPause);

      // Force load metadata if audio source is available
      if (audioSrc.value) {
        audioRef.value.load();
      }
    } else {
      console.error("AudioPlayer: Audio element not found");
    }
  });

  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("mousemove", handleProgressDrag);
});

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.removeEventListener("timeupdate", handleTimeUpdate);
    audioRef.value.removeEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.value.removeEventListener("play", handlePlayPause);
    audioRef.value.removeEventListener("pause", handlePlayPause);
  }

  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("mousemove", handleProgressDrag);
});

// Watch for changes in audio source and reload the audio element
watch(audioSrc, (newSrc: string) => {
  if (newSrc && audioRef.value) {
    console.log("AudioPlayer: Audio source changed, reloading:", newSrc);
    audioRef.value.load();
  }
});

const progressPercentage = computed(() => {
  if (duration.value === 0) return 0;
  const percentage = (currentTime.value / duration.value) * 100;
  console.log(
    "AudioPlayer: Progress percentage:",
    percentage,
    "currentTime:",
    currentTime.value,
    "duration:",
    duration.value
  );
  return percentage;
});
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="audio-player-slice"
  >
    <audio ref="audioRef" :src="audioSrc" preload="metadata" />

    <div class="audio-player">
      <div class="player-left">
        <button class="play-button" @click="togglePlay" :disabled="!audioSrc">
          Press <em>{{ isPlaying ? "Pause" : "Play" }}</em>
        </button>
      </div>
      <div class="player-content">
        <div class="audio-title">
          <PrismicRichText :field="audioTitle" />
          <span class="duration">{{ formatTime(currentTime) }}</span>
        </div>

        <div class="progress-container">
          <div class="progress-bar" @click="handleProgressClick">
            <div
              class="progress-fill"
              :style="{ width: `${progressPercentage}%` }"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="line"></div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/scss/breakpoints.scss" as *;
@use "@/assets/scss/global.scss" as *;

.audio-player-slice {
  width: 100%;
  margin: var(--slide-padding) var(--gutterPadding);
  position: relative;
}

.audio-player {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
  audio {
    display: none;
  }
}

.line {
  position: absolute;
  pointer-events: none;
  bottom: 2px;
  left: 0;

  height: 1px;
  background: var(--color-border);
  width: 100%;
  display: block;
}

.player-left {
  grid-column: 1 / span 3;
}

.player-content {
  grid-column: 4 / span 7;
}

.play-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gutter) var(--gutter-2);
  @include noButton;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  @include bodyType;
  em {
    @include heldaneTextItalic;
  }
}

.audio-title {
  margin-bottom: var(--gutter);
  text-align: left;

  :deep(p) {
    @include bodyType;
    margin: 0;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: var(--gutter-half);
}

.progress-bar {
  position: relative;
  height: var(--gutter-half);
  background: transparent;
  cursor: pointer;
}

.progress-fill {
  height: 100%;
  background: var(--color-text);
  transition: width 0.1s ease;
}

.time-display {
  display: flex;
  justify-content: space-between;
  @include smallType;
  color: var(--color-text);
  opacity: 1;
}
</style>
