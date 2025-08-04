<template>
  <nav ref="mainMenu" class="global-main-menu" aria-label="Main">
    <div class="default-menu-columns" v-if="defaultMenuLinks.length">
      <ul class="default-menu-column-left">
        <li>
          <NuxtLink to="/">Choir</NuxtLink>
        </li>
      </ul>
      <ThemeSwitcher class="theme-switcher-menu" />
      <button
        class="mobile-menu-toggle"
        @click="handleMobileMenuToggle"
        :class="{ 'is-open': isMobileMenuOpen }"
      >
        Menu
      </button>
      <ul class="default-menu-column-right">
        <li
          v-for="(item, index) in defaultMenuLinks"
          :key="'home-col-' + index"
        >
          <prismic-link :field="item.link" />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { computed, onMounted } from "vue"; // Import computed
import { useRoute } from "vue-router"; // Import useRoute
import ThemeSwitcher from "./ThemeSwitcher.vue";
import { useMobileMenu } from "~/composables/useMobileMenu";
import { useMainMenu } from "~/composables/useMainMenu";

// Get the current route
const route = useRoute();

// Get menu data using shared composable
const { menuData } = useMainMenu();

// using homeMenuLinks

// Computed property for all menu links
const defaultMenuLinks = computed(() => {
  // Ensure data exists
  return menuData.value?.data?.links || [];
});

// Mobile menu functionality
const {
  toggleMobileMenu,
  isMobileMenuOpen,
  initializeMobileMenu,
  forceCloseMobileMenu,
} = useMobileMenu();

const handleMobileMenuToggle = () => {
  try {
    toggleMobileMenu();
  } catch (error) {
    console.error("Error toggling mobile menu:", error);
    // Fallback: force close if there's an error
    const { forceCloseMobileMenu } = useMobileMenu();
    forceCloseMobileMenu();
  }
};

onMounted(() => {
  // Initialize mobile menu state
  initializeMobileMenu();
});

// using remainingDefaultMenuLinks
</script>

<style lang="scss" scoped>
@use "@/assets/scss/breakpoints.scss" as *;
@use "@/assets/scss/global.scss" as *;

// Styles specific to home menu
.global-main-menu {
  padding-bottom: 0;
  @include menuType;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  mix-blend-mode: exclusion;
  z-index: 3000;
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
  grid-template-columns: repeat(12, 1fr);
  grid-gap: var(--gutter);
  padding: var(--gutterPadding);
  display: grid;
  align-items: center;
}

.default-menu-column-left {
  grid-column: 1 / span 6;
}
.default-menu-column-right {
  @include breakpoint(mobile) {
    display: none;
  }
  grid-column: 10 / span 3;

  display: flex;
  justify-content: flex-end;
  li {
    margin-right: 3px;
    &:after {
      content: ", ";
      white-space: pre;
      color: var(--color-reverse);
    }
    &:last-of-type {
      &:after {
        content: none;
      }
    }
    a {
      &:hover,
      &.router-link-active {
        text-decoration: underline;
        text-decoration-color: var(--color-reverse);
        text-decoration-thickness: 1px;
        text-underline-offset: 1px;
      }
    }
  }
}
.theme-switcher {
  grid-column: 9 / span 1;
}

.mobile-menu-toggle {
  @include noButton;
  @include menuType;
  color: var(--color-reverse);
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  grid-column: 10 / span 3;
  text-align: right;
  display: none;
  transition: opacity 0.3s ease;

  @include breakpoint(mobile) {
    display: block;
  }

  &.is-open {
    opacity: 0.5;
  }
}
</style>
