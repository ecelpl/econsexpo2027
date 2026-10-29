"use client";

import { useEffect, useRef } from "react";
import { Photo } from "@/components/Photo";
import { CountUp } from "@/components/CountUp";
import { edition2026 } from "@/content/site";
import { asset } from "@/lib/asset";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

// Captioned frames that drift over the moving footage at different depths.
const frames = [
  { slug: "fireside", alt: "A guest speaker answers questions in the 2026 fireside chat", cap: "the fireside chat", pos: "40% 50%", speed: 30, cls: "f1" },
  { slug: "team-table", alt: "A team smiling at their table", cap: "one table, one team", pos: "50% 60%", speed: 12, cls: "f2" },
  { slug: "medals", alt: "A handful of gold medals on red, white and blue ribbons", cap: "medals", speed: 44, cls: "f3" },
  { slug: "friends", alt: "Five students posing together on the walkway", cap: "on the walkway", pos: "50% 40%", speed: 22, cls: "f4" },
  { slug: "speaker-chat", alt: "Guest speakers talking with organisers between sessions", cap: "between sessions", speed: 36, cls: "f5" },
  { slug: "thank-you", alt: "Closing slide reading Thank you for attending Econs Expo 2026", cap: "see you next year", speed: 16, cls: "f6" },
];

export function Retrospective() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLVideoElement>(null);
  const film = useRef<HTMLDialogElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const el = root.current!;
    const v = bg.current!;
    const reduce = prefersReducedMotion();
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let io: IntersectionObserver | undefined;
    if (!reduce && !saveData) {
      const small = window.matchMedia("(max-width: 700px)").matches;
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            if (!v.src) v.src = asset(`/media/video/reel-2026-${small ? 720 : 1280}.mp4`);
            v.play().catch(() => {});
          } else v.pause();
        },
        { rootMargin: "200px" },
      );
      io.observe(el);
    }
    if (reduce) return () => io?.disconnect();

    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>(".rt__frame").forEach((f) => {
        const s = Number(f.dataset.speed);
        gsap.fromTo(f, { y: s * 7 }, { y: -s * 7, ease: "none", scrollTrigger: { trigger: f, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(f.querySelector(".rt__media"), { clipPath: "inset(30% 20% 30% 20%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: { trigger: f, start: "top 95%", end: "top 55%", scrub: true } });
      });
      gsap.fromTo(".rt__year", { yPercent: 30, autoAlpha: 0.2 }, { yPercent: -10, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: ".rt__head", start: "top bottom", end: "bottom 30%", scrub: true } });
      gsap.fromTo(".rt__veil", { opacity: 0.9 }, { opacity: 0.55, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true } });
    }, el);
    return () => {
      io?.disconnect();
      ctx.revert();
    };
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
    <section className="rt" id="2026" ref={root} aria-labelledby="rt-title" data-theme="dark">
      <div className="rt__bg" aria-hidden="true">
        <video ref={bg} muted loop playsInline preload="none" poster={asset("/media/video/reel-2026-poster.jpg")} />
        <div className="rt__veil" />
      </div>

      <div className="rt__content">
        <div className="wrap rt__head">
          <p className="eyebrow eyebrow--light">Previous edition</p>
          <h2 id="rt-title" className="rt__title">
            <span className="hand rt__hand">last time</span>
            <span className="rt__year" aria-label="2026">
              2026
            </span>
          </h2>
          <dl className="rt__stats">
            <div>
              <dt>When</dt>
              <dd>{edition2026.date}</dd>
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
          <button className="rt__film" onClick={openFilm} data-cursor="Play">
            <span className="rt__play" aria-hidden="true" />
            <span>
              Watch the 2026 film <span className="hand">with sound, 1:21</span>
            </span>
          </button>
        </div>

        <div className="wrap rt__field">
          {frames.map((f) => (
            <figure key={f.slug} className={`rt__frame ${f.cls}`} data-speed={f.speed}>
              <div className="rt__media">
                <Photo slug={f.slug} alt={f.alt} sizes="(max-width: 860px) 60vw, 30vw" pos={f.pos} />
              </div>
              <figcaption className="hand">{f.cap}</figcaption>
            </figure>
          ))}
        </div>

        <div className="wrap rt__speakers">
          <h3 className="eyebrow eyebrow--light">2026 guest speakers</h3>
          <ul>
            {edition2026.speakers.map((s) => (
              <li key={s.name}>
                <span className="rt__sname">{s.name}</span>
                <span className="rt__srole">
                  {s.role}, {s.org}
                </span>
              </li>
            ))}
          </ul>
        </div>
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
