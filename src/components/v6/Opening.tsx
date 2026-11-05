"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Symbol } from "@/components/v6/Symbol";
import { SjiiLogo } from "@/components/SjiiLogo";
import { site, registerHref } from "@/content/site";
import { asset } from "@/lib/asset";
import { useGsap, prefersReducedMotion } from "@/lib/motion";
import { onReady } from "@/lib/ready";

/**
 * One symbol to open the site. It draws itself on a plain page, then, as you scroll, steps back
 * while the 2026 footage opens up behind it and the facts arrive.
 */
export function Opening() {
  const root = useRef<HTMLElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const el = root.current!;
    const v = el.querySelector<HTMLVideoElement>(".o6__frame video")!;
    const reduce = prefersReducedMotion();
    const small = window.matchMedia("(max-width: 700px)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let io: IntersectionObserver | undefined;
    if (!reduce && !saveData) {
      v.src = asset(`/media/video/hero-reel-${small ? 720 : 1280}.mp4`);
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
      io.observe(el);
    }
    if (reduce) {
      gsap.set(el.querySelectorAll(".sym path"), { drawSVG: "100%" });
      return () => io?.disconnect();
    }

    const ctx = gsap.context(() => {
      gsap.set(".o6__mark .sym path", { drawSVG: "0%" });
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "power3.inOut" } })
        .to(".o6__mark .sym__axes", { drawSVG: "100%", duration: 0.9 }, 0.1)
        .to(".o6__mark .sym__d", { drawSVG: "100%", duration: 0.7 }, 0.55)
        .to(".o6__mark .sym__s", { drawSVG: "100%", duration: 0.7 }, 0.75)
        .fromTo(".o6__mark .sym__dot", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.6, ease: "back.out(2.6)" }, 1.25)
        .fromTo(".o6__word", { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.08 }, 1.2)
        .fromTo(".o6__sub, .o6__cue", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" }, 1.6);
      const off = onReady(() => intro.play());

      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 } })
        .to(".o6__cue", { autoAlpha: 0, duration: 0.05 }, 0)
        .to(".o6__mark", { scale: 0.7, yPercent: -12, autoAlpha: 0, ease: "power2.in", duration: 0.32 }, 0)
        .fromTo(".o6__frame", { clipPath: small ? "inset(50% 50% 50% 50%)" : "inset(50% 50% 50% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 0.5 }, 0.05)
        .fromTo(".o6__frame video", { scale: 1.25 }, { scale: 1, ease: "none", duration: 0.7 }, 0.05)
        .fromTo(".o6__line", { yPercent: 110 }, { yPercent: 0, stagger: 0.04, duration: 0.2, ease: "power3.out" }, 0.5)
        .fromTo(".o6__meta > *", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.03, duration: 0.18, ease: "power2.out" }, 0.6)
        .to({}, { duration: 0.15 });
      return () => off();
    }, el);
    return () => {
      io?.disconnect();
      ctx.revert();
    };
  }, [gsap]);

  return (
    <section className="o6" ref={root} aria-labelledby="o6-title">
      <div className="o6__sticky">
        <div className="o6__frame" aria-hidden="true">
          <video muted loop playsInline preload="none" poster={asset("/media/video/hero-reel-poster.jpg")} />
          <div className="o6__veil" />
        </div>

        <div className="o6__mark">
          <Symbol title="Econs Expo symbol: supply and demand meeting at one point" />
          <p className="o6__name" aria-hidden="true">
            <span className="o6__mask">
              <span className="o6__word">Econs Expo</span>
            </span>
            <span className="o6__mask">
              <span className="o6__word o6__year">2027</span>
            </span>
          </p>
          <p className="o6__sub">Made by students, for students.</p>
        </div>

        <div className="wrap o6__copy">
          <h1 id="o6-title" className="o6__title">
            <span className="sr">Econs Expo {site.edition}. </span>
            <span className="o6__mask">
              <span className="o6__line">Economics,</span>
            </span>
            <span className="o6__mask">
              <span className="o6__line">out loud.</span>
            </span>
          </h1>
          <div className="o6__meta">
            <p className="o6__lede">
              A one-day economics conference for students from schools across Singapore, planned and run by students at SJI International.
            </p>
            <dl className="o6__facts">
              <div>
                <dt>Date</dt>
                <dd>
                  {site.date.label} <span className="o6__tbc">(to be confirmed)</span>
                </dd>
              </div>
              <div>
                <dt>Venue</dt>
                <dd>{site.venue.short}, Singapore</dd>
              </div>
              <div>
                <dt>Expected</dt>
                <dd>Around 150 students</dd>
              </div>
            </dl>
            <div className="o6__ctas">
              <Link href={registerHref} className="b6 b6--light">
                Register interest
              </Link>
              <a href="#events" className="b6 b6--ghost-light">
                See the events
              </a>
            </div>
            <div className="o6__host">
              <span>Hosted by</span>
              <SjiiLogo />
            </div>
          </div>
        </div>

        <p className="o6__cue" aria-hidden="true">
          Scroll
          <span className="o6__cue-line" />
        </p>
      </div>
    </section>
  );
}
