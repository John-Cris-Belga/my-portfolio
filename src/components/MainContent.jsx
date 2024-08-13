import React from "react";
import Summary from "./Summary";
import Experiences from "./Experiences";
import TechStack from "./TechStack";
import Projects from "./Projects";

export default function MainContent() {
  return (
    <main className="pt-24 lg:w-1/2 lg:py-24">
      <Summary />
      <Experiences />
      <TechStack />
      <Projects />
    </main>
  );
}
