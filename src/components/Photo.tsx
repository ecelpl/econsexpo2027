import { asset } from "@/lib/asset";

type Props = {
  slug: string;
  alt: string;
  sizes?: string;
  className?: string;
  pos?: string;
  priority?: boolean;
};

const WIDTHS = [640, 1280, 2048];

/** A photo from /public/media/photos, served as AVIF with a WebP fallback. All sources are 3:2. */
export function Photo({ slug, alt, sizes = "100vw", className, pos, priority }: Props) {
  const set = (ext: string) => WIDTHS.map((w) => `${asset(`/media/photos/${slug}-${w}.${ext}`)} ${w}w`).join(", ");
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={asset(`/media/photos/${slug}-1280.webp`)}
        alt={alt}
        width={1280}
        height={853}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        style={pos ? { objectPosition: pos } : undefined}
      />
    </picture>
  );
}
