"use client";

import { useEffect, useRef } from "react";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

/** Faint supply and demand curves behind a section, drawn in and drifting at scroll speed. */
export function Curves({ variant = 0 }: { variant?: number }) {
  const root = useRef<SVGSVGElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll("path"), { drawSVG: "0%" }, {
        drawSVG: "100%", duration: 2.2, stagger: 0.25, ease: "power2.inOut",
        scrollTrigger: { trigger: el.parentElement, start: "top 75%" },
      });
      gsap.fromTo(el, { yPercent: 6 }, { yPercent: -6, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, [gsap]);

  const sets = [
    ["M 40 80 C 300 120, 600 420, 980 560", "M 60 560 C 360 520, 640 200, 980 90", "M 140 600 C 440 560, 720 260, 1000 160", "M 0 330 L 1000 330"],
    ["M 20 520 C 260 480, 520 240, 980 120", "M 30 120 C 330 160, 640 420, 990 520", "M 500 0 L 500 640", "M 60 470 C 300 440, 520 260, 900 160"],
  ][variant % 2];

  return (
    <svg className="curves" ref={root} viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true">
      {sets.map((d, i) => (
        <path key={i} d={d} className={i === sets.length - 1 ? "curves__axis" : undefined} />
      ))}
    </svg>
  );
}
