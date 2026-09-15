import type { IconType } from "react-icons";
import { GiBearFace } from "react-icons/gi";
import {
  SiBootstrap,
  SiClaude,
  SiCss,
  SiExpress,
  SiFastify,
  SiFramer,
  SiGit,
  SiGithub,
  SiHtml5,
  SiHubspot,
  SiJavascript,
  SiMongodb,
  SiMui,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiReact,
  SiShadcnui,
  SiSupabase,
  SiTailwindcss,
  SiZapier,
} from "react-icons/si";
import {
  TbBrandAws,
  TbBrandAzure,
  TbBrandMonday,
  TbPhoneCall,
  TbTerminal2,
} from "react-icons/tb";

export type TechStackItem = {
  label: string;
  icon: IconType;
  color: string;
};

export const techStack: TechStackItem[] = [
  { label: "React", icon: SiReact, color: "#61DAFB" },
  { label: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
  { label: "HTML", icon: SiHtml5, color: "#E34F26" },
  { label: "CSS", icon: SiCss, color: "#8B5CF6" },
  { label: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { label: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  { label: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
  { label: "Material UI", icon: SiMui, color: "#007FFF" },
  { label: "shadcn/ui", icon: SiShadcnui, color: "#FFFFFF" },
  { label: "Framer Motion", icon: SiFramer, color: "#0055FF" },
  { label: "Zustand", icon: GiBearFace, color: "#B08968" },
  { label: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { label: "Express.js", icon: SiExpress, color: "#FFFFFF" },
  { label: "Fastify", icon: SiFastify, color: "#FFFFFF" },
  { label: "MS Azure", icon: TbBrandAzure, color: "#0078D4" },
  { label: "AWS", icon: TbBrandAws, color: "#FF9900" },
  { label: "HubSpot", icon: SiHubspot, color: "#FF7A59" },
  { label: "Zapier", icon: SiZapier, color: "#FF4F00" },
  { label: "Monday", icon: TbBrandMonday, color: "#FFCC00" },
  { label: "JustCall", icon: TbPhoneCall, color: "#2BB673" },
  { label: "GitHub", icon: SiGithub, color: "#FFFFFF" },
  { label: "Git", icon: SiGit, color: "#F05032" },
  { label: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { label: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
  { label: "OpenAI", icon: SiOpenai, color: "#FFFFFF" },
  { label: "Claude", icon: SiClaude, color: "#D97757" },
  { label: "Codex", icon: TbTerminal2, color: "#FFFFFF" },
];
