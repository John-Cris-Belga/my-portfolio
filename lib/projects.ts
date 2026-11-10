export type Project = {
  name: string;
  url: string;
  image: string;
  description: string;
  highlight?: string;
  playStoreUrl?: string;
  /** schema.org type used in the JSON-LD. Defaults to Organization. */
  schemaType?: "Organization" | "OnlineStore" | "WebApplication";
  tags: string[];
  accent: string;
  /** Border glow color as "h s l", e.g. "43 74 70". */
  glow: string;
};

export const projects: Project[] = [
  {
    name: "Eduble Startup Inc.",
    url: "https://eduble.ph",
    image: "/projects/eduble.png",
    description:
      "A Filipino edtech startup building affordable learning apps for every learner — from grade school, to the board exam, to the profession beyond it.",
    tags: ["Startup", "EdTech"],
    accent: "#E5B94B",
    glow: "43 74 70",
  },
  {
    name: "Reviewlution",
    url: "https://reviewlution.online",
    image: "/projects/reviewlution.png",
    description:
      "A gamified reviewer for Philippine board exams — timed rounds, streaks, leaderboards, and a projected board rating that tells you if you're on track.",
    highlight: "8,700+ users · 557 schools",
    playStoreUrl: "https://play.google.com/store/apps/details?id=online.reviewlution.app",
    schemaType: "WebApplication",
    tags: ["EdTech", "Web App", "Android App", "Gamification"],
    accent: "#F47C2F",
    glow: "23 90 68",
  },
  {
    name: "Passible",
    url: "https://passible.online",
    image: "/projects/passible.png",
    description:
      "A free review app that helps Filipino board exam takers prepare, with short daily lessons planned back from their exam date. It covers the teacher, nurse, and psychometrician exams, with more on the way.",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.passible.app",
    schemaType: "WebApplication",
    tags: ["EdTech", "Web App", "Android App", "Exam Review"],
    accent: "#2A6A5E",
    glow: "169 45 60",
  },
  {
    name: "Eduble Store",
    url: "https://store.eduble.ph",
    image: "/projects/store-eduble.png",
    description:
      "The official merch shop for Eduble's learning apps — hoodies, tees, mugs, and caps, printed locally. Reviewlution learners redeem the gift cheques they've earned, shipped anywhere in the Philippines.",
    schemaType: "OnlineStore",
    tags: ["E-commerce", "Web App", "Merch", "Gift Redemption"],
    accent: "#E8B84B",
    glow: "42 77 70",
  },
  {
    name: "Arvotech IT Solutions",
    url: "https://arvotech.solutions",
    image: "/projects/arvotech.png",
    description:
      "A web studio that designs and engineers websites, web apps, UI/UX, and brand identities. Built in Bicol, deployed worldwide.",
    tags: ["Agency", "Websites", "Web Apps"],
    accent: "#2BA3B8",
    glow: "189 65 65",
  },
];
