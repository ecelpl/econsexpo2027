"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";

type Props = { slug: string; label: string; className?: string };

/**
 * A short silent loop from the 2026 montage. It plays only while on screen, and stays on its
 * poster frame when the visitor prefers reduced motion or has asked the browser to save data.
 */
export function Loop({ slug, label, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    const small = window.matchMedia("(max-width: 700px)").matches;
    v.src = asset(`/media/video/${slug}-${small ? 640 : 1280}.mp4`);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "120px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [slug]);

  return (
    <video
      ref={ref}
      className={className}
      poster={asset(`/media/video/${slug}-poster.jpg`)}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
