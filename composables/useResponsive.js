import { ref } from "vue";

export const useResponsive = () => {
  const breakpoints = {
    mobile: 812,
    tablet: 1380,
    smallLaptop: 1280,
    laptop: 1512,
    display: 1800,
  };

  const screens = ref({
    isMobile: false,
    isTablet: false,
    isSmallLaptop: false,
    isLaptop: false,
    isDisplay: false,
    current: "laptop",
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
    screens.value = {
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
