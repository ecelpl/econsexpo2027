import type { Metadata } from "next";
import { Edition2026 } from "@/components/Edition2026";

export const metadata: Metadata = {
  title: "Econs Expo 2026",
  description: "The previous edition: 72 students, four guest speakers, the film and the photos from Saturday 25 April 2026.",
};

export default function Page() {
  return <Edition2026 />;
}
