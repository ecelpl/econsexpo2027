import { Opening } from "@/components/v6/Opening";
import { Intro } from "@/components/Intro";
import { Events } from "@/components/v6/Events";
import { Past } from "@/components/v6/Past";
import { CoreTeam } from "@/components/CoreTeam";
import { Closing } from "@/components/v6/Closing";

export default function Home() {
  return (
    <>
      <Opening />
      <Intro />
      <Events />
      <Past />
      <CoreTeam />
      <Closing />
    </>
  );
}
