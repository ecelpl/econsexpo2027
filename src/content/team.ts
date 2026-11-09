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
  /** Their own line, shown in quotes on the card and in the profile. */
  quote?: string;
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
  { slug: "kaya", name: "Kaya Velankar", role: "President", group: "core", core: true, photo: "kaya", quote: "Making growth greener", links: [{ kind: "linkedin", href: "https://www.linkedin.com/in/kaya-velankar-4191a7376/" }] },
  { slug: "richelle", name: "Richelle Luhur", role: "Vice President & Head of Finance", group: "core", core: true, photo: "richelle", quote: "Beyond odds beyond limits", links: [{ kind: "linkedin", href: "https://www.linkedin.com/in/richelle-luhur-249914328" }] },
  { slug: "alysa", name: "Alysa Luhur", role: "Vice President & Head of Marketing", group: "core", core: true, photo: "alysa", quote: "Always curious", links: [{ kind: "linkedin", href: "https://www.linkedin.com/in/alysa-luhur-93a7541b2" }] },
  { slug: "avinash", name: "Avinash Krishpathy", role: "Vice President & Head of Academics", group: "core", core: true, photo: "avinash", quote: "Cool", links: [{ kind: "linkedin", href: "https://www.linkedin.com/in/avinash-krishpathy-64523a324" }] },
  { slug: "en", name: "En Chng", role: "Head of Logistics", group: "core", core: true, photo: "en", quote: "Keep it simple", links: [{ kind: "linkedin", href: "https://www.linkedin.com/in/en-chng-ernest" }] },
  { slug: "christian", name: "Christian Huray", role: "Head of Outreach", group: "core", core: true, photo: "christian" },

  { slug: "marcel", name: "Marcel Tan", role: "Marketing & Outreach", group: "marketing", photo: "marcel", quote: "In pursuit of greatness", links: [{ kind: "linkedin", href: "https://www.linkedin.com/in/marcel-tan-553609413" }] },
  { slug: "nathan", name: "Nathan Chew", role: "Marketing & Outreach", group: "marketing", photo: "nathan", quote: "If you’re going through hell, keep going" },
  { slug: "nicholas", name: "Nicholas Lai", role: "Marketing & Outreach", group: "marketing", photo: "nicholas", quote: "Progress over perfection" },

  { slug: "aarav", name: "Aarav Karnik", role: "Finance & Logistics", group: "finance", photo: "aarav", quote: "Reach beyond imaginable", links: [{ kind: "linkedin", href: "https://www.linkedin.com/in/aarav-karnik-6034b1449/" }] },
  { slug: "miguel", name: "Miguel Saclolo", role: "Finance & Logistics", group: "finance", photo: "miguel", quote: "Do or do not. There is no try.", links: [{ kind: "linkedin", href: "https://www.linkedin.com/in/miguel-saclolo-48b802449/" }] },

  { slug: "gopal", name: "Gopal Nath", role: "Academics & Creativity", group: "academics", photo: "gopal", quote: "Talent and hard work win", links: [{ kind: "linkedin", href: "https://www.linkedin.com/in/gopal-nath-078a00434/" }] },
  { slug: "sara", name: "Sara Mahajan", role: "Academics & Creativity", group: "academics", photo: "sara" },
  { slug: "emma", name: "Emma Song", role: "Academics & Creativity", group: "academics", photo: "emma" },
];

export const coreTeam = members.filter((m) => m.core);
export const byGroup = (g: GroupId) => members.filter((m) => m.group === g);
export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
