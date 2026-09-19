"use client";
import { useEffect, useRef } from "react";
import "./VentureGrid.css";

// Chroma Grid (React Bits) spotlight: while hovering, everything outside the cursor radius turns
// grayscale. Idle cards stay in full color, and the grayscale layer is hidden when not hovering.
// The cards themselves are passed in as children, so they stay server-rendered.

export default function VentureGrid({ children, radius = 320 }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let frame = 0;
    let last = 0;

    const apply = () => {
      el.style.setProperty("--x", `${pos.x.toFixed(1)}px`);
      el.style.setProperty("--y", `${pos.y.toFixed(1)}px`);
    };
    // Eases the spotlight toward the pointer, and stops ticking once it has caught up.
    const follow = (now) => {
      const k = 1 - Math.exp(-(now - last) / 90);
      last = now;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      apply();
      frame = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.3 ? requestAnimationFrame(follow) : 0;
    };
    const local = (e) => {
      const r = el.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
    };

    const onEnter = (e) => {
      local(e);
      Object.assign(pos, target);
      apply();
      el.classList.add("is-chroma");
    };
    const onMove = (e) => {
      local(e);
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(follow);
      }
    };
    const onLeave = () => el.classList.remove("is-chroma");

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className="venture-grid" style={{ "--r": `${radius}px` }}>
      {children}
      <div className="venture-grid__overlay" aria-hidden="true" />
    </div>
  );
}
