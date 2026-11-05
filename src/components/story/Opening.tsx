"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Photo } from "@/components/Photo";
import { SjiiLogo } from "@/components/SjiiLogo";
import { site, registerHref } from "@/content/site";
import { useGsap, prefersReducedMotion } from "@/lib/motion";
import { onReady } from "@/lib/ready";

// The graph lives in a 1000 × 700 box. Origin bottom left.
const O = { x: 90, y: 640 };
const X0 = 150;
const X1 = 900;
const SLOPE = 490 / 750;

/** Where supply (shifted up/down by sy) meets demand (shifted left/right by dx). */
function cross(dx: number, sy: number) {
  const u = (490 + sy + SLOPE * dx) / (2 * SLOPE);
  const x = X0 + u;
  return { x, y: 600 + sy - SLOPE * u };
}

const pinned = [
  { slug: "fireside", alt: "A guest speaker answers questions in the 2026 fireside chat", cap: "the fireside chat", cls: "p1", depth: 26 },
  { slug: "team-table", alt: "A team smiling at their table at Econs Expo 2026", cap: "one table, one team", cls: "p2", depth: -18 },
  { slug: "medals", alt: "Gold Econs Expo 2026 winner medals", cap: "and the medals", cls: "p3", depth: 34 },
];

/**
 * The opening: a supply and demand graph sketched in marker that follows your hand. Demand is you,
 * supply is the seats, and where they cross the marker writes "you are here".
 */
