<template>
  <div id="preloader" class="hidden" v-if="!isSimulator">
    <div class="preloader-loader" ref="preloaderBar">
      <span ref="preloaderBarInner" class="preloader-bar-inner"> </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
const route = useRoute();

// Check if we're in the slice simulator
const isSimulator = computed(() => route.path.startsWith("/slice-simulator"));

// Composables
const prismic = usePrismic();
const { $gsap, $CustomEase, $TextPlugin, $ScrollToPlugin, $ScrollTrigger } =
  useNuxtApp();

// Check if we're in Prismic editor
const isInPrismicEditor = computed(() => prismic.inEditor);

onMounted(() => {
  // Skip preloader animation if in simulator or in Prismic editor
  if (isSimulator.value || isInPrismicEditor.value) {
    document.documentElement.classList.remove("dark");
    return;
  }
  $gsap.set(".preloader-bar-inner", { xPercent: -100 });

  // Ensure GSAP is available
  if (!$gsap) {
    console.warn("GSAP not available");
    return;
  }

  document.body.classList.remove("body-overflow");

  const tl = $gsap.timeline();
  const animateInElements = document.querySelectorAll(".animate-in");

  tl.to(".preloader-bar-inner", {
    xPercent: 0,
    duration: 1.25,
    delay: 0,
    ease: "power4.in",
  })
    .to(".preloader-loader", {
      xPercent: 100,
      duration: 1,
      ease: "power4.in",
    })

    .to("#preloader", {
      duration: 0.8,
      delay: 0,
      alpha: 0,
      ease: "power2.inOut",
      onComplete: () => {
        // Remove the preloader from DOM
        const preloader = document.getElementById("preloader");
        if (preloader) {
          preloader.remove();
        }
      },
      onStart: () => {
        document.body.classList.add("preloader-finished");
      },
    })
    .fromTo(
      ".animate-in",
      {
        autoAlpha: 0,
        y: 30,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        delay: 0.1,
        ease: "power4.inOut",
        stagger: {
          each: 0.075,
          from: "start",
        },
        onComplete: () => {
          $gsap.set(".animate-in", { clearProps: "all" });
          // Refresh scroll triggers after animation
          if ($ScrollTrigger) {
            $ScrollTrigger.refresh();
          }
          window.dispatchEvent(new Event("resize"));
        },
      },
      "-=0.4"
    );
});
</script>

<style lang="scss" scoped>
#preloader {
  background-color: var(--color-background);
  position: fixed;
  z-index: 2000;
  display: block;
  width: 100vw;
  height: 100%;
  top: 0;
  left: 0;
}

.preloader-logo {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: auto;
  max-width: 130px;
}
.preloader-loader {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 100%;
  z-index: 200;
  overflow: hidden;

  span {
    height: 3px;
    width: 100%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    background: var(--color-text);
  }
}

.preloader-logo-wipe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-background);
}
</style>
