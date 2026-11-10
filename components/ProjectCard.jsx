import Image from "next/image";

const ProjectCard = ({ project }) => {
  const host = project.url.replace(/^https?:\/\//, "");

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[inherit] bg-[radial-gradient(120%_70%_at_0%_0%,color-mix(in_srgb,var(--accent,#6366f1)_22%,transparent),transparent_65%)] has-[>a:focus-visible]:outline-2 has-[>a:focus-visible]:outline-offset-2 has-[>a:focus-visible]:outline-cyan-400">
      {/* Links can't nest, so the website link covers the whole card and other links sit above it. */}
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${project.name} (${host})`}
        className="absolute inset-0 z-0 rounded-[inherit] outline-none"
      />

      <div className="pointer-events-none flex items-center bg-black/40 px-4 py-3">
        <span className="truncate rounded-md bg-white/5 px-2 py-0.5 font-mono text-xs text-gray-400">
          {host}
        </span>
      </div>

      <div className="pointer-events-none relative aspect-[1200/630] overflow-hidden border-y border-indigo-900/60">
        <Image
          src={project.image}
          alt={`${project.name} preview`}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="pointer-events-none flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
        <p className="text-sm leading-relaxed text-gray-400">{project.description}</p>
        {project.highlight && (
          <p className="font-mono text-xs text-green-400">{project.highlight}</p>
        )}
        {project.playStoreUrl && (
          <a
            href={project.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Get ${project.name} on Google Play`}
            className="pointer-events-auto relative z-10 -my-2 -ml-2.5 w-fit rounded-lg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-cyan-400"
          >
            {/* The official badge PNG includes its own transparent padding, offset by the negative margins. */}
            <Image
              src="/google-play-badge.png"
              alt="Get it on Google Play"
              width={646}
              height={250}
              className="h-[58px] w-auto"
            />
          </a>
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
    </div>
  );
};

export default ProjectCard;
