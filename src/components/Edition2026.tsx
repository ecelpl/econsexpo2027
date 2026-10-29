"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Photo } from "@/components/Photo";
import { Film } from "@/components/Film";
import { CountUp } from "@/components/CountUp";
import { Curves } from "@/components/Curves";
import { edition2026, registerHref } from "@/content/site";
import { gallery2026 } from "@/content/gallery";
import { asset } from "@/lib/asset";
import { useGsap, prefersReducedMotion } from "@/lib/motion";
import { onReady } from "@/lib/ready";

/** A full-screen viewer for the gallery. Arrow keys move, Escape closes, focus returns to the photo. */
function Viewer({ index, setIndex, opener }: { index: number | null; setIndex: (i: number | null) => void; opener: React.RefObject<HTMLElement | null> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const n = gallery2026.length;
  const go = useCallback((d: number) => index !== null && setIndex((index + d + n) % n), [index, n, setIndex]);

  useEffect(() => {
    const d = dialog.current!;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [index, go]);

  // Swipe on touch screens.
  const start = useRef<number | null>(null);
  const item = index !== null ? gallery2026[index] : null;

  return (
    <dialog
      ref={dialog}
      className="viewer"
      aria-label="2026 photo viewer"
      onClose={() => {
        setIndex(null);
        opener.current?.focus();
      }}
      onClick={(e) => e.target === e.currentTarget && setIndex(null)}
      onPointerDown={(e) => (start.current = e.clientX)}
      onPointerUp={(e) => {
        if (start.current === null) return;
        const dx = e.clientX - start.current;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
        start.current = null;
      }}
    >
      {item && (
        <figure className="viewer__fig" key={item.slug}>
          <Photo slug={item.slug} alt={item.alt} sizes="100vw" priority />
          <figcaption>
            <span className="tabular viewer__count">
              {String(index! + 1).padStart(2, "0")} / {n}
            </span>
            <span>{item.alt}</span>
          </figcaption>
        </figure>
      )}
      <button className="viewer__nav viewer__nav--prev" onClick={() => go(-1)}>
        <span className="sr">Previous photo</span>
        <span aria-hidden="true">←</span>
      </button>
      <button className="viewer__nav viewer__nav--next" onClick={() => go(1)}>
        <span className="sr">Next photo</span>
        <span aria-hidden="true">→</span>
      </button>
      <button className="viewer__close" onClick={() => setIndex(null)} autoFocus>
        <span className="sr">Close viewer</span>
        <span aria-hidden="true">×</span>
      </button>
    </dialog>
  );
}

export function Edition2026() {
  const root = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLVideoElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const el = root.current!;
    const v = bg.current!;
    const reduce = prefersReducedMotion();
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let io: IntersectionObserver | undefined;
    if (!reduce && !saveData) {
      v.src = asset(`/media/video/reel-2026-${window.matchMedia("(max-width: 700px)").matches ? 720 : 1280}.mp4`);
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
      io.observe(el.querySelector(".ed__hero")!);
    }
    const nums = el.querySelectorAll(".ed__prog-ink path");
    if (reduce) {
      gsap.set(nums, { drawSVG: "100%" });
      return () => io?.disconnect();
    }
    const ctx = gsap.context(() => {
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "power4.out" } })
        .fromTo(".ed__line", { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.1 })
        .fromTo(".ed__hand", { autoAlpha: 0, rotate: -12 }, { autoAlpha: 1, rotate: -5, duration: 0.7 }, 0.5)
        .fromTo(".ed__meta > *", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.6);
      const off = onReady(() => intro.play());
      gsap.to(".ed__hero video", { scale: 1.15, ease: "none", scrollTrigger: { trigger: ".ed__hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.set(nums, { drawSVG: "0%" });
      el.querySelectorAll(".ed__prog li").forEach((li) => {
        gsap
          .timeline({ scrollTrigger: { trigger: li, start: "top 80%" } })
          .fromTo(li, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" })
          .to(li.querySelector(".ed__prog-ink path"), { drawSVG: "100%", duration: 0.7, ease: "power2.inOut" }, 0.2);
      });
      return () => off();
    }, el);
    // The masonry reflows as photos load, so reveal by intersection rather than measured positions.
    el.classList.add("is-js");
    const reveal = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("is-in"), reveal.unobserve(e.target))),
      { rootMargin: "0px 0px -8% 0px" },
    );
    el.querySelectorAll(".ed__item").forEach((it) => reveal.observe(it));
    return () => {
      io?.disconnect();
      reveal.disconnect();
      ctx.revert();
    };
  }, [gsap]);

  return (
    <div ref={root}>
      <section className="ed__hero" data-theme="dark" aria-labelledby="ed-title">
        <div className="ed__bg" aria-hidden="true">
          <video ref={bg} muted loop playsInline preload="none" poster={asset("/media/video/reel-2026-poster.jpg")} />
          <div className="ed__veil" />
        </div>
        <div className="wrap ed__copy">
          <p className="eyebrow eyebrow--light">Previous edition</p>
          <h1 id="ed-title" className="ed__title">
            <span className="hand ed__hand">last time</span>
            <span className="ed__mask">
              <span className="ed__line">Econs Expo</span>
            </span>
            <span className="ed__mask">
              <span className="ed__line ed__year">2026</span>
            </span>
          </h1>
          <div className="ed__meta">
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
            <Film className="rt__film">
              <span className="rt__play" aria-hidden="true" />
              <span>
                Watch the 2026 film <span className="hand">with sound, 1:21</span>
              </span>
            </Film>
          </div>
        </div>
      </section>

      <section className="ed__body paper-grid" aria-label="The 2026 day">
        <Curves />
        <div className="wrap ed__grid">
          <div>
            <h2 className="display">
              How the day <span className="hand ed__hand2">went.</span>
            </h2>
            <p className="ed__note">
              This is the 2026 programme. The 2027 programme is different and is on the{" "}
              <Link href="/#experiences">homepage</Link>.
            </p>
          </div>
          <ol className="ed__prog">
            {edition2026.programme.map((p, i) => (
              <li key={p}>
                <span className="ed__prog-n tabular">
                  0{i + 1}
                  <svg className="ed__prog-ink ink" viewBox="0 0 60 40" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M 34 3 C 52 3, 58 12, 57 21 C 56 32, 44 38, 28 37 C 12 36, 3 29, 3 19 C 4 9, 16 3, 32 3 C 40 3, 46 5, 50 8" />
                  </svg>
                </span>
                <span className="ed__prog-t">{p}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="wrap ed__grid ed__grid--spk">
          <h2 className="display">
            Who <span className="hand ed__hand2">spoke.</span>
          </h2>
          <ul className="ed__spk">
            {edition2026.speakers.map((s) => (
              <li key={s.name}>
                <span className="ed__sname">{s.name}</span>
                <span className="ed__srole">
                  {s.role}, {s.org}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ed__gallery" aria-labelledby="gal-title">
        <div className="wrap">
          <div className="ed__gal-head">
            <h2 id="gal-title" className="display display--xl">
              The <span className="hand ed__hand2">photos.</span>
            </h2>
            <p>{gallery2026.length} photos. Choose one to see it full size, then use the arrow keys or swipe.</p>
          </div>
          <ul className="ed__masonry">
            {gallery2026.map((g, i) => (
              <li key={g.slug} className="ed__item">
                <button
                  type="button"
                  className="ed__thumb"
                  data-cursor="View"
                  aria-haspopup="dialog"
                  onClick={(e) => {
                    opener.current = e.currentTarget;
                    setIndex(i);
                  }}
                >
                  <Photo slug={g.slug} alt={g.alt} sizes="(max-width: 700px) 50vw, 33vw" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ed__next" data-theme="dark" aria-labelledby="next-title">
        <div className="wrap">
          <h2 id="next-title" className="display display--xl">
            This year, <span className="hand ed__hand2">it’s your turn.</span>
          </h2>
          <div className="close__ctas">
            <Link href={registerHref} className="btn btn--paper btn--big">
              Register interest
            </Link>
            <Link href="/" className="btn btn--line-light btn--big">
              Econs Expo 2027
            </Link>
          </div>
        </div>
      </section>

      <Viewer index={index} setIndex={setIndex} opener={opener} />
    </div>
  );
}
