"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { registerHref } from "@/content/site";

const links = [
  { href: "/#experiences", label: "Experiences" },
  { href: "/team/", label: "Team" },
  { href: "/#speakers", label: "Speakers" },
  { href: "/#2026", label: "2026" },
  { href: "/attend/", label: "Attend" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="nav__bar wrap">
        <Link href="/" className="nav__brand" aria-label="Econs Expo 2027, home" onClick={() => setOpen(false)}>
          <span className="nav__word">Econs Expo</span>
          <span className="nav__year hand">’27</span>
        </Link>
        <nav className="nav__links" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href={registerHref} className="btn btn--ink nav__cta">
          Register interest
        </Link>
        <button
          ref={btn}
          className="nav__menu"
          aria-expanded={open}
          aria-controls="menu-sheet"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr">{open ? "Close menu" : "Open menu"}</span>
          <span className="nav__burger" aria-hidden="true" />
        </button>
      </div>
      <div id="menu-sheet" className="nav__sheet" hidden={!open}>
        <nav aria-label="Mobile" className="wrap">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ ["--i" as string]: i }}>
              {l.label}
            </Link>
          ))}
          <Link href={registerHref} className="btn btn--ink" onClick={() => setOpen(false)}>
            Register interest
          </Link>
        </nav>
      </div>
    </header>
  );
}
