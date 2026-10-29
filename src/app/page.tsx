import { Hero } from "@/components/Hero";
import { Ticker } from "@/components/Ticker";
import { Intro } from "@/components/Intro";
import { Experiences } from "@/components/Experiences";
import { Numbers } from "@/components/Numbers";
import { CoreTeam } from "@/components/CoreTeam";
import { Retrospective } from "@/components/Retrospective";
import { Speakers } from "@/components/Speakers";
import { Closing } from "@/components/Closing";

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Intro />
      <Experiences />
      <Numbers />
      <CoreTeam />
      <Retrospective />
      <Speakers />
      <Closing />
    </>
  );
}
