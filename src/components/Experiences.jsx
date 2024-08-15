import React from "react";

const experiences = [
  {
    date: "2024 - PRESENT",
    position: "Software Developer | Upwork",
    description:
      "As a freelance Software Developer on Upwork, I leverage my expertise to tackle a diverse range of projects. I work closely with clients to deliver high-quality, custom solutions, utilizing technologies such as React, TypeScript, and AWS. My role involves managing project scopes, ensuring timely delivery, and adapting to various development environments and client needs.",
  },
  {
    date: "2020 - 2024",
    position: "Software Engineer | Netfluence Corporation",
    description: (
      <div>
        <p className="mb-4">
          At Netfluence Corporation, I specialized in front-end development with
          React, HubSpot, and Microsoft Azure. I developed custom React pages,
          templates, CRM cards, workflows, and dashboard reports within HubSpot,
          enhancing automation and streamlining operations. I also integrated
          HubSpot APIs and serverless functions to improve backend efficiency.
        </p>
        <p className="mb-4">
          Beyond HubSpot, I created and deployed an AI-powered embeddable
          chatbot and a chatbot editor using Microsoft Azure services. The
          chatbot, powered by the OpenAI API, provided real-time assistance and
          improved user engagement. The solution was deployed on Azure Static
          Web Apps, with Azure Functions handling the APIs, Azure App
          Configuration managing feature flags, Azure Front Door for CDN, and
          Azure Blob Storage hosting the embeddable URL for seamless access and
          deployment across platforms.
        </p>
        <p className="mb-4">
          I further automated deployments using GitHub Actions and integrated
          external services to ensure seamless data flow, maintaining high
          operational efficiency across all projects.
        </p>
      </div>
    ),
  },
];

export default function Experiences() {
  return (
    <section id="experiences" className="mb-16 md:mb-24 lg:mb-36">
      <p className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-inherit px-6 py-5 backdrop-blur md:-mx-12 md:px-12 ">
        EXPERIENCE
      </p>
      <ol>
        {experiences.map((experience, i) => (
          <li key={i} className="mb-12">
            <div className="md:inline-flex w-full">
              <span className="text-xs text-slate-500 min-w-[120px] font-semibold py-1 mr-5">
                {experience.date}
              </span>
              <div>
                <h3 className="font-medium leading-snug text-slate-200">
                  {experience.position}
                </h3>
                <div className="mt-2 text-sm leading-normal text-slate-400">
                  {experience.description}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
