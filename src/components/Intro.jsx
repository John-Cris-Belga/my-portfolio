import React from "react";
import Contacts from "./Contacts";
import ScrollSpy from "react-scrollspy-navigation";

const navs = [
  {
    name: "About Me",
    href: "#about-me",
    scrollTo: "about-me",
  },
  {
    name: "Experiences",
    href: "#experiences",
    scrollTo: "experiences",
  },
  {
    name: "Tech Stack",
    href: "#tech-stack",
    scrollTo: "tech-stack",
  },
  {
    name: "Projects",
    href: "#projects",
    scrollTo: "projects",
  },
];

export default function Intro() {
  const scrollToSection = (event, sectionId) => {
    event.preventDefault();

    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      const offset = 100;
      const elementPosition =
        targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      });
    }
  };

  return (
    <header className="flex flex-col lg:sticky lg:top-0 lg:w-1/2 lg:max-h-screen lg:py-24 lg:justify-between lg:min-h-screen">
      <div>
        <h1 className="text-4xl font-bold">Chris Belga</h1>
        <h2 className="text-lg font-medium mt-2">Software Developer</h2>
        <p className="mt-4 text-slate-400 max-w-xs">
          Expertly transforming ideas into dynamic, interactive experiences.
        </p>
      </div>
      <ScrollSpy activeClass="nav-active">
        <nav className="hidden lg:block">
          <ul className="flex flex-col gap-4">
            {navs.map((nav) => (
              <li key={nav.href}>
                <a
                  className="text-slate-500 flex items-center"
                  href={nav.href}
                  onClick={(e) => scrollToSection(e, nav.scrollTo)}
                >
                  <span className="inline-block h-px w-8 bg-slate-500 mr-2 transition-all duration-500"></span>
                  {nav.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollSpy>
      <Contacts />
    </header>
  );
}
