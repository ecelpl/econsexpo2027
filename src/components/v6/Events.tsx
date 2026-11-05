"use client";

import { useEffect, useRef } from "react";
import { Photo } from "@/components/Photo";
import { experiences } from "@/content/site";
import { connect } from "@/lib/connect";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

// Only what the committee has written down for 2027. Planned, so labelled as such.
const facts: Record<string, string[]> = {
  buzzer: ["Played in teams", "Rounds of economics questions", "From first principles to the headlines"],
  pitch: ["Starts with a live economic briefing", "A hypothetical $1,000,000 portfolio", "Defend your strategy to the judges"],
  crisis: ["You play a nation’s ministers", "Negotiate and publish policy", "New economic and political shocks each round"],
};

/** The three events, explained plainly: a photo from 2026, what you do, and the format. */
export function Events() {
  const root = useRef<HTMLElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const el = root.current!;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".ev__row"));
    const measures = rows.map((r) =>
      connect(r, r.querySelector(".ev__ink")!, r.querySelector(".ev__ink path")!, r.querySelector(".ev__photo")!, r.querySelector(".ev__title")!),
    );
    const layout = () => measures.forEach((m) => m());
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    document.fonts.ready.then(layout);

    if (prefersReducedMotion()) return () => ro.disconnect();
    const ctx = gsap.context(() => {
      rows.forEach((r) => {
        gsap
          .timeline({ scrollTrigger: { trigger: r, start: "top 72%" } })
          .fromTo(r.querySelector(".ev__photo"), { clipPath: "inset(18% 12% 18% 12%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.out" }, 0)
          .fromTo(r.querySelector(".ev__photo img"), { scale: 1.2 }, { scale: 1, duration: 1.6, ease: "expo.out" }, 0)
          .fromTo(r.querySelectorAll(".ev__text > *"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "power3.out" }, 0.15)
          .fromTo(r.querySelector(".ev__ink path"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1, ease: "power2.inOut" }, 0.45);
      });
    }, el);
    return () => {
      ro.disconnect();
      ctx.revert();
    };
  }, [gsap]);

  return (
    <section className="ev s6" id="events" ref={root} aria-labelledby="ev-title">
      <div className="wrap">
        <header className="s6__head">
          <p className="s6__eyebrow">The events</p>
          <h2 id="ev-title" className="s6__title">Three ways to use economics in one day.</h2>
          <p className="s6__note">Planned for 2027. Details may still change. Photos are from Econs Expo 2026.</p>
        </header>
        {experiences.map((x, i) => (
          <article key={x.id} className={`ev__row${i % 2 ? " ev__row--flip" : ""}`} aria-labelledby={`ev-${x.id}`}>
            <figure className="ev__photo">
              <Photo slug={x.photo} alt={x.photoAlt} sizes="(max-width: 860px) 100vw, 55vw" pos={x.photoPos} />
            </figure>
            <div className="ev__text">
              <p className="ev__n">{x.index}</p>
              <h3 id={`ev-${x.id}`} className="ev__title">
                {x.title}
              </h3>
              <p className="ev__body">{x.body}</p>
              <ul className="ev__facts">
                {facts[x.id].map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <svg className="ev__ink line6" aria-hidden="true">
              <path />
            </svg>
          </article>
        ))}
      </div>
    </section>
  );
}
