import { ref } from "vue";

export const useResponsive = () => {
  const breakpoints = {
    mobile: 812,
    tablet: 1380,
    smallLaptop: 1280,
    laptop: 1512,
    display: 1800,
  };

  // Initialize with SSR-safe defaults
  const screens = ref({
    isMobile: typeof window !== "undefined" ? window.innerWidth <= 812 : true,
    isTablet: false,
    isSmallLaptop: false,
    isLaptop: false,
    isDisplay: false,
    current:
      typeof window !== "undefined"
        ? window.innerWidth <= 812
          ? "mobile"
          : "laptop"
        : "mobile",
  });

  const updateScreens = () => {
    if (typeof window === "undefined") {
      screens.value = {
        isMobile: true,
        isTablet: false,
        isSmallLaptop: false,
        isLaptop: false,
        isDisplay: false,
        current: "mobile",
      };
      return;
    }

    const width = window.innerWidth;
    const newScreens = {
      isMobile: width <= breakpoints.mobile,
      isTablet: width <= breakpoints.tablet && width > breakpoints.mobile,
      isSmallLaptop:
        width <= breakpoints.smallLaptop && width > breakpoints.tablet,
      isLaptop: width <= breakpoints.laptop && width > breakpoints.smallLaptop,
      isDisplay: width >= breakpoints.display,
      current:
        width <= breakpoints.mobile
          ? "mobile"
          : width <= breakpoints.tablet
            ? "tablet"
            : width <= breakpoints.smallLaptop
              ? "smallLaptop"
              : width <= breakpoints.laptop
                ? "laptop"
                : width >= breakpoints.display
                  ? "display"
                  : "laptop",
    };

    console.log(
      "updateScreens called - width:",
      width,
      "isMobile:",
      newScreens.isMobile,
      "isDisplay:",
      newScreens.isDisplay
    );
    screens.value = newScreens;
    console.log("screens.value updated:", screens.value);
  };

  if (typeof window !== "undefined") {
    updateScreens();

    // Add resize listener to ensure updates
    window.addEventListener("resize", updateScreens);

    // Cleanup function to remove listener
    const cleanup = () => {
      window.removeEventListener("resize", updateScreens);
    };

    // Return cleanup function for components to use if needed
    return {
      screens,
      breakpoints,
      updateScreens,
      cleanup,
    };
  }

  return {
    screens,
    breakpoints,
    updateScreens,
  };
};
