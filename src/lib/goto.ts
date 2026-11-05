import type Lenis from "lenis";

/** Glides to a section on the homepage. Returns false if the section isn't on this page. */
export function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
  // Lenis honours the scroll-padding set for the fixed nav.
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", `#${id}`);
  return true;
}
