"use client";

import Link from "next/link";
import { useContext, useEffect, useRef } from "react";
import { Photo } from "@/components/Photo";
import { ProfileProvider, OpenProfile } from "@/components/People";
import { coreTeam, members, groups } from "@/content/team";
import { asset } from "@/lib/asset";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

function Rows() {
  const open = useContext(OpenProfile);
  return (
    <ul className="crew__list">
        {coreTeam.map((m, i) => (
          <li key={m.slug}>
            <button
              type="button"
              className="crew__row"
              aria-haspopup="dialog"
              onClick={(e) => open(m, e.currentTarget)}
            >
              <span className="crew__i tabular">0{i + 1}</span>
              {m.photo && <img className="crew__thumb" src={asset(`/media/team/${m.photo}.jpg`)} alt="" width={96} height={96} loading="lazy" />}
              <span className="crew__name">{m.name}</span>
              <span className="crew__role hand">{m.role}</span>
              <svg className="crew__line ink" viewBox="0 0 1000 12" preserveAspectRatio="none" aria-hidden="true">
                <path pathLength={1} d="M 2 7 C 240 3, 520 10, 760 5 C 860 3, 940 6, 998 4" />
              </svg>
            </button>
          </li>
        ))}
    </ul>
  );
}

export function CoreTeam() {
  const root = useRef<HTMLElement>(null);
  const { gsap } = useGsap();
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current!;
    const ctx = gsap.context(() => {
      gsap.fromTo(".crew__row", { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".crew__list", start: "top 80%" } });
      gsap.fromTo(".crew__group img", { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".crew__group", start: "top bottom", end: "bottom top", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, [gsap]);

  return (
    <ProfileProvider>
      <section className="crew" ref={root} aria-labelledby="crew-title">
        <div className="wrap crew__head">
          <p className="eyebrow">The people</p>
          <h2 id="crew-title" className="display display--xl">
            Made by students, <span className="hand crew__hand">for students.</span>
          </h2>
          <p className="crew__body">
            {members.length} students across a core team and {groups.length - 1} subcommittees. Pick a name to meet them.
          </p>
        </div>
        <div className="wrap">
          <Rows />
        </div>
        <div className="wrap crew__foot">
          <figure className="crew__group">
            <Photo slug="core-2027" alt="The Econs Expo 2027 core team standing together in the SJI International courtyard" sizes="(max-width: 860px) 100vw, 60vw" pos="50% 62%" />
            <figcaption className="hand">the 2027 core team, August 2026</figcaption>
          </figure>
          <div className="crew__more">
            <p>Marketing &amp; Outreach, Finance &amp; Logistics, and Academics &amp; Creativity make it happen.</p>
            <Link href="/team/" className="btn btn--ink" data-cursor="Team">
              Meet all {members.length}
            </Link>
          </div>
        </div>
      </section>
    </ProfileProvider>
  );
}
