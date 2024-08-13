import React from "react";

const projects = [
  {
    name: "ConstructAI Search",
    description:
      "ConstructAI Search is an intelligent app that allows users to effortlessly search for construction projects using natural language. Powered by the OpenAI API, the app features an integrated chatbox that dynamically interprets user prompts. When a search query is detected, the app displays relevant construction projects on the left in the form of interactive cards, while casual conversations continue in the chatbox on the right.",
  },
  {
    name: "RealEstate AI Finder",
    description:
      "RealEstate AI Finder is a smart application that enables users to search for real estate properties using natural language. Leveraging the OpenAI API, the app includes a chatbox that distinguishes between search queries and casual conversations. When a search query is detected, it displays relevant real estate listings on the left side in the form of interactive cards, while casual interactions are maintained in the chatbox on the right.",
  },
  {
    name: "EmbedAI Chat",
    description:
      "EmbedAI Chat is a versatile embeddable chatbot that seamlessly integrates into any platform, offering natural language interaction powered by the OpenAI API. Designed for easy embedding, it enhances user engagement by providing intelligent responses, making it an ideal solution for customer support, information retrieval, or interactive user experiences across websites and applications.",
  },
  {
    name: "ChatBot Styler",
    description:
      "ChatBot Styler is a powerful editor designed for customizing the appearance and behavior of your embeddable chatbot. It allows users to easily modify styles, labels, and other elements, enabling personalized chatbot experiences that align with your brand’s identity. With intuitive controls and seamless integration, ChatBot Styler ensures your chatbot looks and feels exactly how you envision it.",
  },
  {
    name: "E.M.A.S (Environment Management and  Automation System)",
    description:
      "E.M.A.S is an efficient app designed to accurately transfer objects, properties, and associations between HubSpot portals. With two input fields for the access tokens of the source and destination portals, E.M.A.S provides a detailed comparison, showing existing objects, properties, and associations in the destination portal and highlighting what's missing. While it doesn't transfer property values, it ensures a precise and organized replication of your HubSpot setup across different portals.",
  },
  {
    name: "ChadGPT",
    description:
      "ChadGPT is a cost-effective solution designed to centralize access to ChatGPT Plus' capabilities within my organization. By utilizing a single API key, ChadGPT replicates the functionalities of ChatGPT, allowing team members to leverage its power without the need for individual subscriptions. This internally-developed tool streamlines AI-driven workflows, enhancing productivity while significantly reducing costs.",
  },
  {
    name: "ClientHub Dashboard",
    description:
      "ClientHub Dashboard is a comprehensive client portal built on HubSpot, offering a centralized view of project status and key deliverables. Upon logging in, clients are greeted with an interactive dashboard featuring charts that visualize project progress, completion percentages, and updates from the Customer Success Manager (CSM). The portal provides access to main deliverables, associated Risks, Assumptions, Issues, and Decisions related to tasks, and includes a Support Inbox for direct communication with customer support. Powered by HubSpot API, ClientHub Dashboard enhances client engagement and streamlines project management.",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="mb-16 md:mb-24 lg:mb-36">
      <p className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-inherit px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:hidden">
        Projects
      </p>
      <ul className="flex flex-wrap justify-around md:justify-start lg:justify-between gap-4">
        {projects.map((project, i) => (
          <li
            key={i}
            className="flex flex-col gap-2 justify-start items-start bg-white bg-opacity-20 min-w-full rounded p-4"
          >
            <h2 className="font-semibold">{project.name}</h2>
            <span className="text-sm break-words">{project.description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
