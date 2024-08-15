import React from "react";
import {
  ReactIcon,
  HTMLIcon,
  CSSIcon,
  JavascriptIcon,
  TailwindIcon,
  NextJSIcon,
  MaterialUIIcon,
  ShadcnIcon,
  NodeJSIcon,
  AzureIcon,
  AWSIcon,
  GitHubIcon,
  MongoDBIcon,
  OpenAIIcon,
  TypeScriptIcon,
  GitIcon,
  FigmaIcon,
  BootstrapIcon,
  FramerMotionIcon,
} from "./SVG/SVG";

const techs = [
  {
    icon: <ReactIcon width="30" height="30" />,
    name: "React",
  },
  {
    icon: <NextJSIcon width="30" height="30" />,
    name: "NextJS",
  },
  {
    icon: <HTMLIcon width="30" height="30" />,
    name: "HTML",
  },
  {
    icon: <CSSIcon width="30" height="30" />,
    name: "CSS",
  },
  {
    icon: <JavascriptIcon width="30" height="30" />,
    name: "Javascript",
  },
  {
    icon: <TailwindIcon width="30" height="30" />,
    name: "Tailwind",
  },
  {
    icon: <BootstrapIcon width="40" height="40" />,
    name: "Bootstrap",
  },

  {
    icon: <MaterialUIIcon width="30" height="30" />,
    name: "Material UI",
  },
  {
    icon: <ShadcnIcon width="30" height="30" />,
    name: "shadcn/ui",
  },
  {
    icon: <NodeJSIcon width="30" height="30" />,
    name: "NodeJS",
  },
  {
    icon: <AzureIcon width="30" height="30" />,
    name: "MS Azure",
  },
  {
    icon: <AWSIcon width="30" height="30" />,
    name: "AWS",
  },
  {
    icon: (
      <img
        src="https://raw.githubusercontent.com/pmndrs/zustand/main/examples/demo/public/favicon.ico"
        width="40"
        height="40"
      />
    ),
    name: "Zustand",
  },
  {
    icon: (
      <img
        src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/168_Hubspot_logo_logos-512.png"
        width="40"
        height="40"
      />
    ),
    name: "HubSpot",
  },
  {
    icon: <GitHubIcon width="40" height="40" />,
    name: "Github",
  },
  {
    icon: <MongoDBIcon width="40" height="40" />,
    name: "MongoDB",
  },
  {
    icon: <OpenAIIcon width="40" height="40" />,
    name: "OPENAI",
  },
  {
    icon: <TypeScriptIcon width="40" height="40" />,
    name: "Typescript",
  },
  {
    icon: <GitIcon width="40" height="40" />,
    name: "Git",
  },
  {
    icon: <FigmaIcon width="40" height="40" />,
    name: "Figma",
  },
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="mb-16 md:mb-24 lg:mb-36">
      <p className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-inherit px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:hidden">
        Tech Stack
      </p>
      <ul className="flex flex-wrap justify-around md:justify-start lg:justify-between gap-4">
        {techs.map((tech, i) => (
          <li
            key={i}
            className="flex flex-col gap-2 justify-center items-center bg-white bg-opacity-20 min-w-fit w-24 lg:w-28 rounded py-4"
          >
            <div>{tech.icon}</div>
            <span className="text-xs break-words">{tech.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
