"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import BorderGlow from "./BorderGlow";
import ProjectCard from "./ProjectCard";
import "./VentureGrid.css";

// Chroma Grid (React Bits) spotlight: while hovering, everything outside the cursor radius turns
// grayscale. Idle cards stay in full color, and the grayscale layer is hidden when not hovering.

export default function VentureGrid({ projects, radius = 320, damping = 0.45 }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const setX = gsap.quickSetter(el, "--x", "px");
    const setY = gsap.quickSetter(el, "--y", "px");
    const pos = { x: 0, y: 0 };

    const local = (e) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onEnter = (e) => {
      Object.assign(pos, local(e));
      setX(pos.x);
      setY(pos.y);
      el.classList.add("is-chroma");
    };
    const onMove = (e) => {
      gsap.to(pos, {
        ...local(e),
        duration: damping,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => {
          setX(pos.x);
          setY(pos.y);
        },
      });
    };
    const onLeave = () => el.classList.remove("is-chroma");

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(pos);
    };
  }, [damping]);

  return (
    <div ref={rootRef} className="venture-grid" style={{ "--r": `${radius}px` }}>
      {projects.map((project) => (
        <BorderGlow
          key={project.url}
          className="venture-card"
          backgroundColor="#07081a"
          borderRadius={14}
          glowRadius={32}
          glowColor={project.glow}
          colors={[project.accent, "#c084fc", "#38bdf8"]}
          style={{ "--accent": project.accent }}
        >
          <ProjectCard project={project} />
        </BorderGlow>
      ))}
      <div className="venture-grid__overlay" aria-hidden="true" />
    </div>
  );
}
