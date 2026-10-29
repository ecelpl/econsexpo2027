// Builds web-ready photos and video loops from the originals.
// Usage: node scripts/media.mjs <photos-dir> <montage.mp4>
// Photos go to public/media/photos/<slug>-<width>.{avif,webp}; loops to public/media/video/.
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const [srcDir, montage] = process.argv.slice(2);
const outPhotos = "public/media/photos";
const outVideo = "public/media/video";
mkdirSync(outPhotos, { recursive: true });
mkdirSync(outVideo, { recursive: true });

const WIDTHS = [640, 1280, 2048];

// blur: regions (fractions of the frame) that must not be readable, e.g. class name lists.
const photos = [
  { slug: "whiteboard", file: "originals/DSC01893.jpeg", blur: [[0, 0.1, 0.245, 0.64]] },
  { slug: "panel", file: "originals/DSC01858.jpeg" },
  { slug: "hall-clap", file: "originals/DSC01849.jpeg" },
  { slug: "briefing", file: "originals/DSC02026.jpeg" },
  { slug: "trio", file: "originals/DSC02122.jpeg" },
  { slug: "friends", file: "originals/DSC02159.jpeg" },
  { slug: "medals", file: "originals/DSC02167.jpeg" },
  { slug: "thank-you", file: "originals/DSC02455.jpeg" },
  { slug: "speakers-stage", file: "originals/DSC04827.jpeg" },
  { slug: "crisis-tables", file: "originals/DSC05035 (1).jpeg" },
  { slug: "hall-wide", file: "originals/IMG_2396.jpeg" },
  { slug: "fireside", file: "originals/IMG_2413.jpeg" },
  { slug: "hall-qa", file: "originals/IMG_2423.jpeg" },
  { slug: "tokens", file: "originals/IMG_2425.jpeg" },
  { slug: "tables-wide", file: "originals/IMG_2446.jpeg" },
  { slug: "award", file: "originals/IMG_2492.jpeg" },
  { slug: "speaker-chat", file: "originals/DSC01812.jpeg" },
  { slug: "pitch-room", file: "originals_large/L1050021.jpeg" },
  { slug: "pitch-stand", file: "originals_large/L1050028.jpeg" },
  { slug: "hall-pitch", file: "originals_large/L1050031.jpeg" },
  { slug: "workshop", file: "originals_large/L1050036.jpeg" },
  { slug: "team-table", file: "originals_large/L1050040.jpeg" },
  { slug: "laptops", file: "originals_large/L1050049.jpeg" },
  { slug: "committee-2027", file: "originals_large/EE27Aug-64.jpeg" },
  { slug: "core-2027", file: "originals_large/EE27Aug-140.jpeg" },
];

for (const p of photos) {
  const src = path.join(srcDir, p.file);
  let base = sharp(src).rotate();
  if (p.blur) {
    const { width, height } = await base.metadata();
    const comps = [];
    for (const [x0, y0, x1, y1] of p.blur) {
      const left = Math.round(x0 * width), top = Math.round(y0 * height);
      const w = Math.round((x1 - x0) * width), h = Math.round((y1 - y0) * height);
      const patch = await sharp(src).rotate().extract({ left, top, width: w, height: h }).blur(40).toBuffer();
      comps.push({ input: patch, left, top });
    }
    base = sharp(await base.composite(comps).jpeg({ quality: 95 }).toBuffer());
  }
  const buf = await base.toBuffer();
  const meta = await sharp(buf).metadata();
  for (const w of WIDTHS) {
    const r = sharp(buf).resize({ width: w, withoutEnlargement: true });
    await r.clone().avif({ quality: 52, effort: 4 }).toFile(`${outPhotos}/${p.slug}-${w}.avif`);
    await r.clone().webp({ quality: 74 }).toFile(`${outPhotos}/${p.slug}-${w}.webp`);
  }
  // tiny blurred placeholder colour
  const { dominant } = await sharp(buf).stats();
  console.log(p.slug, `${meta.width}x${meta.height}`, `rgb(${dominant.r},${dominant.g},${dominant.b})`);
}

// Silent loops cut from the 2026 montage (no audio: the soundtrack licence is unconfirmed).
const loops = [
  { slug: "hall", start: 0.2, dur: 2.7 },
  { slug: "panel", start: 24.1, dur: 2.7 },
  { slug: "board", start: 29.7, dur: 2.2 },
  { slug: "tables", start: 38.2, dur: 2.7 },
  { slug: "team", start: 41.1, dur: 2.7 },
];
if (montage && existsSync(montage)) {
  for (const l of loops) {
    for (const [w, crf] of [[1280, 24], [640, 28]]) {
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(l.start), "-t", String(l.dur), "-i", montage,
        "-an", "-vf", `scale=${w}:-2,fps=30`, "-c:v", "libx264", "-preset", "slow", "-crf", String(crf),
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${outVideo}/${l.slug}-${w}.mp4`]);
    }
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(l.start), "-i", montage, "-frames:v", "1",
      "-vf", "scale=1280:-2", "-q:v", "4", `${outVideo}/${l.slug}-poster.jpg`]);
    console.log("loop", l.slug);
  }
  // Full film, played only when a visitor asks for it.
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", montage, "-vf", "scale=1280:-2", "-c:v", "libx264",
    "-preset", "slow", "-crf", "25", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", `${outVideo}/film-2026.mp4`]);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "56.3", "-i", montage, "-frames:v", "1",
    "-vf", "scale=1280:-2", "-q:v", "4", `${outVideo}/film-2026-poster.jpg`]);
  console.log("film");
}
