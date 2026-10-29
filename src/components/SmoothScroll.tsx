"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

/** Weighted scroll that ScrollTrigger reads from. Off entirely for reduced motion. */
export function SmoothScroll() {
  const { gsap, ScrollTrigger } = useGsap();

  useEffect(() => {
    // Phones resize the viewport as the address bar slides; re-measuring every trigger then stutters.
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, anchors: { offset: -72 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis");
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [gsap, ScrollTrigger]);

  return null;
}
