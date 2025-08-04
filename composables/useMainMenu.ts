import { usePrismic, useAsyncData } from "#imports";

export const useMainMenu = () => {
  const prismic = usePrismic();
  
  const { data: menuData } = useAsyncData("main_menu", async () => {
    try {
      return await prismic.client.getSingle("main_menu");
    } catch (error) {
      console.error("Error fetching main menu data:", error);
      return null;
    }
  });

  return {
    menuData
  };
}; 