"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Photo } from "@/components/Photo";
import { experiences } from "@/content/site";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

/* ---------- Buzzer: a playable sample question ---------- */

const QUESTION = {
  prompt: "Bubble tea goes up 10% in price and cups sold fall 25%. Is demand elastic or inelastic?",
  options: ["Elastic", "Inelastic"],
  answer: "Elastic",
  why: "Quantity fell 25% for a 10% price rise, so price elasticity is −2.5. Anything bigger than 1 in size is elastic.",
};

function Buzzer({ onTime }: { onTime: (t: number) => void }) {
  const [state, setState] = useState<"idle" | "live" | "done">("idle");
  const [left, setLeft] = useState(10);
  const [pick, setPick] = useState<string | null>(null);

  useEffect(() => {
    if (state !== "live") return;
    const t0 = performance.now();
    const id = window.setInterval(() => {
      const t = Math.max(0, 10 - (performance.now() - t0) / 1000);
      setLeft(t);
      onTime(t / 10);
      if (t <= 0) setState("done");
    }, 50);
    return () => window.clearInterval(id);
  }, [state, onTime]);

  const reset = () => {
    setPick(null);
    setLeft(10);
    onTime(1);
    setState("live");
  };

  return (
    <div className="widget buzzer">
      <p className="widget__label">Sample question · not from the competition</p>
      {state === "idle" ? (
        <button className="btn btn--ink" onClick={reset}>
          Try a 10-second round
        </button>
      ) : (
        <>
          <p className="buzzer__q">{QUESTION.prompt}</p>
          <div className="buzzer__opts" role="group" aria-label="Answers">
            {QUESTION.options.map((o) => (
              <button
                key={o}
                className={`buzzer__opt${pick === o ? (o === QUESTION.answer ? " is-right" : " is-wrong") : ""}`}
                disabled={state === "done"}
                onClick={() => {
                  setPick(o);
                  setState("done");
                }}
              >
                {o}
              </button>
            ))}
          </div>
          <p className="buzzer__status" aria-live="polite">
            {state === "live" && <span className="tabular">{left.toFixed(1)}s</span>}
            {state === "done" &&
              (pick === null
                ? `Time's up. ${QUESTION.why}`
                : pick === QUESTION.answer
                  ? `Correct. ${QUESTION.why}`
                  : `Not quite. ${QUESTION.why}`)}
          </p>
          {state === "done" && (
            <button className="link" onClick={reset}>
              Go again
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ---------- Investment Pitch: split a hypothetical $1,000,000 ---------- */

const ASSETS = [
  { key: "equities", label: "Equities" },
  { key: "bonds", label: "Bonds" },
  { key: "property", label: "Property" },
  { key: "cash", label: "Cash" },
] as const;

type Split = Record<(typeof ASSETS)[number]["key"], number>;

function Portfolio({ split, setSplit }: { split: Split; setSplit: (s: Split) => void }) {
  const total = Object.values(split).reduce((a, b) => a + b, 0);
  const fmt = (n: number) => `$${(n * 10_000).toLocaleString("en-SG")}`;
  return (
    <div className="widget portfolio">
      <p className="widget__label">Illustrative only · no returns are simulated</p>
      {ASSETS.map((a) => (
        <label key={a.key} className="portfolio__row">
          <span>{a.label}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={split[a.key]}
            onChange={(e) => {
              const v = Number(e.target.value);
              const others = total - split[a.key];
              setSplit({ ...split, [a.key]: Math.min(v, 100 - others) });
            }}
            aria-valuetext={`${split[a.key]}%, ${fmt(split[a.key])}`}
          />
          <span className="tabular">{fmt(split[a.key])}</span>
        </label>
      ))}
      <p className="portfolio__total" aria-live="polite">
        {total === 100 ? "Fully invested. Now defend it to the judges." : `${fmt(100 - total)} still to allocate`}
      </p>
    </div>
  );
}

/* ---------- Crisis: apply a supply shock ---------- */

function Shock({ shocked, setShocked }: { shocked: boolean; setShocked: (b: boolean) => void }) {
  return (
    <div className="widget">
      <p className="widget__label">Example shock · illustrative</p>
      <p className="shock__q">A key import is suddenly cut off. What happens to prices at home?</p>
      <button className="btn btn--red" aria-pressed={shocked} onClick={() => setShocked(!shocked)}>
        {shocked ? "Undo the shock" : "Apply the shock"}
      </button>
      <p className="shock__a" aria-live="polite">
        {shocked ? "Supply shifts left from S to S₁. Prices rise and less is traded. Your move, minister." : " "}
      </p>
    </div>
  );
}

/* ---------- Ink diagrams drawn over each photo ---------- */

function Diagram({ id, time, split, shocked }: { id: string; time: number; split: Split; shocked: boolean }) {
  if (id === "buzzer") {
    const c = 2 * Math.PI * 70;
    return (
      <svg className="diagram ink ink--halo" viewBox="0 0 400 300" aria-hidden="true">
        <circle cx="300" cy="96" r="70" className="d-faint" />
        <circle
          cx="300"
          cy="96"
          r="70"
          className="d-live"
          style={{ strokeDasharray: c, strokeDashoffset: c * (1 - time), transform: "rotate(-90deg)", transformOrigin: "300px 96px" }}
        />
        <text x="300" y="108" textAnchor="middle" className="d-big">
          {Math.ceil(time * 10)}s
        </text>
        <path className="d-draw" d="M 228 170 C 250 200, 210 228, 186 222 l 12 -14 m -12 14 l 18 6" />
      </svg>
    );
  }
  if (id === "pitch") {
    // A hand-drawn pie whose slices follow the sliders.
    let a0 = -Math.PI / 2;
    const r = 78;
    const cx = 262;
    const cy = 112;
    const slices = ASSETS.map((a) => {
      const f = split[a.key] / 100;
      const a1 = a0 + f * 2 * Math.PI;
      const p = { key: a.key, x: cx + r * Math.cos(a0), y: cy + r * Math.sin(a0), mid: (a0 + a1) / 2, f, label: a.label };
      a0 = a1;
      return p;
    });
    return (
      <svg className="diagram ink ink--halo" viewBox="0 0 400 300" aria-hidden="true">
        <circle cx={cx} cy={cy} r={r} className="d-draw" />
        {slices.map((s) => (
          <g key={s.key}>
            {s.f > 0 && s.f < 1 && <line x1={cx} y1={cy} x2={s.x} y2={s.y} className="d-line" />}
            {s.f >= 0.1 && (
              <text x={cx + (r + 26) * Math.cos(s.mid)} y={cy + (r + 26) * Math.sin(s.mid) + 6} textAnchor="middle" className="d-note">
                {Math.round(s.f * 100)}%
              </text>
            )}
          </g>
        ))}
        <text x={cx} y={cy + r + 52} textAnchor="middle" className="d-note">
          $1,000,000
        </text>
      </svg>
    );
  }
  return (
    <svg className="diagram ink ink--halo" viewBox="0 0 400 300" aria-hidden="true">
      <path className="d-draw" d="M 190 40 L 190 250 L 380 250" />
      <text x="176" y="52" className="d-note" textAnchor="end">P</text>
      <text x="380" y="276" className="d-note" textAnchor="end">Q</text>
      <path className="d-line" d="M 214 86 L 364 226" />
      <text x="366" y="222" className="d-note">D</text>
      <path className="d-line" d="M 214 230 L 364 92" style={{ opacity: shocked ? 0.35 : 1 }} />
      <text x="366" y="90" className="d-note">S</text>
      <g className="d-shift" style={{ transform: shocked ? "translateX(-56px)" : "translateX(0)", opacity: shocked ? 1 : 0 }}>
        <path className="d-red" d="M 214 230 L 364 92" />
        <text x="366" y="90" className="d-note d-note--red">S₁</text>
      </g>
      <path className="d-red d-arrow" d="M 330 150 C 316 140, 300 140, 284 150 l 10 -2 m -10 2 l 4 9" style={{ opacity: shocked ? 1 : 0 }} />
    </svg>
  );
}

/* ---------- The pinned chapter ---------- */

export function Experiences() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [time, setTime] = useState(1);
  const [split, setSplit] = useState<Split>({ equities: 40, bonds: 30, property: 20, cash: 10 });
  const [shocked, setShocked] = useState(false);
  const { gsap, ScrollTrigger } = useGsap();

  useEffect(() => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => {
      const st = ScrollTrigger.create({
        trigger: el.querySelector(".xp__track"),
        start: "top top",
        end: "bottom bottom",
        onUpdate: (s) => setActive(Math.min(2, Math.floor(s.progress * 3))),
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, [gsap, ScrollTrigger]);

  // Redraw the ink each time the chapter changes.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current!;
    const draws = el.querySelectorAll(`.xp__frame[data-i="${active}"] .d-draw, .xp__frame[data-i="${active}"] .d-line`);
    gsap.fromTo(draws, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, stagger: 0.12, ease: "power2.inOut" });
  }, [active, gsap]);

  const onTime = useMemo(() => (t: number) => setTime(t), []);

  const jump = (i: number) => {
    const track = root.current!.querySelector<HTMLElement>(".xp__track")!;
    if (window.matchMedia("(max-width: 860px)").matches) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const span = track.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + 0.5) / 3), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <section className="xp" id="experiences" ref={root} aria-labelledby="xp-title">
      <div className="wrap xp__head">
        <p className="eyebrow">The 2027 programme · planned</p>
        <h2 id="xp-title" className="display">
          Three ways to <span className="hand xp__hand">think fast</span>
        </h2>
      </div>

      <div className="xp__track">
        <div className="xp__pin wrap">
          <div className="xp__frames">
            {experiences.map((x, i) => (
              <figure key={x.id} className={`xp__frame${i === active ? " is-on" : ""}${i < active ? " is-past" : ""}`} data-i={i}>
                <Photo slug={x.photo} alt={x.photoAlt} sizes="(max-width: 860px) 100vw, 55vw" pos={x.photoPos} />
                <Diagram id={x.id} time={time} split={split} shocked={shocked} />
                <figcaption className="hand">{x.caption}</figcaption>
              </figure>
            ))}
          </div>

          <ol className="xp__steps">
            {experiences.map((x, i) => (
              <li key={x.id} className={`xp__step${i === active ? " is-on" : ""}`}>
                <button className="xp__tab" onClick={() => jump(i)} aria-current={i === active ? "step" : undefined}>
                  <span className="xp__num tabular">{x.index}</span>
                  <span className="xp__title">{x.title}</span>
                </button>
                <div className="xp__detail">
                  <p className="xp__kicker hand">{x.kicker}</p>
                  <p className="xp__body">{x.body}</p>
                  <div className="xp__mobile-photo">
                    <Photo slug={x.photo} alt="" sizes="100vw" pos={x.photoPos} />
                    <Diagram id={x.id} time={time} split={split} shocked={shocked} />
                    <span className="hand">{x.caption}</span>
                  </div>
                  {x.id === "buzzer" && <Buzzer onTime={onTime} />}
                  {x.id === "pitch" && <Portfolio split={split} setSplit={setSplit} />}
                  {x.id === "crisis" && <Shock shocked={shocked} setShocked={setShocked} />}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
