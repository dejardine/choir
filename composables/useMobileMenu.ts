import { ref, watch } from "vue";

// Global state for mobile menu
const isMobileMenuOpen = ref(false);
const mobileMenuRef = ref<HTMLElement | null>(null);

export const useMobileMenu = () => {
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };

  const openMobileMenu = () => {
    isMobileMenuOpen.value = true;
  };

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
  };

  // Watch for mobile menu state changes to prevent body scroll
  watch(isMobileMenuOpen, (isOpen) => {
    if (process.client) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  });

  return {
    isMobileMenuOpen,
    mobileMenuRef,
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
  };
};
