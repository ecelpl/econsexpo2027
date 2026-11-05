import { asset } from "@/lib/asset";

/**
 * The St. Joseph's Institution International logo, from the school's own site. Drawn as a CSS mask
 * so it takes the colour of the text around it (white on dark sections, ink on paper).
 */
export function SjiiLogo({ variant = "wide", className = "" }: { variant?: "wide" | "tall" | "crest"; className?: string }) {
  const file = { wide: "sjii", tall: "sjii-vertical", crest: "sjii-crest" }[variant];
  const src = asset(`/media/brand/${file}.svg`);
  return (
    <span
      role="img"
      aria-label="St. Joseph's Institution International"
      className={`sjii sjii--${variant} ${className}`}
      style={{ ["--logo" as string]: `url("${src}")` }}
    />
  );
}
