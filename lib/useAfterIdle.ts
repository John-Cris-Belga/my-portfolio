"use client";
import { useEffect, useState } from "react";
import { afterIdle } from "@/lib/afterIdle";

/** True once the page has loaded and gone idle (plus `delay` ms). Used to mount non-critical UI late. */
export function useAfterIdle(delay = 0): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => afterIdle(() => setReady(true), delay), [delay]);
  return ready;
}
