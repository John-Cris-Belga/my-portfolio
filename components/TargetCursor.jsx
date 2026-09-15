"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import "./TargetCursor.css";

// Adapted from React Bits "Target Cursor": site-wide by default (or limited to `scopeRef`),
// disabled on touch devices, and the spin only runs while visible.

const BORDER = 3;
const CORNER = 12;
const IDLE = [
  { x: -CORNER * 1.5, y: -CORNER * 1.5 },
  { x: CORNER * 0.5, y: -CORNER * 1.5 },
  { x: CORNER * 0.5, y: CORNER * 0.5 },
  { x: -CORNER * 1.5, y: CORNER * 0.5 },
];

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const subscribe = (onChange) => {
  const mq = window.matchMedia(FINE_POINTER);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const useFinePointer = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(FINE_POINTER).matches, () => false);

/** @param {Record<string, any>} props */
export default function TargetCursor({
  scopeRef,
  targetSelector = ".cursor-target",
  spinDuration = 2,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = "#ffffff",
  cursorColorOnTarget,
}) {
  const enabled = useFinePointer();
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const scope = scopeRef ? scopeRef.current : document.documentElement;
    const cursor = cursorRef.current;
    if (!enabled || !scope || !cursor) return;

    const dot = dotRef.current;
    const corners = Array.from(cursor.querySelectorAll(".target-cursor-corner"));
    const strength = { current: 0 };
    let spin = null;
    let activeTarget = null;
    let targetCorners = null;
    let lastX = 0;
    let lastY = 0;
    let shown = false;

    scope.classList.add("has-target-cursor");
    gsap.set(cursor, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const startSpin = () => {
      spin?.kill();
      gsap.set(cursor, { rotation: 0 });
      spin = gsap.to(cursor, { rotation: 360, duration: spinDuration, ease: "none", repeat: -1 });
    };

    const ticker = () => {
      if (!targetCorners || strength.current === 0) return;
      const cx = gsap.getProperty(cursor, "x");
      const cy = gsap.getProperty(cursor, "y");
      const s = strength.current;
      const duration = s >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
      corners.forEach((corner, i) => {
        const curX = gsap.getProperty(corner, "x");
        const curY = gsap.getProperty(corner, "y");
        gsap.to(corner, {
          x: curX + (targetCorners[i].x - cx - curX) * s,
          y: curY + (targetCorners[i].y - cy - curY) * s,
          duration,
          ease: duration === 0 ? "none" : "power1.out",
          overwrite: "auto",
        });
      });
    };

    const measure = (target) => {
      const r = target.getBoundingClientRect();
      targetCorners = [
        { x: r.left - BORDER, y: r.top - BORDER },
        { x: r.right + BORDER - CORNER, y: r.top - BORDER },
        { x: r.right + BORDER - CORNER, y: r.bottom + BORDER - CORNER },
        { x: r.left - BORDER, y: r.bottom + BORDER - CORNER },
      ];
    };

    const tint = (color) => {
      if (!cursorColorOnTarget) return;
      gsap.to(corners, { borderColor: color, duration: 0.15, ease: "power2.out" });
      gsap.to(dot, { backgroundColor: color, duration: 0.15, ease: "power2.out" });
    };

    const lock = (target) => {
      if (target === activeTarget) return;
      activeTarget = target;
      spin?.kill();
      gsap.set(cursor, { rotation: 0 });
      gsap.killTweensOf(corners, "x,y");
      tint(cursorColorOnTarget);
      measure(target);
      gsap.ticker.add(ticker);
      gsap.to(strength, { current: 1, duration: hoverDuration, ease: "power2.out" });
    };

    const release = (resumeSpin = true) => {
      if (!activeTarget) return;
      activeTarget = null;
      targetCorners = null;
      gsap.ticker.remove(ticker);
      gsap.set(strength, { current: 0, overwrite: true });
      tint(cursorColor);
      gsap.killTweensOf(corners, "x,y");
      corners.forEach((corner, i) =>
        gsap.to(corner, { x: IDLE[i].x, y: IDLE[i].y, duration: 0.3, ease: "power3.out" }),
      );
      if (resumeSpin) startSpin();
    };

    const onEnter = (e) => {
      shown = true;
      lastX = e.clientX;
      lastY = e.clientY;
      gsap.set(cursor, { x: lastX, y: lastY });
      gsap.to(cursor, { autoAlpha: 1, duration: 0.15 });
      startSpin();
    };
    const onMove = (e) => {
      // The pointer may already be inside the scope on load, when no pointerenter fires.
      if (!shown) return onEnter(e);
      lastX = e.clientX;
      lastY = e.clientY;
      gsap.to(cursor, { x: lastX, y: lastY, duration: 0.1, ease: "power3.out" });
    };
    const onLeave = () => {
      shown = false;
      release(false);
      spin?.kill();
      gsap.to(cursor, { autoAlpha: 0, duration: 0.15 });
    };
    const onOver = (e) => {
      const target = e.target.closest?.(targetSelector);
      if (target && scope.contains(target)) lock(target);
      else release();
    };
    const onScroll = () => {
      if (!activeTarget) return;
      const target = document.elementFromPoint(lastX, lastY)?.closest(targetSelector);
      if (target === activeTarget) measure(target);
      else if (target && scope.contains(target)) {
        release(false);
        lock(target);
      } else release();
    };
    const onDown = () => {
      gsap.to(dot, { scale: 0.7, duration: 0.3 });
      gsap.to(cursor, { scale: 0.9, duration: 0.2 });
    };
    const onUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.3 });
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    };

    scope.addEventListener("pointermove", onMove);
    scope.addEventListener("pointerenter", onEnter);
    scope.addEventListener("pointerleave", onLeave);
    scope.addEventListener("mouseover", onOver);
    scope.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      scope.removeEventListener("pointermove", onMove);
      scope.removeEventListener("pointerenter", onEnter);
      scope.removeEventListener("pointerleave", onLeave);
      scope.removeEventListener("mouseover", onOver);
      scope.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(ticker);
      spin?.kill();
      gsap.killTweensOf([cursor, dot, ...corners]);
      scope.classList.remove("has-target-cursor");
    };
  }, [enabled, scopeRef, targetSelector, spinDuration, hoverDuration, parallaxOn, cursorColor, cursorColorOnTarget]);

  if (!enabled) return null;

  return createPortal(
    <div ref={cursorRef} className="target-cursor-wrapper" aria-hidden="true">
      <div ref={dotRef} className="target-cursor-dot" style={{ backgroundColor: cursorColor }} />
      <div className="target-cursor-corner corner-tl" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-tr" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-br" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-bl" style={{ borderColor: cursorColor }} />
    </div>,
    document.body,
  );
}
