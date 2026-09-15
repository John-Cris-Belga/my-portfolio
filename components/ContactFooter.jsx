import { TbBrandGithub, TbBrandLinkedin, TbMail } from "react-icons/tb";
import { site } from "@/lib/site";

const socials = [
  { label: "GitHub", href: site.sameAs[0], icon: TbBrandGithub },
  { label: "LinkedIn", href: site.sameAs[1], icon: TbBrandLinkedin },
];

const ContactFooter = () => (
  <footer id="contact" className="relative w-full max-w-300 pb-28 sm:pb-36 text-center">
    <h2 className="text-2xl sm:text-4xl font-semibold text-white">Have a project in mind?</h2>
    <p className="mt-3 text-sm sm:text-base text-gray-400">Let&apos;s build it together.</p>

    <a
      href={`mailto:${site.email}`}
      className="mt-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/60 bg-indigo-600/20 px-6 py-3 font-mono text-sm text-white backdrop-blur-sm transition hover:bg-indigo-600/40 focus-visible:outline-2 focus-visible:outline-cyan-400"
    >
      <TbMail className="h-5 w-5 text-cyan-400" aria-hidden="true" />
      {site.email}
    </a>

    <div className="mt-8 flex justify-center gap-5">
      {socials.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-gray-400 transition hover:text-white"
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </a>
      ))}
    </div>

    <p className="mt-12 text-xs text-gray-500">© {new Date().getFullYear()} {site.name}</p>
  </footer>
);

export default ContactFooter;
