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
import { Loader } from "@/components/Loader";
import { Cursor } from "@/components/Cursor";
import { ThemeWatcher } from "@/components/ThemeWatcher";
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

export const viewport: Viewport = { themeColor: "#0d1a15" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-SG" suppressHydrationWarning>
      <head>
        {/* Decide before first paint whether the opening plays, so returning visitors never see it flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('ee-intro')!=='1'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('ee-intro')}catch(e){}",
          }}
        />
      </head>
      <body>
        <Loader />
        <SmoothScroll />
        <Cursor />
        <ThemeWatcher />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
