import type { Metadata } from "next";
import { TeamWall } from "@/components/TeamWall";

export const metadata: Metadata = {
  title: "Meet the team",
  description: "The students organising Econs Expo 2027: the core team and three subcommittees.",
};

export default function TeamPage() {
  return <TeamWall />;
}
