/**
 * Draws a marker line between two elements inside `box`, as an SVG path in pixels. Returns a
 * function that re-measures (call it on resize). The line leaves `from` at its right edge (or
 * bottom on narrow layouts) and arrives just left of `to`.
 */
export function connect(box: HTMLElement, svg: SVGSVGElement, path: SVGPathElement, from: HTMLElement, to: HTMLElement) {
  return () => {
    const b = box.getBoundingClientRect();
    const f = from.getBoundingClientRect();
    const t = to.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${b.width} ${b.height}`);
    const beside = t.left >= f.right - 4;
    const x1 = beside ? f.right - b.left - f.width * 0.12 : f.left - b.left + f.width * 0.82;
    const y1 = beside ? f.top - b.top + f.height * 0.72 : f.bottom - b.top - f.height * 0.1;
    const x2 = t.left - b.left - 10;
    const y2 = t.top - b.top + t.height * 0.55;
    const d = beside
      ? `M ${x1} ${y1} C ${x1 + (x2 - x1) * 0.7} ${y1 + 20}, ${x2 - 60} ${y2}, ${x2} ${y2}`
      : `M ${x1} ${y1} C ${x1} ${y1 + 50}, ${x2 - 30} ${y2 - 30}, ${x2} ${y2}`;
    path.setAttribute("d", d);
  };
}
