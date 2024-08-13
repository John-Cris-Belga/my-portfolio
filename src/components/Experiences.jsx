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
    description:
      "At Netfluence Corporation, I served as a Software Engineer, specializing in front-end development with React and HubSpot. I designed and implemented dynamic web applications, developed serverless functions, and created an AI chatbot for our website powered by the OpenAI API, enhancing user interaction with real-time assistance. Additionally, I independently built several internal tools that significantly improved operational efficiency. My work also involved integrating Microsoft Azure services and automating deployments using GitHub Actions.",
  },
];

export default function Experiences() {
  return (
    <section id="experiences" className="mb-16 md:mb-24 lg:mb-36">
      <p className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-inherit px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:hidden">
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
                <p className="mt-2 text-sm leading-normal text-slate-400">
                  {experience.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
