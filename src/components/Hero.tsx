"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { site, registerHref } from "@/content/site";
import { asset } from "@/lib/asset";
import { useGsap, prefersReducedMotion } from "@/lib/motion";
import { onReady } from "@/lib/ready";

/**
 * Full-screen 2026 footage behind the headline. As you scroll, the footage pulls back into a
 * framed window on paper and the marker labels it, handing over to the rest of the page.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const el = root.current!;
    const v = video.current!;
    const reduce = prefersReducedMotion();
    const small = window.matchMedia("(max-width: 700px)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!reduce && !saveData) {
      v.src = asset(`/media/video/hero-reel-${small ? 720 : 1280}.mp4`);
      v.play().catch(() => {});
    }

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".hero__under path", { drawSVG: "100%" });
        return;
      }
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "power4.out" } })
        .fromTo(".hero__media", { scale: 1.18 }, { scale: 1, duration: 2.2, ease: "expo.out" }, 0)
        .fromTo(".hero__line", { yPercent: 115 }, { yPercent: 0, duration: 1.2, stagger: 0.12 }, 0.1)
        .fromTo(".hero__under path", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, ease: "power2.inOut" }, 0.75)
        .fromTo(".hero__meta > *", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.7)
        .fromTo(".hero__cue", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1.4);
      const off = onReady(() => intro.play());

      const mm = gsap.matchMedia();
      mm.add({ wide: "(min-width: 861px)", narrow: "(max-width: 860px)" }, (c) => {
        const wide = c.conditions?.wide;
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.7 } })
          .to(".hero__frame", { clipPath: wide ? "inset(17% 22% 17% 22% round 22px)" : "inset(22% 6% 30% 6% round 16px)", ease: "none" }, 0)
          .to(".hero__shade", { opacity: 0.15, ease: "none" }, 0)
          .to(".hero__copy", { yPercent: wide ? -26 : -18, autoAlpha: 0, ease: "power2.in", duration: 0.3 }, 0)
          .to(".hero__cue", { autoAlpha: 0, duration: 0.1 }, 0)
          .fromTo(".hero__note", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.45)
          .fromTo(".hero__note path", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.3, ease: "none" }, 0.5);
      });
      return () => {
        off();
        mm.revert();
      };
    }, el);
    return () => ctx.revert();
  }, [gsap]);

  return (
    <section className="hero" ref={root} aria-labelledby="hero-title" data-theme="dark">
      <div className="hero__sticky">
        <div className="hero__frame">
          <div className="hero__media">
            <video
              ref={video}
              muted
              loop
              playsInline
              preload="none"
              poster={asset("/media/video/hero-reel-poster.jpg")}
              aria-label="Footage from Econs Expo 2026: the hall, a crash course and teams at their tables"
            />
          </div>
          <div className="hero__shade" />
        </div>

        <div className="hero__copy wrap">
          <p className="eyebrow eyebrow--light hero__eyebrow">
            Econs Expo {site.edition} · {site.venue.short}
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__mask">
              <span className="hero__line">Economics,</span>
            </span>
            <span className="hero__mask">
              <span className="hero__line">
                <span className="hero__loud">
                  out loud.
                  <svg className="hero__under ink" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M 4 22 C 70 14, 160 30, 296 16 M 286 8 C 294 12, 298 16, 296 22" />
                  </svg>
                </span>
              </span>
            </span>
          </h1>
          <div className="hero__meta">
            <p className="hero__lede">
              A student-led conference where you buzz in, pitch a portfolio and steer a country through a crisis.
            </p>
            <div className="hero__row">
              <dl className="hero__facts">
                <div>
                  <dt>Date</dt>
                  <dd>
                    {site.date.short} <span className="tbc tbc--light">to be confirmed</span>
                  </dd>
                </div>
                <div>
                  <dt>Where</dt>
                  <dd>{site.venue.short}, Singapore</dd>
                </div>
                <div>
                  <dt>Who</dt>
                  <dd>Around 150 students</dd>
                </div>
              </dl>
              <div className="hero__ctas">
                <Link href={registerHref} className="btn btn--paper">
                  Register interest
                </Link>
                <Link href="/#experiences" className="btn btn--line-light">
                  The three experiences
                </Link>
              </div>
            </div>
          </div>
        </div>

        <p className="hero__cue hand" aria-hidden="true">
          scroll
          <svg className="ink" viewBox="0 0 20 40">
            <path d="M 10 2 C 12 14, 8 24, 10 36 M 4 29 L 10 37 L 16 29" />
          </svg>
        </p>

        <div className="hero__note" aria-hidden="true">
          <span className="hand">2026, in motion. This year, it’s your turn.</span>
          <svg className="ink" viewBox="0 0 160 90">
            <path d="M 6 8 C 40 4, 96 18, 120 48 C 132 62, 140 72, 150 84 M 134 82 L 151 85 L 150 68" />
          </svg>
        </div>
      </div>
    </section>
  );
}
