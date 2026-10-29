import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/newsreader/standard.css";
import "@fontsource-variable/newsreader/standard-italic.css";
import "@fontsource/kalam/400.css";
import "@fontsource/kalam/700.css";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { default: "Econs Expo 2027 · Economics, out loud", template: "%s · Econs Expo 2027" },
  description: site.description,
  openGraph: {
    title: "Econs Expo 2027",
    description: site.description,
    type: "website",
    images: ["/media/photos/whiteboard-1280.webp"],
  },
};

export const viewport: Viewport = { themeColor: "#f1f4ef" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-SG">
      <body>
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
