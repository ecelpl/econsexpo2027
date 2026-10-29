"use client";

import { useEffect, useRef } from "react";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

// A seat sketched in marker: head, shoulders, and a chair back.
const seat = [
  "M 100 34 C 122 34, 132 52, 130 70 C 128 90, 114 100, 100 100 C 84 100, 70 88, 70 68 C 70 50, 80 34, 102 34",
  "M 46 196 C 46 150, 68 120, 100 118 C 134 118, 156 150, 156 196",
  "M 28 206 L 172 206",
];

/** Three empty seats, drawn in as you arrive. Names go up only once they are confirmed. */
export function Speakers() {
  const root = useRef<HTMLElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const el = root.current!;
    const paths = el.querySelectorAll(".spk__seat path");
    if (prefersReducedMotion()) {
      gsap.set(paths, { drawSVG: "100%" });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(paths, { drawSVG: "0%" });
      el.querySelectorAll<HTMLElement>(".spk__card").forEach((c, i) => {
        gsap
          .timeline({ scrollTrigger: { trigger: el.querySelector(".spk__cards"), start: "top 75%" } })
          .fromTo(c, { y: 80, rotate: 0, autoAlpha: 0 }, { y: 0, rotate: [-3, 2, -1.5][i], autoAlpha: 1, duration: 1, ease: "power3.out" }, i * 0.14)
          .to(c.querySelectorAll(".spk__seat path"), { drawSVG: "100%", duration: 0.9, stagger: 0.18, ease: "power2.inOut" }, i * 0.14 + 0.4)
          .fromTo(c.querySelector(".spk__tba"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, i * 0.14 + 1.1);
      });
      gsap.fromTo(".spk__q", { rotate: -30, scale: 0.6, autoAlpha: 0 }, { rotate: 8, scale: 1, autoAlpha: 1, ease: "back.out(2)", duration: 0.9, scrollTrigger: { trigger: ".spk__head", start: "top 70%" } });
    }, el);
    return () => ctx.revert();
  }, [gsap]);

  return (
    <section className="spk paper-grid" id="speakers" ref={root} aria-labelledby="spk-title">
      <div className="wrap spk__grid">
        <div className="spk__head">
          <p className="eyebrow">Guest speakers 2027</p>
          <h2 id="spk-title" className="display display--xl">
            To be <span className="hand spk__hand">announced.</span>
            <span className="spk__q hand" aria-hidden="true">
              ?
            </span>
          </h2>
          <p className="spk__body">
            We are inviting economists and people from finance and policy to open the day. Names go up here once they are
            confirmed, not before.
          </p>
        </div>
        <ul className="spk__cards" aria-label="Speaker places, not yet announced">
          {[1, 2, 3].map((n) => (
            <li key={n} className="spk__card" data-cursor="Soon">
              <span className="spk__slot tabular">0{n}</span>
              <svg className="spk__seat ink" viewBox="0 0 200 220" aria-hidden="true">
                {seat.map((d) => (
                  <path key={d} d={d} />
                ))}
              </svg>
              <span className="hand spk__tba">name to come</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
