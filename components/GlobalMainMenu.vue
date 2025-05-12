<template>
  <nav ref="mainMenu" class="global-main-menu" aria-label="Main">
    <div class="default-menu-columns" v-if="defaultMenuLinks.length">
      <ul class="default-menu-column-left">
        <li>
          <NuxtLink to="/">Choir</NuxtLink>
        </li>
      </ul>
      <ThemeSwitcher class="theme-switcher-menu" />

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
import { computed } from "vue"; // Import computed
import { useRoute } from "vue-router"; // Import useRoute
import ThemeSwitcher from "./ThemeSwitcher.vue";
import { usePrismic, useAsyncData } from "#imports";

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

// using remainingDefaultMenuLinks
</script>

<style lang="scss" scoped>
@use "@/assets/scss/breakpoints.scss" as *;

// Styles specific to home menu
.global-main-menu {
  padding-bottom: 0;
  @include menuType;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  :deep(ul) {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
}

.default-menu-columns {
  grid-template-columns: repeat(12, 1fr);
  grid-gap: var(--gutter);
  padding: var(--gutter);
  display: grid;
}
.default-menu-column-left {
  grid-column: 1 / span 6;
}
.default-menu-column-right {
  grid-column: 10 / span 3;

  display: flex;
  justify-content: flex-end;
  li {
    margin-right: 3px;
    &:after {
      content: ", ";
      white-space: pre;
    }
    &:last-of-type {
      &:after {
        content: none;
      }
    }
  }
}
.theme-switcher {
  grid-column: 9 / span 1;
  margin-top: 3px;
}
</style>
