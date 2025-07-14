<template>
  <div id="preloader" class="hidden" v-if="!isSimulator">
    <div class="preloader-loader" ref="preloaderBar">
      <span ref="preloaderBarInner" class="preloader-bar-inner"> </span>
    </div>
    <div class="preloader-logo">
      <div class="preloader-logo-wipe"></div>
      <svg
        width="130"
        height="48"
        viewBox="0 0 130 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M56.5658 47.3557H43.8829V46.4537L44.5171 46.3893C46.2927 46.1315 46.2927 45.745 46.2927 40.7195V31.055C46.2927 25.7074 44.8976 21.9705 40.839 21.9705C39.9512 21.9705 38.6195 22.357 37.2878 23.0013V40.655C37.2878 45.6805 37.2878 46.0671 38.8732 46.2604L39.761 46.3893V47.2913H26.9512V46.3893L27.5854 46.3248C29.4244 46.0671 29.4244 45.6805 29.4244 40.655V8.56913C29.4244 7.73154 29.4244 6.89396 28.6634 6.05638L26.6341 3.67248V3.35034C28.3463 3.02819 29.8049 2.64161 31.8341 1.99732C34.4976 1.15973 35.5122 0.773154 37.2244 0L37.5415 0.128859C37.4146 1.48188 37.2244 4.76779 37.2244 12.0483V22.0349C39.8244 19.9732 43.9463 17.2671 47.1805 17.2671C51.3659 17.2671 54.1561 20.8752 54.1561 25.3208V40.7839C54.1561 45.8094 54.1561 46.196 55.7415 46.3893L56.5658 46.5181V47.3557ZM103.112 8.56913C103.112 5.86309 101.083 3.99463 98.6732 3.99463C96.3268 3.99463 94.2341 5.86309 94.2341 8.56913C94.2341 11.2107 96.3268 13.1436 98.6732 13.1436C101.083 13.1436 103.112 11.2107 103.112 8.56913ZM104.888 46.4537L104.063 46.3248C102.415 46.1315 102.415 45.745 102.415 40.7195V24.9987C102.415 21.5839 102.541 18.6201 102.668 17.2027L102.351 17.0738C100.385 18.1691 99.2439 18.6846 97.4049 19.4577C95.6293 20.1664 94.5512 20.553 92.3317 21.1973V21.5195L93.8537 23.8389C94.5512 24.7409 94.6146 25.5141 94.6146 26.3517V40.7195C94.6146 45.745 94.6146 46.1315 92.7756 46.3893L92.1415 46.4537V47.3557H104.888V46.4537ZM121.439 46.3893L119.029 46.196C117.444 46.0671 117.38 45.6805 117.38 40.655V25.4497C118.395 24.4188 119.346 23.5168 120.424 23.4523C122.834 23.1946 123.532 25.3208 125.941 25.5785C128.288 25.7718 130 23.7745 130 21.3906C130 19.5221 128.668 17.2027 125.815 17.2671C122.834 17.3315 119.854 20.4242 117.317 24.3544V23.7101C117.317 21.5839 117.444 18.5557 117.571 17.2027L117.254 17.0738C115.605 18.0403 114.146 18.749 112.307 19.4577C110.595 20.1664 109.137 20.6819 107.234 21.1973V21.5195L108.756 23.8389C109.454 24.7409 109.517 25.5141 109.517 26.3517V40.7195C109.517 45.745 109.517 46.1315 107.678 46.3893L107.044 46.4537V47.3557H121.376V46.3893H121.439ZM125.307 47.098L125.117 46.7758C125.054 46.647 124.99 46.5826 124.99 46.5826C124.99 46.5826 124.99 46.647 124.99 46.8403V47.4201H124.673V46.0027H124.99L125.244 46.5181C125.307 46.647 125.371 46.7114 125.371 46.7114C125.371 46.7114 125.371 46.647 125.498 46.5181L125.751 46.0027H126.068V47.4201H125.751V46.8403C125.751 46.647 125.751 46.5826 125.751 46.5826C125.751 46.5826 125.688 46.7114 125.624 46.7758L125.434 47.098H125.307ZM123.785 47.3557V46.2604H123.405V45.9383H124.546V46.2604H124.166V47.3557H123.785ZM14.2683 18.8134C15.9805 18.8134 16.8683 19.9087 17.5659 21.1973C18.2 22.4215 18.3902 23.9678 19.0878 25.1919C19.722 26.3517 20.9268 27.3181 22.322 27.3181C24.3512 27.3181 26 25.5785 25.9366 23.4523C25.8098 20.6174 23.4634 19.0711 22.2585 18.4268C20.039 17.2671 17.3756 16.8805 14.6488 17.1383C6.34146 18.0403 0 24.9987 0 33.6322C0 42.2658 6.02439 47.8711 13.6976 47.8711C18.7073 47.8711 23.6537 44.3919 25.4927 39.3664L25.1756 39.1732C23.2732 41.4926 20.9902 42.4591 18.3902 42.4591C12.0488 42.4591 7.92683 37.6913 7.92683 29.4443C7.86341 23.5168 11.161 18.8134 14.2683 18.8134ZM89.8585 32.4725C89.8585 41.6859 82.1219 48 74.1951 48C66.2683 48 58.5317 41.8792 58.5317 32.7946C58.5317 23.5812 66.3317 17.2027 74.1951 17.2027C82.1219 17.2027 89.8585 23.4523 89.8585 32.4725ZM81.1073 33.0523C81.1073 24.9342 78.5707 18.6846 74.1317 18.6846C69.8195 18.6846 67.2829 23.9678 67.2829 32.2148C67.2829 40.2685 69.8195 46.5826 74.1317 46.5826C78.5707 46.5826 81.1073 41.2993 81.1073 33.0523Z"
          fill="var(--color-text)"
        />
      </svg>
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
    .to(
      ".preloader-logo-wipe",
      {
        duration: 0.5,
        ease: "power4.in",
        delay: 0,
        alpha: 0,
      },
      "-=2.25"
    )
    .to(".preloader-logo", {
      alpha: 1,
      duration: 0.35,
      ease: "power4.in",
      duration: 0.3,
      alpha: 0,
      y: "-20px",
      ease: "power4.inOut",
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
