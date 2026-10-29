"use client";

import { useEffect, useRef } from "react";
import { Photo } from "@/components/Photo";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

type MarkKind = "circle" | "under" | "double";

const shapes: Record<MarkKind, string> = {
  circle: "M 54 4 C 86 3, 99 12, 98 21 C 97 30, 72 34, 46 33 C 18 32, 2 27, 3 18 C 4 8, 28 3, 62 5",
  under: "M 2 30 C 30 27, 64 31, 98 27",
  double: "M 2 28 C 34 25, 66 29, 98 26 M 8 33 C 38 31, 70 34, 94 31",
};

function Mark({ kind, note, after = "", children }: { kind: MarkKind; note: string; after?: string; children: React.ReactNode }) {
  // `after` keeps trailing punctuation on the same line as the marked word.
  return (
    <span className="mark-wrap">
      <span className={`mark mark--${kind}`}>
        {children}
        <svg className="mark__ink ink" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
          <path d={shapes[kind]} />
        </svg>
        <span className="mark__note hand" aria-hidden="true">
          {note}
        </span>
      </span>
      {after}
    </span>
  );
}

export function Intro() {
  const root = useRef<HTMLElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const el = root.current!;
    const paths = el.querySelectorAll<SVGPathElement>(".mark__ink path");
    const notes = el.querySelectorAll<HTMLElement>(".mark__note");
    if (prefersReducedMotion()) {
      gsap.set(paths, { drawSVG: "100%" });
      gsap.set(notes, { autoAlpha: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(paths, { drawSVG: "0%" });
      gsap.set(notes, { autoAlpha: 0, y: 6 });
      el.querySelectorAll<HTMLElement>(".mark").forEach((m) => {
        gsap
          .timeline({ scrollTrigger: { trigger: m, start: "top 72%", toggleActions: "play none none reverse" } })
          .to(m.querySelector(".mark__ink path"), { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" })
          .to(m.querySelector(".mark__note"), { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.3");
      });
      // Three photos drift at different speeds to give the collage depth.
      el.querySelectorAll<HTMLElement>("[data-speed]").forEach((p) => {
        gsap.fromTo(
          p,
          { yPercent: 0 },
          {
            yPercent: -Number(p.dataset.speed),
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [gsap]);

  return (
    <section className="intro" ref={root} aria-labelledby="intro-title">
      <div className="wrap intro__grid">
        <p className="eyebrow intro__eyebrow">Why Econs Expo</p>
        <h2 id="intro-title" className="intro__statement">
          Economics gets interesting the moment you have to <em>use</em> it. For one day, students from schools across
          Singapore take the ideas behind{" "}
          <Mark kind="circle" note="$1M on the line" after=",">
            finance
          </Mark>{" "}
          <Mark kind="under" note="read the market">
            business
          </Mark>{" "}
          and{" "}
          <Mark kind="double" note="run a country">
            politics
          </Mark>{" "}
          out of the textbook and into the room.
        </h2>

        <figure className="intro__ph intro__ph--a" data-speed="10">
          <Photo slug="team-table" alt="A team of six students smiling at their table, laptops open, at Econs Expo 2026" sizes="(max-width: 860px) 90vw, 40vw" pos="50% 60%" />
          <figcaption className="hand">2026 · one table, one team</figcaption>
        </figure>
        <figure className="intro__ph intro__ph--b" data-speed="22">
          <Photo slug="briefing" alt="A delegate reads the crisis briefing booklet" sizes="(max-width: 860px) 60vw, 26vw" pos="40% 50%" />
          <figcaption className="hand">reading the brief</figcaption>
        </figure>
        <figure className="intro__ph intro__ph--c" data-speed="4">
          <Photo slug="panel" alt="Guest speakers in conversation on stage in front of students, 2026" sizes="(max-width: 860px) 70vw, 30vw" pos="50% 50%" />
          <figcaption className="hand">2026 guest panel</figcaption>
        </figure>

        <p className="intro__body">
          It is run entirely by students at SJI International, and it is built for anyone curious about how the world
          makes decisions, whether or not you take economics as a subject.
        </p>
      </div>
    </section>
  );
}
