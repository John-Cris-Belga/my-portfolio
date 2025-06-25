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
  Supabase,
  OpenAIIcon,
  TypeScriptIcon,
  GitIcon,
  HubSpot,
  BootstrapIcon,
  FramerMotionIcon,
  ExpressJS,
  Fastify
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
    icon: <FramerMotionIcon width="40" height="40" />,
    name: "Framer Motion",
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
    icon: <NodeJSIcon width="30" height="30" />,
    name: "NodeJS",
  },
  {
    icon: <ExpressJS width="40" height="40" />,
    name: "ExpressJS",
  },
  {
    icon: <Fastify width="40" height="40" />,
    name: "Fastify",
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
    icon: <HubSpot width="40" height="40" />,
    name: "HubSpot",
  },
  {
    icon: <GitHubIcon width="40" height="40" />,
    name: "Github",
  },
  {
    icon: <GitIcon width="40" height="40" />,
    name: "Git",
  },
  {
    icon: <MongoDBIcon width="40" height="40" />,
    name: "MongoDB",
  },
  {
    icon: <Supabase width="40" height="40" />,
    name: "supabase",
  },
  {
    icon: <OpenAIIcon width="40" height="40" />,
    name: "OPENAI",
  }
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="mb-16 md:mb-24 lg:mb-36">
      <p className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-inherit px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:hidden">
        Tech Stack
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {techs.map((tech, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 justify-center items-center bg-white bg-opacity-20 rounded py-4"
          >
            <div>{tech.icon}</div>
            <span className="text-xs break-words">{tech.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}