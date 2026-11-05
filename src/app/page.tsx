import { Opening } from "@/components/story/Opening";
import { Story } from "@/components/story/Story";
import { CoreTeam } from "@/components/CoreTeam";
import { Retrospective } from "@/components/Retrospective";
import { Speakers } from "@/components/Speakers";
import { Closing } from "@/components/Closing";

export default function Home() {
  return (
    <>
      <Opening />
      <Story />
      <Retrospective />
      <Speakers />
      <CoreTeam />
      <Closing />
    </>
  );
}
