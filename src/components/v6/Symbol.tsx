/**
 * The Econs Expo symbol: a corner of axes, demand and supply crossing, and the point where they meet.
 * Drawn as strokes so it can draw itself in.
 */
export function Symbol({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg className={`sym ${className}`} viewBox="0 0 200 200" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path className="sym__axes" d="M 26 22 L 26 176 L 180 176" />
      <path className="sym__d" d="M 48 50 L 166 146" />
      <path className="sym__s" d="M 48 150 L 166 46" />
      <circle className="sym__dot" cx="107" cy="98" r="11" />
    </svg>
  );
}
