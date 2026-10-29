"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Switches the nav to light text while a dark section sits under it. */
export function ThemeWatcher() {
  const path = usePathname();
  useEffect(() => {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const on = new Set<Element>();
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => (e.isIntersecting ? on.add(e.target) : on.delete(e.target)));
        nav.toggleAttribute("data-dark", on.size > 0);
      },
      { rootMargin: "0px 0px -94% 0px" },
    );
    document.querySelectorAll("[data-theme='dark']").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [path]);
  return null;
}
