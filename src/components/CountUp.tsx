"use client";

import { useEffect, useRef } from "react";
import { useGsap, prefersReducedMotion } from "@/lib/motion";

/** A number that counts up once it scrolls into view. Renders the final value without JS. */
export function CountUp({ to, pad = 0 }: { to: number; pad?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { gsap } = useGsap();
  useEffect(() => {
    const el = ref.current!;
    if (prefersReducedMotion()) return;
    const n = { v: 0 };
    const fmt = (v: number) => String(Math.round(v)).padStart(pad, "0");
    el.textContent = fmt(0);
    const t = gsap.to(n, {
      v: to, duration: 1.6, ease: "power3.out",
      onUpdate: () => (el.textContent = fmt(n.v)),
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
    return () => {
      t.scrollTrigger?.kill();
      t.kill();
      el.textContent = fmt(to);
    };
  }, [gsap, to, pad]);
  return (
    <span ref={ref} className="tabular">
      {String(to).padStart(pad, "0")}
    </span>
  );
}