export function Opening() {
  const root = useRef<HTMLElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const el = root.current!;
    const svg = el.querySelector<SVGSVGElement>(".op__graph")!;
    const S = svg.querySelector(".op__s")!;
    const D = svg.querySelector(".op__d")!;
    const Dl = svg.querySelector(".op__dl")!;
    const Sl = svg.querySelector(".op__sl")!;
    const gx = svg.querySelector(".op__gx")!;
    const gy = svg.querySelector(".op__gy")!;
    const dot = svg.querySelector<SVGGElement>(".op__dotpos")!;
    const note = svg.querySelector<SVGGElement>(".op__here")!;
    const px = svg.querySelector<SVGTextElement>(".op__px")!;
    const qx = svg.querySelector<SVGTextElement>(".op__qx")!;
    const reduce = prefersReducedMotion();

    const state = { dx: 0, sy: 0 };
    let last = "";
    const draw = () => {
      const key = `${state.dx.toFixed(1)},${state.sy.toFixed(1)}`;
      if (key === last) return;
      last = key;
      const { dx, sy } = state;
      S.setAttribute("d", `M ${X0 - 14} ${600 + sy + 14 * SLOPE} L ${X1 + 10} ${110 + sy - 10 * SLOPE}`);
      D.setAttribute("d", `M ${X0 + dx - 14} ${110 - 14 * SLOPE} L ${X1 + dx + 10} ${600 + 10 * SLOPE}`);
      Sl.setAttribute("transform", `translate(${X1 + 22} ${118 + sy})`);
      Dl.setAttribute("transform", `translate(${X1 + dx + 22} ${606})`);
      const c = cross(dx, sy);
      gx.setAttribute("d", `M ${c.x} ${c.y} L ${c.x} ${O.y}`);
      gy.setAttribute("d", `M ${c.x} ${c.y} L ${O.x} ${c.y}`);
      dot.setAttribute("transform", `translate(${c.x} ${c.y})`);
      note.setAttribute("transform", `translate(${c.x} ${c.y})`);
      px.setAttribute("y", String(c.y + 8));
      qx.setAttribute("x", String(c.x));
    };
    draw();

    if (reduce) {
      gsap.set(el.querySelectorAll(".op__ink"), { drawSVG: "100%" });
      return;
    }

    const toDx = gsap.quickTo(state, "dx", { duration: 1.1, ease: "power3.out", onUpdate: draw });
    const toSy = gsap.quickTo(state, "sy", { duration: 1.1, ease: "power3.out", onUpdate: draw });
    const polys = Array.from(el.querySelectorAll<HTMLElement>(".op__pin")).map((p) => ({
      x: gsap.quickTo(p, "x", { duration: 1.4, ease: "power3.out" }),
      y: gsap.quickTo(p, "y", { duration: 1.4, ease: "power3.out" }),
      d: Number(p.dataset.depth),
    }));

    // With no pointer (phones, or a still mouse) the market drifts on its own.
    let idle = 0;
    let visible = true;
    const t0 = performance.now();
    const drift = () => {
      if (!visible || performance.now() - idle < 2500) return;
      const t = (performance.now() - t0) / 1000;
      toDx(Math.sin(t * 0.55) * 120);
      toSy(Math.sin(t * 0.37 + 1) * 40);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !visible) return;
      idle = performance.now();
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      toDx(nx * 340);
      toSy(ny * 130);
      polys.forEach((p) => {
        p.x(nx * p.d);
        p.y(ny * p.d);
      });
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    window.addEventListener("pointermove", move, { passive: true });
    // Phones get one demonstration sweep after the opening, then the graph rests. Desktops drift when the mouse is still.
    const touch = window.matchMedia("(hover: none)").matches;
    if (!touch) gsap.ticker.add(drift);
    const sweep = touch
      ? gsap
          .timeline({ paused: true, delay: 2.1, defaults: { ease: "sine.inOut", onUpdate: draw } })
          .to(state, { dx: -130, sy: 30, duration: 1.4 })
          .to(state, { dx: 110, sy: -25, duration: 1.6 })
          .to(state, { dx: 0, sy: 0, duration: 1.2 })
      : null;
    const offSweep = sweep ? onReady(() => sweep.play()) : () => {};

    const ctx = gsap.context(() => {
      gsap.set(".op__ink", { drawSVG: "0%" });
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "power4.out" } })
        .fromTo(".op__line", { yPercent: 115 }, { yPercent: 0, duration: 1.15, stagger: 0.1 }, 0)
        .to(".op__axes", { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" }, 0.15)
        .fromTo(".op__axtext", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.1 }, 0.7)
        .to(".op__s", { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" }, 0.55)
        .to(".op__d", { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" }, 0.75)
        .fromTo(".op__lab", { autoAlpha: 0, scale: 0.6, transformOrigin: "0% 100%" }, { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(2)" }, 1.2)
        .fromTo(".op__dot", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.6, ease: "back.out(3)" }, 1.45)
        .fromTo(".op__guide", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 1.55)
        .to(".op__here path", { drawSVG: "100%", duration: 0.6, ease: "power2.inOut" }, 1.7)
        .fromTo(".op__here text, .op__px, .op__qx", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 1.9)
        .fromTo(".op__pin", { autoAlpha: 0, yPercent: -40, rotate: (i) => [-14, 12, -10][i] }, { autoAlpha: 1, yPercent: 0, rotate: (i) => [-5, 4, -3][i], duration: 1, stagger: 0.12, ease: "back.out(1.4)" }, 0.9)
        .fromTo(".op__meta > *", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.6)
        .fromTo(".op__motto", { autoAlpha: 0, rotate: -8 }, { autoAlpha: 1, rotate: -3, duration: 0.8 }, 0.5);
      const off = onReady(() => intro.play());

      // On the way out the sheet tilts away, like turning a page in the notebook.
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 } })
        .to(".op__copy", { yPercent: -18, autoAlpha: 0.2, ease: "none" }, 0)
        .to(".op__board", touch ? { yPercent: 6, ease: "none" } : { yPercent: 10, rotate: -2, scale: 0.94, ease: "none" }, 0);
      return () => off();
    }, el);

    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", move);
      gsap.ticker.remove(drift);
      offSweep();
      sweep?.kill();
      ctx.revert();
    };
  }, [gsap]);

  return (
    <section className="op paper-grid" ref={root} aria-labelledby="op-title">
      <div className="wrap op__grid">
        <div className="op__copy">
          <p className="hand op__motto">Made by students, for students.</p>
          <h1 id="op-title" className="op__title">
            <span className="op__mask">
              <span className="op__line">Economics,</span>
            </span>
            <span className="op__mask">
              <span className="op__line op__loud">out loud.</span>
            </span>
          </h1>
          <div className="op__meta">
            <p className="op__lede">
              One day of economics, run by students. Buzz in, pitch a portfolio and steer a country through a crisis. Every market
              needs a buyer. <span className="hand">This one needs you.</span>
            </p>
            <dl className="op__facts">
              <div>
                <dt>Date</dt>
                <dd>
                  {site.date.short} <span className="tbc">to be confirmed</span>
                </dd>
              </div>
              <div>
                <dt>Who</dt>
                <dd>Around 150 students</dd>
              </div>
            </dl>
            <div className="op__ctas">
              <Link href={registerHref} className="btn btn--ink">
                Register interest
              </Link>
              <a href="#story" className="btn btn--line">
                Follow the story
              </a>
            </div>
            <div className="op__host">
              <span>Hosted by</span>
              <SjiiLogo />
            </div>
          </div>
        </div>

        <div className="op__board">
          {pinned.map((p) => (
            <figure key={p.slug} className={`op__pin ${p.cls}`} data-depth={p.depth}>
              <span className="op__tape" aria-hidden="true" />
              <Photo slug={p.slug} alt={p.alt} sizes="(max-width: 860px) 40vw, 18vw" />
              <figcaption className="hand">2026 · {p.cap}</figcaption>
            </figure>
          ))}
          <svg className="op__graph ink" viewBox="0 0 1000 700" role="img" aria-labelledby="op-graph-t">
            <title id="op-graph-t">
              A sketched supply and demand graph. Supply is the seats at Econs Expo, demand is you, and where they cross is marked
              “you are here”.
            </title>
            <path className="op__ink op__axes" d={`M ${O.x} 30 L ${O.x} ${O.y} L 970 ${O.y} M ${O.x - 10} 44 L ${O.x} 28 L ${O.x + 10} 44 M 956 ${O.y - 10} L 972 ${O.y} L 956 ${O.y + 10}`} />
            <text className="op__axtext" x={O.x - 18} y={34} textAnchor="end">price</text>
            <text className="op__axtext" x={968} y={O.y + 40} textAnchor="end">quantity</text>
            <path className="op__guide op__gx" />
            <path className="op__guide op__gy" />
            <path className="op__ink op__s" />
            <path className="op__ink op__d" />
            <g className="op__sl">
              <text className="op__lab" x={0} y={0}>S <tspan className="op__sub">seats</tspan></text>
            </g>
            <g className="op__dl">
              <text className="op__lab" x={0} y={0}>D <tspan className="op__sub">you</tspan></text>
            </g>
            <text className="op__px" x={O.x - 14} textAnchor="end">P*</text>
            <text className="op__qx" y={O.y + 40} textAnchor="middle">Q*</text>
            <g className="op__here">
              <path className="op__ink" d="M 22 -26 C 50 -70, 96 -92, 150 -96 M 22 -26 L 26 -48 M 22 -26 L 44 -34" />
              <text x={160} y={-88}>you are here</text>
            </g>
            <g className="op__dotpos">
              <g className="op__dot">
                <circle r={13} className="op__dot-fill" />
                <circle r={14} className="op__dot-ring">
                  <animate attributeName="r" values="14;38" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0" dur="2.2s" repeatCount="indefinite" />
                </circle>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <p className="op__cue hand" aria-hidden="true">
        <span className="op__cue-m">move your mouse, then scroll</span>
        <span className="op__cue-t">scroll to follow the story</span>
      </p>
    </section>
  );
}
