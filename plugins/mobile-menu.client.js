export default defineNuxtPlugin((nuxtApp) => {
  const { handleRouteChange, initializeMobileMenu, forceCloseMobileMenu, checkAndResetMobileMenuState } = useMobileMenu();

  // Handle route changes to close mobile menu
  nuxtApp.hook("page:start", () => {
    handleRouteChange();
  });

  // Handle app initialization
  nuxtApp.hook("app:mounted", () => {
    // Ensure mobile menu is properly initialized
    initializeMobileMenu();
    // Check and reset state if needed
    checkAndResetMobileMenuState();
  });

  // Handle app cleanup
  nuxtApp.hook("app:unmount", () => {
    // Force close mobile menu on app unmount
    forceCloseMobileMenu();
  });

  // Periodically check mobile menu state to ensure it stays in sync
  if (process.client) {
    setInterval(() => {
      checkAndResetMobileMenuState();
    }, 5000); // Check every 5 seconds
  }
});
