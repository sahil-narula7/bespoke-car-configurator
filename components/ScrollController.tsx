"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollController() {
  useLayoutEffect(() => {
    let frameId = 0;
    const previousScrollRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";

    // Always start from the top on refresh, even if the URL contains a hash.
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    const lenis = new Lenis({
      duration: 1.12,
      smoothWheel: true,
      lerp: 0.09,
    });

    const forceTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      lenis.scrollTo(0, { immediate: true, force: true });
      ScrollTrigger.update();
    };

    forceTop();
    requestAnimationFrame(forceTop);

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    const revealItems = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    revealItems.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 56 },
        {
          opacity: 1,
          y: 0,
          ease: "power3.out",
          duration: 1,
          scrollTrigger: {
            trigger: item,
            start: "top 84%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    gsap.fromTo(
      "[data-amenity]",
      { opacity: 0, y: 36, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.16,
        ease: "power3.out",
        duration: 0.9,
        scrollTrigger: {
          trigger: "#features",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      },
    );

    gsap.fromTo(
      "#hero",
      { backgroundPosition: "50% 0%" },
      {
        backgroundPosition: "50% 90%",
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return null;
}
