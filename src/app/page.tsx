import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { Experiences } from "@/components/Experiences";
import { CoreTeam } from "@/components/CoreTeam";
import { Retrospective } from "@/components/Retrospective";
import { Speakers } from "@/components/Speakers";
import { Closing } from "@/components/Closing";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Experiences />
      <CoreTeam />
      <Retrospective />
      <Speakers />
      <Closing />
    </>
  );
}
