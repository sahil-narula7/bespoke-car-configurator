"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollValue } from "@/components/ScrollContext";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTracker() {
  const scroll = useScrollValue();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        scroll.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, [scroll]);

  return null;
}
