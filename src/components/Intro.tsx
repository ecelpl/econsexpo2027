"use client";

import { useEffect, useRef } from "react";
import { Photo } from "@/components/Photo";
import { Curves } from "@/components/Curves";
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

// Where the marker tip sits in the whiteboard photo, as fractions of the 3:2 frame.
const PEN_TIP = { x: 0.653, y: 0.606 };
const IMG_RATIO = 3 / 2;

/** Maps the pen tip in an object-fit: cover image to coordinates inside `box`. */
function penPoint(img: HTMLImageElement, box: DOMRect) {
  const r = img.getBoundingClientRect();
  const [px, py] = getComputedStyle(img)
    .objectPosition.split(" ")
    .map((v) => parseFloat(v) / 100);
  const h = Math.max(r.width / IMG_RATIO, r.height);
  const w = h * IMG_RATIO;
  return {
    x: r.left - box.left + (r.width - w) * px + PEN_TIP.x * w,
    y: r.top - box.top + (r.height - h) * py + PEN_TIP.y * h,
  };
}

export function Intro() {
  const root = useRef<HTMLElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const el = root.current!;
    const svg = el.querySelector<SVGSVGElement>(".intro__pen")!;
    const pen = svg.querySelector("path")!;
    const img = el.querySelector<HTMLImageElement>(".intro__board img")!;
    const word = el.querySelector<HTMLElement>(".intro__use")!;
    const reduce = prefersReducedMotion();

    // The line leaves her marker and underlines the word "use".
    const layout = () => {
      const box = el.querySelector(".intro__stage")!.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      const tip = penPoint(img, box);
      const w = word.getBoundingClientRect();
      const y = w.bottom - box.top + 2;
      const x1 = w.left - box.left - 4;
      const x2 = w.right - box.left + 6;
      const beside = w.left - box.left > tip.x; // desktop: text sits right of the photo
      const lead = beside
        ? `M ${tip.x} ${tip.y} C ${tip.x + 120} ${tip.y + 40}, ${x1 - 140} ${y + 70}, ${x1} ${y}`
        : `M ${tip.x} ${tip.y} C ${tip.x + 60} ${tip.y + 80}, ${x2 + 40} ${y - 60}, ${x1} ${y}`;
      pen.setAttribute("d", `${lead} C ${x1 + 20} ${y - 3}, ${x2 - 20} ${y + 3}, ${x2} ${y - 2}`);
    };

    const ctx = gsap.context(() => {
      const paths = el.querySelectorAll<SVGPathElement>(".mark__ink path");
      const notes = el.querySelectorAll<HTMLElement>(".mark__note");
      if (reduce) {
        gsap.set([paths, pen], { drawSVG: "100%" });
        gsap.set(notes, { autoAlpha: 1 });
        return;
      }
      gsap.set([paths, pen], { drawSVG: "0%" });
      gsap.set(notes, { autoAlpha: 0, y: 6 });
      gsap.to(pen, {
        drawSVG: "100%",
        ease: "none",
        scrollTrigger: { trigger: ".intro__stage", start: "top 62%", end: "top 12%", scrub: 0.6 },
      });
      el.querySelectorAll<HTMLElement>(".mark").forEach((m) => {
        gsap
          .timeline({ scrollTrigger: { trigger: m, start: "top 70%", toggleActions: "play none none reverse" } })
          .to(m.querySelector(".mark__ink path"), { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" })
          .to(m.querySelector(".mark__note"), { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.3");
      });
      el.querySelectorAll<HTMLElement>("[data-speed]").forEach((p) => {
        gsap.fromTo(
          p,
          { yPercent: Number(p.dataset.speed) },
          { yPercent: -Number(p.dataset.speed), ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      gsap.fromTo(
        ".intro__board img",
        { scale: 1.15 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: ".intro__board", start: "top bottom", end: "bottom top", scrub: true } },
      );
    }, el);

    let ro: ResizeObserver | undefined;
    document.fonts.ready.then(() => {
      layout();
      ro = new ResizeObserver(layout);
      ro.observe(el);
    });
    img.addEventListener("load", layout);
    return () => {
      ctx.revert();
      ro?.disconnect();
      img.removeEventListener("load", layout);
    };
  }, [gsap]);

  return (
    <section className="intro paper-grid" ref={root} aria-labelledby="intro-title">
      <Curves />
      <div className="wrap intro__stage">
        <figure className="intro__board">
          <Photo
            slug="whiteboard"
            alt="A student draws cost curves on the whiteboard during a 2026 crash course"
            sizes="(max-width: 860px) 100vw, 40vw"
            pos="68% 50%"
          />
          <figcaption className="hand">2026 · crash course, costs of production</figcaption>
        </figure>

        <div className="intro__text">
          <p className="eyebrow intro__eyebrow">Why Econs Expo</p>
          <h2 id="intro-title" className="intro__statement">
            Economics gets interesting the moment you have to <em className="intro__use">use</em> it. For one day,
            students from schools across Singapore take the ideas behind{" "}
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
          <p className="intro__body">
            It is run entirely by students at SJI International, and it is built for anyone curious about how the world
            makes decisions, whether or not you take economics as a subject.
          </p>
        </div>
        <svg className="intro__pen ink" aria-hidden="true">
          <path />
        </svg>
      </div>

      <div className="wrap intro__strip">
        <figure className="intro__ph intro__ph--a" data-speed="8">
          <Photo slug="team-table" alt="A team of six students smiling at their table, laptops open, at Econs Expo 2026" sizes="(max-width: 860px) 70vw, 34vw" pos="50% 60%" />
          <figcaption className="hand">one table, one team</figcaption>
        </figure>
        <figure className="intro__ph intro__ph--b" data-speed="18">
          <Photo slug="briefing" alt="A delegate reads the crisis briefing booklet" sizes="(max-width: 860px) 50vw, 22vw" pos="40% 50%" />
          <figcaption className="hand">reading the brief</figcaption>
        </figure>
        <figure className="intro__ph intro__ph--c" data-speed="4">
          <Photo slug="panel" alt="Guest speakers in conversation on stage in front of students, 2026" sizes="(max-width: 860px) 70vw, 30vw" />
          <figcaption className="hand">the 2026 guest panel</figcaption>
        </figure>
      </div>
    </section>
  );
}
