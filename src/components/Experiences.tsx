"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Photo } from "@/components/Photo";
import { Buzzer, Diagram, Portfolio, Shock, type Split } from "@/components/ExperienceWidgets";
import { experiences } from "@/content/site";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * The three experiences as full-screen panels that travel sideways while the section is pinned.
 * Each panel's diagram draws itself as the panel arrives. Phones and reduced motion get a stack.
 */
export function Experiences() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [time, setTime] = useState(1);
  const [split, setSplit] = useState<Split>({ equities: 40, bonds: 30, property: 20, cash: 10 });
  const [shocked, setShocked] = useState(false);
  const { gsap, ScrollTrigger } = useGsap();
  const onTime = useCallback((t: number) => setTime(t), []);

  useEffect(() => {
    const el = root.current!;
    const reduce = prefersReducedMotion();
    const draw = (i: number) => {
      if (reduce) return;
      const p = el.querySelectorAll(".xp__panel")[i];
      if (!p) return;
      gsap.fromTo(p.querySelectorAll(".diagram .d-draw, .diagram .d-line"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, stagger: 0.12, ease: "power2.inOut", overwrite: true });
      gsap.fromTo(p.querySelectorAll(".xp__reveal"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "power3.out", overwrite: true });
    };

    const mm = gsap.matchMedia();
    mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => {
      const track = el.querySelector<HTMLElement>(".xp__track")!;
      const panels = gsap.utils.toArray<HTMLElement>(".xp__panel", el);
      const dist = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: el.querySelector(".xp__pin"),
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => `+=${dist() * 1.15}`,
          invalidateOnRefresh: true,
          onUpdate: (s) => {
            gsap.set(".xp__bar path", { drawSVG: `${s.progress * 100}%` });
            setActive(Math.min(panels.length - 1, Math.round(s.progress * (panels.length - 1))));
          },
        },
      });
      panels.forEach((p, i) => {
        gsap.fromTo(
          p.querySelector(".xp__bg img"),
          { scale: 1.3, xPercent: -8 },
          { scale: 1.05, xPercent: 8, ease: "none", scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
        );
        gsap.fromTo(
          p.querySelector(".xp__num"),
          { xPercent: 40 },
          { xPercent: -40, ease: "none", scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
        );
        if (i > 0) ScrollTrigger.create({ trigger: p, containerAnimation: tween, start: "left 55%", onEnter: () => draw(i), onLeaveBack: () => draw(i - 1) });
      });
      ScrollTrigger.create({ trigger: el.querySelector(".xp__pin"), start: "top 60%", onEnter: () => draw(0) });
      return () => tween.scrollTrigger?.kill();
    });
    mm.add("(max-width: 860px), (prefers-reduced-motion: reduce)", () => {
      el.querySelectorAll(".xp__panel").forEach((p, i) => {
        ScrollTrigger.create({ trigger: p, start: "top 65%", once: true, onEnter: () => draw(i) });
      });
    });
    return () => mm.revert();
  }, [gsap, ScrollTrigger]);

  return (
    <section className="xp" id="experiences" ref={root} aria-labelledby="xp-title" data-theme="dark">
      <div className="wrap xp__head">
        <p className="eyebrow eyebrow--light">The 2027 programme · planned</p>
        <h2 id="xp-title" className="display display--xl">
          Three ways to <span className="hand xp__hand">think fast</span>
        </h2>
      </div>

      <div className="xp__pin">
        <div className="xp__track">
          {experiences.map((x, i) => (
            <article key={x.id} className={`xp__panel xp__panel--${x.id}`} aria-labelledby={`xp-${x.id}`}>
              <div className="xp__bg">
                <Photo slug={x.photo} alt={x.photoAlt} sizes="100vw" pos={x.photoPos} />
              </div>
              <span className="xp__num" aria-hidden="true">
                {x.index}
              </span>
              <div className="xp__inner wrap">
                <div className="xp__content">
                  <p className="xp__kicker hand xp__reveal">{x.kicker}</p>
                  <h3 id={`xp-${x.id}`} className="xp__title xp__reveal">
                    {x.title}
                  </h3>
                  <p className="xp__body xp__reveal">{x.body}</p>
                  <div className="xp__reveal">
                    {x.id === "buzzer" && <Buzzer onTime={onTime} />}
                    {x.id === "pitch" && <Portfolio split={split} setSplit={setSplit} />}
                    {x.id === "crisis" && <Shock shocked={shocked} setShocked={setShocked} />}
                  </div>
                </div>
                <div className="xp__diagram">
                  <Diagram id={x.id} time={time} split={split} shocked={shocked} />
                </div>
              </div>
              <p className="xp__cap hand">{x.caption}</p>
            </article>
          ))}
        </div>

        <div className="xp__progress wrap" aria-hidden="true">
          <svg className="xp__bar ink" viewBox="0 0 1000 12" preserveAspectRatio="none">
            <path d="M 2 6 C 200 2, 420 10, 640 5 C 780 2, 900 8, 998 5" />
          </svg>
          <ol>
            {experiences.map((x, i) => (
              <li key={x.id} className={i === active ? "is-on" : ""}>
                <span className="tabular">{x.index}</span> {x.title.replace("Economics ", "").replace("Economic ", "")}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
