import gsap from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import { CustomEase } from "gsap/dist/CustomEase";
import { TextPlugin } from "gsap/dist/TextPlugin";
import { InertiaPlugin } from "gsap/dist/InertiaPlugin";
import { Draggable } from "gsap/dist/Draggable";

if (process.client) {
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollToPlugin,
    CustomEase,
    TextPlugin,
    InertiaPlugin,
    Draggable
  );
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      gsap,
      ScrollTrigger,
      ScrollToPlugin,
      CustomEase,
      TextPlugin,
      InertiaPlugin,
      Draggable,
    },
  };
});
