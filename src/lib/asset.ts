const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefixes a /public path with the deploy base path (needed on GitHub Pages). */
export const asset = (p: string) => `${base}${p}`;
