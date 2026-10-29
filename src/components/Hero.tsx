"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Photo } from "@/components/Photo";
import { site, registerHref } from "@/content/site";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

// Where the marker tip sits in the whiteboard photo, as fractions of the 3:2 frame.
const PEN_TIP = { x: 0.653, y: 0.606 };
const IMG_RATIO = 3 / 2;

/** Maps a point in an object-fit: cover image to coordinates inside `box`. */
function coverPoint(img: HTMLImageElement, box: DOMRect) {
  const r = img.getBoundingClientRect();
  const [px, py] = getComputedStyle(img)
    .objectPosition.split(" ")
    .map((v) => parseFloat(v) / 100);
  const h = Math.max(r.width / IMG_RATIO, r.height);
  const w = h * IMG_RATIO;
  const ox = (r.width - w) * px;
  const oy = (r.height - h) * py;
  return { x: r.left - box.left + ox + PEN_TIP.x * w, y: r.top - box.top + oy + PEN_TIP.y * h };
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const el = root.current!;
    const svg = el.querySelector<SVGSVGElement>(".hero__ink")!;
    const path = svg.querySelector<SVGPathElement>("path")!;
    const img = el.querySelector<HTMLImageElement>(".hero__photo img")!;
    const word = el.querySelector<HTMLElement>(".hero__loud")!;
    const reduce = prefersReducedMotion();

    const layout = () => {
      const box = el.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      const tip = coverPoint(img, box);
      // Measure the line's mask, which never moves, so the reveal animation can't skew the result.
      const m = word.closest(".hero__mask")!.getBoundingClientRect();
      const y = m.bottom - box.top - m.height * 0.04;
      const x1 = m.left - box.left;
      const x2 = x1 + word.offsetWidth;
      const stacked = tip.y < m.top - box.top; // phone layout: photo sits above the headline
      const lead = stacked
        ? `M ${tip.x} ${tip.y} C ${tip.x + 30} ${tip.y + 90}, ${x2 + 20} ${y - 90}, ${x2 + 4} ${y - 4}`
        : `M ${tip.x} ${tip.y} C ${tip.x - 60} ${tip.y + 70}, ${x2 + 160} ${y + 26}, ${x2 + 6} ${y}`;
      const span = x2 - x1;
      const under = ` C ${x2 - span * 0.35} ${y - 7}, ${x1 + span * 0.4} ${y + 9}, ${x1 - 6} ${y + 1} l 22 -10`;
      path.setAttribute("d", lead + under);
    };

    const ctx = gsap.context(() => {}, el);
    const start = () => {
      layout();
      if (reduce) {
        gsap.set(path, { drawSVG: "100%" });
        return;
      }
      ctx.add(() => gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".hero__photo", { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 1.3, ease: "expo.inOut" }, 0)
        .fromTo(".hero__photo img", { scale: 1.12 }, { scale: 1, duration: 1.8 }, 0)
        .fromTo(".hero__line", { yPercent: 105 }, { yPercent: 0, duration: 1.1, stagger: 0.09 }, 0.35)
        .fromTo(".hero__meta > *", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.8)
        .fromTo(path, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.5, ease: "power2.inOut" }, 1.25)
        .fromTo(".hero__cap", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1.4));
    };

    let ro: ResizeObserver | undefined;
    document.fonts.ready.then(() => {
      if (img.complete) start();
      else img.addEventListener("load", start, { once: true });
      ro = new ResizeObserver(layout);
      ro.observe(el);
    });

    // Drift the photo slightly slower than the page as it leaves.
    if (!reduce)
      ctx.add(() =>
        gsap.to(".hero__photo img", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        }),
      );

    return () => {
      ctx.revert();
      ro?.disconnect();
    };
  }, [gsap]);

  return (
    <section className="hero" ref={root} aria-labelledby="hero-title">
      <div className="hero__photo">
        <Photo
          slug="whiteboard"
          alt="A student draws cost curves on the whiteboard during a 2026 crash course"
          sizes="(max-width: 860px) 100vw, 62vw"
          pos="70% 50%"
          priority
        />
        <p className="hero__cap hand">2026 · crash course, costs of production</p>
      </div>

      <div className="hero__copy wrap">
        <h1 id="hero-title" className="hero__title">
          <span className="hero__mask">
            <span className="hero__line">Economics,</span>
          </span>
          <span className="hero__mask">
            <span className="hero__line">
              <span className="hero__loud">out loud.</span>
            </span>
          </span>
        </h1>
        <div className="hero__meta">
          <p className="hero__lede">
            Econs Expo {site.edition} is a student-led conference at {site.venue.short} where you buzz in, pitch a
            portfolio and steer a country through a crisis.
          </p>
          <dl className="hero__facts">
            <div>
              <dt>Date</dt>
              <dd>
                {site.date.short} <span className="tbc">to be confirmed</span>
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
            <Link href={registerHref} className="btn btn--ink">
              Register interest
            </Link>
            <Link href="/#experiences" className="btn btn--line">
              See the three experiences
            </Link>
          </div>
        </div>
      </div>

      <svg className="hero__ink ink" aria-hidden="true">
        <path />
      </svg>
    </section>
  );
}
