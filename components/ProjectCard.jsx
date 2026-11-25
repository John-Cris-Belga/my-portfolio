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
        <div className="flex items-center gap-2.5">
          {project.logo && (
            // Decorative: the name sits right beside it, so it isn't announced twice.
            <Image
              src={project.logo}
              alt=""
              aria-hidden="true"
              width={256}
              height={256}
              className="h-7 w-7 shrink-0 object-contain"
            />
          )}
          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
        </div>
        <p className="text-sm leading-relaxed text-gray-400">{project.description}</p>
        {project.highlight && (
          <p className="font-mono text-xs text-green-400">{project.highlight}</p>
        )}
        {(project.playStoreUrl || project.appStoreUrl) && (
          <div className="-my-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            {project.appStoreUrl && (
              <a
                href={project.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Download ${project.name} on the App Store`}
                className="pointer-events-auto relative z-10 w-fit rounded-lg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
              >
                {/* Apple's official badge, unmodified, at its 40px minimum height. It carries no
                    padding of its own, so it sits flush and sets the row's left edge. */}
                <Image
                  src="/app-store-badge.svg"
                  alt="Download on the App Store"
                  width={120}
                  height={40}
                  className="h-[40px] w-auto"
                />
              </a>
            )}
            {project.playStoreUrl && (
              <a
                href={project.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get ${project.name} on Google Play`}
                className="pointer-events-auto relative z-10 -mx-2.5 w-fit rounded-lg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-cyan-400"
              >
                {/* Google's badge PNG bakes in its own transparent padding; the negative margins
                    cancel it so both badges read as the same size with an even gap between. */}
                <Image
                  src="/google-play-badge.png"
                  alt="Get it on Google Play"
                  width={646}
                  height={250}
                  className="h-[58px] w-auto"
                />
              </a>
            )}
          </div>
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
