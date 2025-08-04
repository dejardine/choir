import { ref, watch, onMounted, onUnmounted } from "vue";

// Global state for mobile menu - using a more persistent approach
const isMobileMenuOpen = ref(false);
const mobileMenuRef = ref<HTMLElement | null>(null);
const isInitialized = ref(false);

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

  // Force close mobile menu (useful for route changes)
  const forceCloseMobileMenu = () => {
    isMobileMenuOpen.value = false;
    // Reset body overflow
    if (process.client) {
      document.body.style.overflow = "";
    }
  };

  // Check and reset mobile menu state if needed
  const checkAndResetMobileMenuState = () => {
    if (process.client) {
      // If body overflow is hidden but menu state is closed, reset it
      if (
        document.body.style.overflow === "hidden" &&
        !isMobileMenuOpen.value
      ) {
        document.body.style.overflow = "";
      }
      // If body overflow is not hidden but menu state is open, reset it
      else if (
        document.body.style.overflow !== "hidden" &&
        isMobileMenuOpen.value
      ) {
        isMobileMenuOpen.value = false;
      }
    }
  };

  // Initialize mobile menu state
  const initializeMobileMenu = () => {
    if (isInitialized.value) return;

    // Ensure mobile menu is closed on initialization
    isMobileMenuOpen.value = false;

    // Reset body overflow
    if (process.client) {
      document.body.style.overflow = "";
    }

    isInitialized.value = true;
  };

  // Watch for mobile menu state changes to prevent body scroll
  watch(
    isMobileMenuOpen,
    (isOpen) => {
      if (process.client) {
        if (isOpen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      }
    },
    { immediate: true }
  );

  // Handle route changes
  const handleRouteChange = () => {
    // Close mobile menu on route change
    forceCloseMobileMenu();
    // Check and reset state if needed
    checkAndResetMobileMenuState();
  };

  return {
    isMobileMenuOpen,
    mobileMenuRef,
    isInitialized,
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    forceCloseMobileMenu,
    initializeMobileMenu,
    handleRouteChange,
    checkAndResetMobileMenuState,
  };
};
