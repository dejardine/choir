// GSAP import
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
      const wipeElements = el.querySelectorAll(".wipe-in");

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

          // Update theme-color meta tag to match --color-background
          const computedStyle = getComputedStyle(document.documentElement);
          const bgColor = computedStyle
            .getPropertyValue("--color-background")
            .trim();

          // Convert CSS variable to actual color value
          let themeColor = bgColor;
          if (bgColor.startsWith("var(--")) {
            // If it's still a CSS variable, get the computed value
            const tempEl = document.createElement("div");
            tempEl.style.backgroundColor = bgColor;
            document.body.appendChild(tempEl);
            themeColor = getComputedStyle(tempEl).backgroundColor;
            document.body.removeChild(tempEl);
          }

          // Update the theme-color meta tag
          let themeMeta = document.querySelector('meta[name="theme-color"]');
          if (!themeMeta) {
            themeMeta = document.createElement("meta");
            themeMeta.name = "theme-color";
            document.head.appendChild(themeMeta);
          }
          themeMeta.content = themeColor;
        },
      });
      tl.set(el, { visibility: "visible" });

      // Animate wipe-in elements first
      if (wipeElements.length > 0) {
        tl.fromTo(
          wipeElements,
          {
            xPercent: 0,
          },
          {
            xPercent: 100,
            duration: 0.4,
            ease: "power4.inOut",
            stagger: {
              each: 0.1,
              from: "start",
            },
          },
          0
        );
      }

      // Then animate in elements
      tl.fromTo(
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
