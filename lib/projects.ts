export type Project = {
  name: string;
  url: string;
  image: string;
  description: string;
  highlight?: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    name: "Eduble Startup Inc.",
    url: "https://eduble.ph",
    image: "/projects/eduble.png",
    description:
      "A Filipino edtech startup building affordable learning apps for every learner — from grade school, to the board exam, to the profession beyond it.",
    tags: ["Startup", "EdTech"],
  },
  {
    name: "Reviewlution",
    url: "https://reviewlution.online",
    image: "/projects/reviewlution.png",
    description:
      "A gamified reviewer for Philippine board exams — timed rounds, streaks, leaderboards, and a projected board rating that tells you if you're on track.",
    highlight: "8,700+ users · 557 schools",
    tags: ["EdTech", "Web App", "Gamification"],
  },
  {
    name: "Arvotech IT Solutions",
    url: "https://arvotech.solutions",
    image: "/projects/arvotech.png",
    description:
      "A web studio that designs and engineers websites, web apps, UI/UX, and brand identities. Built in Bicol, deployed worldwide.",
    tags: ["Agency", "Websites", "Web Apps"],
  },
];
