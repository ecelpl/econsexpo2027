import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "team/", "attend/", "2026/"].map((p) => ({ url: `${SITE_URL}/${p}` }));
}
