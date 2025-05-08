// GSAP import
import gsap from "gsap/dist/gsap";
import { CustomEase } from "gsap/dist/CustomEase";

import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (process.client) {
  gsap.registerPlugin(ScrollToPlugin, CustomEase, ScrollTrigger);
}

export const globalRouteTransition = {
  name: "global-route-transition",
  mode: "out-in",
  css: false,

  onBeforeLeave() {},

  onLeave(el, done) {
    document.body.classList.add("page-routing");

    gsap.to(".global-route-transition", {
      opacity: 1,
      duration: 0.5,
      delay: 0,
      display: "block",
      ease: CustomEase.create("custom", "M0,0 C1,0 0,1 1,1 "),
      onComplete: () => {
        done();
        document.body.classList.remove("body-overflow");
      },
    });
  },

  onBeforeEnter() {},
  onEnter(el, done) {
    if (process.client) {
      const animateInElements = el.querySelectorAll(".animate-in");

      document.body.classList.remove("no-overflow");
      const tl = gsap.timeline();
      tl.to(window, {
        duration: 0.2,
        scrollTo: {
          y: 0,
        },
      });
      tl.to(".global-route-transition", {
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0,
        display: "none",
        onComplete: () => {
          gsap.set(".global-route-transition", {
            opacity: 1,
          });
          ScrollTrigger.refresh();
          document.body.classList.remove("page-routing");
        },
      });
      tl.set(el, { visibility: "visible" }).fromTo(
        animateInElements,
        {
          autoAlpha: 0,
          y: 30,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          delay: 0,
          ease: "power4.inOut",
          stagger: {
            each: 0.075,
            from: "start",
          },
          onComplete: () => {
            gsap.set(animateInElements, { clearProps: "all" });
            console.log("refresh scroll trigger on enter");
            window.dispatchEvent(new Event("resize"));
          },
        },
        0
      );
    }
  },
};
