const projects = [
  {
    name: "CueCue",
    description:
      "CueCue is a to-do app that allows users to create, update, and delete tasks. It features a clean and intuitive interface that makes task management simple and efficient. Users can add tasks and mark tasks as complete, helping them stay organized and productive. CueCue is built using the MERN stack (MongoDB, Express.js, React, and Node.js) as the capstone project to complete a workshop in MERN Stack development.",
    role: ["Frontend Development", "Backend Development"],
    tech_stack: ["MongoDB", "ExpressJS", "React", "NodeJS"],
    url: "https://todo-app-frontend-beryl.vercel.app",
  },
  {
    name: "Cardano Casino",
    description:
      "Cardano Casino is a decentralized application (dApp) that offers a variety of casino games powered by the Cardano blockchain. The platform allows users to play games, earn rewards, and interact with other players in a secure and transparent environment. By leveraging blockchain technology, Cardano Casino ensures fairness and trust in every game, providing an innovative and entertaining experience for players worldwide.",
    role: [
      "Frontend Development",
      "Backend Development",
      "Blockchain Integration",
    ],
    tech_stack: ["MeshJS", "React", "AWS"],
    url: "https://www.upwork.com/freelancers/~01316681e6a97b8c12?p=1854763433609932800",
  },
  {
    name: "ConstructAI Search",
    description:
      "ConstructAI Search is an intelligent app that allows users to effortlessly search for construction projects using natural language. Powered by the OpenAI API, the app features an integrated chatbox that dynamically interprets user prompts. When a search query is detected, the app displays relevant construction projects on the left in the form of interactive cards, while casual conversations continue in the chatbox on the right.",
    role: ["Frontend Development", "Backend Development", "AI Integration"],
  },
  {
    name: "RealEstate AI Finder",
    description:
      "RealEstate AI Finder is a smart application that enables users to search for real estate properties using natural language. Leveraging the OpenAI API, the app includes a chatbox that distinguishes between search queries and casual conversations. When a search query is detected, it displays relevant real estate listings on the left side in the form of interactive cards, while casual interactions are maintained in the chatbox on the right.",
    role: ["Frontend Development", "Backend Development", "AI Integration"],
  },
  {
    name: "EmbedAI Chat",
    description:
      "EmbedAI Chat is a versatile embeddable chatbot that seamlessly integrates into any platform, offering natural language interaction powered by the OpenAI API. Designed for easy embedding, it enhances user engagement by providing intelligent responses, making it an ideal solution for customer support, information retrieval, or interactive user experiences across websites and applications.",
    role: ["Frontend Development", "Backend Development", "AI Integration"],
  },
  {
    name: "ChatBot Styler",
    description:
      "ChatBot Styler is a powerful editor designed for customizing the appearance and behavior of your embeddable chatbot. It allows users to easily modify styles, labels, and other elements, enabling personalized chatbot experiences that align with your brand’s identity. With intuitive controls and seamless integration, ChatBot Styler ensures your chatbot looks and feels exactly how you envision it.",
    role: ["Frontend Development", "Backend Development"],
  },
  {
    name: "E.M.A.S (Environment Management and  Automation System)",
    description:
      "E.M.A.S is an efficient app designed to accurately transfer objects, properties, and associations between HubSpot portals. With two input fields for the access tokens of the source and destination portals, E.M.A.S provides a detailed comparison, showing existing objects, properties, and associations in the destination portal and highlighting what's missing. While it doesn't transfer property values, it ensures a precise and organized replication of your HubSpot setup across different portals.",
    role: ["Frontend Development", "Backend Development"],
  },
  {
    name: "ChadGPT",
    description:
      "ChadGPT is a cost-effective solution designed to centralize access to ChatGPT Plus' capabilities within my organization. By utilizing a single API key, ChadGPT replicates the functionalities of ChatGPT, allowing team members to leverage its power without the need for individual subscriptions. This internally-developed tool streamlines AI-driven workflows, enhancing productivity while significantly reducing costs.",
    role: ["Frontend Development", "Backend Development", "AI Integration"],
  },
  {
    name: "ClientHub Dashboard",
    description:
      "ClientHub Dashboard is a comprehensive client portal built on HubSpot, offering a centralized view of project status and key deliverables. Upon logging in, clients are greeted with an interactive dashboard featuring charts that visualize project progress, completion percentages, and updates from the Customer Success Manager (CSM). The portal provides access to main deliverables, associated Risks, Assumptions, Issues, and Decisions related to tasks, and includes a Support Inbox for direct communication with customer support. Powered by HubSpot API, ClientHub Dashboard enhances client engagement and streamlines project management.",
    role: ["Frontend Development", "Backend Development"],
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
            <ul className="flex flex-wrap gap-2">
              {project.role.map((role, i) => (
                <li
                  key={i}
                  className="text-xs bg-white bg-opacity-40 rounded px-2"
                >
                  {role}
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-2">
              {(project?.tech_stack || []).map((tech, i) => (
                <li
                  key={i}
                  className="text-xs bg-white bg-opacity-40 rounded px-2"
                >
                  {tech}
                </li>
              ))}
            </ul>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline"
            >
              {project.url}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
