# Econs Expo 2027

The website for Econs Expo 2027, the student-led inter-school economics conference hosted by SJI International.

Design direction: **Margin Notes**. Real 2026 photographs, annotated live in one violet marker.

## Stack

Next.js (static export), React, TypeScript, GSAP (ScrollTrigger, DrawSVG) and Lenis. No backend.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
```

## Updating content

- Event facts, the three experiences and the 2026 edition: `src/content/site.ts`.
  Set `registerUrl` once a sign-up form exists, and every Register button switches to it.
- The committee: `src/content/team.ts`. Only add social links a person has approved.
- Photos: put originals in a folder and run `node scripts/media.mjs <photos-dir> <montage.mp4>`.
  It writes AVIF and WebP at 640, 1280 and 2048 px, plus the silent montage loops.

## Checks

`node scripts/shoot.cjs <url> <out-dir> 1440,390` captures scroll screenshots and reports
console errors and horizontal overflow.
