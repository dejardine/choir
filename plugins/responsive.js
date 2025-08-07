export default defineNuxtPlugin((nuxtApp) => {
  const { screens, updateScreens, breakpoints } = useResponsive();

  // Force an immediate update
  if (typeof window !== "undefined") {
    // Run immediately and ensure it's synchronous
    updateScreens();

    // Also run on next tick to ensure it's applied
    setTimeout(() => {
      updateScreens();
    }, 0);

    // Add resize listener
    window.addEventListener("resize", updateScreens);

    // Update on route change
    nuxtApp.hook("page:start", () => {
      updateScreens();
    });

    // Cleanup when app is destroyed
    nuxtApp.hook("app:unmount", () => {
      window.removeEventListener("resize", updateScreens);
    });
  }

  return {
    provide: {
      screens,
    },
  };
});
