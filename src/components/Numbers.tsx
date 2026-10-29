"use client";

import { useEffect, useRef } from "react";
import { CountUp } from "@/components/CountUp";
import { Curves } from "@/components/Curves";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

const items = [
  { n: 150, pre: "~", label: "students expected", note: "2026: 72" },
  { n: 3, label: "experiences", note: "buzz · pitch · crisis" },
  { n: 1, label: "day at SJI International", note: "20 Feb 2027, tbc" },
];

/** The event in three numbers, each circled by the marker as it counts up. */
export function Numbers() {
  const root = useRef<HTMLElement>(null);
  const { gsap } = useGsap();
  useEffect(() => {
    const el = root.current!;
    const rings = el.querySelectorAll(".num__ring path");
    if (prefersReducedMotion()) {
      gsap.set(rings, { drawSVG: "100%" });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(rings, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.2, stagger: 0.2, ease: "power2.inOut", scrollTrigger: { trigger: el, start: "top 70%" } });
      gsap.fromTo(".num__note", { autoAlpha: 0, rotate: -8 }, { autoAlpha: 1, rotate: -4, duration: 0.6, stagger: 0.2, delay: 0.8, scrollTrigger: { trigger: el, start: "top 70%" } });
    }, el);
    return () => ctx.revert();
  }, [gsap]);

  return (
    <section className="num paper-grid" ref={root} aria-label="Econs Expo 2027 in numbers">
      <Curves variant={1} />
      <ul className="wrap num__list">
        {items.map((it) => (
          <li key={it.label} className="num__item">
            <span className="num__n">
              {it.pre}
              <CountUp to={it.n} />
              <svg className="num__ring ink" viewBox="0 0 200 120" preserveAspectRatio="none" aria-hidden="true">
                <path d="M 110 6 C 170 4, 198 30, 196 60 C 194 96, 150 116, 96 114 C 40 112, 4 92, 4 58 C 4 24, 44 6, 100 6 C 130 6, 150 10, 164 16" />
              </svg>
            </span>
            <span className="num__label">{it.label}</span>
            <span className="num__note hand">{it.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
