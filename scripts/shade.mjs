// Bakes the experiences' dark reading gradient into their photos, so the browser does not
// have to blend a full-screen overlay over each moving panel on every frame.
// Usage: node scripts/shade.mjs  (reads public/media/photos/<slug>-2048.webp)
import sharp from "sharp";

const slugs = ["hall-clap", "hall-pitch", "crisis-tables"];
const dir = "public/media/photos";
const ink = "9,38,25";

for (const slug of slugs) {
  const src = `${dir}/${slug}-2048.webp`;
  const { width, height } = await sharp(src).metadata();
  const shade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="h" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="rgb(${ink})" stop-opacity="0.92"/>
        <stop offset="0.45" stop-color="rgb(${ink})" stop-opacity="0.74"/>
        <stop offset="1" stop-color="rgb(${ink})" stop-opacity="0.3"/>
      </linearGradient>
      <linearGradient id="v" x1="0" x2="0" y1="1" y2="0">
        <stop offset="0" stop-color="rgb(${ink})" stop-opacity="0.75"/>
        <stop offset="0.3" stop-color="rgb(${ink})" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#h)"/>
    <rect width="100%" height="100%" fill="url(#v)"/>
  </svg>`);
  const out = await sharp(src).composite([{ input: shade }]).toBuffer();
  for (const w of [640, 1280, 2048]) {
    const img = sharp(out).resize({ width: w });
    await img.clone().avif({ quality: 52 }).toFile(`${dir}/${slug}-shaded-${w}.avif`);
    await img.clone().webp({ quality: 78 }).toFile(`${dir}/${slug}-shaded-${w}.webp`);
  }
  console.log(slug, width, height);
}
