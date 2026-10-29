"use client";

import { useEffect, useRef, useState } from "react";
import { edition2026 } from "@/content/site";
import { asset } from "@/lib/asset";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

type Speaker = (typeof edition2026.speakers)[number];

/** The 2026 guest speakers as photo cards. Each opens a profile with a short, sourced bio. */
export function SpeakerCards({ tone = "light" }: { tone?: "light" | "dark" }) {
  const root = useRef<HTMLUListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [current, setCurrent] = useState<Speaker | null>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    if (current && !dialog.current!.open) dialog.current!.showModal();
  }, [current]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current!;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sc__card",
        { autoAlpha: 0, y: 60, rotate: (i) => [-4, 3, -2, 4][i % 4] },
        { autoAlpha: 1, y: 0, rotate: (i) => [-1.5, 1, -0.5, 1.5][i % 4], duration: 1, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%" } },
      );
    }, el);
    return () => ctx.revert();
  }, [gsap]);

  const close = () => {
    const d = dialog.current!;
    d.classList.add("is-closing");
    window.setTimeout(() => {
      d.classList.remove("is-closing");
      d.close();
    }, 220);
  };

  return (
    <>
      <ul className={`sc sc--${tone}`} ref={root}>
        {edition2026.speakers.map((s) => (
          <li key={s.slug}>
            <button
              type="button"
              className="sc__card"
              data-cursor="Read"
              aria-haspopup="dialog"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setCurrent(s);
              }}
            >
              <span className="sc__photo">
                <img src={asset(`/media/speakers/${s.slug}.jpg`)} alt="" width={480} height={480} loading="lazy" />
              </span>
              <span className="sc__name">{s.name}</span>
              <span className="sc__role">
                {s.role}, {s.org}
              </span>
              <span className="sc__more hand" aria-hidden="true">
                read more →
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="profile"
        aria-labelledby="speaker-name"
        onClose={() => {
          setCurrent(null);
          opener.current?.focus();
        }}
        onClick={(e) => e.target === e.currentTarget && close()}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        {current && (
          <div className="profile__card">
            <div className="profile__photo">
              <img src={asset(`/media/speakers/${current.slug}.jpg`)} alt={`Portrait of ${current.name}`} width={480} height={480} />
            </div>
            <div className="profile__body">
              <p className="eyebrow">Guest speaker · Econs Expo 2026</p>
              <h2 id="speaker-name" className="profile__name">
                {current.name}
              </h2>
              <p className="profile__role hand">
                {current.role}, {current.org}
              </p>
              <p className="profile__intro">{current.bio}</p>
              <p className="sc__note">
                Title as at Econs Expo 2026.
                {current.source && (
                  <>
                    {" "}
                    Source:{" "}
                    <a href={current.source.href} target="_blank" rel="noopener noreferrer">
                      {current.source.label}
                      <span className="sr"> (opens in a new tab)</span>
                    </a>
                  </>
                )}
              </p>
            </div>
            <button className="profile__close" onClick={close} autoFocus>
              <span className="sr">Close profile</span>
              <span aria-hidden="true">×</span>
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
