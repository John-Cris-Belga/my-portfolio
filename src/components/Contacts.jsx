import React from "react";
import { Github, LinkedIn } from "./SVG/SVG";

const Socials = [
  {
    name: "Github",
    icon: <Github fill="inherit" />,
    link: "https://github.com/John-Cris-Belga",
  },
  {
    name: "LinkedIn",
    icon: <LinkedIn fill="inherit" />,
    link: "https://www.linkedin.com/in/chris-belga-730791112",
  },
];

export default function Contacts() {
  return (
    <ul className="flex gap-4 mt-8 lg:mt-0">
      {Socials.map((social) => (
        <li key={social.name}>
          <a
            href={social.link}
            target="_blank"
            className="fill-[gray] hover:fill-white"
          >
            {social.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
