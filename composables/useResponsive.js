import { ref } from "vue";

export const useResponsive = () => {
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  const screens = ref({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    current: "desktop",
  });

  const updateScreens = () => {
    if (typeof window === "undefined") {
      screens.value = {
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        isLargeDesktop: false,
        current: "mobile",
      };
      return;
    }

    const width = window.innerWidth;
    screens.value = {
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg && width < breakpoints.xl,
      isLargeDesktop: width >= breakpoints.xl,
      current:
        width < breakpoints.md
          ? "mobile"
          : width < breakpoints.lg
            ? "tablet"
            : width < breakpoints.xl
              ? "desktop"
              : "largeDesktop",
    };
  };

  if (typeof window !== "undefined") {
    updateScreens();
  }

  return {
    screens,
    breakpoints,
    updateScreens,
  };
};
