// The 2027 committee, verified against the Instagram "Meet the Team" slides (29 Oct 2026)
// and the Econs Expo Marketing 2027 doc.
//
// Only add `links` that the person has approved for public display. Never guess a URL.
// `photo` is a slug in /public/media/team. Interim crops from the Instagram slides are used
// until the full-resolution headshots from Drive are matched.

export type Link = { kind: "linkedin" | "instagram" | "web"; href: string };

export type Member = {
  slug: string;
  name: string;
  role: string;
  group: GroupId;
  core?: boolean;
  photo?: string;
  intro?: string;
  links?: Link[];
  /** Something about this entry still needs confirming before launch. */
  check?: string;
};

export type GroupId = "core" | "marketing" | "finance" | "academics";

export const groups: { id: GroupId; name: string; blurb: string }[] = [
  { id: "core", name: "Core team", blurb: "Sets the direction and keeps the day running." },
  { id: "marketing", name: "Marketing & Outreach", blurb: "Schools, speakers, socials and the story." },
  { id: "finance", name: "Finance & Logistics", blurb: "Budgets, rooms, timings and everything in between." },
  // Instagram calls this "Academics & Creativity"; the Marketing doc says "Academics & Content".
  { id: "academics", name: "Academics & Creativity", blurb: "Questions, cases and the crisis itself." },
];

export const members: Member[] = [
  { slug: "kaya", name: "Kaya Valenkar", role: "President", group: "core", core: true, photo: "kaya", check: "Spelling: Instagram says Valenkar, the Marketing doc says Velankar" },
  { slug: "richelle", name: "Richelle Luhur", role: "Vice President & Head of Finance", group: "core", core: true, photo: "richelle" },
  { slug: "alysa", name: "Alysa Luhur", role: "Vice President & Head of Marketing", group: "core", core: true, photo: "alysa" },
  { slug: "christian", name: "Christian Huray", role: "Head of Outreach", group: "core", core: true, photo: "christian" },
  { slug: "avinash", name: "Avinash Krishpathy", role: "Vice President & Head of Academics", group: "core", core: true, photo: "avinash" },
  { slug: "en", name: "En Chng", role: "Head of Logistics", group: "core", core: true, photo: "en" },

  { slug: "marcel", name: "Marcel Tan", role: "Marketing & Outreach", group: "marketing", photo: "marcel" },
  { slug: "nathan", name: "Nathan Chew", role: "Marketing & Outreach", group: "marketing", photo: "nathan" },
  { slug: "nicholas", name: "Nicholas Lai", role: "Marketing & Outreach", group: "marketing", photo: "nicholas" },

  { slug: "aarav", name: "Aarav Karnik", role: "Finance & Logistics", group: "finance", photo: "aarav" },
  { slug: "miguel", name: "Miguel Sacloco", role: "Finance & Logistics", group: "finance", photo: "miguel", check: "Spelling: Instagram says Sacloco, the Marketing doc says Saclolo" },

  { slug: "gopal", name: "Gopal Nath", role: "Academics & Creativity", group: "academics", photo: "gopal" },
  // Listed in the Marketing doc but without an Instagram slide yet. Shown without a photo.
  { slug: "sara", name: "Sara Mahajan", role: "Academics & Creativity", group: "academics", check: "No Instagram slide yet" },
  { slug: "emma", name: "Emma Song", role: "Academics & Creativity", group: "academics", check: "No Instagram slide yet" },
  { slug: "natasha", name: "Natasha Malhotra", role: "Academics & Creativity", group: "academics", check: "Not on the Master Control sheet or Instagram yet" },
];

export const coreTeam = members.filter((m) => m.core);
export const byGroup = (g: GroupId) => members.filter((m) => m.group === g);
export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
