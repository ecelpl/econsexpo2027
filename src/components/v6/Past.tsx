"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Film } from "@/components/Film";
import { SpeakerCards } from "@/components/SpeakerCards";
import { CountUp } from "@/components/CountUp";
import { edition2026 } from "@/content/site";
import { asset } from "@/lib/asset";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

/** Econs Expo 2026: the numbers, the reel in a frame, and who spoke. */
export function Past() {
  const root = useRef<HTMLElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const el = root.current!;
    const v = el.querySelector<HTMLVideoElement>(".pa__reel video")!;
    const reduce = prefersReducedMotion();
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let io: IntersectionObserver | undefined;
    if (!reduce && !saveData) {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            if (!v.src) v.src = asset(`/media/video/reel-2026-${window.matchMedia("(max-width: 700px)").matches ? 720 : 1280}.mp4`);
            v.play().catch(() => {});
          } else v.pause();
        },
        { rootMargin: "200px" },
      );
      io.observe(v);
    }
    if (reduce) return () => io?.disconnect();
    const ctx = gsap.context(() => {
      gsap.fromTo(".pa__reel", { clipPath: "inset(12% 8% 12% 8%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: ".pa__reel", start: "top 90%", end: "top 35%", scrub: 0.6 } });
      gsap.fromTo(".pa__reel video", { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".pa__reel", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".pa__stats > div", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".pa__stats", start: "top 80%" } });
    }, el);
    return () => {
      io?.disconnect();
      ctx.revert();
    };
  }, [gsap]);

  return (
    <section className="pa s6" id="2026" ref={root} aria-labelledby="pa-title">
      <div className="wrap">
        <header className="s6__head s6__head--split">
          <div>
            <p className="s6__eyebrow">Last year</p>
            <h2 id="pa-title" className="s6__title">Econs Expo 2026.</h2>
          </div>
          <dl className="pa__stats">
            <div>
              <dt>Date</dt>
              <dd className="pa__small">{edition2026.date}</dd>
            </div>
            <div>
              <dt>Students</dt>
              <dd>
                <CountUp to={Number(edition2026.participants)} />
              </dd>
            </div>
            <div>
              <dt>Guest speakers</dt>
              <dd>
                <CountUp to={edition2026.speakers.length} />
              </dd>
            </div>
          </dl>
        </header>

        <div className="pa__reel">
          <video muted loop playsInline preload="none" poster={asset("/media/video/reel-2026-poster.jpg")} aria-hidden="true" />
          <div className="pa__over">
            <Film className="pa__film">
              <span className="pa__play" aria-hidden="true" />
              <span>Watch the 2026 film (1:21, with sound)</span>
            </Film>
          </div>
        </div>

        <div className="pa__speakers" id="speakers">
          <h3 className="pa__h3">Who spoke in 2026</h3>
          <SpeakerCards />
          <p className="pa__next">The 2027 guest speakers will be announced here once they are confirmed.</p>
          <Link href="/2026/" className="b6 b6--ink">
            Photos and programme from 2026
          </Link>
        </div>
      </div>
    </section>
  );
}
