<template>
  <nav
    ref="mobileMenuRef"
    class="global-mobile-menu"
    aria-label="Main"
    @click.stop
  >
    <button class="mobile-menu-close" @click="handleCloseMenu">Close</button>

    <div class="default-menu-columns" v-if="defaultMenuLinks.length">
      <ul>
        <li class="mobile-menu-item">
          <NuxtLink to="/" @click="handleCloseMenu">Home</NuxtLink>
        </li>
        <li
          v-for="(item, index) in defaultMenuLinks"
          :key="'home-col-' + index"
          class="mobile-menu-item"
        >
          <prismic-link :field="item.link" @click="handleCloseMenu" />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from "vue"; // Import computed
import { useRoute } from "vue-router"; // Import useRoute
import ThemeSwitcher from "./ThemeSwitcher.vue";
import { usePrismic, useAsyncData } from "#imports";
import { useMobileMenu } from "~/composables/useMobileMenu";

// Get the current route
const route = useRoute();

// Get Prismic client and fetch menu data
const prismic = usePrismic();
const { data: menuData } = await useAsyncData("main_menu", async () => {
  try {
    return await prismic.client.getSingle("main_menu");
  } catch (error) {
    console.error("Error fetching main menu data:", error);
    return null; // Return null or handle error as needed
  }
});

// using homeMenuLinks

// Computed property for all menu links
const defaultMenuLinks = computed(() => {
  // Ensure data exists
  return menuData.value?.data?.links || [];
});

// Mobile menu functionality
const { isMobileMenuOpen, closeMobileMenu, mobileMenuRef } = useMobileMenu();

// GSAP animation
const { $gsap } = useNuxtApp();

let tl = null;

onMounted(() => {
  // Set initial state - start from above the viewport
  $gsap.set(mobileMenuRef.value, { y: "-100%" });

  // Set initial state for menu items - hidden and moved up
  $gsap.set(".mobile-menu-item", {
    y: 20,
    opacity: 0,
  });

  // Add click outside listener
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  // Remove click outside listener
  document.removeEventListener("click", handleClickOutside);
});

// Watch for mobile menu state changes
watch(isMobileMenuOpen, (isOpen) => {
  if (isOpen) {
    // Create fresh timeline for opening animation
    tl = $gsap.timeline();

    // Animate menu down
    tl.to(mobileMenuRef.value, {
      y: "0%",
      duration: 0.6,
      ease: "expo.inOut",
    }).to(
      ".mobile-menu-item",
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "expo.out",
        from: "start",
      },
      "-=0.3"
    );
  } else {
    // Fade out menu items together without stagger
    $gsap.to(".mobile-menu-item", {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
    });

    // Animate menu back up
    $gsap.to(mobileMenuRef.value, {
      y: "-100%",
      duration: 0.6,
      ease: "expo.inOut",
      onComplete: () => {
        // Reset menu items to initial state after menu closes
        $gsap.set(".mobile-menu-item", {
          y: 20,
          opacity: 0,
        });
      },
    });
  }
});

const handleCloseMenu = () => {
  closeMobileMenu();
};

const handleClickOutside = (event) => {
  // Don't close if clicking on the mobile menu toggle button
  if (event.target.closest(".mobile-menu-toggle")) {
    return;
  }

  if (
    isMobileMenuOpen.value &&
    mobileMenuRef.value &&
    !mobileMenuRef.value.contains(event.target)
  ) {
    closeMobileMenu();
  }
};

// using remainingDefaultMenuLinks
</script>

<style lang="scss" scoped>
@use "@/assets/scss/breakpoints.scss" as *;
@use "@/assets/scss/global.scss" as *;

// Styles specific to home menu
.global-mobile-menu {
  padding-bottom: 0;
  @include mobileMenu;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 8000;
  background-color: var(--color-background);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  :deep(ul) {
    list-style-type: none;
    padding: 0;
    margin: 0;
    a {
      color: var(--color-reverse);
    }
  }
}

.default-menu-columns {
  padding: 0 var(--gutterPadding);
  width: 100%;
  position: relative;
}

.mobile-menu-close {
  @include noButton;
  @include menuType;
  color: var(--color-reverse);
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  position: absolute;
  top: var(--gutterPadding);
  right: var(--gutterPadding);
  z-index: 10;
}
</style>
