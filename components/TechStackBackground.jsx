"use client";
import TechStackSpiral from "./TechStackSpiral";
import { techStack } from "@/lib/techStack";

// Bundles the spiral with its 27 icons so both load together, off the critical path.
export default function TechStackBackground() {
  return <TechStackSpiral items={techStack} />;
}
