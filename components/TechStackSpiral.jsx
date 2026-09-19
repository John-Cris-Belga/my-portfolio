"use client";
import { useEffect, useRef } from "react";
import { afterIdle } from "@/lib/afterIdle";
import "./TechStackSpiral.css";

// Adapted from React Bits "Infinite Spiral" to render icon items as a non-interactive background.

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;
const smoothstep = (min, max, value) => {
  const x = clamp((value - min) / (max - min || 1), 0, 1);
  return x * x * (3 - 2 * x);
};

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

  useEffect(() => {
    const root = rootRef.current;
    if (!root || items.length === 0) return;

    let frameId;
    let previousTime = performance.now();
    let progress = 0;
    let visible = true;
    let laidOut = false;
    const zIndices = [];
    let bounds = root.getBoundingClientRect();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect();
      laidOut = false;
    });
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.02 },
    );
    intersectionObserver.observe(root);

    const render = (time) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      if (!visible || reducedMotion.matches) {
        if (laidOut) {
          frameId = requestAnimationFrame(render);
          return;
        }
      } else {
        progress += speed * (direction === "down" ? -1 : 1) * delta;
      }
      laidOut = true;

      const count = items.length;
      const half = count / 2;
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const fit = Math.min(1, width / (cardWidth * 2.8), height / (cardHeight * 2.35));
      const responsiveRadius = Math.min(radius, Math.max(72, width * 0.36)) * fit;
      const fadeStart = clamp(1 - edgeFade, 0, 0.98);
      const turnSize = Math.max(cardsPerTurn, 1);
      // Spread the loop across the full container height instead of a fixed spacing.
      const spacing = Math.max(verticalSpacing * fit, height / count);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const offset = modulo(index - progress + half, count) - half;

        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
        const opacity = 1 - smoothstep(fadeStart, 1, edge);
        const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1);
        const scale = (1 + (centerScale - 1) * focus) * fit;
        const angleRadians = (offset * (360 / turnSize) * Math.PI) / 180;
        const x = Math.sin(angleRadians) * responsiveRadius;
        const z = Math.cos(angleRadians) * responsiveRadius;
        const depthScale = clamp(perspective / Math.max(perspective - z, 1), 0.72, 1.45);
        const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2;

        // Only transform and opacity change per frame so tiles stay on the compositor.
        card.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${(offset * spacing).toFixed(1)}px), 0) scale(${(scale * depthScale).toFixed(3)})`;
        card.style.opacity = opacity.toFixed(2);
        // Re-stacking layers is expensive, so only touch z-index when the depth bucket changes.
        const zIndex = Math.round(depth * count) * 100 + index;
        if (zIndices[index] !== zIndex) {
          zIndices[index] = zIndex;
          card.style.zIndex = String(zIndex);
        }
      });

      frameId = requestAnimationFrame(render);
    };

    const cancelIdle = afterIdle(() => {
      previousTime = performance.now();
      frameId = requestAnimationFrame(render);
      root.classList.add("is-ready");
    }, 300);

    return () => {
      cancelIdle();
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [
    items,
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
    <div
      ref={rootRef}
      className={`tech-spiral ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="tech-spiral__stage">
        {items.map(({ label, icon: Icon, color }, index) => (
          <div
            key={label}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className="tech-spiral__item"
            style={{ width: cardWidth, height: cardHeight, borderRadius: cardRadius, color }}
          >
            <Icon className="tech-spiral__icon" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackSpiral;
