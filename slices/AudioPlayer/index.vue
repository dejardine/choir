<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { getSliceComponentProps } from "@prismicio/vue";
import { computed, ref, onMounted, onUnmounted } from "vue";

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
  currentTime.value = audioRef.value.currentTime;
};

const handleLoadedMetadata = () => {
  if (!audioRef.value) return;
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
  if (audioRef.value) {
    audioRef.value.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.value.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.value.addEventListener("play", handlePlayPause);
    audioRef.value.addEventListener("pause", handlePlayPause);
  }

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

const progressPercentage = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
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
      <button class="play-button" @click="togglePlay" :disabled="!audioSrc">
        {{ isPlaying ? "pause" : "play" }}
      </button>

      <div class="player-content">
        <div class="audio-title">
          <PrismicRichText :field="audioTitle" />
        </div>

        <div class="progress-container">
          <div class="progress-bar" @click="handleProgressClick">
            <div
              class="progress-fill"
              :style="{ width: `${progressPercentage}%` }"
            />
          </div>

          <div class="time-display">
            <span class="current-time">{{ formatTime(currentTime) }}</span>
            <span class="duration">{{ formatTime(duration) }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/scss/breakpoints.scss" as *;

.audio-player-slice {
  width: 100%;
  padding: var(--gutter-2) var(--gutterPadding);

  @include breakpoint(mobile) {
    padding: var(--gutter) var(--gutterPadding);
  }
}

.audio-player {
  display: flex;
  align-items: center;
  gap: var(--gutter-2);
  max-width: 600px;
  margin: 0 auto;

  @include breakpoint(mobile) {
    gap: var(--gutter);
  }
}

.play-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gutter) var(--gutter-2);
  min-width: 60px;
  height: 48px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  @include smallType;
  text-transform: lowercase;

  &:hover {
    background: var(--color-text);
    color: var(--color-background);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background: transparent;
      color: var(--color-text);
    }
  }

  @include breakpoint(mobile) {
    min-width: 50px;
    height: 40px;
    padding: var(--gutter-half) var(--gutter);
  }
}

.player-content {
  flex: 1;
  min-width: 0;
}

.audio-title {
  margin-bottom: var(--gutter);
  text-align: center;

  :deep(p) {
    @include bodyType;
    margin: 0;
  }

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    @include bodyType;
    margin: 0;
  }
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: var(--gutter-half);
}

.progress-bar {
  position: relative;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  cursor: pointer;
}

.progress-fill {
  height: 100%;
  background: var(--color-text);
  border-radius: 2px;
  transition: width 0.1s ease;
}

.time-display {
  display: flex;
  justify-content: space-between;
  @include smallType;
  color: var(--color-text);
  opacity: 0.7;
}
</style>
