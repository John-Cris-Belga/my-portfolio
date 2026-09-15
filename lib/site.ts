import { projects } from "@/lib/projects";
import { techStack } from "@/lib/techStack";

export const site = {
  url: "https://chrisbelga.dev",
  name: "Chris Belga",
  title: "Chris Belga — Web Developer & HubSpot Admin",
  shortDescription:
    "Web developer and HubSpot admin from Bicol, Philippines. Building web apps with React, Next.js, and Node.js — and the startups Eduble, Reviewlution, and Arvotech.",
  description:
    "Chris Belga is a full-stack web developer and HubSpot admin based in Bicol, Philippines. A mechanical engineer turned software developer, he builds web apps with React, Next.js, and Node.js, and is the builder behind Eduble, Reviewlution, and Arvotech IT Solutions. Available for projects.",
  jobTitles: ["Web Developer", "HubSpot Admin"],
  email: "inquiry@chrisbelga.dev",
  location: { region: "Bicol", country: "PH", countryName: "Philippines" },
  image: "/my_picture.png",
  sameAs: [
    "https://github.com/John-Cris-Belga",
    "https://www.linkedin.com/in/chris-b-730791112/",
  ],
  alumniOf: ["BS in Mechanical Engineering", "Full Stack Web Development"],
  languages: ["Filipino", "English"],
  keywords: [
    "Chris Belga",
    "web developer Philippines",
    "HubSpot admin",
    "HubSpot developer",
    "Next.js developer",
    "React developer",
    "full-stack developer",
    "Bicol web developer",
    "freelance web developer",
    "Eduble",
    "Reviewlution",
    "Arvotech IT Solutions",
  ],
};

export function buildJsonLd() {
  const personId = `${site.url}/#person`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        url: site.url,
        image: `${site.url}${site.image}`,
        email: `mailto:${site.email}`,
        jobTitle: site.jobTitles,
        description: site.description,
        address: {
          "@type": "PostalAddress",
          addressRegion: site.location.region,
          addressCountry: site.location.country,
        },
        knowsLanguage: site.languages,
        knowsAbout: techStack.map((t) => t.label),
        hasCredential: site.alumniOf.map((name) => ({
          "@type": "EducationalOccupationalCredential",
          name,
        })),
        sameAs: site.sameAs,
      },
      ...projects.map((p) =>
        p.url.includes("reviewlution")
          ? {
              "@type": "WebApplication",
              "@id": `${p.url}/#app`,
              name: p.name,
              url: p.url,
              description: p.description,
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web",
              creator: { "@id": personId },
            }
          : {
              "@type": "Organization",
              "@id": `${p.url}/#organization`,
              name: p.name,
              url: p.url,
              description: p.description,
              founder: { "@id": personId },
            },
      ),
      {
        "@type": "ProfilePage",
        "@id": `${site.url}/#profilepage`,
        url: site.url,
        name: site.title,
        description: site.shortDescription,
        inLanguage: "en",
        mainEntity: { "@id": personId },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": personId },
        inLanguage: "en",
      },
    ],
  };
}
