"use client";

import { useRef } from "react";
import { asset } from "@/lib/asset";

/** A button that opens the 2026 film, with sound, in a modal player. */
export function Film({ className, children }: { className?: string; children: React.ReactNode }) {
  const film = useRef<HTMLDialogElement>(null);
  const open = () => {
    film.current?.showModal();
    film.current?.querySelector("video")?.play().catch(() => {});
  };
  const close = () => {
    film.current?.querySelector("video")?.pause();
    film.current?.close();
  };
  return (
    <>
      <button className={className} onClick={open} data-cursor="Play" aria-haspopup="dialog">
        {children}
      </button>
      <dialog
        ref={film}
        className="film"
        aria-label="Econs Expo 2026 film"
        onClick={(e) => e.target === e.currentTarget && close()}
        onClose={() => film.current?.querySelector("video")?.pause()}
      >
        <video controls playsInline preload="none" poster={asset("/media/video/film-2026-poster.jpg")}>
          <source src={asset("/media/video/film-2026.mp4")} type="video/mp4" />
        </video>
        <button className="film__close" onClick={close}>
          <span className="sr">Close film</span>
          <span aria-hidden="true">×</span>
        </button>
      </dialog>
    </>
  );
}
