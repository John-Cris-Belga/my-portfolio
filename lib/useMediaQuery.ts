"use client";
import { useSyncExternalStore } from "react";

/**
 * Matches a media query, and keeps matching as it changes. Returns false during the
 * server render and the first client render, so it never causes a hydration mismatch —
 * callers should treat false as "not yet known" and render the cheaper option.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** A mouse or trackpad, as opposed to a touchscreen. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
