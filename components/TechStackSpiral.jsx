"use client";
import { useEffect, useRef } from "react";
import { afterIdle } from "@/lib/afterIdle";
import { onLite } from "@/lib/perfMode";
import "./TechStackSpiral.css";

// Adapted from React Bits "Infinite Spiral" as a non-interactive background. Every tile follows
// the same helix path, so the path is baked into one set of keyframes and each tile plays it
// with a different phase. The browser runs these on the compositor: no per-frame JavaScript.

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;
const smoothstep = (min, max, value) => {
  const x = clamp((value - min) / (max - min || 1), 0, 1);
  return x * x * (3 - 2 * x);
};

const KEYFRAME_STEPS = 80;

const TechStackSpiral = ({
  items,
  speed = 0.45,
  direction = "up",
  radius = 170,
  cardWidth = 100,
  cardHeight = 100,
  verticalSpacing = 60,
  perspective = 1000,
  cardsPerTurn = 7,
  cardRadius = 20,
  centerScale = 1.2,
  edgeFade = 0.3,
  className = "",
}) => {
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const count = items.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || count === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const half = count / 2;
    const duration = (count / Math.max(speed, 0.01)) * 1000;
    let animations = [];
    let paused = reducedMotion;
    let ready = false;
    let rebuildFrame = 0;

    const build = () => {
      const elapsed = animations[0]?.currentTime ?? 0;
      animations.forEach((a) => a.cancel());

      const bounds = root.getBoundingClientRect();
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const fit = Math.min(1, width / (cardWidth * 2.8), height / (cardHeight * 2.35));
      const helixRadius = Math.min(radius, Math.max(72, width * 0.36)) * fit;
      const fadeStart = clamp(1 - edgeFade, 0, 0.98);
      const turnSize = Math.max(cardsPerTurn, 1);
      // Spread the loop across the full container height instead of a fixed spacing.
      const spacing = Math.max(verticalSpacing * fit, height / count);

      const keyframes = [];
      for (let s = 0; s <= KEYFRAME_STEPS; s++) {
        const p = s / KEYFRAME_STEPS;
        const offset = half - p * count;
        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
        const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1);
        const angle = (offset * (360 / turnSize) * Math.PI) / 180;
        const x = Math.sin(angle) * helixRadius;
        const z = Math.cos(angle) * helixRadius;
        const depthScale = clamp(perspective / Math.max(perspective - z, 1), 0.72, 1.45);
        const scale = (1 + (centerScale - 1) * focus) * fit * depthScale;
        keyframes.push({
          offset: p,
          // z only orders the tiles front-to-back (the stage is preserve-3d with no perspective).
          transform: `translate3d(${x.toFixed(1)}px, ${(offset * spacing).toFixed(1)}px, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`,
          opacity: (1 - smoothstep(fadeStart, 1, edge)).toFixed(3),
        });
      }

      animations = cardRefs.current.slice(0, count).flatMap((card, index) => {
        // A tile can be briefly unmounted (e.g. during a hot reload); skip it rather than throw.
        if (!card) return [];
        const startOffset = modulo(index + half, count) - half;
        const animation = card.animate(keyframes, {
          duration,
          iterations: Infinity,
          iterationStart: (half - startOffset) / count,
          direction: direction === "down" ? "reverse" : "normal",
          fill: "both",
        });
        animation.currentTime = elapsed;
        if (paused) animation.pause();
        return [animation];
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      if (!ready) return;
      cancelAnimationFrame(rebuildFrame);
      rebuildFrame = requestAnimationFrame(build);
    });
    resizeObserver.observe(root);

    const cancelIdle = afterIdle(() => {
      build();
      ready = true;
      root.classList.add("is-ready");
    }, 300);
    const cancelLite = onLite(() => {
      paused = true;
      animations.forEach((a) => a.pause());
    });

    return () => {
      cancelIdle();
      cancelLite();
      cancelAnimationFrame(rebuildFrame);
      resizeObserver.disconnect();
      animations.forEach((a) => a.cancel());
    };
  }, [
    count,
    speed,
    direction,
    radius,
    cardWidth,
    cardHeight,
    verticalSpacing,
    perspective,
    cardsPerTurn,
    centerScale,
    edgeFade,
  ]);

  return (
    <div ref={rootRef} className={`tech-spiral ${className}`.trim()} aria-hidden="true">
      <div className="tech-spiral__stage">
        {items.map(({ label, icon: Icon, color }, index) => (
          <div
            key={label}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className="tech-spiral__item"
            style={{
              width: cardWidth,
              height: cardHeight,
              marginLeft: -cardWidth / 2,
              marginTop: -cardHeight / 2,
              borderRadius: cardRadius,
              color,
            }}
          >
            <Icon className="tech-spiral__icon" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackSpiral;
