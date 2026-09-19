"use client";

import { useEffect, useRef } from "react";
import { afterIdle } from "@/lib/afterIdle";
import { onLite } from "@/lib/perfMode";
import "./ElectricBorder.css";

// Same look as the React Bits original, but the per-frame math is ~10x cheaper:
// the outline is sampled once per resize, and noise comes from a lookup table
// instead of ~60,000 Math.sin calls per frame.

const OCTAVES = 8;
const LACUNARITY = 1.6;
const GAIN = 0.7;
const BASE_FREQUENCY = 10;
const DISPLACEMENT = 60;
// Room around the card for the displaced line (it never moves more than ~17px).
const BORDER_OFFSET = 30;
const FRAME_MS = 1000 / 30;

const LUT_SIZE = 8192;
const LUT = new Float32Array(LUT_SIZE);
for (let n = 0; n < LUT_SIZE; n++) LUT[n] = (Math.sin(n * 12.9898) * 43758.5453) % 1;

function roundedRectPoint(t, left, top, width, height, radius, out) {
  const sw = width - 2 * radius;
  const sh = height - 2 * radius;
  const arc = (Math.PI * radius) / 2;
  let d = t * (2 * sw + 2 * sh + 4 * arc);
  const corner = (cx, cy, start, p) => {
    const a = start + p * (Math.PI / 2);
    out[0] = cx + radius * Math.cos(a);
    out[1] = cy + radius * Math.sin(a);
  };

  if (d <= sw) return void ((out[0] = left + radius + d), (out[1] = top));
  d -= sw;
  if (d <= arc) return corner(left + width - radius, top + radius, -Math.PI / 2, d / arc);
  d -= arc;
  if (d <= sh) return void ((out[0] = left + width), (out[1] = top + radius + d));
  d -= sh;
  if (d <= arc) return corner(left + width - radius, top + height - radius, 0, d / arc);
  d -= arc;
  if (d <= sw) return void ((out[0] = left + width - radius - d), (out[1] = top + height));
  d -= sw;
  if (d <= arc) return corner(left + radius, top + height - radius, Math.PI / 2, d / arc);
  d -= arc;
  if (d <= sh) return void ((out[0] = left), (out[1] = top + height - radius - d));
  d -= sh;
  return corner(left + radius, top + radius, Math.PI, d / arc);
}

const ElectricBorder = ({
  children,
  color = "#5227FF",
  speed = 1,
  chaos = 0.12,
  borderRadius = 24,
  className,
  style = {},
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    let dpr = 1;
    let count = 0;
    let baseX = new Float32Array(0);
    let baseY = new Float32Array(0);
    let noiseX = new Float32Array(0);

    const measure = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width + BORDER_OFFSET * 2;
      const height = rect.height + BORDER_OFFSET * 2;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const radius = Math.min(borderRadius, Math.min(rect.width, rect.height) / 2);
      const perimeter = 2 * (rect.width + rect.height) + 2 * Math.PI * radius;
      count = Math.floor(perimeter / 2) + 1;
      baseX = new Float32Array(count);
      baseY = new Float32Array(count);
      noiseX = new Float32Array(count);
      const point = [0, 0];
      for (let i = 0; i < count; i++) {
        const progress = i / (count - 1);
        roundedRectPoint(progress, BORDER_OFFSET, BORDER_OFFSET, rect.width, rect.height, radius, point);
        baseX[i] = point[0];
        baseY[i] = point[1];
        noiseX[i] = progress * 8;
      }
    };

    let time = 0;
    let lastTime = performance.now();
    const jRow = new Int32Array(OCTAVES);
    const uyRow = new Float32Array(OCTAVES);
    const freqRow = new Float32Array(OCTAVES);
    const ampRow = new Float32Array(OCTAVES);

    const paint = (now) => {
      time += Math.min((now - lastTime) / 1000, 0.1) * speed;
      lastTime = now;

      // The first octave is flattened to zero in the original, so octaves start at 1.
      let frequency = BASE_FREQUENCY;
      let amplitude = chaos;
      for (let k = 0; k < OCTAVES; k++) {
        const y = time * frequency * 0.3;
        const j = Math.floor(y);
        const fy = y - j;
        jRow[k] = j * 57;
        uyRow[k] = fy * fy * (3 - 2 * fy);
        freqRow[k] = frequency;
        ampRow[k] = k === 0 ? 0 : amplitude;
        frequency *= LACUNARITY;
        amplitude *= GAIN;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();

      const mask = LUT_SIZE - 1;
      for (let i = 0; i < count; i++) {
        const x = noiseX[i];
        let nx = 0;
        let ny = 0;
        for (let k = 1; k < OCTAVES; k++) {
          const fx = freqRow[k] * x;
          const ix = Math.floor(fx);
          const f = fx - ix;
          const ux = f * f * (3 - 2 * f);
          const uy = uyRow[k];
          const n0 = ix + jRow[k];
          // Seed 0 and seed 1 (+100 on x) share the same fractions, only the lattice cell differs.
          const a0 = LUT[n0 & mask], b0 = LUT[(n0 + 1) & mask], c0 = LUT[(n0 + 57) & mask], d0 = LUT[(n0 + 58) & mask];
          const a1 = LUT[(n0 + 100) & mask], b1 = LUT[(n0 + 101) & mask], c1 = LUT[(n0 + 157) & mask], d1 = LUT[(n0 + 158) & mask];
          const top0 = a0 + (b0 - a0) * ux;
          const top1 = a1 + (b1 - a1) * ux;
          nx += ampRow[k] * (top0 + (c0 + (d0 - c0) * ux - top0) * uy);
          ny += ampRow[k] * (top1 + (c1 + (d1 - c1) * ux - top1) * uy);
        }
        const px = baseX[i] + nx * DISPLACEMENT;
        const py = baseY[i] + ny * DISPLACEMENT;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    };

    let frame = 0;
    let lastPaint = -Infinity;
    let visible = true;
    let frozen = false;
    const loop = (now) => {
      if (frozen) return;
      frame = requestAnimationFrame(loop);
      if (!visible || now - lastPaint < FRAME_MS - 1) return;
      lastPaint = now;
      paint(now);
    };

    const resizeObserver = new ResizeObserver(() => {
      measure();
      paint(performance.now());
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersectionObserver.observe(container);

    measure();
    paint(performance.now());

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cancelIdle = afterIdle(() => {
      if (!frozen && !reducedMotion) frame = requestAnimationFrame(loop);
    }, 600);
    const cancelLite = onLite(() => {
      frozen = true;
      cancelAnimationFrame(frame);
    });

    return () => {
      frozen = true;
      cancelIdle();
      cancelLite();
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [color, speed, chaos, borderRadius]);

  return (
    <div
      ref={containerRef}
      className={`electric-border ${className ?? ""}`}
      style={{ "--electric-border-color": color, borderRadius, ...style }}
    >
      <div className="eb-canvas-container">
        <canvas ref={canvasRef} className="eb-canvas" />
      </div>
      <div className="eb-layers">
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className="eb-content">{children}</div>
    </div>
  );
};

export default ElectricBorder;
