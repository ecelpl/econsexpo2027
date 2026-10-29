"use client";

import { useEffect, useRef } from "react";
import { Photo } from "@/components/Photo";
import { Loop } from "@/components/Loop";
import { edition2026 } from "@/content/site";
import { asset } from "@/lib/asset";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

type Item =
  | { kind: "photo"; slug: string; alt: string; cap: string; pos?: string; speed: number; cls: string }
  | { kind: "loop"; slug: string; alt: string; cap: string; speed: number; cls: string };

// An archive to wander through: captioned frames at different depths, not a grid.
const items: Item[] = [
  { kind: "loop", slug: "hall", alt: "The 2026 hall filling with students", cap: "the hall fills", speed: 6, cls: "r1" },
  { kind: "photo", slug: "fireside", alt: "A guest speaker answers questions in the 2026 fireside chat", cap: "the fireside chat", pos: "40% 50%", speed: 18, cls: "r2" },
  { kind: "photo", slug: "speaker-chat", alt: "Guest speakers talking with organisers between sessions", cap: "between sessions", speed: 10, cls: "r3" },
  { kind: "loop", slug: "board", alt: "A student drawing cost curves on a whiteboard", cap: "crash course", speed: 24, cls: "r4" },
  { kind: "photo", slug: "workshop", alt: "Students working in a crowded hall", cap: "heads down", pos: "50% 60%", speed: 4, cls: "r5" },
  { kind: "loop", slug: "tables", alt: "Teams working at their tables", cap: "at the tables", speed: 14, cls: "r6" },
  { kind: "photo", slug: "friends", alt: "Five students posing together on the walkway", cap: "on the walkway", pos: "50% 40%", speed: 20, cls: "r7" },
  { kind: "photo", slug: "medals", alt: "A handful of gold medals on red, white and blue ribbons", cap: "medals", speed: 8, cls: "r8" },
  { kind: "photo", slug: "thank-you", alt: "Closing slide reading Thank you for attending Econs Expo 2026", cap: "see you next year", speed: 16, cls: "r9" },
];

export function Retrospective() {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLDialogElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current!;
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>(".retro__item").forEach((it) => {
        gsap.fromTo(
          it,
          { y: Number(it.dataset.speed) * 6 },
          { y: -Number(it.dataset.speed) * 6, ease: "none", scrollTrigger: { trigger: it, start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.fromTo(
          it.querySelector(".retro__media"),
          { clipPath: "inset(18% 12% 18% 12%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: { trigger: it, start: "top 92%", end: "top 45%", scrub: true } },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [gsap]);

  const openFilm = () => {
    film.current?.showModal();
    film.current?.querySelector("video")?.play().catch(() => {});
  };
  const closeFilm = () => {
    film.current?.querySelector("video")?.pause();
    film.current?.close();
  };

  return (
    <section className="retro" id="2026" ref={root} aria-labelledby="retro-title">
      <div className="wrap retro__head">
        <p className="eyebrow">Previous edition</p>
        <h2 id="retro-title" className="display">
          Last time, <span className="hand retro__hand">in 2026</span>
        </h2>
        <dl className="retro__stats">
          <div>
            <dt>When</dt>
            <dd>{edition2026.date}</dd>
          </div>
          <div>
            <dt>Students</dt>
            <dd className="tabular">{edition2026.participants}</dd>
          </div>
          <div>
            <dt>Guest speakers</dt>
            <dd className="tabular">{edition2026.speakers.length}</dd>
          </div>
        </dl>
        <button className="btn btn--ink retro__film" onClick={openFilm}>
          <span aria-hidden="true" className="play" /> Watch the 2026 film
        </button>
      </div>

      <div className="wrap retro__field">
        {items.map((it) => (
          <figure key={it.slug + it.cls} className={`retro__item ${it.cls}`} data-speed={it.speed}>
            <div className="retro__media">
              {it.kind === "photo" ? (
                <Photo slug={it.slug} alt={it.alt} sizes="(max-width: 860px) 70vw, 34vw" pos={it.pos} />
              ) : (
                <Loop slug={it.slug} label={it.alt} />
              )}
            </div>
            <figcaption className="hand">{it.cap}</figcaption>
          </figure>
        ))}
      </div>

      <div className="wrap retro__speakers">
        <h3 className="eyebrow">2026 guest speakers</h3>
        <ul>
          {edition2026.speakers.map((s) => (
            <li key={s.name}>
              <span className="retro__sname">{s.name}</span>
              <span className="retro__srole">
                {s.role}, {s.org}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={film}
        className="film"
        aria-label="Econs Expo 2026 film"
        onClick={(e) => e.target === e.currentTarget && closeFilm()}
        onClose={() => film.current?.querySelector("video")?.pause()}
      >
        <video controls playsInline preload="none" poster={asset("/media/video/film-2026-poster.jpg")}>
          <source src={asset("/media/video/film-2026.mp4")} type="video/mp4" />
        </video>
        <button className="film__close" onClick={closeFilm}>
          <span className="sr">Close film</span>
          <span aria-hidden="true">×</span>
        </button>
      </dialog>
    </section>
  );
}
