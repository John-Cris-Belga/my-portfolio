"use client";
import { useEffect, useRef, useState } from "react";
import { afterIdle } from "@/lib/afterIdle";

// Shows the first photo as a plain <img> right away. The WebGL morph engine (and ogl) is
// downloaded and started well after the page is idle, then takes over on the canvas.

export default function AvatarMorph({
  images,
  interval = 10000,
  duration = 1.1,
  intensity = 0.55,
  scale = 2.4,
  aberration = 0.35,
  label = "",
  className = "",
}) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  // A string key keeps the setup from re-running when the parent passes a new array with the same photos.
  const imagesKey = JSON.stringify(images.map(({ src, position }) => [src, position ?? ""]));

  useEffect(() => {
    const list = JSON.parse(imagesKey).map(([src, position]) => ({ src, position: position || undefined }));
    let dispose;
    let cancelled = false;
    const cancelIdle = afterIdle(async () => {
      const { createAvatarMorph } = await import("@/lib/avatarMorphEngine");
      const canvas = canvasRef.current;
      if (cancelled || !canvas || list.length < 2) return;
      dispose = createAvatarMorph(canvas, list, { interval, duration, intensity, scale, aberration }, () =>
        setReady(true),
      );
    }, 2500);
    return () => {
      cancelled = true;
      cancelIdle();
      dispose?.();
    };
  }, [imagesKey, interval, duration, intensity, scale, aberration]);

  const first = images[0];

  return (
    <>
      {!ready && first && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={`${className} is-active`}
          src={first.src}
          alt={label}
          fetchPriority="high"
          decoding="async"
          style={first.position ? { objectPosition: first.position } : undefined}
        />
      )}
      <canvas ref={canvasRef} className={`${className} is-active`} role="img" aria-label={label} />
    </>
  );
}
