import Image from "next/image";

const ProjectCard = ({ project }) => {
  const host = project.url.replace(/^https?:\/\//, "");

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#1b2c68a0] bg-linear-to-br from-black/40 to-[#0a0d37]/40 shadow-lg backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-500/60 focus-visible:outline-2 focus-visible:outline-cyan-400"
    >
      <div className="flex items-center gap-3 bg-black/40 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <span className="truncate rounded-md bg-white/5 px-2 py-0.5 font-mono text-xs text-gray-400">
          {host}
        </span>
      </div>

      <div className="relative aspect-[1200/630] overflow-hidden border-y border-indigo-900/60">
        <Image
          src={project.image}
          alt={`${project.name} preview`}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
        <p className="text-sm leading-relaxed text-gray-400">{project.description}</p>
        {project.highlight && (
          <p className="font-mono text-xs text-green-400">{project.highlight}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-gray-300"
            >
              {tag}
            </span>
          ))}
          <span className="ml-auto text-sm text-cyan-400 transition group-hover:translate-x-0.5">
            Visit ↗
          </span>
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
