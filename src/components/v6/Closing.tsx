"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Symbol } from "@/components/v6/Symbol";
import { site, registerHref } from "@/content/site";
import { useGsap } from "@/lib/motion";

/** The last word: the symbol again, and the one thing to do next. */
export function Closing() {
  const root = useRef<HTMLElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const el = root.current!;
    const paths = el.querySelectorAll(".sym path");
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 65%" } })
        .fromTo(paths, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, stagger: 0.2, ease: "power3.inOut" }, 0)
        .fromTo(".sym__dot", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.5, ease: "back.out(2.6)" }, 0.8)
        .fromTo(".c6__line", { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.08, ease: "power4.out" }, 0.3)
        .fromTo(".c6__meta > *", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 0.6);
    }, el);
    return () => ctx.revert();
  }, [gsap]);

  return (
    <section className="c6 s6" ref={root} aria-labelledby="c6-title">
      <div className="wrap c6__inner">
        <Symbol className="c6__sym" />
        <h2 id="c6-title" className="c6__title">
          <span className="o6__mask">
            <span className="c6__line">Your move.</span>
          </span>
        </h2>
        <div className="c6__meta">
          <p className="c6__body">
            {site.date.label} (to be confirmed) at {site.venue.name}, {site.venue.address}.
          </p>
          <div className="o6__ctas">
            <Link href={registerHref} className="b6 b6--ink">
              Register interest
            </Link>
            <Link href="/attend/" className="b6 b6--ghost">
              How the day works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
