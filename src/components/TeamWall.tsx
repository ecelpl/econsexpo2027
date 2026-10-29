"use client";

import { useEffect, useRef } from "react";
import { Photo } from "@/components/Photo";
import { Portrait, ProfileProvider } from "@/components/People";
import { byGroup, groups, members } from "@/content/team";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

export function TeamWall() {
  const root = useRef<HTMLDivElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current!;
    const ctx = gsap.context(() => {
      gsap.fromTo(".tm-hero__photo", { clipPath: "inset(12% 8% 12% 8%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out" });
      gsap.to(".tm-hero__photo img", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: ".tm-hero", start: "top top", end: "bottom top", scrub: true },
      });
      el.querySelectorAll<HTMLElement>(".tm-group").forEach((g) => {
        gsap.fromTo(
          g.querySelectorAll(".portrait"),
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07, ease: "power3.out", scrollTrigger: { trigger: g, start: "top 78%" } },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [gsap]);

  return (
    <ProfileProvider>
      <div ref={root}>
        <section className="tm-hero" aria-labelledby="tm-title">
          <div className="tm-hero__photo">
            <Photo slug="committee-2027" alt="The Econs Expo 2027 committee together under the courtyard umbrellas" sizes="100vw" pos="50% 55%" priority />
          </div>
          <div className="wrap tm-hero__copy">
            <p className="eyebrow">Meet the team</p>
            <h1 id="tm-title" className="display display--xl">
              {members.length} students. <span className="hand tm-hero__hand">One very long to-do list.</span>
            </h1>
            <p className="tm-hero__body">
              Econs Expo is planned and run by students at SJI International. Choose anyone to read who they are and what
              they do.
            </p>
          </div>
        </section>

        {groups.map((g) => (
          <section key={g.id} className={`tm-group tm-group--${g.id}`} aria-labelledby={`g-${g.id}`}>
            <div className="wrap tm-group__grid">
              <header className="tm-group__head">
                <h2 id={`g-${g.id}`} className="tm-group__name">
                  {g.name}
                </h2>
                <p className="hand tm-group__blurb">{g.blurb}</p>
              </header>
              <ul className="tm-wall">
                {byGroup(g.id).map((m, i) => (
                  <li key={m.slug} style={{ ["--i" as string]: i }}>
                    <Portrait member={m} size={g.id === "core" ? "lg" : "md"} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </ProfileProvider>
  );
}
