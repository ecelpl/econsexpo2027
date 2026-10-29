"use client";

// The loader announces when the page is uncovered so entrance animations start on cue.
declare global {
  interface Window {
    __eeReady?: boolean;
  }
}

export function onReady(fn: () => void) {
  if (typeof window === "undefined") return () => {};
  if (window.__eeReady) {
    fn();
    return () => {};
  }
  const h = () => fn();
  window.addEventListener("ee:ready", h, { once: true });
  return () => window.removeEventListener("ee:ready", h);
}

export function markReady() {
  window.__eeReady = true;
  window.dispatchEvent(new Event("ee:ready"));
}
