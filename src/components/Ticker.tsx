"use client";

import { useEffect, useRef } from "react";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

const rows = [
  ["Buzz in", "Supply", "Pitch", "Demand", "Negotiate", "Elasticity"],
  ["Shock", "Policy", "Portfolio", "Trade-off", "Inflation", "Decide"],
];

function Doodle({ i }: { i: number }) {
  const d = [
    "M 20 4 C 34 4, 38 18, 26 30 C 14 40, 2 30, 6 18 C 9 9, 18 6, 30 8",
    "M 4 20 L 36 20 M 26 10 L 36 20 L 26 30",
    "M 20 2 L 24 15 L 38 16 L 27 24 L 31 38 L 20 30 L 9 38 L 13 24 L 2 16 L 16 15 Z",
  ][i % 3];
  return (
    <svg className="tk__doodle ink" viewBox="0 0 40 40" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/** Two rows of economics words that drift in opposite directions and lean with scroll speed. */
export function Ticker() {
  const root = useRef<HTMLDivElement>(null);
  const { gsap, ScrollTrigger } = useGsap();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current!;
    const inners = el.querySelectorAll<HTMLElement>(".tk__inner");
    const anims = Array.from(inners).flatMap((n) => n.getAnimations());
    const skew = gsap.quickTo(el.querySelectorAll(".tk__row"), "skewX", { duration: 0.4, ease: "power3.out" });
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (s) => {
        const v = s.getVelocity();
        skew(gsap.utils.clamp(-12, 12, -v / 220));
        anims.forEach((a) => (a.playbackRate = 1 + Math.min(4, Math.abs(v) / 600)));
      },
    });
    return () => st.kill();
  }, [gsap, ScrollTrigger]);

  return (
    <div className="tk" ref={root} aria-hidden="true">
      {rows.map((words, r) => (
        <div key={r} className={`tk__row tk__row--${r}`}>
          <div className="tk__inner">
            {[0, 1].map((rep) =>
              words.map((w, i) => (
                <span key={`${rep}-${i}`} className={`tk__word${(i + r) % 2 ? " tk__word--outline" : ""}`}>
                  {w}
                  <Doodle i={i + r} />
                </span>
              )),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
