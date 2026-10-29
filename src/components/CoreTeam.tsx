"use client";

import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { Photo } from "@/components/Photo";
import { ProfileProvider, OpenProfile } from "@/components/People";
import { coreTeam, members, groups, type Member } from "@/content/team";
import { asset } from "@/lib/asset";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

function Rows() {
  const open = useContext(OpenProfile);
  const list = useRef<HTMLUListElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Member | null>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const f = float.current!;
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    const x = gsap.quickTo(f, "x", { duration: 0.55, ease: "power3.out" });
    const y = gsap.quickTo(f, "y", { duration: 0.55, ease: "power3.out" });
    const r = gsap.quickTo(f, "rotate", { duration: 0.8, ease: "power3.out" });
    let lx = 0;
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      r(gsap.utils.clamp(-10, 10, (e.clientX - lx) * 0.6));
      lx = e.clientX;
    };
    const l = list.current!;
    l.addEventListener("pointermove", move);
    return () => l.removeEventListener("pointermove", move);
  }, [gsap]);

  useEffect(() => {
    const f = float.current!;
    gsap.to(f, { autoAlpha: hover ? 1 : 0, scale: hover ? 1 : 0.85, duration: 0.35, ease: "power3.out" });
  }, [hover, gsap]);

  return (
    <>
      <ul className="crew__list" ref={list} onPointerLeave={() => setHover(null)}>
        {coreTeam.map((m, i) => (
          <li key={m.slug}>
            <button
              type="button"
              className="crew__row"
              aria-haspopup="dialog"
              data-cursor="Meet"
              onPointerEnter={() => setHover(m)}
              onFocus={() => setHover(null)}
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
      <div className="crew__float" ref={float} aria-hidden="true">
        {coreTeam.map((m) => (
          <img key={m.slug} src={asset(`/media/team/${m.photo}.jpg`)} alt="" width={480} height={480} className={hover?.slug === m.slug ? "is-on" : ""} />
        ))}
        <svg className="ink" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 52 3 C 82 2, 98 24, 97 50 C 96 79, 74 97, 48 97 C 20 97, 3 76, 3 49 C 3 24, 22 5, 46 4 C 58 3, 66 6, 72 10" />
        </svg>
      </div>
    </>
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
            Run by students, <span className="hand crew__hand">start to finish.</span>
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
