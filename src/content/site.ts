// Event facts. Every field carries its status so nothing provisional is shown as final.
// Source: "Econs Expo Marketing 2027" (Drive), checked 29 Oct 2026.

export const site = {
  name: "Econs Expo",
  edition: "2027",
  tagline: "Economics, out loud.",
  description:
    "A student-led inter-school economics conference hosted by St. Joseph's Institution International, Singapore. Buzz in, pitch a portfolio and steer a country through a crisis.",
  date: { label: "20 February 2027", short: "20 Feb 2027", confirmed: false },
  venue: {
    name: "St. Joseph's Institution International",
    short: "SJI International",
    address: "490 Thomson Road, Singapore 298191",
  },
  participants: { label: "~150", note: "students from schools across Singapore", confirmed: false },
  // No sign-up form exists yet. When one does, set its URL here and every CTA switches to it.
  registerUrl: null as string | null,
  instagram: "https://www.instagram.com/econs_expo/",
} as const;

export const registerHref = site.registerUrl ?? "/attend/#register";

export type Experience = {
  id: "buzzer" | "pitch" | "crisis";
  index: string;
  title: string;
  kicker: string;
  body: string;
  photo: string;
  photoAlt: string;
  photoPos?: string;
  caption: string;
};

// The three planned 2027 experiences. Photos are from 2026 and captioned as such.
export const experiences: Experience[] = [
  {
    id: "buzzer",
    index: "01",
    title: "Economics Buzzer Competition",
    kicker: "Fast recall, under pressure",
    body: "Teams race through rounds of economics questions, from first principles to the headlines. Know it, buzz it, explain it.",
    photo: "hall-clap",
    photoAlt: "Students applauding across the hall at Econs Expo 2026",
    photoPos: "50% 60%",
    caption: "2026 · the main hall",
  },
  {
    id: "pitch",
    index: "02",
    title: "Investment Pitch",
    kicker: "One briefing, one portfolio, one pitch",
    body: "After a live economic briefing, your team builds a strategy for a hypothetical $1,000,000 portfolio and defends it to the judges. Beginner, intermediate and advanced categories are planned.",
    photo: "hall-pitch",
    photoAlt: "Teams working on laptops during the 2026 stock pitch round",
    photoPos: "55% 55%",
    caption: "2026 · stock pitch round",
  },
  {
    id: "crisis",
    index: "03",
    title: "Economic Crisis Simulation",
    kicker: "Shocks arrive. You decide.",
    body: "Take a seat as a nation's ministers. Negotiate, publish policy and respond as economic and political shocks hit, round after round.",
    photo: "crisis-tables",
    photoAlt: "Delegates around a table during the 2026 crisis simulation",
    photoPos: "45% 50%",
    caption: "2026 · crisis simulation",
  },
];

// Econs Expo 2026, from the 2026 archive Drive. Previous edition only.
export const edition2026 = {
  date: "Saturday 25 April 2026",
  participants: "72",
  speakers: [
    { name: "Robert Huray", role: "Chairman, Southeast Asia", org: "Deutsche Bank" },
    { name: "Lim Zi-Kuan", role: "Head of M&A, Asia Pacific", org: "Deutsche Bank" },
    { name: "Prof. Nattavudh Powdthavee", role: "Professor of Economics", org: "Nanyang Technological University" },
    { name: "Dr Prakash Kannan", role: "Chief Economist", org: "GIC" },
  ],
  programme: ["Guest speaker fireside and panel", "Economics crash courses", "Stock propositions", "Econs Crisis simulation", "Closing ceremony and medals"],
};
