// "Lite" mode: when a device can't keep up, the always-running effects freeze on a still frame
// so the page stays smooth. Set by the frame-rate governor below, remembered for the session.
const EVENT = "perf-lite";
const STORAGE_KEY = "perf-lite";

export const isLite = () =>
  typeof document !== "undefined" && document.documentElement.dataset.perf === "lite";

/** Calls `cb` once lite mode is on (immediately if it already is). Returns an unsubscribe. */
export function onLite(cb: () => void): () => void {
  if (isLite()) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}

function setLite() {
  if (isLite()) return;
  document.documentElement.dataset.perf = "lite";
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Watches real frame times once the effects are running. If the page can't hold ~40fps,
 * switches to lite mode. Checks a few times, since lag can show up late (thermal throttling).
 */
export function startPerfGovernor(): () => void {
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) setLite();
  } catch {}
  if (isLite()) return () => {};

  let raf = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  const windows = [2000, 8000, 20000];

  const sample = (index: number) => {
    const deltas: number[] = [];
    let last = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (stopped) return;
      if (last && !document.hidden) {
        const d = now - last;
        // Gaps this long are tab switches or the window being dragged, not slowness.
        if (d < 250) deltas.push(d);
      }
      last = now;
      if (now - start < 3000) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (deltas.length > 30) {
        const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
        const slow = deltas.filter((d) => d > 34).length / deltas.length;
        if (avg > 25 || slow > 0.2) {
          setLite();
          return;
        }
      }
      if (index + 1 < windows.length) {
        timer = setTimeout(() => sample(index + 1), windows[index + 1] - windows[index]);
      }
    };
    raf = requestAnimationFrame(tick);
  };

  timer = setTimeout(() => sample(0), windows[0]);
  const cancelOnLite = onLite(() => {
    stopped = true;
  });

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    if (timer) clearTimeout(timer);
    cancelOnLite();
  };
}
